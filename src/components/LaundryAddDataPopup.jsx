import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useCart } from "../context/CartContenxt";

const LaundryAddDataPopup = ({
  serviceAddData,
  serviceWfAddData,
  servicePlAddData,
  selectedItem,
  isOpen,
  setIsOpen,
  productDetails,
}) => {
  const [quantity, setQuantity] = useState(0);
  const { refreshCart, laundryCart } = useCart();

  const [selectedDetails, setSelectedDetails] = useState({
    type: [],
    services: [],
    requirements: [],
    comments: [],
  });

  const togglePopup = () => {
    setIsOpen(!isOpen);
    setSelectedDetails({
      type: [],
      services: [],
      requirements: [],
      comments: [],
    });
    setQuantity(0);
  };

  const [isInCart, setIsInCart] = useState(false);
  const [cartItemId, setCartItemId] = useState(null);
  const [existingCartItem, setExistingCartItem] = useState(null);

  const selectType = (type) => {
    setSelectedDetails((prev) => ({ ...prev, type }));
  };

  const toggleService = (service) => {
    setSelectedDetails((prev) => {
      const newServices = prev?.services?.includes(service)
        ? prev?.services?.filter((s) => s !== service)
        : [...prev.services, service];
      return { ...prev, services: newServices };
    });
  };

  const toggleRequirement = (requirement) => {
    setSelectedDetails((prev) => {
      const newRequirements = prev?.requirements?.includes(requirement)
        ? prev?.requirements?.filter((r) => r !== requirement)
        : [...(prev?.requirements || []), requirement];
      return { ...prev, requirements: newRequirements };
    });
  };

  const toggleComment = (comment) => {
    setSelectedDetails((prev) => {
      const newComments = prev?.comments?.includes(comment)
        ? prev?.comments?.filter((c) => c !== comment)
        : [...prev.comments, comment];
      return { ...prev, comments: newComments };
    });
  };

  const handleIncrement = () => {
    setQuantity(quantity + 1);
  };
  const handleDecrement = () => {
    if (quantity === 1) {
      return;
    } else {
      setQuantity(quantity - 1);
    }
  };

  useEffect(() => {
      if (selectedItem && laundryCart?.length > 0) {
        const cartItem = laundryCart.find(
          (item) => item?.serviceName === selectedItem 
        );
        if (cartItem) {
          setIsInCart(true);
          setCartItemId(cartItem._id);
          setExistingCartItem(cartItem);
        } else {
          setIsInCart(false);
          setCartItemId(null);
          setExistingCartItem(null);
        }
      } else {
        setIsInCart(false);
        setCartItemId(null);
        setExistingCartItem(null);
      }
    }, [selectedItem, laundryCart]);

    const addToServiceData = async () => {
      if (quantity === 0) {
        toast.error("Increase Quantity");
        return;
      }
      if (selectedDetails?.type == null) {
        toast.error("Select Garment Type");
        return;
      }
      
      const token = localStorage.getItem("authToken");
      const userId = localStorage.getItem("userId");
    
      const garmentData = {
        productId: productDetails?._id + (Math.floor(Math.random() * 900) + 100) ,
        productDetails,
        quantity,
        garmentType: selectedDetails?.type,
        additionalServices: selectedDetails?.services,
        requirements: selectedDetails?.requirements,
        comments: selectedDetails?.comments,
        isInCart: false,
      };
    
      const currentServiceData = 
        selectedItem === "Wash & Iron"
          ? serviceAddData
          : selectedItem === "Wash & Fold"
          ? serviceWfAddData
          : servicePlAddData;
      try {
        if (cartItemId) {
          const updatedProducts = [
            ...(currentServiceData?.garments?.map(garment => ({
              ...garment,
              isInCart: isInCart,
            })) || []),
            { ...garmentData} // Add the new garmentData with isInCart
          ];
          
           const response = await axios.put(
            `${import.meta.env.VITE_BACKEND_URL}api/v1/Laundrycarts/update/${cartItemId}`,
            {
              products: updatedProducts,
              cartId: cartItemId, 
              weight: currentServiceData?.serviceWeight || 0,
              customerId: userId,
              serviceName: selectedItem,
              productAddons: currentServiceData?.addons || [],
              pieceCount: updatedProducts.length,
              totalPrice: currentServiceData?.totalPrice,
              isInCart: existingCartItem?.isInCart,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          refreshCart();
          toast.success("Cart updated successfully");
        } else {
          const response = await axios.post(
            `${import.meta.env.VITE_BACKEND_URL}api/v1/Laundrycarts/add`,
            {
              productId: productDetails?._id + (Math.floor(Math.random() * 900) + 100) ,
              products: [garmentData],
              weight: currentServiceData?.serviceWeight || 0,
              customerId: userId,
              serviceName: selectedItem,
              productAddons: currentServiceData?.addons || [],
              pieceCount: 1,
              totalPrice: currentServiceData?.price || 0,
              isInCart: false,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          toast.success("Added to cart successfully");
        }
        
        refreshCart();
        setQuantity(0);
        setSelectedDetails({
          type: null,
          services: [],
          requirement: null,
          comments: [],
        });
        togglePopup();
      } catch (error) {
        console.error(error);
        toast.error("Failed to update cart");
      }
    };

  return (
    <div className="flex justify-center items-center">
      {isOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50 p-5 pb-10 text-sm">
          <div className="bg-white rounded-lg p-6 w-[55vw] mx-auto">
            <h2 className="text-lg text-[#00414e] mb-4">
              {productDetails?.name}
            </h2>
            <div className="space-y-2 mt-5 mx-8">
              <p className="text-gray-600">
                Select {productDetails?.name} Type
              </p>
              <div className="flex justify-start gap-3">
                {productDetails?.type?.map((type) => (
                  <button
                    key={type}
                    onClick={() => selectType(type)}
                    className={`rounded-lg text-[10px] px-3 py-1 border capitalize ${
                      selectedDetails.type === type
                        ? "bg-[#006370] text-white"
                        : "border-[#88A5BF] text-black/80"
                    }`}
                  >
                    {type?.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2 mt-5 mx-8">
              <p className="text-gray-600">Select One or More Services</p>
              <div className="flex justify-start gap-3">
                {productDetails?.serviceAddons?.map((service) => (
                  <button
                    key={service}
                    onClick={() => toggleService(service)}
                    className={`rounded-lg text-[10px] px-3 py-1 border ${
                      selectedDetails.services.includes(service)
                        ? "bg-[#006370] text-white"
                        : "border-[#88A5BF] text-black/80"
                    }`}
                  >
                    {`${service?.name} (₹ ${service?.price}) `}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2 mt-5 mx-8">
              <p className="text-gray-600">Requirements</p>
              <div className="flex justify-start gap-3">
  {productDetails?.requirements?.map((req) => (
    <button
      key={req}
      onClick={() => toggleRequirement(req)}
      className={`rounded-lg text-[10px] px-3 py-1 border ${
        selectedDetails.requirements?.includes(req)
          ? "bg-[#006370] text-white"
          : "border-[#88A5BF] text-black/80"
      }`}
    >
      {`${req?.name} (₹ ${req?.price}) `}
    </button>
  ))}
</div>
            </div>
            <div className="space-y-2 mt-5 mx-8">
              <p className="text-gray-600">Comments</p>
              <div className="grid grid-cols-4 justify-start gap-3">
                {productDetails?.comments?.map((comment) => (
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
            <div className="mt-4 mx-8">
              <button
                onClick={addToServiceData}
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

export default LaundryAddDataPopup;
