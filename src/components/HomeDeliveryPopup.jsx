const HomeDeliveryPopup = ({ isOpen, setIsOpen }) => {
  const togglePopup = () => setIsOpen(!isOpen);

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-screen h-screen p-6 relative">
            <h2 className="text-xl font-semibold mb-4">Delivery Details</h2>
            <button
              onClick={togglePopup}
              className="absolute top-3 right-3 text-xl text-gray-500 hover:text-gray-800"
            >
              ✕
            </button>
            <div className="flex w-full h-full pb-10 justify-between">
              <div className="flex-1">
              <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d121058.93187202603!2d73.78056642686632!3d18.524761373821995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2bf2e67461101%3A0x828d43bf9d9ee343!2sPune%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1732773032436!5m2!1sen!2sin"   className="w-full h-full p-4 pr-4" allowfullscreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
              </div>
              <form className="w-[350px] rounded-xl p-5">
                <div className="mb-4 ">
                  <label
                    htmlFor="fullAddress"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Enter Location
                  </label>
                  <input
                    id="fullAddress"
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                    placeholder="Enter your full address"
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="selected-address"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Selected Address
                  </label>
                  <input
                    type="text"
                    id="selected-address"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm "
                    placeholder="Enter your selected address"
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="plot-number"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Plot Number
                  </label>
                  <input
                    type="text"
                    id="plot-number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm "
                    placeholder="Enter your plot number"
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="landmark"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Enter your landmark
                  </label>
                  <input
                    type="text"
                    id="landmark"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm "
                    placeholder="Enter your landmark"
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="lable"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Select Label
                  </label>
                  <div className="flex gap-3 ">
                  <button className="px-4 py-1 text-white bg-[#00414e] rounded-full ">Home</button>
                  <button className="px-4 py-1 text-white bg-[#00414e] rounded-full ">Office</button>
                  <button className="px-4 py-1 text-white bg-[#00414e] rounded-full ">Other</button>
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-[#00414e] text-white rounded-md"
                >
                  Add Address
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HomeDeliveryPopup;
