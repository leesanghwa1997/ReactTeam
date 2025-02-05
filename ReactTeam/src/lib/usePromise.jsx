import { useState, useEffect } from 'react';
import { useAuth } from '../contextAPI/AuthProvider';

export default function usePromise(promiseCreator, deps) {
  // 대기 중/완료/실패에 대한 상태 관리
  const [loading, setLoading] = useState(false);
  const [resolved, setResolved] = useState(null);
  const [error, setError] = useState(null);
  const { tokenData, setTokenData } = useAuth();

  const setRefreshToken = async () => {
    const refreshToken = tokenData.refresh_token;
    const url = 'https://accounts.spotify.com/api/token';

    const payload = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      }),
    };
    const body = await fetch(url, payload);
    const response = await body.json();
    setTokenData((prev) => ({ ...prev, ...response }));
  };

  useEffect(() => {
    const process = async () => {
      setLoading(true);
      try {
        const resolved = await promiseCreator();
        setResolved(resolved);
      } catch (e) {
        if (e.response?.status === 401) {
          try {
            setRefreshToken();
          } catch (refreshE) {
            setError(refreshE);
          }
        }
      }
      setLoading(false);
    };

    process();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return [loading, resolved, error];
}
