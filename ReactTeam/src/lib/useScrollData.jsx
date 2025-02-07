import { useEffect, useState, useRef } from 'react';
import axios from 'axios';

const useScrollData = (initialEndpoint, authorization) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [endpoint, setEndpoint] = useState(initialEndpoint);
  const isMounted = useRef(false);

  // ✅ API 요청 함수
  const request = async () => {
    if (!endpoint || loading) return;
    setLoading(true);
    try {
      const response = await axios.get(endpoint, {
        headers: { Authorization: authorization },
      });

      const { items, next } = response.data;

      setData((prev) => [...prev, ...items]);
      setEndpoint(next);
    } catch (error) {
      console.error('데이터 불러오기 실패:', error);
    }
    setLoading(false);
  };

  // ✅ 첫 데이터 로드
  useEffect(() => {
    request();
    isMounted.current = true;
  }, []);

  // ✅ 무한 스크롤용 핸들러
  const loadMore = () => {
    if (!isMounted.current || !endpoint || loading) return;
    request();
  };

  return { data, loading, loadMore };
};

export default useScrollData;
