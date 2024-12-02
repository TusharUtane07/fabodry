import { useState, useEffect } from "react";
import axios from "axios";

const useFetch = (url, options = {}, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios({
          url,
          method: options.method || "GET",
          ...options,
        });
        setData(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    if (url) fetchData();
  }, [url, ...dependencies]);
  return { data, loading, error };
};

export default useFetch;
