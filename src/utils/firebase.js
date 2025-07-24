import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { 
  getFirestore, 
  enableIndexedDbPersistence
} from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBRB-aJgLlFkdRvatG6eMKQQVYXHBlvFSY",
  authDomain: "investor-business-bridge-a870e.firebaseapp.com",
  projectId: "investor-business-bridge-a870e",
  storageBucket: "investor-business-bridge-a870e.appspot.com",
  messagingSenderId: "637547304927",
  appId: "1:637547304927:web:5142070d020b272f2d966a"
};

// Check if running in development mode
const isDevelopment = process.env.NODE_ENV === 'development';

console.log(`Firebase initializing in ${isDevelopment ? 'DEVELOPMENT' : 'PRODUCTION'} mode`);
console.log("Firebase config:", { 
  ...firebaseConfig, 
  apiKey: "***REDACTED***",
  projectId: firebaseConfig.projectId,
  authDomain: firebaseConfig.authDomain
});

// Initialize Firebase
let app, auth, db, storage;

try {
  // Initialize the Firebase app
  app = initializeApp(firebaseConfig);
  console.log("Firebase app initialized successfully");
  
  // Initialize Auth
  auth = getAuth(app);
  console.log("Firebase Auth initialized");

  // Initialize Firestore
  db = getFirestore(app);
  console.log("Firestore initialized");
  
  // Initialize Storage
  storage = getStorage(app);
  console.log("Firebase Storage initialized");

  // Enable offline persistence for Firestore
  if (typeof window !== 'undefined') {
    enableIndexedDbPersistence(db)
      .then(() => {
        console.log("Firestore persistence enabled");
      })
      .catch((err) => {
        console.error("Error enabling Firestore persistence:", err);
        if (err.code === 'failed-precondition') {
          console.warn("Multiple tabs open, persistence can only be enabled in one tab at a time.");
        } else if (err.code === 'unimplemented') {
          console.warn("The current browser does not support all of the features required to enable persistence");
        }
      });
  }
} catch (error) {
  console.error("Firebase initialization error:", error);
  throw error;
}

// Add some helper functions to help with debugging Firestore issues
export const logFirestoreError = (operation, error, collection) => {
  console.error(`Firebase ${operation} error in collection "${collection}":`, error);
  
  if (error.code === 'failed-precondition' && error.message && error.message.includes('requires an index')) {
    const indexUrl = error.message.match(/https:\/\/console\.firebase\.google\.com[^\s]+/);
    console.warn(`This query requires an index. Create it here: ${indexUrl ? indexUrl[0] : 'URL not found in error'}`);
    return `Index required for ${collection} queries. Create it using the link in the console.`;
  }
  
  return `Error with Firestore operation: ${error.code || 'unknown'} - ${error.message || 'No message'}`;
};

export { auth, db, storage };
export default app; 