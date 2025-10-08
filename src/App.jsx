import React, { useState, useEffect } from 'react';

function App() {
  const [status, setStatus] = useState('Testing connection...');

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    try {
      const response = await fetch('https://biz-sphere-b.vercel.app/api/health');
      const data = await response.json();
      setStatus('✅ Connected to backend! Database: ' + data.database);
    } catch (error) {
      setStatus('❌ Failed to connect to backend');
    }
  };

  return (
    <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'Arial' }}>
      <h1>BizSphere Frontend</h1>
      <h2>Status: {status}</h2>
      <button 
        onClick={testConnection}
        style={{ padding: '10px 20px', fontSize: '16px', marginTop: '20px' }}
      >
        Test Connection
      </button>
    </div>
  );
}

export default App;