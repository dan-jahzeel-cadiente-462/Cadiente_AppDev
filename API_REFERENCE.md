# EasySave Mobile - API Reference Guide

## Base Configuration

### API Base URL
**Location:** `src/app/api/auth.js` (Line 4)

```javascript
const API_BASE_URL = 'http://your-api-url.com'; // UPDATE THIS
```

**Examples:**
- Development: `http://192.168.1.100:3000`
- Development (localhost): `http://10.0.2.2:3000` (Android Emulator)
- Production: `https://api.easysave.com`

---

## API Endpoints

### 1. Login Endpoint

**Method:** `POST`  
**Path:** `/auth/login`  
**Full URL:** `{API_BASE_URL}/auth/login`

#### Request
```json
{
  "username": "johndoe",
  "password": "password123"
}
```

#### Success Response (200)
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "username": "johndoe",
    "id": 1,
    "email": "john@example.com"
  }
}
```

#### Error Response (401)
```json
{
  "message": "Invalid username or password"
}
```

---

### 2. Register Endpoint

**Method:** `POST`  
**Path:** `/auth/register`  
**Full URL:** `{API_BASE_URL}/auth/register`

#### Request
```json
{
  "username": "johndoe",
  "password": "password123",
  "confirmPassword": "password123"
}
```

#### Success Response (201)
```json
{
  "user": {
    "username": "johndoe",
    "id": 1,
    "email": "john@example.com"
  }
}
```

#### Error Response (400)
```json
{
  "message": "Username already exists"
}
```

---

### 3. Logout Endpoint

**Method:** `POST`  
**Path:** `/auth/logout`  
**Full URL:** `{API_BASE_URL}/auth/logout`

#### Request Headers
```
Authorization: Bearer {token}
Content-Type: application/json
```

#### Request Body
```json
{}
```

#### Success Response (200)
```json
{
  "message": "Logged out successfully"
}
```

#### Error Response (401)
```json
{
  "message": "Unauthorized"
}
```

---

## Request / Response Specifications

### Authentication Token Format
The app uses Bearer tokens in the Authorization header:

```
Authorization: Bearer {token}
```

All authenticated requests automatically include this header. The token is stored after successful login and used for subsequent API calls.

### Content-Type
All requests use JSON:
```
Content-Type: application/json
```

### Timeout
Default request timeout: **10,000 ms** (10 seconds)

---

## Key Implementation Details

### 1. Token Storage
After successful login, the token is stored in:
```javascript
global.authToken = tokenValue;
```

This is automatically included in all subsequent requests via the request interceptor.

### 2. Request Interceptor
```javascript
authAPI.interceptors.request.use((config) => {
  const token = global.authToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### 3. Error Response Format
The app expects error responses in this format:
```javascript
{
  message: "Error description",
  // other fields optional
}
```

The error message is displayed to the user via `Alert.alert()`.

### 4. API Calls Flow

#### Login Flow
```
User enters credentials
  ↓
LoginScreen dispatches loginRequest(username, password)
  ↓
Redux-Saga calls loginAPI(username, password)
  ↓
API returns {token, user}
  ↓
loginSuccess action dispatches with token and user
  ↓
Redux reducer updates isSignedIn = true
  ↓
Navigation switches to Main Stack
```

#### Registration Flow
```
User enters credentials
  ↓
RegisterScreen dispatches registerRequest(username, password, confirmPassword)
  ↓
Redux-Saga calls registerAPI(username, password, confirmPassword)
  ↓
API returns {user}
  ↓
registerSuccess action dispatches
  ↓
Navigation redirects to LoginScreen
```

---

## Customization Examples

### Change Username to Email
If your API uses email instead of username:

**In `src/screens/auth/LoginScreen.js`:**
```javascript
// Change this
<CustomTextInput
  label="Username"
  placeholder="Enter your username"
  value={username}
  onChangeText={setUsername}
  keyboardType="email-address"
/>

// To this
<CustomTextInput
  label="Email"
  placeholder="Enter your email"
  value={email}
  onChangeText={setEmail}
  keyboardType="email-address"
/>
```

**Update the request:**
```javascript
const handleLogin = () => {
  dispatch(loginRequest(email, password)); // Changed from username
};
```

**In `src/app/api/auth.js`:**
```javascript
export const loginAPI = async (email, password) => {
  try {
    const response = await authAPI.post('/auth/login', {
      email,      // Changed from username
      password,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
```

### Handle Additional User Fields
If your user object has more fields:

**In `src/app/saga/auth.js`:**
```javascript
function* loginSaga(action) {
  try {
    const { username, password } = action.payload;
    const response = yield call(loginAPI, username, password);

    // Extract additional fields from response
    const { token, user } = response;
    global.authToken = token;

    yield put(loginSuccess(user, token)); // user now includes extra fields
  } catch (error) {
    yield put(loginFailure(error.message || 'Login failed'));
  }
}
```

**In `src/screens/main/HomeScreen.js`:**
```javascript
const { user } = useSelector((state) => state.auth);

<Text>Email: {user?.email}</Text>
<Text>Name: {user?.firstName} {user?.lastName}</Text>
```

---

## Testing the API

### Using cURL
```bash
# Login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"johndoe","password":"password123"}'

# Register
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"johndoe","password":"password123","confirmPassword":"password123"}'
```

### Using Postman
1. Create a new POST request
2. Set URL to: `http://localhost:3000/auth/login`
3. Set Headers: `Content-Type: application/json`
4. Set Body (raw, JSON):
```json
{
  "username": "johndoe",
  "password": "password123"
}
```
5. Send request

---

## Troubleshooting

### "Network Error" in App
- Check API_BASE_URL is correct
- Verify backend server is running
- Check firewall/proxy settings
- For Android Emulator: use `10.0.2.2` instead of `localhost`

### "Cannot read property 'message' of undefined"
- Ensure API returns response in expected format
- Check error handling in saga

### Token Not Sent in Requests
- Verify login was successful
- Check `global.authToken` is set
- Verify request interceptor is working

### CORS Errors
- Add CORS headers to your backend
- Example (Node.js/Express):
```javascript
app.use(cors({
  origin: 'http://localhost:8081',
  credentials: true
}));
```

---

## Security Notes

⚠️ **For Production:**
1. Use HTTPS instead of HTTP
2. Store tokens in secure storage (AsyncStorage with encryption)
3. Implement token refresh logic
4. Add request/response encryption if needed
5. Implement rate limiting on backend
6. Add CSRF protection
7. Validate all inputs
8. Use environment variables for API URL

---

## Complete Example Backend (Node.js/Express)

```javascript
const express = require('express');
const app = express();

app.use(express.json());

// Mock user database
const users = {};

app.post('/auth/login', (req, res) => {
  const { username, password } = req.body;
  
  // Validate inputs
  if (!username || !password) {
    return res.status(400).json({ message: 'Missing credentials' });
  }
  
  // Check user exists and password is correct
  if (users[username] && users[username].password === password) {
    return res.json({
      token: 'mock-jwt-token-' + Date.now(),
      user: { username, id: 1 }
    });
  }
  
  res.status(401).json({ message: 'Invalid credentials' });
});

app.post('/auth/register', (req, res) => {
  const { username, password, confirmPassword } = req.body;
  
  if (!username || !password || !confirmPassword) {
    return res.status(400).json({ message: 'Missing fields' });
  }
  
  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }
  
  if (users[username]) {
    return res.status(400).json({ message: 'Username already exists' });
  }
  
  users[username] = { password };
  res.status(201).json({ user: { username, id: Object.keys(users).length } });
});

app.post('/auth/logout', (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

---

**Last Updated:** March 2026  
**API Version:** 1.0
