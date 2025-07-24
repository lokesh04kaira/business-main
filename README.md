# InvestorConnect Platform

A web application that connects investors with entrepreneurs, providing a platform for investment opportunities and business development.

## Overview

InvestorConnect is designed to bridge the gap between investors and business owners in India. The platform facilitates:

- Business owners sharing their business ideas and seeking investment
- Investors posting their investment criteria and opportunities
- Bankers providing loan information for businesses
- Business advisors sharing knowledge and guidance

## System Modules

1. **User**
   - Register and login
   - View business categories

2. **Business People**
   - Register and login
   - Post business ideas

3. **Investors**
   - Register and login
   - View business proposals
   - Post investment opportunities

4. **Banker**
   - Register and login
   - Post loan details

5. **Business Advisor**
   - Register and login
   - Post information
   - View queries
   - Post solutions

## Technologies Used

- React.js for frontend
- Firebase for authentication and database
- React Router for navigation
- Tailwind CSS for styling

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository:
```
git clone https://github.com/yourusername/investor-business.git
cd investor-business
```

2. Install dependencies:
```
npm install
```

3. Create a Firebase project and configure authentication and Firestore database

4. Create a `.env` file in the root directory with your Firebase configuration:
```
REACT_APP_FIREBASE_API_KEY=your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-auth-domain
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-storage-bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
REACT_APP_FIREBASE_APP_ID=your-app-id
```

5. Start the development server:
```
npm start
```

### Firebase Setup

1. Create a new Firebase project at [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. Enable Email/Password authentication
3. Create a Firestore database with the following collections:
   - users
   - businessProposals
   - investorProposals
   - loanDetails
   - businessInfo

## Features

- User authentication (register, login, logout)
- Role-based access control (user, investor, business, banker, advisor)
- Business proposal submission and management
- Investment opportunity posting
- Loan information sharing
- Business advice and information posting

## Future Enhancements

- Chat functionality between users
- Contract generation and document signing
- Payment integration for platform fees
- Enhanced search and matching algorithms
- Mobile application development

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- This project was created as a solution to connect investors and entrepreneurs in India.
- Special thanks to all contributors who have helped to make this platform possible.
# business
