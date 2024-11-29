const CouponPopup = ({ isOpen, setIsOpen, onCouponSelect }) => {
    const coupons = [
      { code: "Fabodry30", description: "Flat 30% Off" },
      { code: "Fabodry50", description: "Flat 50% Off" },
      { code: "Fabodry30", description: "Flat 30% Off" },
      { code: "Fabodry50", description: "Flat 50% Off" },
    ];
  
    return (
      <div className="relative">
        {isOpen && (
          <div
            className="fixed inset-0 bg-gray-800 bg-opacity-50 z-40"
            onClick={() => setIsOpen(false)}
          ></div>
        )}
        <div
          className={`fixed inset-y-0 left-0 bg-white w-[550px] h-full shadow-lg z-50 transform transition-transform duration-300 ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-lg font-bold">Offers</h2>
            <button
              className="text-gray-500 hover:text-gray-700"
              onClick={() => setIsOpen(false)}
            >
              X
            </button>
          </div>
          <div className="mt-8 overflow-scroll h-full mb-8" style={{scrollbarWidth: "none"}}>
            {coupons.map((coupon, index) => (
              <div 
                key={index} 
                className="border border-gray-400 my-2 mx-5 rounded-lg p-4 flex justify-between "
              >
                <div>
                  <p className="uppercase">{coupon.code}</p>
                  <p className="text-xs text-gray-500">{coupon.description}</p>
                </div>
                <button 
                  className="bg-[#00414e] text-gray-200 px-4 rounded-lg text-sm"
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