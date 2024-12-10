import axios from "axios";
import { createContext, useState, useContext, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(null);

  const refreshCart = async () => {
    const token = localStorage.getItem("authToken");
    const mobileNumber = localStorage.getItem("mobileNumber");
    if (!token) {
      console.warn("No auth token found. Cannot fetch cart items.");
      return;
    }

    try {
      const response = await axios.get(`http://localhost:8888/api/v1/customers/search?mobile=${mobileNumber}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartItems(response.data.data.customer.cart); 
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  useEffect(() => {
    refreshCart();
  }, []); 

  return (
    <CartContext.Provider value={{ cartItems, refreshCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
