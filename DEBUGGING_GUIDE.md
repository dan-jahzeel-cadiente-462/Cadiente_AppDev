# EasySave Mobile - Login Debugging Guide (Symfony Backend)

## Step-by-Step Debugging Process

### Step 1: Verify Symfony Backend is Responding

Open terminal and test your endpoint directly:

```bash
# Test if backend is responding (GET request first)
curl http://127.0.0.1:8000/api/login
```

Expected: Either response or error from Symfony (not "Connection refused")

---

### Step 2: Test Login with cURL (Exactly as App Sends It)

```bash
# Test POST request with JSON body
curl -X POST http://127.0.0.1:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"testpass"}'
```

**Expected Response (Success):**
```json
{
  "token": "some_jwt_token_here",
  "user": {
    "username": "testuser"
  }
}
```

**Or if registration required first:**
```json
{
  "message": "User not found",
  "code": 401
}
```

**Copy the exact response** - this tells us what format the app should expect.

---

### Step 3: Check Symfony Response Format

Your Symfony API should return JSON like one of these:

#### Option A (Standard)
```json
{
  "token": "jwt_token_string",
  "user": {
    "username": "john",
    "id": 1
  }
}
```

#### Option B (With message)
```json
{
  "success": true,
  "data": {
    "token": "jwt_token_string",
    "user": { "username": "john" }
  }
}
```

#### Option C (Laravel/Symfony typical)
```json
{
  "access_token": "jwt_token_string",
  "token_type": "Bearer",
  "user": { "username": "john" }
}
```

**Note which format YOUR backend uses** - this is important!

---

### Step 4: Check Mobile App Logs

Run the app and watch the console for errors:

```bash
# Terminal 1: Start metro
npm start

# Terminal 2: Run Android with logs
npm run android -- --verbose 2>&1 | grep -i "login\|api\|error"
```

**Look for:**
- Network error messages
- Response format errors
- Timeout errors

---

### Step 5: Verify App Sending Correct Format

The app sends login request like this:

```javascript
// What the app sends:
POST http://127.0.0.1:8000/api/login
Content-Type: application/json

{
  "username": "testuser",
  "password": "testpass"
}
```

**Verify this matches your Symfony endpoint exactly.**

---

### Step 6: Fix API Response Handling

If your Symfony response format is different, update `src/app/api/auth.js`:

#### If Symfony returns different token field:
```javascript
// Current (expects: response.token)
export const loginAPI = async (username, password) => {
  try {
    const response = await authAPI.post('/api/login', {
      username,
      password,
    });
    // response.data should have: { token, user }
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// UPDATE TO (if Symfony returns access_token):
export const loginAPI = async (username, password) => {
  try {
    const response = await authAPI.post('/api/login', {
      username,
      password,
    });
    // Transform response to match app expectations
    return {
      token: response.data.access_token || response.data.token,
      user: response.data.user
    };
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
```

---

### Step 7: Manual Mobile App Testing Without API

Test the Redux flow locally first:

**File: `src/app/saga/auth.js`**

```javascript
// TEMPORARILY - replace loginAPI call with mock data
function* loginSaga(action) {
  try {
    const { username, password } = action.payload;
    
    // MOCK: Skip API call, use hardcoded response
    const response = {
      token: 'mock-token-12345',
      user: { username: username }
    };
    
    // const response = yield call(loginAPI, username, password);  // COMMENT OUT
    
    global.authToken = response.token;
    yield put(loginSuccess(response.user, response.token));
  } catch (error) {
    yield put(loginFailure(error.message || 'Login failed'));
  }
}
```

**Test steps:**
1. Update file above
2. Run: `npm start`
3. Try login with ANY credentials
4. If it works with mock data → API response format is the issue
5. If it fails → Redux/navigation issue

**Then restore the real API call:**
```javascript
const response = yield call(loginAPI, username, password);
```

---

### Step 8: Common Issues & Fixes

#### ❌ Issue: "Network Error" or timeout
**Cause:** Backend not accessible  
**Fix:**
```bash
# Check if backend is listening
curl http://127.0.0.1:8000/api/login
# Should get response, not "Connection refused"
```

#### ❌ Issue: "Cannot read property 'token' of undefined"
**Cause:** API response format doesn't match  
**Fix:** 
- Test with cURL (Step 2)
- Update API handler to match response format
- Check what fields Symfony actually returns

#### ❌ Issue: CORS error
**Cause:** Browser/app blocking requests from different origin  
**Fix:** Update Symfony `config/packages/nelmio_cors.yaml`:
```yaml
nelmio_cors:
  defaults:
    origin_regex: true
    allow_origin: ['.*']
    allow_methods: ['POST', 'PUT', 'GET', 'DELETE', 'OPTIONS']
    allow_headers: ['Content-Type', 'Authorization']
  paths:
    ^/api/:
      origin_regex: true
      allow_origin: ['.*']
```

#### ❌ Issue: 401 Unauthorized consistently
**Cause:** Credentials wrong or user doesn't exist  
**Fix:**
```bash
# Register user first in Symfony
curl -X POST http://127.0.0.1:8000/api/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"testpass123"}'

# Then login
curl -X POST http://127.0.0.1:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"testpass123"}'
```

---

### Step 9: Complete Debugging Checklist

```
Backend:
☐ Symfony server is running
☐ cURL POST to /api/login works
☐ Returns JSON with token and user fields
☐ CORS is enabled
☐ Endpoint path is exactly /api/login

Mobile App:
☐ API_BASE_URL is http://127.0.0.1:8000
☐ Response format matches API response
☐ Mock test (Step 7) shows navigation works
☐ Real API call made after mock works
☐ Error message shows in mobile app

Network:
☐ Backend server is accessible from device/emulator
☐ No firewall blocking port 8000
☐ Android emulator: use 10.0.2.2:8000 instead of 127.0.0.1:8000?
```

---

### Step 10: If Using Android Emulator

**Important:** Emulator cannot reach `127.0.0.1:8000`

**Update `src/app/api/auth.js`:**

```javascript
// For emulator (Android Emulator on Windows/Mac/Linux)
const API_BASE_URL = 'http://10.0.2.2:8000';

// For physical device on same network
// const API_BASE_URL = 'http://YOUR_PC_IP:8000';  // e.g., 192.168.1.100:8000
```

**How to find your PC IP:**
```bash
# Windows
ipconfig
# Look for IPv4 Address like 192.168.x.x

# Mac/Linux
ifconfig
# Look for inet address
```

---

## Quick Postman Test Template

Use this in Postman to verify backend:

```
POST http://127.0.0.1:8000/api/login
Headers:
  Content-Type: application/json

Body (raw, JSON):
{
  "username": "testuser",
  "password": "testpass123"
}
```

Copy the exact response and compare with app expectations.

---

## Final Solution Path

1. **Run cURL test** (Step 2) → note the exact response
2. **If cURL works but app fails** → Response format mismatch → Update `src/app/api/auth.js`
3. **If cURL fails** → Backend issue → Fix Symfony
4. **If unsure** → Test with mock (Step 7) → narrows down the problem

**Result:** You'll know exactly what's broken and how to fix it!
