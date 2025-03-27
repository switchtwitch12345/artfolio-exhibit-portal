
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AuthDebug = () => {
  const [serverStatus, setServerStatus] = useState<string>('Checking...');
  const [users, setUsers] = useState<any[]>([]);
  const [apiUrl, setApiUrl] = useState<string>('');
  const [showDebug, setShowDebug] = useState<boolean>(false);

  useEffect(() => {
    const getBaseUrl = () => {
      if (import.meta.env.DEV) {
        return window.location.hostname === 'localhost' ? 
          `${window.location.protocol}//${window.location.hostname}:5000` : 
          '';
      }
      return '';
    };
    
    setApiUrl(getBaseUrl());
  }, []);

  const checkServerStatus = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/health`);
      setServerStatus(`Server OK: ${response.data.status}`);
    } catch (error) {
      setServerStatus('Server Error: Unable to connect');
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/debug/users`);
      setUsers(response.data.users || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const toggleDebug = () => {
    setShowDebug(!showDebug);
    if (!showDebug) {
      checkServerStatus();
      fetchUsers();
    }
  };

  return (
    <div className="mt-6">
      <button 
        type="button" 
        onClick={toggleDebug}
        className="text-xs text-gray-400 hover:text-gray-600"
      >
        {showDebug ? "Hide Debug Info" : "Show Debug Info"}
      </button>

      {showDebug && (
        <div className="mt-3 p-4 bg-gray-100 rounded-lg text-xs">
          <h4 className="font-semibold mb-2">Debug Information</h4>
          <p>API URL: {apiUrl || 'Not configured'}</p>
          <p>Server Status: {serverStatus}</p>
          <p>Default Login: admin@example.com / password123</p>
          
          <div className="mt-2">
            <button 
              onClick={checkServerStatus}
              className="mr-2 px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
            >
              Check Server
            </button>
            <button 
              onClick={fetchUsers}
              className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
            >
              Show Users
            </button>
          </div>
          
          {users.length > 0 && (
            <div className="mt-2">
              <p className="font-semibold">Registered Users:</p>
              <ul>
                {users.map(user => (
                  <li key={user._id}>{user.email} ({user.name})</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AuthDebug;
