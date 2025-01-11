import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const useFetch = (url, options = {}, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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
        if (err.response?.status === 401 || err.response?.status === 403) {
          // Remove auth token and redirect to login
          localStorage.removeItem("authToken");
          navigate("/login");
        }
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    if (url) fetchData();
  }, [url, navigate, ...dependencies]);
  return { data, loading, error };
};

export default useFetch;
