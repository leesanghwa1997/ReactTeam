import { useEffect, useState, useRef } from 'react';
import axios from 'axios';

const useScrollData = (initialEndpoint, authorization) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [endpoint, setEndpoint] = useState(initialEndpoint);
  const isMounted = useRef(false);

  const request = async () => {
    if (!endpoint || loading) return;
    setLoading(true);
    try {
      const response = await axios.get(endpoint, {
        headers: { Authorization: authorization },
      });
      let { items, next } = response.data;
      if (response.data.albums) items = response.data.albums.items;
      if (response.data.albums) next = response.data.albums.next;

      if (items) setData((prev) => [...prev, ...items]);
      if (next) setEndpoint(next);
    } catch (error) {
      console.error('데이터 불러오기 실패:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    request();
    isMounted.current = true;
  }, []);

  const handleReachEnd = () => {
    if (!isMounted.current || !endpoint || loading) return;
    request();
  };

  return { data, loading, handleReachEnd };
};

export default useScrollData;
