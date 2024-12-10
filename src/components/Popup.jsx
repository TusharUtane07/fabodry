import axios from "axios";
import { useState } from "react";
import { useCart } from "../context/CartContenxt";

const Popup = ({ isOpen, setIsOpen, productDetails }) => {
  const togglePopup = () => setIsOpen(!isOpen);

  const { refreshCart } = useCart();

  const [selectedDetails, setSelectedDetails] = useState({
    type: null, 
    services: [], 
    requirement: null, 
    comments: [], 
    press: "Steam Press", 
  });

  const selectType = (type) => {
    setSelectedDetails((prev) => ({ ...prev, type }));
  };

  const toggleService = (service) => {
    setSelectedDetails((prev) => {
      const newServices = prev.services.includes(service)
        ? prev.services.filter((s) => s !== service)
        : [...prev.services, service];
      return { ...prev, services: newServices };
    });
  };

  const selectRequirement = (requirement) => {
    setSelectedDetails((prev) => ({ ...prev, requirement }));
  };

  const toggleComment = (comment) => {
    setSelectedDetails((prev) => {
      const newComments = prev.comments.includes(comment)
        ? prev.comments.filter((c) => c !== comment)
        : [...prev.comments, comment];
      return { ...prev, comments: newComments };
    });
  };
  console.log(productDetails, "pd");

  const togglePress = () => {
    setSelectedDetails((prev) => ({
      ...prev,
      press: prev.press === "Steam Press" ? "Premium Steam Press" : "Steam Press",
    }));
  };

  const addToCart = async () => {
    const token = localStorage.getItem("authToken");
    const userId = localStorage.getItem("userId");

    try {
        const response = await axios.post(
            "http://localhost:8888/api/v1/carts/add",
            {
                customerId: userId,
                productId: [productDetails?.productId],
                serviceId: productDetails?.serviceName,
                quantity: 1,
                garmentType: selectedDetails.type,
                additionalServices: selectedDetails.services,
                onHangerPrice: selectedDetails.requirement === "On Hanger" ? 20 : 12,
                requirements: selectedDetails.requirement,
                comments: selectedDetails.comments,
                press: selectedDetails.press,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        await refreshCart();
    } catch (error) {
        console.error("Error updating cart:", error);
    }
};


  return (
    <div className="flex justify-center items-center">
      {isOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50 p-5 pb-10 text-sm">
          <div className="bg-white rounded-lg p-6 w-[60vw] mx-auto">
            <h2 className="text-lg text-[#00414e] mb-4">
              {productDetails?.productName}
            </h2>
            <div className="space-y-2 mt-5 mx-8">
              <p className="text-gray-600">Select {productDetails?.productName} Type</p>
              <div className="flex justify-start gap-3">
                {["Kids", "Silk", "Linen", "Cotton", "Wedding"].map((type) => (
                  <button
                    key={type}
                    onClick={() => selectType(type)}
                    className={`rounded-lg text-[10px] px-3 py-1 border ${
                      selectedDetails.type === type
                        ? "bg-[#006370] text-white"
                        : "border-[#88A5BF] text-black/80"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2 mt-5 mx-8">
              <p className="text-gray-600">Select One or More Services</p>
              <div className="flex justify-start gap-3">
                {["Dry Clean (Rs 800/pc)", "Steam Press (Rs 800/pc)", "Starching (Rs 800/pc)"].map(
                  (service) => (
                    <button
                      key={service}
                      onClick={() => toggleService(service)}
                      className={`rounded-lg text-[10px] px-3 py-1 border ${
                        selectedDetails.services.includes(service)
                          ? "bg-[#006370] text-white"
                          : "border-[#88A5BF] text-black/80"
                      }`}
                    >
                      {service}
                    </button>
                  )
                )}
              </div>
            </div>
            <div className="space-y-2 mt-5 mx-8">
              <p className="text-gray-600">Requirements</p>
              <div className="flex justify-start gap-3">
                {["Fold (Rs 10/pc)", "Hanger (Rs 10/pc)", "On Hanger (Rs 20/pc)"].map((req) => (
                  <button
                    key={req}
                    onClick={() => selectRequirement(req)}
                    className={`rounded-lg text-[10px] px-3 py-1 border ${
                      selectedDetails.requirement === req
                        ? "bg-[#006370] text-white"
                        : "border-[#88A5BF] text-black/80"
                    }`}
                  >
                    {req}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2 mt-5 mx-8">
              <p className="text-gray-600">Comments</p>
              <div className="grid grid-cols-4 justify-start gap-3">
                {[
                  "Beads Damaged",
                  "Beads Missing",
                  "Bleach Mark",
                  "Button Missing",
                  "Part Missing",
                  "No Guarantee for Stain",
                  "Fungus Stain",
                  "Hole",
                  "Lining Damaged",
                ].map((comment) => (
                  <button
                    key={comment}
                    onClick={() => toggleComment(comment)}
                    className={`rounded-lg text-[10px] px-3 py-1 border ${
                      selectedDetails.comments.includes(comment)
                        ? "bg-[#006370] text-white"
                        : "border-[#88A5BF] text-black/80"
                    }`}
                  >
                    {comment}
                  </button>
                ))}
              </div>
            </div>
            <div
              className={`flex mt-5 mx-8 items-center justify-between w-72 py-0.5 h-8 px-1 text-[10px] bg-gray-300 rounded-full cursor-pointer`}
              onClick={togglePress}
            >
              <div
                className={`flex-1 text-center py-1 rounded-full px-3 transition-all ${
                  selectedDetails.press === "Steam Press"
                    ? "bg-[#006370] text-white"
                    : "text-black"
                }`}
              >
                Steam Press
              </div>
              <div
                className={`flex-1 text-center py-1 rounded-full px-3 transition-all ${
                  selectedDetails.press === "Premium Steam Press"
                    ? "bg-[#006370] text-white"
                    : "text-black"
                }`}
              >
                Premium Steam Press
              </div>
            </div>
            <div className="mt-4 mx-8">
              <button
                onClick={addToCart}
                className="text-[10px] bg-[#006370] text-white px-20 py-2 rounded-lg"
              >
                Add
              </button>
              <button
                onClick={togglePopup}
                className="text-[10px] bg-[#006370] ml-3 text-white px-20 py-2 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Popup;
