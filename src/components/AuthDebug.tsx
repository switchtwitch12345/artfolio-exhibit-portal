
import React, { useState } from 'react';
import { toast } from 'sonner';
import { login } from '@/services/authService';

const AuthDebug = () => {
  const [showDebug, setShowDebug] = useState<boolean>(false);
  const [testUser, setTestUser] = useState<string>('user1');
  const [testResponse, setTestResponse] = useState<string>('');

  const users = [
    { _id: '1', name: 'User One', email: 'user1' },
    { _id: '2', name: 'Admin One', email: 'admin1' },
    { _id: '3', name: 'User Two', email: 'user2' }
  ];

  const testLogin = () => {
    setTestResponse('Testing login...');
    
    try {
      // Try to login with the selected user - synchronous operation
      const response = login({
        email: testUser,
        password: testUser
      });
      
      setTestResponse(JSON.stringify(response, null, 2));
      toast.success('Login test successful!');
    } catch (error: any) {
      console.error('Login test error:', error);
      const errorMessage = error.message || 'Unknown error';
      setTestResponse(`Error: ${errorMessage}`);
      toast.error(`Login test failed: ${errorMessage}`);
    }
  };

  const toggleDebug = () => {
    setShowDebug(!showDebug);
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
          <p>Authentication: <span className="text-green-500">Client-side Only (No Server)</span></p>
          <p>Available Accounts: user1, admin1, user2 (passwords same as usernames)</p>
          
          <div className="mt-3">
            <div className="flex items-center">
              <label className="mr-2">Test Login With: </label>
              <select 
                value={testUser} 
                onChange={(e) => setTestUser(e.target.value)}
                className="mr-2 px-2 py-1 bg-white border rounded"
              >
                <option value="user1">user1</option>
                <option value="admin1">admin1</option>
                <option value="user2">user2</option>
              </select>
              <button 
                onClick={testLogin}
                className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
              >
                Test Login
              </button>
            </div>
          </div>
          
          <div className="mt-2">
            <p className="font-semibold">Available Users:</p>
            <ul>
              {users.map(user => (
                <li key={user._id}>{user.email} ({user.name})</li>
              ))}
            </ul>
          </div>
          
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
