'use client';

import { useEffect, useState } from 'react';

export default function AuthDebugPage() {
  const [clientCookies, setClientCookies] = useState<string>('');
  const [serverSession, setServerSession] = useState<string>('Loading...');

  useEffect(() => {
    // Get client-side cookies
    setClientCookies(document.cookie || '(no cookies)');

    // Check server session
    fetch('/api/auth/session')
      .then(res => res.json())
      .then(data => {
        setServerSession(JSON.stringify(data, null, 2));
      })
      .catch(err => {
        setServerSession('Error: ' + err.message);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Auth Debug Page</h1>

        <div className="bg-white rounded-lg p-6 mb-6 shadow">
          <h2 className="text-lg font-semibold mb-3">Client-Side Cookies</h2>
          <p className="text-sm text-gray-500 mb-2">These are cookies visible to JavaScript (non-httpOnly):</p>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
            {clientCookies}
          </pre>
        </div>

        <div className="bg-white rounded-lg p-6 mb-6 shadow">
          <h2 className="text-lg font-semibold mb-3">Server Session (/api/auth/session)</h2>
          <p className="text-sm text-gray-500 mb-2">This checks if the server can read the brandprobe-auth cookie:</p>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
            {serverSession}
          </pre>
        </div>

        <div className="bg-white rounded-lg p-6 shadow">
          <h2 className="text-lg font-semibold mb-3">Test Actions</h2>
          <div className="space-y-3">
            <button
              onClick={() => window.location.href = '/api/auth/google?redirect=dashboard'}
              className="block w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Test Google Sign In (redirect=dashboard)
            </button>
            <button
              onClick={() => window.location.href = '/dashboard'}
              className="block w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Go to Dashboard
            </button>
            <button
              onClick={() => window.location.reload()}
              className="block w-full px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Refresh This Page
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
