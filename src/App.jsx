import React, { useState, useEffect } from 'react';

function App() {
  const [status, setStatus] = useState('Testing connection...');
  const [health, setHealth] = useState(null);

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    try {
      const response = await fetch('https://biz-sphere-b.vercel.app/api/health');
      const data = await response.json();
      setHealth(data);
      setStatus('✅ Connected to backend!');
    } catch (error) {
      setStatus('❌ Failed to connect to backend: ' + error.message);
    }
  };

  const testBackend = async () => {
    try {
      const response = await fetch('https://biz-sphere-b.vercel.app/api/test');
      const data = await response.json();
      alert('Backend test: ' + data.message);
    } catch (error) {
      alert('Backend test failed: ' + error.message);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial', maxWidth: '800px', margin: '0 auto' }}>
      <h1>BizSphere Frontend</h1>
      <p>Frontend: https://biz-sphere-f.vercel.app</p>
      <p>Backend: https://biz-sphere-b.vercel.app</p>
      
      <div style={{ 
        padding: '15px', 
        background: health ? '#e8f5e8' : '#ffe6e6',
        border: '1px solid #ccc',
        borderRadius: '5px',
        margin: '20px 0'
      }}>
        <h3>Connection Status: {status}</h3>
        {health && (
          <div>
            <p><strong>Backend:</strong> {health.backend}</p>
            <p><strong>Database:</strong> {health.database}</p>
            <p><strong>Timestamp:</strong> {new Date(health.timestamp).toLocaleString()}</p>
          </div>
        )}
      </div>

      <button 
        onClick={testBackend}
        style={{
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          marginRight: '10px'
        }}
      >
        Test Backend
      </button>

      <button 
        onClick={testConnection}
        style={{
          padding: '10px 20px',
          backgroundColor: '#28a745',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Refresh Status
      </button>

      <div style={{ marginTop: '30px' }}>
        <h3>Test these URLs directly:</h3>
        <ul>
          <li><a href="https://biz-sphere-b.vercel.app/api/test" target="_blank" rel="noopener">Backend Test</a></li>
          <li><a href="https://biz-sphere-b.vercel.app/api/health" target="_blank" rel="noopener">Backend Health</a></li>
        </ul>
      </div>
    </div>
  );
}

export default App;