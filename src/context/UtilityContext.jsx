import { createContext, useContext } from 'react';
import {toast} from 'react-hot-toast';

const UtilityContext = createContext();

export const UtilityProvider = ({ children }) => {
  const validateMobileNumber = () => {
    const mobileNumber = localStorage.getItem('mobileNumber');
    if (!mobileNumber || mobileNumber.length !== 10) {
      toast.error('Please enter mobile number');
      return false;
    }
    return true;
  };

  return (
    <UtilityContext.Provider
      value={{
        validateMobileNumber,
      }}
    >
      {children}
    </UtilityContext.Provider>
  );
};

export const useUtility = () => useContext(UtilityContext);


