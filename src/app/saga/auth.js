import { call, put, takeEvery } from 'redux-saga/effects';
import { authLogin } from '../api/auth';

import {
  USER_LOGIN,
  USER_LOGIN_COMPLETED,
  USER_LOGIN_ERROR,
  USER_LOGIN_REQUEST,
  USER_LOGOUT_REQUEST,
  USER_LOGOUT_COMPLETED,
} from '../actions';

export function* userLoginAsync(action) {
  yield put({ type: USER_LOGIN_REQUEST });
  try {
    const response = yield call(authLogin, action.payload);
    yield put({ type: USER_LOGIN_COMPLETED, payload: response });
  } catch (error) {
    yield put({ type: USER_LOGIN_ERROR, payload: error.message });
  }
}

export function* userLogoutAsync() {
  try {
    // TODO: Call API to logout on backend if needed
    yield put({ type: USER_LOGOUT_COMPLETED });
  } catch (error) {
    // Handle logout error if needed
    yield put({ type: USER_LOGOUT_COMPLETED });
  }
}

export function* userLogin() {
  yield takeEvery(USER_LOGIN, userLoginAsync);
}

export function* userLogout() {
  yield takeEvery(USER_LOGOUT_REQUEST, userLogoutAsync);
}