import { useEffect, useState } from 'react';
import axiosInstance from '../../API/axiosInstance';

export default function useCheckUserRole() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const authDataStr = localStorage.getItem('sharifzin_auth_token');
        if (!authDataStr) {
          setLoading(false);
          return;
        }

        const parsed = JSON.parse(authDataStr);
        const accessToken = parsed?.token;
        const currentUser = parsed?.user;

        if (!accessToken || !currentUser?.user_id) {
          setLoading(false);
          return;
        }

        // Call verify with correct token
        const { data } = await axiosInstance.get(`/api/auth/verify/${currentUser.user_id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        setUser(data.user || currentUser);
      } catch (err) {
        console.error('Verify failed:', err.response?.data || err.message);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  const isLoggedIn = !!user;
  const role = user?.role;
  const isCooperation = user?.role === 'همکار';

  return { user, isCooperation, isLoggedIn, role, loading, error };
}
