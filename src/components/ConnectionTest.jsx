import React, { useEffect, useState } from 'react';
import { authAPI } from '../services/auth';

const ConnectionTest = () => {
  const [status, setStatus] = useState('Testing...');
  const [health, setHealth] = useState(null);

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    try {
      // Test basic connection
      const response = await fetch('https://biz-sphere-b.vercel.app/api/health');
      const data = await response.json();
      setHealth(data);
      setStatus('Connected to backend!');
    } catch (error) {
      setStatus('Connection failed: ' + error.message);
    }
  };

  return (
    <div style={{ padding: '20px', background: '#f5f5f5', margin: '10px' }}>
      <h3>Connection Test</h3>
      <p><strong>Status:</strong> {status}</p>
      {health && (
        <div>
          <p><strong>Backend:</strong> {health.backend}</p>
          <p><strong>Database:</strong> {health.database}</p>
          <p><strong>Time:</strong> {health.timestamp}</p>
        </div>
      )}
    </div>
  );
};

export default ConnectionTest;