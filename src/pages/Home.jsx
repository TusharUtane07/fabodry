import { useEffect, useState } from "react";
import MainSection from "../components/MainSection";
import { useNavigate } from "react-router-dom";
import useFetch from "../hooks/useFetch";

const Home = () => {
  const [products, setProducts] = useState(null);
  const navigate = useNavigate();
  const { data } = useFetch("http://51.21.62.30/api/v1/products");
  useEffect(() => {
    if (data) {
      setProducts(data);
    }
  }, [data]);
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/");
    }
  }, [navigate]);
  return (
    <div className="">
      <MainSection products={products}/>
    </div>
  );
};

export default Home;
