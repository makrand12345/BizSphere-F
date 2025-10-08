import React, { useState, useEffect } from 'react';
import { authAPI } from './services/auth';

function App() {
  const [connectionStatus, setConnectionStatus] = useState('Testing connection...');
  const [backendHealth, setBackendHealth] = useState(null);

  useEffect(() => {
    testBackendConnection();
  }, []);

  const testBackendConnection = async () => {
    try {
      const response = await fetch('https://biz-sphere-b.vercel.app/api/health');
      const data = await response.json();
      setBackendHealth(data);
      setConnectionStatus('Connected to backend!');
    } catch (error) {
      setConnectionStatus('Failed to connect to backend');
      console.error('Connection error:', error);
    }
  };

  const handleRegister = async () => {
    try {
      const result = await authAPI.register({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      });
      console.log('Register result:', result);
      alert('Registration successful!');
    } catch (error) {
      console.error('Registration error:', error);
      alert('Registration failed: ' + error.message);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>BizSphere Frontend</h1>
      
      <div style={{ 
        padding: '15px', 
        margin: '10px 0', 
        backgroundColor: connectionStatus.includes('Connected') ? '#d4edda' : '#f8d7da',
        border: '1px solid',
        borderColor: connectionStatus.includes('Connected') ? '#c3e6cb' : '#f5c6cb',
        borderRadius: '5px'
      }}>
        <h3>Connection Status</h3>
        <p><strong>{connectionStatus}</strong></p>
        {backendHealth && (
          <div>
            <p><strong>Backend:</strong> {backendHealth.backend}</p>
            <p><strong>Database:</strong> {backendHealth.database}</p>
            <p><strong>Timestamp:</strong> {backendHealth.timestamp}</p>
          </div>
        )}
      </div>

      <div style={{ margin: '20px 0' }}>
        <button 
          onClick={handleRegister}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Test Registration
        </button>
      </div>

      <div style={{ marginTop: '30px' }}>
        <h3>Test Links:</h3>
        <ul>
          <li><a href="https://biz-sphere-b.vercel.app/api/test" target="_blank" rel="noopener noreferrer">Backend Test Route</a></li>
          <li><a href="https://biz-sphere-b.vercel.app/api/health" target="_blank" rel="noopener noreferrer">Backend Health Check</a></li>
        </ul>
      </div>
    </div>
  );
}

export default App;