// src/services/auth.ts
import api from './axios';

interface SignInPayload {
  email: string;
  password: string;
}

export const signIn = async (payload: SignInPayload) => {
  const response = await api.post('/Auth/sign-in', payload);
  return response;
};
