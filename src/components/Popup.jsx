import axios from "axios";
import { useEffect, useState } from "react";
import { useCart } from "../context/CartContenxt";
import toast from "react-hot-toast";

const Popup = ({ isOpen, setIsOpen, productDetails, isEditOrder, orderDetails, setUpdatedOrderProductDetails }) => {
  const togglePopup = () => setIsOpen(!isOpen);
  const [quantity, setQuantity] = useState(0);

  const { refreshCart } = useCart();

  const [selectedDetails, setSelectedDetails] = useState({
    type: null,
    services: [],
    requirement: null,
    comments: [],
    press: "Regular",
  });

  const selectType = (type) => {
    if (!type) return;
    setSelectedDetails((prev) => ({ ...prev, type }));
  };

  const toggleService = (service) => {
    if (!service) return;
    setSelectedDetails((prev) => {
      const currentServices = prev?.services || [];
      const newServices = currentServices.includes(service)
        ? currentServices.filter((s) => s !== service)
        : [...currentServices, service];
      return { ...prev, services: newServices };
    });
  };

  const selectRequirement = (requirement) => {
    if (!requirement) return;
    setSelectedDetails((prev) => ({ ...prev, requirement }));
  };

  const toggleComment = (comment) => {
    if (!comment) return;
    setSelectedDetails((prev) => {
      const currentComments = prev?.comments || [];
      const newComments = currentComments.includes(comment)
        ? currentComments.filter((c) => c !== comment)
        : [...currentComments, comment];
      return { ...prev, comments: newComments };
    });
  };

  const togglePress = () => {
    setSelectedDetails((prev) => ({
      ...prev,
      press: prev?.press === "Regular" ? "Premium" : "Regular",
    }));
  };

  const handleIncrement = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleDecrement = () => {
    setQuantity((prev) => (prev <= 1 ? prev : prev - 1));
  };

  const addToCart = async () => {
    if(isEditOrder){
      setUpdatedOrderProductDetails(prevState => {
        return [
          ...(prevState || []), // Spread prevState if it exists, otherwise use an empty array
          {
            productId: productDetails,
            serviceName: productDetails?.serviceName || "",
            quantity: quantity,
            garmentType: selectedDetails?.type ? [{ name: selectedDetails.type.label, price: selectedDetails?.type?.price }] : [],
            serviceAddons: selectedDetails?.services || [],
            requirements: selectedDetails?.requirement ? [selectedDetails.requirement] : [],
            comments: selectedDetails?.comments || [],
            isPremium: selectedDetails?.press === "Premium",
          }
        ];
      });
            
            
      setIsOpen(false)
      toast.success("Added New Garment")
      return
    } else {
    if (quantity === 0) {
      toast.error("Increase Quantity");
      return;
    }
    if (!selectedDetails?.type) {
      toast.error("Select Garment Type");
      return;
    }

    const mobileNumber = localStorage.getItem("mobileNumber");
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("authToken");

    if (!mobileNumber || !userId) {
      setIsOpen(false);
      toast.error("Please enter mobile number");
      return;
    }

    try {
      // Ensure arrays are properly initialized
      const payload = {
        customerId: userId,
        productId: productDetails?._id ? [productDetails._id] : [],
        serviceName: productDetails?.serviceName || "",
        quantity: quantity,
        garmentType : selectedDetails?.type ? [{ name: selectedDetails.type.label, price: selectedDetails?.type?.price }]: [],
        serviceAddons: selectedDetails?.services || [],
        requirements: selectedDetails?.requirement ? [selectedDetails.requirement] : [],
        comments: selectedDetails?.comments || [],
        isPremium: selectedDetails?.press === "Premium",
      };

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}api/v1/carts/add`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(`${productDetails?.name || 'Item'} Added`);
      setSelectedDetails({
        type: null,
        services: [],
        requirement: null,
        comments: [],
        press: "Regular",
      });
      setQuantity(0);
      await refreshCart();
      togglePopup();
    } catch (error) {
      if (!userId) {
        toast.error("Please enter mobile number");
      } else {
        toast.error("Internal server error");
      }
      console.error("Error updating cart:", error);
    } finally {
      setQuantity(0);
    }
  }
  };

  // Ensure productDetails exists before rendering
  if (!productDetails) {
    return null;
  }

  return (
    <div className="flex justify-center items-center">
      {isOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50 p-5 pb-10 text-sm">
          <div className="bg-white rounded-lg p-6 w-[55vw] mx-auto">
            <h2 className="text-lg text-[#00414e] mb-4">
              {productDetails?.name || 'Product'}
            </h2>
            <div className="space-y-2 mt-5 mx-8">
              <p className="text-gray-600">Select {productDetails?.name || 'Product'} Type</p>
              <div className="flex justify-start gap-3">
                {(productDetails?.type || []).map((type) => (
                  <button
                    key={type?.label || type}
                    onClick={() => selectType(type)}
                    className={`rounded-lg text-[10px] px-3 py-1 border capitalize ${
                      selectedDetails?.type === type
                        ? "bg-[#006370] text-white"
                        : "border-[#88A5BF] text-black/80"
                    }`}
                  >
                    {selectedDetails?.press === "Regular"
                      ? `${type?.label || type} (₹ ${type?.price || 0})`
                      : `${type?.label || type} (₹ ${type?.premiumPrice || 0})`}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2 mt-5 mx-8">
              <p className="text-gray-600">Select One or More Services</p>
              <div className="flex justify-start gap-3">
                {(productDetails?.serviceAddons || []).map((service) => (
                  <button
                    key={service?.name || service}
                    onClick={() => toggleService(service)}
                    className={`rounded-lg text-[10px] px-3 py-1 border ${
                      (selectedDetails?.services || []).includes(service)
                        ? "bg-[#006370] text-white"
                        : "border-[#88A5BF] text-black/80"
                    }`}
                  >
                    {`${service?.name || service} (₹ ${service?.price || 0})`}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2 mt-5 mx-8">
              <p className="text-gray-600">Requirements</p>
              <div className="flex justify-start gap-3">
                {(productDetails?.requirements || []).map((req) => (
                  <button
                    key={req?.name || req}
                    onClick={() => selectRequirement(req)}
                    className={`rounded-lg text-[10px] px-3 py-1 border ${
                      selectedDetails?.requirement === req
                        ? "bg-[#006370] text-white"
                        : "border-[#88A5BF] text-black/80"
                    }`}
                  >
                    {`${req?.name || req} (₹ ${req?.price || 0})`}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2 mt-5 mx-8">
              <p className="text-gray-600">Comments</p>
              <div className="grid grid-cols-4 justify-start gap-3">
                {(productDetails?.comments || []).map((comment) => (
                  <button
                    key={comment}
                    onClick={() => toggleComment(comment)}
                    className={`rounded-lg text-[10px] px-3 py-1 border ${
                      (selectedDetails?.comments || []).includes(comment)
                        ? "bg-[#006370] text-white"
                        : "border-[#88A5BF] text-black/80"
                    }`}
                  >
                    {comment}
                  </button>
                ))}
              </div>
            </div>
            <div className="mx-8 flex items-center gap-3">
              <p>Quantity: </p>
              <div className="border border-gray-300 w-20 text-center justify-center my-3 rounded-lg p-1 text-sm flex items-center">
                <button
                  className="bg-[#006370] text-white rounded-sm px-1"
                  onClick={handleIncrement}
                >
                  +
                </button>
                <span className="text-gray-500 px-3">{quantity}</span>
                <button
                  className="bg-[#006370] text-white rounded-sm px-1"
                  onClick={handleDecrement}
                >
                  -
                </button>
              </div>
            </div>
            <div
              className={`flex mt-1 mx-8 items-center justify-between w-72 py-0.5 h-8 px-1 text-[10px] bg-gray-300 rounded-full cursor-pointer`}
              onClick={togglePress}
            >
              <div
                className={`flex-1 text-center py-1 rounded-full px-3 transition-all ${
                  selectedDetails?.press === "Regular"
                    ? "bg-[#006370] text-white"
                    : "text-black"
                }`}
              >
                Regular
              </div>
              <div
                className={`flex-1 text-center py-1 rounded-full px-3 transition-all ${
                  selectedDetails?.press === "Premium"
                    ? "bg-[#006370] text-white"
                    : "text-black"
                }`}
              >
                Premium
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