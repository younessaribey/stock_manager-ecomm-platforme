#!/usr/bin/env node

const { spawn, exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const net = require('net');

// Colors for console output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
  reset: '\x1b[0m',
  bright: '\x1b[1m'
};

// Helper functions
const print = {
  status: (msg) => console.log(`${colors.green}[INFO]${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}[WARNING]${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}[ERROR]${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}[SUCCESS]${colors.reset} ${msg}`),
  header: (msg) => {
    console.log(`${colors.blue}${colors.bright}================================${colors.reset}`);
    console.log(`${colors.blue}${colors.bright}${msg}${colors.reset}`);
    console.log(`${colors.blue}${colors.bright}================================${colors.reset}`);
  },
  step: (step, total, msg) => {
    console.log(`${colors.cyan}[${step}/${total}]${colors.reset} ${msg}`);
  }
};

// Check if command exists
function commandExists(command) {
  return new Promise((resolve) => {
    exec(`${process.platform === 'win32' ? 'where' : 'which'} ${command}`, (error) => {
      resolve(!error);
    });
  });
}

// Check if port is in use
function portInUse(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.listen(port, () => {
      server.once('close', () => resolve(false));
      server.close();
    });
    server.on('error', () => resolve(true));
  });
}

// Kill process on port
function killPort(port) {
  return new Promise((resolve) => {
    const command = process.platform === 'win32' 
      ? `netstat -ano | findstr :${port}` 
      : `lsof -ti :${port}`;
    
    exec(command, (error, stdout) => {
      if (!error && stdout) {
        const killCmd = process.platform === 'win32'
          ? `taskkill /PID ${stdout.trim().split(/\s+/).pop()} /F`
          : `kill -9 ${stdout.trim()}`;
        
        exec(killCmd, () => {
          setTimeout(resolve, 1000); // Wait a bit after killing
        });
      } else {
        resolve();
      }
    });
  });
}

// Wait for service to be ready with better feedback
async function waitForService(port, serviceName, maxAttempts = 60) {
  print.step('⏳', '∞', `Waiting for ${serviceName} on port ${port}...`);
  
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    if (await portInUse(port)) {
      print.success(`${serviceName} is ready on port ${port}!`);
      return true;
    }
    
    // Show progress dots
    if (attempt % 5 === 0 && attempt > 0) {
      process.stdout.write(`${colors.yellow}.${colors.reset}`);
    }
    
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log(''); // New line after dots
  print.error(`${serviceName} failed to start within ${maxAttempts} seconds`);
  return false;
}

// Test database connection
async function testDatabaseConnection() {
  return new Promise((resolve) => {
    try {
      // Simple test to see if we can connect to the database
      const testScript = `
        const { sequelize } = require('./server/config/dbSequelize');
        sequelize.authenticate()
          .then(() => {
            console.log('Database connection successful');
            process.exit(0);
          })
          .catch((error) => {
            console.error('Database connection failed:', error.message);
            process.exit(1);
          });
      `;
      
      const testFile = path.join(__dirname, 'test-db.js');
      fs.writeFileSync(testFile, testScript);
      
      const testProcess = spawn('node', [testFile], { stdio: 'pipe' });
      
      testProcess.on('close', (code) => {
        // Clean up test file
        if (fs.existsSync(testFile)) {
          fs.unlinkSync(testFile);
        }
        resolve(code === 0);
      });
      
      // Timeout after 10 seconds
      setTimeout(() => {
        testProcess.kill();
        if (fs.existsSync(testFile)) {
          fs.unlinkSync(testFile);
        }
        resolve(false);
      }, 10000);
      
    } catch (error) {
      resolve(false);
    }
  });
}

// Global process references
let processes = [];

// Cleanup function
async function cleanup() {
  print.header('SHUTTING DOWN SERVICES');
  
  // Kill spawned processes gracefully
  for (const proc of processes) {
    if (proc && !proc.killed) {
      print.status(`Stopping ${proc.name}...`);
      proc.kill('SIGTERM');
      
      // Wait a bit, then force kill if needed
      setTimeout(() => {
        if (!proc.killed) {
          proc.kill('SIGKILL');
        }
      }, 3000);
    }
  }
  
  // Kill processes on ports
  print.status('Cleaning up ports...');
  await killPort(5050);
  await killPort(3000);
  
  print.success('All services stopped.');
  process.exit(0);
}

// Set up signal handlers
process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
process.on('uncaughtException', (error) => {
  print.error(`Uncaught exception: ${error.message}`);
  cleanup();
});

async function main() {
  const startTime = Date.now();
  
  print.header('🚀 BROTHERS PHONE SHOP - LAUNCHER');
  console.log(`${colors.magenta}Starting all services...${colors.reset}\n`);

  // Step 1: Check prerequisites
  print.header('📋 CHECKING PREREQUISITES');
  print.step(1, 8, 'Checking Node.js...');

  if (!(await commandExists('node'))) {
    print.error('Node.js is not installed. Please install Node.js first.');
    process.exit(1);
  }
  print.success('Node.js found');

  print.step(1, 8, 'Checking npm...');
  if (!(await commandExists('npm'))) {
    print.error('npm is not installed. Please install npm first.');
    process.exit(1);
  }
  print.success('npm found');

  // Step 2: Determine database mode
  print.step(2, 8, 'Determining database configuration...');
  const dockerAvailable = await commandExists('docker');
  const postgresAvailable = await commandExists('psql') || await commandExists('pg_ctl');
  
  let databaseMode = 'sqlite';
  
  if (dockerAvailable) {
    print.status('Docker available - will use PostgreSQL via Docker');
    databaseMode = 'docker';
  } else if (postgresAvailable) {
    print.status('PostgreSQL available - will use local PostgreSQL');
    databaseMode = 'postgres';
  } else {
    print.warning('Using SQLite for development (PostgreSQL/Docker not available)');
    databaseMode = 'sqlite';
  }

  // Step 3: Clean up existing processes
  print.step(3, 8, 'Cleaning up existing processes...');
  if (databaseMode !== 'sqlite') {
    await killPort(5432);
  }
  await killPort(5050);
  await killPort(3000);
  print.success('Ports cleaned up');

  // Step 4: Setup database
  print.step(4, 8, 'Setting up database...');
  
  if (databaseMode === 'docker') {
    print.status('Starting PostgreSQL with Docker...');
    
    // Stop and remove existing container
    exec('docker stop stmg-postgres 2>/dev/null || true');
    exec('docker rm stmg-postgres 2>/dev/null || true');
    
    const dockerProcess = spawn('docker', [
      'run', '-d',
      '--name', 'stmg-postgres',
      '-e', 'POSTGRES_DB=stmg',
      '-e', 'POSTGRES_USER=postgres',
      '-e', 'POSTGRES_PASSWORD=password',
      '-p', '5432:5432',
      'postgres:13'
    ], { stdio: 'pipe' });

    dockerProcess.name = 'PostgreSQL Docker';
    processes.push(dockerProcess);
    
    // Wait for PostgreSQL
    if (!(await waitForService(5432, 'PostgreSQL'))) {
      print.error('Failed to start PostgreSQL');
      process.exit(1);
    }
  } else if (databaseMode === 'postgres') {
    print.status('Using local PostgreSQL (assuming it\'s running)');
  } else {
    print.status('Using SQLite - no separate database server needed');
  }

  // Step 5: Install dependencies
  print.step(5, 8, 'Installing dependencies...');

  if (!fs.existsSync('server/node_modules')) {
    print.status('Installing backend dependencies...');
    await new Promise((resolve, reject) => {
      const npm = spawn('npm', ['install'], { cwd: 'server', stdio: 'inherit' });
      npm.on('close', (code) => code === 0 ? resolve() : reject(new Error('Backend npm install failed')));
    });
  }

  // Install SQLite if needed
  if (databaseMode === 'sqlite') {
    print.status('Installing SQLite dependencies...');
    await new Promise((resolve, reject) => {
      const npm = spawn('npm', ['install', 'sqlite3', '--save'], { cwd: 'server', stdio: 'inherit' });
      npm.on('close', (code) => code === 0 ? resolve() : reject(new Error('SQLite install failed')));
    });
  }

  if (!fs.existsSync('client/node_modules')) {
    print.status('Installing frontend dependencies...');
    await new Promise((resolve, reject) => {
      const npm = spawn('npm', ['install'], { cwd: 'client', stdio: 'inherit' });
      npm.on('close', (code) => code === 0 ? resolve() : reject(new Error('Frontend npm install failed')));
    });
  }

  print.success('All dependencies installed');

  // Step 6: Setup environment
  print.step(6, 8, 'Setting up environment files...');

  const serverEnvContent = databaseMode === 'sqlite' 
    ? `NODE_ENV=development
PORT=5050
DB_TYPE=sqlite
DB_PATH=./database.sqlite
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret`
    : `NODE_ENV=development
PORT=5050
DB_TYPE=postgres
DB_HOST=localhost
DB_PORT=5432
DB_NAME=stmg
DB_USER=postgres
DB_PASSWORD=password
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret`;

  if (!fs.existsSync('server/.env')) {
    fs.writeFileSync('server/.env', serverEnvContent);
    print.status(`Server .env created for ${databaseMode} database`);
  }

  if (!fs.existsSync('client/.env')) {
    const clientEnv = `REACT_APP_API_URL=http://localhost:5050/api
REACT_APP_UPLOADS_PATH=http://localhost:5050/uploads`;
    fs.writeFileSync('client/.env', clientEnv);
    print.status('Client .env created');
  }

  print.success('Environment configured');

  // Step 7: Start backend server
  print.step(7, 8, 'Starting backend server...');

  const backendProcess = spawn('npm', ['start'], { 
    cwd: 'server',
    stdio: ['ignore', 'pipe', 'pipe']
  });
  
  backendProcess.name = 'Backend Server';
  processes.push(backendProcess);

  // Capture backend output
  backendProcess.stdout.on('data', (data) => {
    const output = data.toString().trim();
    if (output) console.log(`${colors.cyan}[Backend]${colors.reset} ${output}`);
  });

  backendProcess.stderr.on('data', (data) => {
    const output = data.toString().trim();
    if (output && !output.includes('DeprecationWarning')) {
      console.log(`${colors.yellow}[Backend]${colors.reset} ${output}`);
    }
  });

  // Wait for backend
  if (!(await waitForService(5050, 'Backend Server'))) {
    print.error('Failed to start backend server');
    process.exit(1);
  }

  // Test database connection
  print.status('Testing database connection...');
  if (await testDatabaseConnection()) {
    print.success('Database connection verified');
  } else {
    print.warning('Database connection test failed, but continuing...');
  }

  // Step 8: Start frontend server
  print.step(8, 8, 'Starting frontend server...');

  const frontendProcess = spawn('npm', ['start'], { 
    cwd: 'client',
    stdio: ['ignore', 'pipe', 'pipe'],
    env: { ...process.env, BROWSER: 'none' }
  });
  
  frontendProcess.name = 'Frontend Server';
  processes.push(frontendProcess);

  // Capture frontend output (filter out verbose webpack output)
  frontendProcess.stdout.on('data', (data) => {
    const output = data.toString().trim();
    if (output && !output.includes('webpack') && !output.includes('compiled')) {
      console.log(`${colors.magenta}[Frontend]${colors.reset} ${output}`);
    }
  });

  frontendProcess.stderr.on('data', (data) => {
    const output = data.toString().trim();
    if (output && !output.includes('DeprecationWarning') && !output.includes('webpack')) {
      console.log(`${colors.yellow}[Frontend]${colors.reset} ${output}`);
    }
  });

  // Wait for frontend
  if (!(await waitForService(3000, 'Frontend Server'))) {
    print.error('Failed to start frontend server');
    process.exit(1);
  }

  // Success message
  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000).toFixed(1);
  
  print.header('🎉 ALL SERVICES STARTED SUCCESSFULLY!');
  console.log('');
  print.success(`🚀 Brothers Phone Shop is running! (Started in ${duration}s)`);
  console.log('');
  console.log(`${colors.bright}📱 Frontend:${colors.reset}  ${colors.cyan}http://localhost:3000${colors.reset}`);
  console.log(`${colors.bright}🔧 Backend:${colors.reset}   ${colors.cyan}http://localhost:5050${colors.reset}`);
  console.log(`${colors.bright}🗄️  Database:${colors.reset} ${colors.cyan}${databaseMode === 'sqlite' ? 'SQLite (file-based)' : 'PostgreSQL on port 5432'}${colors.reset}`);
  console.log('');
  print.status('Press Ctrl+C to stop all services');
  console.log('');

  // Keep the process running
  process.stdin.resume();
}

// Run the main function
main().catch((error) => {
  print.error(`Failed to start services: ${error.message}`);
  console.error(error.stack);
  process.exit(1);
});
