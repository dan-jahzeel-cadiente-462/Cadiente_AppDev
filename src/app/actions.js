// AUTH/USER_LOGIN
export const USER_LOGIN = 'USER_LOGIN';
export const USER_LOGIN_REQUEST = 'USER_LOGIN_REQUEST';
export const USER_LOGIN_COMPLETED = 'USER_LOGIN_COMPLETED';
export const USER_LOGIN_ERROR = 'USER_LOGIN_ERROR';
export const USER_LOGIN_RESET = 'USER_LOGIN_RESET';

// AUTH/USER_LOGOUT
export const USER_LOGOUT = 'USER_LOGOUT';
export const USER_LOGOUT_REQUEST = 'USER_LOGOUT_REQUEST';
export const USER_LOGOUT_COMPLETED = 'USER_LOGOUT_COMPLETED';

// Action Creators
export const loginRequest = (username, password) => ({
  type: USER_LOGIN,
  payload: { username, password },
});

export const logoutRequest = () => ({
  type: USER_LOGOUT_REQUEST,
});

export const clearAuthError = () => ({
  type: USER_LOGIN_RESET,
});