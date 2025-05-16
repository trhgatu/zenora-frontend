// ✅ auth.ts (service)
import api from '@/lib/axios';

export const requestOtp = async (email: string) => {
  return api.post('/Auth/request-otp', { email });
};

export const verifyOtp = async ({ email, otpCode, ipAddress, deviceInfo }: {
  email: string;
  otpCode: string;
  ipAddress: string;
  deviceInfo: string;
}) => {
  return api.post('/Auth/verify-otp', { email, otpCode, ipAddress, deviceInfo });
};

export const signUp = async ({ fullName, email, password }: {
  fullName: string;
  email: string;
  password: string;
}) => {
  return api.post('/Auth/sign-up', { fullName, email, password });
};

export const signIn = async ({ email, password }: {
  email: string;
  password: string;
}) => {
  return api.post('/Auth/sign-in', { email, password });
};
