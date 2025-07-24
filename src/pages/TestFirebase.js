import React, { useState } from 'react';
import { addDoc, collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db, auth } from '../utils/firebase';

// Add section for index creation help
const IndexHelperSection = () => (
  <div className="mt-8 p-6 bg-indigo-50 rounded-lg border border-indigo-200">
    <h3 className="text-xl font-semibold mb-4">Firestore Index Helper</h3>
    <p className="mb-3">
      If you're experiencing index-related errors in your app, you need to create the necessary composite indexes in Firebase.
    </p>
    <p className="mb-4">
      Click the buttons below to create the required indexes for each collection:
    </p>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <a 
        href="https://console.firebase.google.com/project/investor-business-bridge-a870e/firestore/indexes"
        target="_blank"
        rel="noopener noreferrer"
        className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded text-center"
      >
        Open Firebase Indexes Page
      </a>
      <a 
        href="https://firebase.google.com/docs/firestore/query-data/index-overview"
        target="_blank"
        rel="noopener noreferrer"
        className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded text-center"
      >
        Read Indexes Documentation
      </a>
    </div>
  </div>
);

function TestFirebase() {
  const [loading, setLoading] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [error, setError] = useState(null);

  const runFirebaseTest = async () => {
    setLoading(true);
    setError(null);
    setTestResult(null);

    try {
      const results = {
        firestore: {
          write: false,
          read: false,
          collections: []
        },
        auth: {
          initialized: !!auth
        }
      };

      // Test Firestore write operation
      try {
        console.log("Testing Firestore write operation...");
        const testDoc = {
          text: "Test document",
          timestamp: new Date().toISOString()
        };
        const docRef = await addDoc(collection(db, 'test_collection'), testDoc);
        console.log("Write test successful with document ID:", docRef.id);
        results.firestore.write = true;
        results.firestore.testDocId = docRef.id;
      } catch (writeErr) {
        console.error("Firestore write test failed:", writeErr);
        results.firestore.writeError = writeErr.message;
      }

      // Test Firestore read operation
      try {
        console.log("Testing Firestore read operation...");
        const testQuery = query(
          collection(db, 'test_collection'),
          orderBy('timestamp', 'desc'),
          limit(1)
        );
        const querySnapshot = await getDocs(testQuery);
        console.log("Read test got results:", querySnapshot.docs.length);
        results.firestore.read = true;
        results.firestore.readResults = querySnapshot.docs.length;
      } catch (readErr) {
        console.error("Firestore read test failed:", readErr);
        results.firestore.readError = readErr.message;
      }

      // Get list of collections
      try {
        console.log("Checking collections...");
        const collectionsToCheck = [
          'businessProposals',
          'investorProposals',
          'loanDetails',
          'businessInfo'
        ];
        
        for (const collectionName of collectionsToCheck) {
          try {
            const collQuery = query(collection(db, collectionName), limit(1));
            const collSnapshot = await getDocs(collQuery);
            console.log(`Collection ${collectionName} exists and contains ${collSnapshot.docs.length} documents`);
            results.firestore.collections.push({
              name: collectionName,
              exists: true,
              count: collSnapshot.docs.length
            });
          } catch (collErr) {
            console.error(`Error checking collection ${collectionName}:`, collErr);
            results.firestore.collections.push({
              name: collectionName,
              exists: false,
              error: collErr.message
            });
          }
        }
      } catch (collErr) {
        console.error("Error checking collections:", collErr);
      }

      setTestResult(results);
    } catch (err) {
      console.error("Test failed with error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Firebase Test Page</h1>

      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <button
          onClick={runFirebaseTest}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Run Firebase Test'}
        </button>

        {error && (
          <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p className="font-bold">Error:</p>
            <p>{error}</p>
          </div>
        )}

        {testResult && (
          <div className="mt-4">
            <h2 className="text-xl font-semibold mb-2">Test Results</h2>
            
            <div className="mb-4">
              <h3 className="text-lg font-medium">Auth:</h3>
              <p>Initialized: {testResult.auth.initialized ? 'Yes' : 'No'}</p>
            </div>
            
            <div className="mb-4">
              <h3 className="text-lg font-medium">Firestore:</h3>
              <p>Write Test: {testResult.firestore.write ? 'Success' : 'Failed'}</p>
              {testResult.firestore.writeError && (
                <p className="text-red-600">Write Error: {testResult.firestore.writeError}</p>
              )}
              
              <p>Read Test: {testResult.firestore.read ? 'Success' : 'Failed'}</p>
              {testResult.firestore.readError && (
                <p className="text-red-600">Read Error: {testResult.firestore.readError}</p>
              )}
              
              <h4 className="font-medium mt-2">Collections:</h4>
              <ul className="list-disc pl-5">
                {testResult.firestore.collections.map((coll, index) => (
                  <li key={index}>
                    {coll.name}: {coll.exists ? `Exists (${coll.count} documents)` : 'Does not exist'}
                    {coll.error && <span className="text-red-600"> - Error: {coll.error}</span>}
                  </li>
                ))}
              </ul>
            </div>
            
            <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-64 text-xs">
              {JSON.stringify(testResult, null, 2)}
            </pre>
          </div>
        )}
      </div>
      
      {/* Add the index helper section */}
      <IndexHelperSection />
    </div>
  );
}

export default TestFirebase; 