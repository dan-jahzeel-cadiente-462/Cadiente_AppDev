# EasySave Mobile - Authentication System Setup

## Overview
This project implements a complete authentication system for a React Native mobile app using Redux, Redux-Saga, and Axios for API communication. The app includes login, registration, and dashboard functionality.

## Project Structure

### Core App Files
- **App.tsx** - Main app component with Redux Provider and Redux-Saga setup

### Redux Architecture (`src/app/`)
- **api/auth.js** - API endpoints for authentication
  - `loginAPI(username, password)` 
  - `registerAPI(username, password, confirmPassword)`
  - `logoutAPI()`

- **actions.js** - Redux action creators
  - Login/Register/Logout actions
  - Error handling actions

- **reducers/auth.js** - Auth state reducer
  - Handles loading, authentication state, user data
  - Manages errors

- **saga/auth.js** - Redux-Saga middleware
  - Handles async API calls
  - Side effects management

### UI Components (`src/components/`)
- **CustomTextInput.js** - Text input with validation display
- **CustomPasswordInput.js** - Password input with visibility toggle
- **CustomButton.js** - Reusable button with loading state

### Navigation (`src/navigations/`)
- **AuthNavigations.js** - Auth stack (Login, Register)
- **MainNavigations.js** - App stack (Home, etc.)
- **index.js** - Root navigation that switches based on auth state

### Screens (`src/screens/`)
- **auth/LoginScreen.js** - User login with form validation
- **auth/RegisterScreen.js** - User registration with password confirmation
- **main/HomeScreen.js** - Dashboard after login

### Utilities (`src/utils/`)
- **routes.js** - Navigation route constants
- **image.js** - Image utility functions
- **index.js** - Utils exports

## Dependencies Installed

### Core Dependencies
- `react-native` - React Native framework
- `react` - React library
- `@react-navigation/native` - Navigation library
- `@react-navigation/native-stack` - Stack navigation
- `react-native-safe-area-context` - Safe area handling
- `react-native-screens` - Native screens support

### State Management & API
- `redux` - State management
- `react-redux` - Redux React bindings
- `redux-saga` - Side effects management
- `axios` - HTTP client for API calls

## API Configuration

Edit `src/app/api/auth.js` and replace `http://your-api-url.com` with your actual API base URL.

Expected API endpoints:
- `POST /auth/login` - Login endpoint
- `POST /auth/register` - Registration endpoint
- `POST /auth/logout` - Logout endpoint

Expected request/response format:
```javascript
// Login Request
{
  username: string,
  password: string
}

// Login Response
{
  token: string,
  user: {
    username: string,
    // other user fields
  }
}
```

## Authentication Flow

1. **Initial State** - User sees Auth Stack (Login/Register)
2. **Login** - Redux-Saga makes API call, stores token and user
3. **Success** - Navigation switches to Main Stack (Home)
4. **Logout** - Clears auth state, returns to Auth Stack

## Features Implemented

✅ Username/Password authentication
✅ User registration with password confirmation
✅ Form validation with error messages
✅ Loading states during API calls
✅ Error handling and display
✅ Redux state management
✅ API integration via Axios
✅ Protected navigation based on auth state
✅ Logout functionality
✅ Reusable UI components
✅ Custom styled TextInput, PasswordInput, Button

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure API URL
Edit `src/app/api/auth.js` and set your API base URL:
```javascript
const API_BASE_URL = 'http://your-api-url.com';
```

### 3. Run the App

**For Android:**
```bash
npm run android
```

**For iOS:**
```bash
npm run ios
```

**Metro Start:**
```bash
npm start
```

## Form Validation Rules

### Login
- Username: Required
- Password: Required, minimum 6 characters

### Register
- Username: Required, minimum 3 characters
- Password: Required, minimum 6 characters
- Confirm Password: Must match password

## State Management

The Redux store structure:
```
{
  auth: {
    isLoading: boolean,
    isSignedIn: boolean,
    user: { username, ... } | null,
    token: string | null,
    error: string | null
  }
}
```

## API Interceptor

The Axios instance automatically includes the auth token in all requests:
```
Authorization: Bearer <token>
```

Token is stored in `global.authToken` after successful login.

## Customization

### Colors
Edit component styles to change theme colors:
- Primary: `#007AFF` (Blue)
- Error: `#FF6B6B` (Red)
- Background: `#F5F5F5` (Light Gray)

### API Response Fields
Update the login/register sagas in `src/app/saga/auth.js` if your API returns different field names.

## Troubleshooting

### API Calls Not Working
- Verify API_BASE_URL is correct
- Check if backend server is running
- Verify endpoint URLs match your API

### Navigation Not Switching
- Check Redux store is properly connected
- Verify `isSignedIn` state is being updated
- Check browser/device logs for errors

### Form Validation Not Showing
- Ensure CustomTextInput and CustomPasswordInput components are receiving `error` prop
- Check validation function logic in screens

## Next Steps

1. Connect to your actual API
2. Add more screens/features as needed
3. Implement persistent storage (AsyncStorage) for auth token
4. Add user profile management
5. Add additional security measures (token refresh, etc.)
6. Implement error recovery and retry logic

## Notes

- The app currently stores the auth token in memory (`global.authToken`)
- For production, use AsyncStorage to persist the token across app restarts
- Implement token refresh logic to handle expired tokens
- Add more comprehensive error handling for network issues
