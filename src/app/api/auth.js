const BASE_URL = 'http://127.0.0.1:8000/api';
const options = {
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
};

export async function authLogin({ username, password }) {
  try {
    const response = await fetch(BASE_URL + '/login', {
      method: 'POST',
      ...options,
      body: JSON.stringify({
        username,
        password,
      }),
    });
    
    const data = await response.json();

    if (response.ok) {
      // Return the complete user data including token and user info
      return {
        success: true,
        token: data.token, // Assuming Symfony returns a token
        user: {
          id: data.user?.id || data.id,
          username: data.user?.username || data.username || username,
          email: data.user?.email || data.email,
          firstName: data.user?.firstName || data.firstName || data.first_name,
          lastName: data.user?.lastName || data.lastName || data.last_name,
          roles: data.user?.roles || data.roles || ['ROLE_USER'],
          // Add any other user fields your API returns
        },
        // Return the raw data as well in case you need other fields
        ...data
      };
    } else {
      throw new Error(data.message || data.error || 'Login failed');
    }
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}