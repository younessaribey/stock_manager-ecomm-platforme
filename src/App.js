import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/products');
      const data = await response.json();
      if (data.success) {
        setProducts(data.data);
      } else {
        setError('Failed to fetch products');
      }
    } catch (err) {
      setError('Error connecting to backend API');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Stock Manager E-commerce Platform</h1>
        <p>Welcome to your stock management system!</p>
        
        {loading && <p>Loading products...</p>}
        
        {error && (
          <div style={{ color: '#ff6b6b', margin: '20px 0' }}>
            <p>⚠️ {error}</p>
            <p>Make sure the backend server is running on port 5001</p>
          </div>
        )}
        
        {!loading && !error && (
          <div style={{ marginTop: '30px', textAlign: 'left' }}>
            <h2>📦 Products ({products.length})</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginTop: '20px' }}>
              {products.map(product => (
                <div key={product.id} style={{ 
                  background: 'rgba(255,255,255,0.1)', 
                  padding: '20px', 
                  borderRadius: '10px',
                  border: '1px solid rgba(255,255,255,0.2)'
                }}>
                  <h3>{product.name}</h3>
                  <p><strong>SKU:</strong> {product.sku}</p>
                  <p><strong>Price:</strong> ${product.price}</p>
                  <p><strong>Stock:</strong> {product.stock} units</p>
                  <p><strong>Category:</strong> {product.category}</p>
                  <p>{product.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
