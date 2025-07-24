// This file is kept for backwards compatibility but its functionality is no longer used
const demoData = {};

// Helper function to handle Firestore errors
export const handleFirestoreError = (error, type) => {
  console.error(`Error fetching ${type}:`, error);
  
  let errorMsg = `Failed to load ${type}.`;
  if (error.code) {
    errorMsg += ` Error code: ${error.code}.`;
  }
  
  // If it's an index error, include the URL
  if (error.code === 'failed-precondition' && error.message && error.message.includes('requires an index')) {
    const indexUrl = error.message.match(/https:\/\/console\.firebase\.google\.com[^\s]+/);
    if (indexUrl) {
      errorMsg += ` Please create the required index: ${indexUrl[0]}`;
    }
  }
  
  return {
    error: errorMsg,
    data: null
  };
};

export default demoData; 