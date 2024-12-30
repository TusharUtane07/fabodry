import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const OrderEditPopup = ({ 
  isOpen, 
  setIsOpen, 
  productDetails,
  serviceAddData,
  setServiceAddData,
  serviceWfAddData,
  setServiceWfAddData,
  servicePlAddData,
  setServicePlAddData,
  selectedItem,
  editingGarment
}) => {
  const togglePopup = () => setIsOpen(!isOpen);
  const [quantity, setQuantity] = useState(0);

  const [selectedDetails, setSelectedDetails] = useState({
    type: null,
    services: [],
    requirement: null,
    comments: [],
    press: "Regular",
  });

  // Load existing garment data when editing
  useEffect(() => {
    if (editingGarment && productDetails) {
      setSelectedDetails({
        type: editingGarment.garmentType,
        services: editingGarment.additionalServices || [],
        requirement: editingGarment.requirements,
        comments: editingGarment.comments || [],
        press: editingGarment.press || "Regular"
      });
      setQuantity(editingGarment.quantity || 0);
    }
  }, [editingGarment, productDetails]);

  const selectType = (type) => {
    setSelectedDetails(prev => ({ ...prev, type }));
  };

  const toggleService = (service) => {
    setSelectedDetails(prev => {
      const newServices = prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service];
      return { ...prev, services: newServices };
    });
  };

  const selectRequirement = (requirement) => {
    setSelectedDetails(prev => ({ ...prev, requirement }));
  };

  const toggleComment = (comment) => {
    setSelectedDetails(prev => {
      const newComments = prev.comments.includes(comment)
        ? prev.comments.filter(c => c !== comment)
        : [...prev.comments, comment];
      return { ...prev, comments: newComments };
    });
  };

  const handleIncrement = () => {
    setQuantity(prev => prev + 1);
  };

  const handleDecrement = () => {
    if (quantity <= 1) return;
    setQuantity(prev => prev - 1);
  };

  const updateGarmentData = () => {
    if (quantity === 0) {
      toast.error("Increase Quantity");
      return;
    }
    if (!selectedDetails?.type) {
      toast.error("Select Garment Type");
      return;
    }

    const updatedGarment = {
      productDetails,
      quantity,
      garmentType: selectedDetails.type,
      additionalServices: selectedDetails.services,
      onHangerPrice: selectedDetails.requirement === "On Hanger" ? 20 : 12,
      requirements: selectedDetails.requirement,
      comments: selectedDetails.comments,
      press: selectedDetails.press,
    };

    // Update the correct service data based on selectedItem
    if (selectedItem === "Wash & Iron") {
      setServiceAddData(prev => ({
        ...prev,
        selectedService: selectedItem,
        garments: prev.garments.map(g => 
          g.productDetails._id === productDetails._id ? updatedGarment : g
        )
      }));
    } else if (selectedItem === "Wash & Fold") {
      setServiceWfAddData(prev => ({
        ...prev,
        selectedService: selectedItem,
        garments: prev.garments.map(g => 
          g.productDetails._id === productDetails._id ? updatedGarment : g
        )
      }));
    } else {
      setServicePlAddData(prev => ({
        ...prev,
        selectedService: selectedItem,
        garments: prev.garments.map(g => 
          g.productDetails._id === productDetails._id ? updatedGarment : g
        )
      }));
    }

    toast.success(`${productDetails?.name} Updated`);
    togglePopup();
  };

  return (
    <div className="flex justify-center items-center">
      {isOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50 p-5 pb-10 text-sm">
          <div className="bg-white rounded-lg p-6 w-[55vw] mx-auto">
            <h2 className="text-lg text-[#00414e] mb-4">
              Edit {productDetails?.name}
            </h2>
            <div className="space-y-2 mt-5 mx-8">
              <p className="text-gray-600">Select {productDetails?.name} Type</p>
              <div className="flex justify-start gap-3">
                {productDetails?.type?.map((type) => (
                  <button
                    key={type.label}
                    onClick={() => selectType(type)}
                    className={`rounded-lg text-[10px] px-3 py-1 border capitalize ${
                      selectedDetails.type === type
                        ? "bg-[#006370] text-white"
                        : "border-[#88A5BF] text-black/80"
                    }`}
                  >
                    {selectedDetails.press === "Regular"
                      ? `${type.label} (₹ ${type.price})`
                      : `${type.label} (₹ ${type.premiumPrice})`}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2 mt-5 mx-8">
              <p className="text-gray-600">Select One or More Services</p>
              <div className="flex justify-start gap-3">
                {productDetails?.serviceAddons?.map((service) => (
                  <button
                    key={service.name}
                    onClick={() => toggleService(service)}
                    className={`rounded-lg text-[10px] px-3 py-1 border ${
                      selectedDetails.services.includes(service)
                        ? "bg-[#006370] text-white"
                        : "border-[#88A5BF] text-black/80"
                    }`}
                  >
                    {`${service.name} (₹ ${service.price})`}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2 mt-5 mx-8">
              <p className="text-gray-600">Requirements</p>
              <div className="flex justify-start gap-3">
                {productDetails?.requirements?.map((req) => (
                  <button
                    key={req.name}
                    onClick={() => selectRequirement(req)}
                    className={`rounded-lg text-[10px] px-3 py-1 border ${
                      selectedDetails.requirement === req
                        ? "bg-[#006370] text-white"
                        : "border-[#88A5BF] text-black/80"
                    }`}
                  >
                    {`${req.name} (₹ ${req.price})`}
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
                onClick={updateGarmentData}
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