import { createReducer, on } from '@ngrx/store';
import { login, logout } from '../action/auth.action';

export interface AuthState {
  user: any | null;
}

const initialState: AuthState = {
  user: JSON.parse(localStorage.getItem('users') || 'null'),
};

export const authReducer = createReducer(
  initialState,
  on(login, (state, { user }) => {

    
    localStorage.setItem('users', JSON.stringify({...user,password:'********'}));
    return { ...state, user };
  }),
  on(logout, () => {
    localStorage.removeItem('users');
    return { user: null };
  })
);
