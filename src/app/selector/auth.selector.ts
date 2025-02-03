import { createSelector, createFeatureSelector } from '@ngrx/store';
import { AuthState } from '../reducer/auth.reducer';

export const selectAuthState = createFeatureSelector<AuthState>('auth');

export const selectUser = createSelector(
  selectAuthState,
  (state) => state.user
);

export const selectIsAuthenticated = createSelector(
  selectUser,
  (user) => !!user
);

export const selectUserRole = createSelector(
  selectUser,
  (user) => user?.role || ''
);
