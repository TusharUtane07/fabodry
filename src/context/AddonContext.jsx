import React, { createContext, useContext, useState, useEffect } from "react";

// Create Context
const SelectedAddonsContext = createContext();

// Provider Component
export const SelectedAddonsProvider = ({ children }) => {
  const [selectedAddons, setSelectedAddons] = useState({
    antiviralCleaning: false,
    fabricSoftener: false,
  });

  useEffect(() => {
    // Load saved add-ons from localStorage on mount
    const savedAddons = localStorage.getItem("selectedAddons");
    if (savedAddons) {
      setSelectedAddons(JSON.parse(savedAddons));
    }
  }, []);

  const updateAddons = (id, checked) => {
    setSelectedAddons((prev) => {
      const updatedAddons = { ...prev, [id]: checked };
      // Save updated add-ons to localStorage
      localStorage.setItem("selectedAddons", JSON.stringify(updatedAddons));
      return updatedAddons;
    });
  };

  return (
    <SelectedAddonsContext.Provider value={{ selectedAddons, updateAddons }}>
      {children}
    </SelectedAddonsContext.Provider>
  );
};

// Custom Hook to Use Context
export const useSelectedAddons = () => useContext(SelectedAddonsContext);
