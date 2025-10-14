const bcrypt = require('bcryptjs');

(async () => {
  const password = 'azerty123';
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  console.log('Hashed Password:', hashedPassword);
})();