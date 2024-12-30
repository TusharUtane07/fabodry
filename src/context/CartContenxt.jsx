import axios from "axios";
import { createContext, useState, useContext, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(null);
  const [cartProdcuts, setCartProducts] = useState(null);
  const [laundryCart, setLaundryCart] = useState(null);

  const refreshCart = async () => {
    const mobileNumber = localStorage.getItem("mobileNumber");
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.warn("No auth token found. Cannot fetch cart items.");
      return;
    }

    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}api/v1/customers/search?mobile=${mobileNumber}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // setCartItems(response?.data?.data?.customer?.cart); 
      setCartItems([])
      setCartProducts(response?.data?.data?.customer?.cart)
      setLaundryCart(response?.data?.data?.customer?.laundryCart)
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  useEffect(() => {
    refreshCart();
  }, []); 

  return (
    <CartContext.Provider value={{ cartItems, refreshCart, cartProdcuts, laundryCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
