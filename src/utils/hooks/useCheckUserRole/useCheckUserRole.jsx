'use client';

import { useEffect, useState } from 'react';

import axiosInstance from '../../API/axiosInstance';

const AUTH_STORAGE_KEY = 'sharifzin-auth-token';

export default function useCheckUserRole() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const authDataStr = localStorage.getItem(AUTH_STORAGE_KEY);

        if (!authDataStr?.length) {
          setLoading(false);
          return;
        }

        let parsed;

        try {
          parsed = JSON.parse(authDataStr);
        } catch {
          localStorage.removeItem(AUTH_STORAGE_KEY);
          setLoading(false);
          return;
        }

        const accessToken = parsed?.token;
        const currentUser = parsed?.user;

        if (!accessToken?.length) {
          localStorage.removeItem(AUTH_STORAGE_KEY);
          setLoading(false);
          return;
        }

        /*
         * Verify token
         */
        const { data } = await axiosInstance.get('/api/v1/auth/verify', {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        const verifiedUser = data?.user || currentUser;

        if (!verifiedUser) {
          throw new Error('اطلاعات کاربر دریافت نشد');
        }

        setUser(verifiedUser);

        /*
         * Update localStorage with fresh user data
         */
        localStorage.setItem(
          AUTH_STORAGE_KEY,
          JSON.stringify({
            token: accessToken,
            user: verifiedUser,
          })
        );
      } catch (err) {
        console.error('Verify failed:', err?.response?.data || err?.message);

        setUser(null);
        setError(err);

        /*
         * Token is invalid/expired
         */
        if (err?.response?.status === 401 || err?.response?.status === 403) {
          localStorage.removeItem(AUTH_STORAGE_KEY);
        }
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  const isLoggedIn = !!user;
  const role = user?.role;
  const isCooperation = role === 'همکار';
  const isAdmin = role === 'admin';

  return { user, isCooperation, isLoggedIn, role, loading, error, isAdmin };
}
