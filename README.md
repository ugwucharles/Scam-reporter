# ScamGuard - Scam Reporting Platform

A modern, sleek web application for reporting and searching scam activities. Built with React, Node.js, and MongoDB with a premium design inspired by modern fintech applications.

## Features

- **Advanced Search**: Search scam database by email, phone, website, or business name
- **Report Scams**: Submit detailed scam reports with evidence
- **Bot Protection**: Google reCAPTCHA integration to prevent spam and malicious submissions
- **User Authentication**: Secure login and registration system
- **Admin Dashboard**: Moderation tools for administrators
- **Responsive Design**: Mobile-first, responsive UI
- **Real-time Updates**: Live statistics and trending scams
- **Premium UI**: Sleek, modern design with smooth animations

## Tech Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Express Validator** - Input validation
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing

### Frontend
- **React 19** - Frontend framework
- **TypeScript** - Type safety
- **Material-UI (MUI)** - UI component library
- **Framer Motion** - Animations
- **React Router** - Client-side routing
- **React Query** - Data fetching
- **Axios** - HTTP client

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

## Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd scam-reporter
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/scam-reporter
JWT_SECRET=your_super_secure_jwt_secret_key_here
NODE_ENV=development
RECAPTCHA_SECRET_KEY=your_recaptcha_secret_key_here
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install --legacy-peer-deps
```

Create a `.env` file in the frontend directory:
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_RECAPTCHA_SITE_KEY=your_recaptcha_site_key_here
```

### 4. Database Setup
Make sure MongoDB is running on your system. The application will automatically create the database and collections on first run.

### 5. reCAPTCHA Setup
To enable bot protection, you need to set up Google reCAPTCHA:

1. Go to [Google reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin)
2. Create a new site with reCAPTCHA v2
3. Add your domains (localhost for development)
4. Copy the Site Key and Secret Key
5. Add them to your `.env` files as shown above

For detailed setup instructions, see [RECAPTCHA_SETUP.md](./RECAPTCHA_SETUP.md).

## Running the Application

### Start the Backend Server
```bash
cd backend
npm run dev
```
The server will start on `http://localhost:5000`

### Start the Frontend Application
```bash
cd frontend
npm start
```
The application will open at `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile
- `POST /api/auth/change-password` - Change password

### Scam Reports
- `GET /api/scams` - Get all approved scam reports
- `GET /api/scams/:id` - Get single scam report
- `POST /api/scams` - Create new scam report
- `PUT /api/scams/:id` - Update scam report
- `DELETE /api/scams/:id` - Delete scam report
- `POST /api/scams/:id/vote` - Vote on scam report
- `POST /api/scams/:id/flag` - Flag scam report

### Search
- `GET /api/search` - Search scam reports
- `GET /api/search/suggestions` - Get search suggestions  
- `GET /api/search/stats` - Get platform statistics
- `GET /api/search/similar/:id` - Get similar reports

## Project Structure

```
scam-reporter/
├── backend/
│   ├── models/          # MongoDB models
│   ├── routes/          # Express routes
│   ├── middleware/      # Custom middleware
│   ├── utils/           # Utility functions
│   ├── .env             # Environment variables
│   ├── server.js        # Main server file
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── services/    # API services
│   │   ├── context/     # React context
│   │   ├── types/       # TypeScript types
│   │   ├── utils/       # Utility functions
│   │   └── App.tsx      # Main app component
│   ├── public/
│   ├── .env             # Environment variables
│   └── package.json
└── README.md
```

## Features in Detail

### User Authentication
- Secure registration and login
- JWT-based authentication
- Password hashing with bcrypt
- Profile management
- Role-based access control

### Scam Reporting
- Detailed scam report forms
- File upload for evidence
- Categorized scam types
- Location and financial loss tracking
- Status tracking (pending, approved, rejected)

### Search Functionality
- Multi-criteria search
- Full-text search capabilities
- Advanced filtering options
- Search suggestions
- Similar report recommendations

### Admin Features
- Report moderation
- User management
- Platform statistics
- Content moderation tools

## Design Philosophy

The application follows a modern, clean design philosophy inspired by leading fintech applications:

- **Clean Typography**: Using Inter font family for readability
- **Consistent Spacing**: 8px grid system for consistent layouts  
- **Subtle Animations**: Smooth transitions using Framer Motion
- **Professional Color Scheme**: Blue and purple gradients with careful contrast
- **Mobile-First**: Responsive design that works on all devices
- **Accessibility**: ARIA labels and keyboard navigation support

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Security Considerations

- All user inputs are validated and sanitized
- Passwords are hashed using bcrypt with salt rounds
- JWT tokens have expiration times
- Rate limiting on API endpoints
- CORS configuration for security
- Helmet.js for security headers

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@scamguard.com or create an issue in the repository.
