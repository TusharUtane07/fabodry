import axios from "axios";
import { useEffect, useState } from "react";
import { useCart } from "../context/CartContenxt";
import toast from "react-hot-toast";

const OrderEditPopup = ({ isOpen, setIsOpen, productDetails, cartId }) => {
  const { laundryCart } = useCart();

  const [selectedDetails, setSelectedDetails] = useState({
    type: [],
    services: [],
    requirements: [],
    comments: [],
  });

  const [quantity, setQuantity] = useState(0);

  useEffect(() => {
    try {
      const cartItem = laundryCart?.find(item => item?._id === cartId);
      if (cartItem && productDetails) {
        const selectedProduct = cartItem?.products?.find(
          (item) => item.productDetails._id === productDetails?._id
        );
        console.log(selectedProduct);
        const { garmentType, additionalServices, requirements, comments, quantity } = selectedProduct;
        console.log(selectedProduct);

        setSelectedDetails({
          type: garmentType,
          services: additionalServices,
          requirements: requirements,
          comments: comments,
        });

        setQuantity(quantity || 0);
      }
    } catch (error) {
      console.error("Error in useEffect:", error);
    }
  }, [laundryCart, cartId, productDetails]);

  const togglePopup = () => setIsOpen(!isOpen);

  const { refreshCart } = useCart();

  const selectType = (type) => {
    if (!type) return;
    setSelectedDetails(prev => ({ ...prev, type }));
  };

  const toggleService = (service) => {
    if (!service) return;
    setSelectedDetails(prev => {
      const services = prev?.services || [];
      return {
        ...prev,
        services: services.some(s => s._id === service._id)
          ? services.filter(s => s._id !== service._id)
          : [...services, service]
      };
    });
  };

  const toggleRequirement = (requirement) => {
    if (!requirement) return;
    setSelectedDetails(prev => {
      const requirements = prev?.requirements || [];
      return {
        ...prev,
        requirements: requirements.some(r => r._id === requirement._id)
          ? requirements.filter(r => r._id !== requirement._id)
          : [...requirements, requirement]
      };
    });
  };

  const toggleComment = (comment) => {
    if (!comment) return;
    setSelectedDetails(prev => {
      const comments = prev?.comments || [];
      return {
        ...prev,
        comments: comments.includes(comment)
          ? comments.filter(c => c !== comment)
          : [...comments, comment]
      };
    });
  };

  const handleIncrement = () => {
    setQuantity(prev => prev + 1);
  };

  const handleDecrement = () => {
    setQuantity(prev => (prev <= 1 ? prev : prev - 1));
  };

  const addToCart = async () => {
    try {
      if (quantity === 0) {
        throw new Error("Please increase quantity");
      }
      if (!selectedDetails?.type) {
        throw new Error("Please select garment type");
      }
  
      const mobileNumber = localStorage.getItem("mobileNumber");
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("authToken");
  
      if (!mobileNumber || !userId) {
        setIsOpen(false);
        throw new Error("Please enter mobile number");
      }
  
      const garmentData = {
        productDetails,
        quantity,
        garmentType: selectedDetails.type,
        additionalServices: selectedDetails.services,
        requirements: selectedDetails.requirements,
        comments: selectedDetails.comments,
      };
  
      // Fetch the current cart details
      const cartResponse = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}api/v1/Laundrycarts/${cartId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      const currentCart = cartResponse?.data?.data;
  
      // Check if the product exists in the cart
      const existingProductIndex = currentCart.products.findIndex(
        (item) => item?.productDetails?._id === productDetails?._id
      );
  
      if (existingProductIndex !== -1) {
        // Update the existing product details
        currentCart.products[existingProductIndex] = {
          ...currentCart.products[existingProductIndex],
          quantity: garmentData.quantity,
          garmentType: garmentData.garmentType,
          additionalServices: garmentData.additionalServices,
          requirements: garmentData.requirements,
          comments: garmentData.comments,
        };
      } else {
        // Add the new product to the cart
        currentCart?.products?.push(garmentData);
      }
  
      // Update the cart with modified products
      const updatedPayload = {
        products: currentCart?.products,
        weight: currentCart?.weight,
        isInCart: false,
        customerId: userId,
        pieceCount: currentCart?.pieceCount,
        totalPrice: currentCart?.products?.reduce(
          (total, item) => total + item.quantity * item.productDetails.price,
          0
        ),
      };
  
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}api/v1/Laundrycarts/update/${cartId}`,
        updatedPayload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      toast.success(`${productDetails?.name || "Item"} updated successfully`);
      setSelectedDetails({
        type: null,
        services: [],
        requirements: [],
        comments: [],
      });
      setQuantity(0);
      await refreshCart();
      togglePopup();
    } catch (error) {
      console.error("Error updating cart:", error);
      toast.error(error.message || "Error updating cart");
    }
  };
  

  if (!productDetails) {
    return null;
  }

console.log(selectedDetails.type);

  return (
    <div className="flex justify-center items-center">
      {isOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50 p-5 pb-10 text-sm">
          <div className="bg-white rounded-lg p-6 w-[55vw] mx-auto">
            <h2 className="text-lg text-[#00414e] mb-4">
              {productDetails?.name || 'Product'}
            </h2>
            {/* Type Selection */}
            <div className="space-y-2 mt-5 mx-8">
              <p className="text-gray-600">Select {productDetails?.name || 'Product'} Type</p>
              <div className="flex justify-start gap-3">
                {(productDetails?.type || []).map((type) => (
                  <button
                    key={type?.label}
                    onClick={() => selectType(type)}
                    className={`rounded-lg text-[10px] px-3 py-1 border capitalize ${
                      selectedDetails?.type?.label === type?.label
                        ? "bg-[#006370] text-white"
                        : "border-[#88A5BF] text-black/80"
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>
            {/* Services Selection */}
            <div className="space-y-2 mt-5 mx-8">
              <p className="text-gray-600">Select One or More Services</p>
              <div className="flex justify-start gap-3">
                {(productDetails?.serviceAddons || []).map((service) => (
                  <button
                    key={service?._id}
                    onClick={() => toggleService(service)}
                    className={`rounded-lg text-[10px] px-3 py-1 border ${
                      selectedDetails?.services?.some(s => s._id === service._id)
                        ? "bg-[#006370] text-white"
                        : "border-[#88A5BF] text-black/80"
                    }`}
                  >
                    {`${service?.name || ''} (₹ ${service?.price || 0})`}
                  </button>
                ))}
              </div>
            </div>
            {/* Requirements Selection */}
            <div className="space-y-2 mt-5 mx-8">
              <p className="text-gray-600">Requirements</p>
              <div className="flex justify-start gap-3">
                {(productDetails?.requirements || []).map((req) => (
                  <button
                    key={req?._id}
                    onClick={() => toggleRequirement(req)}
                    className={`rounded-lg text-[10px] px-3 py-1 border ${
                      selectedDetails?.requirements?.some(r => r._id === req._id)
                        ? "bg-[#006370] text-white"
                        : "border-[#88A5BF] text-black/80"
                    }`}
                  >
                    {`${req?.name || ''} (₹ ${req?.price || 0})`}
                  </button>
                ))}
              </div>
            </div>
            {/* Comments Selection */}
            <div className="space-y-2 mt-5 mx-8">
              <p className="text-gray-600">Comments</p>
              <div className="grid grid-cols-4 justify-start gap-3">
                {(productDetails?.comments || []).map((comment) => (
                  <button
                    key={comment}
                    onClick={() => toggleComment(comment)}
                    className={`rounded-lg text-[10px] px-3 py-1 border ${
                      selectedDetails?.comments?.includes(comment)
                        ? "bg-[#006370] text-white"
                        : "border-[#88A5BF] text-black/80"
                    }`}
                  >
                    {comment}
                  </button>
                ))}
              </div>
            </div>
            {/* Quantity Controls */}
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
            {/* Action Buttons */}
            <div className="mt-4 mx-8">
              <button
                onClick={addToCart}
                className="text-[10px] bg-[#006370] text-white px-20 py-2 rounded-lg"
              >
                Update
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

export default OrderEditPopup;