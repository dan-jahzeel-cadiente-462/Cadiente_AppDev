import {
  USER_LOGIN,
  USER_LOGIN_COMPLETED,
  USER_LOGIN_ERROR,
  USER_LOGIN_REQUEST,
  USER_LOGIN_RESET,
  USER_LOGOUT_REQUEST,
  USER_LOGOUT_COMPLETED,
} from '../actions';

const INITIAL_STATE = {
  user: null,
  isLoading: false,
  isSignedIn: false,
  error: null,
};

export default function reducer(state = INITIAL_STATE, action) {
  console.log(action.type);
  switch (action.type) {
    case USER_LOGIN_REQUEST:
      return {
        ...state,
        user: null,
        isLoading: true,
        error: null,
      };

    case USER_LOGIN_COMPLETED:
      return {
        ...state,
        // Handle both nested user object and flat response
        user: action.payload.user || action.payload,
        isLoading: false,
        isSignedIn: true,
        error: null,
      };

    case USER_LOGIN_ERROR:
      return {
        ...state,
        user: null,
        isLoading: false,
        isSignedIn: false,
        error: action.payload,
      };

    case USER_LOGOUT_REQUEST:
      return {
        ...state,
        isLoading: true,
      };

    case USER_LOGOUT_COMPLETED:
      return INITIAL_STATE;

    case USER_LOGIN_RESET:
      return INITIAL_STATE;

    default:
      return state;
  }
}

export const userLogin = payload => ({
  type: USER_LOGIN,
  payload,
});


export const resetLogin = () => ({
  type: USER_LOGIN_RESET
});