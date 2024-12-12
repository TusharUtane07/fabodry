import { useEffect, useState } from "react";
import useFetch from "../hooks/useFetch";

const CouponPopup = ({ isOpen, setIsOpen, onCouponSelect }) => {

  const [couponCodes, setCouponCodes]  = useState(null);
      const token = localStorage.getItem("authToken");
        const { data, loading, error } = useFetch("http://localhost:8888/api/v1/coupons/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      useEffect(() => {
      if (data?.data) {
        setCouponCodes(data.data);
      }
    }, [data]);
  
    return (
      <div className="relative">
        {isOpen && (
          <div
            className="fixed inset-0 bg-gray-800 bg-opacity-50 z-40"
            onClick={() => setIsOpen(false)}
          ></div>
        )}
        <div
          className={`fixed inset-y-0 left-0 bg-white w-[250px] h-full shadow-lg z-50 transform transition-transform duration-300 ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex justify-between items-center p-2 border-b">
            <h2 className="text-lg font-bold">Offers</h2>
            <button
              className="text-gray-500 hover:text-gray-700"
              onClick={() => setIsOpen(false)}
            >
              X
            </button>
          </div>
          <div className="mt-8 overflow-scroll h-full mb-8" style={{scrollbarWidth: "none"}}>
            {couponCodes?.map((coupon, index) => (
              <div 
                key={index} 
                className="border border-gray-400 my-2 mx-5 rounded-lg p-2.5 flex justify-between "
              >
                <div>
                  <p className="uppercase text-[10px]">{coupon.code}</p>
                  <p className="text-[8px] text-gray-500">Discount: {coupon.discountValue}% off</p>
                </div>
                <button 
                  className="bg-[#00414e] text-gray-200 px-3 rounded-lg text-[10px]"
                  onClick={() => onCouponSelect(coupon)}
                >
                  Apply
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };
  
  export default CouponPopup;