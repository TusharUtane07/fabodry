const HomeDeliveryPopup = ({ isOpen, setIsOpen }) => {
  const togglePopup = () => setIsOpen(!isOpen);

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-1/2 lg:w-1/3 p-6 relative">
            <h2 className="text-xl font-semibold mb-4">Delivery Details</h2>
            <button
              onClick={togglePopup}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
            >
              ✕
            </button>
            <form>
              {/* Full Address */}
              <div className="mb-4">
                <label
                  htmlFor="fullAddress"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Full Address
                </label>
                <textarea
                  id="fullAddress"
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                  placeholder="Enter your full address"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="pincode"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Pincode
                </label>
                <input
                  type="text"
                  id="pincode"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm "
                  placeholder="Enter your pincode"
                />
              </div>
              <button
                type="submit"
                className="w-full px-4 py-2 bg-[#00414e] text-white rounded-md"
              >
                Save Details
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default HomeDeliveryPopup;
