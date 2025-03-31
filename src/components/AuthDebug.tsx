
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';

const AuthDebug = () => {
  const [serverStatus, setServerStatus] = useState<string>('Checking...');
  const [users, setUsers] = useState<any[]>([]);
  const [apiUrl, setApiUrl] = useState<string>('');
  const [showDebug, setShowDebug] = useState<boolean>(false);
  const [isTestingLogin, setIsTestingLogin] = useState<boolean>(false);
  const [testResponse, setTestResponse] = useState<string>('');

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
      toast.success('Server connection successful!');
    } catch (error) {
      console.error('Server health check error:', error);
      setServerStatus('Server Error: Unable to connect');
      toast.error('Failed to connect to server API');
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/debug/users`);
      setUsers(response.data.users || []);
      toast.success('Users fetched successfully!');
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users');
    }
  };

  const testLogin = async () => {
    setIsTestingLogin(true);
    setTestResponse('Testing login...');
    
    try {
      // Try to login with the default credentials
      const response = await axios.post(`${apiUrl}/api/auth/login`, {
        email: 'admin@example.com',
        password: 'password123'
      });
      
      setTestResponse(JSON.stringify(response.data, null, 2));
      toast.success('Login test successful!');
      localStorage.setItem('testUser', JSON.stringify(response.data));
    } catch (error: any) {
      console.error('Login test error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
      setTestResponse(`Error: ${errorMessage}\n\nFull error: ${JSON.stringify(error.response?.data || error, null, 2)}`);
      toast.error(`Login test failed: ${errorMessage}`);
    } finally {
      setIsTestingLogin(false);
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
              className="mr-2 px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
            >
              Show Users
            </button>
            <button 
              onClick={testLogin}
              disabled={isTestingLogin}
              className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            >
              Test Login
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
          
          {testResponse && (
            <div className="mt-2">
              <p className="font-semibold">Test Login Response:</p>
              <pre className="p-2 bg-gray-200 rounded overflow-auto max-h-40">{testResponse}</pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AuthDebug;
