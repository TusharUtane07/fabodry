import { useEffect, useState } from "react";
import AlphabetsComponent from "../components/alphabetsComponent";
import productGif from "../assets/product.gif";
import { useCart } from "../context/CartContenxt";
import { useUtility } from "../context/UtilityContext";
import {
  MdDelete,
  MdEdit,
  MdModeEditOutline,
  MdVerified,
} from "react-icons/md";
import { IoChevronBackCircle } from "react-icons/io5";
import axios from "axios";
import toast from "react-hot-toast";
import { RxCross2 } from "react-icons/rx";
import LaundryAddDataPopup from "../components/LaundryAddDataPopup";
import LaundryEditDataPopup from "../components/LaundryEditDataPopup";

const Laundry = ({
  mode,
  filteredLaundryProducts,
  orderDetails,
  isEditOrder,
  setUpdatedLaundryProductDetails,
  setHiddenElement,
}) => {
  const { refreshCart, laundryCart } = useCart();
  const { validateMobileNumber } = useUtility();

  const [selectedItem, setSelectedItem] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isInCart, setIsInCart] = useState(false);
  const [cartPId, setCartPId] = useState(null);

  const addons = [
    {
      id: 1,
      name: "Antiviral Cleaning",
      price: 5,
      description: "Remove 99.9 Germs",
    },
    {
      id: 2,
      name: "Fabric Softener",
      price: 5,
      description: "Unbeatable shine & Fragrance",
    },
    {
      id: 3,
      name: "Stain Treatment",
      price: 8,
      description: "Special care for tough stains",
    },
    {
      id: 4,
      name: "Premium Detergent",
      price: 6,
      description: "Enhanced cleaning power",
    },
  ];

  const laundryServices = [
    {
      name: "Wash & Fold",
      price: 12,
      description: "Updated description for Laundry Services",
      image: productGif,
    },
    {
      name: "Wash & Iron",
      price: 20,
      description: "Updated description for Laundry Services",
      image: productGif,
    },
    {
      name: "Premium Laundry",
      price: 40,
      description: "Updated description for Laundry Services",
      image: productGif,
    },
  ];

  const [serviceAddData, setServiceAddData] = useState({
    totalSelectedWeight: 0,
    selectedService: null,
    addons: [],
    garments: [],
    serviceWeight: 0,
    price: laundryServices[1].price,
  });
  const [serviceWfAddData, setServiceWfAddData] = useState({
    totalSelectedWeight: 0,
    selectedService: null,
    addons: [],
    garments: [],
    serviceWeight: 0,
    price: laundryServices[0].price,
  });
  const [servicePlAddData, setServicePlAddData] = useState({
    totalSelectedWeight: 0,
    selectedService: null,
    addons: [],
    garments: [],
    serviceWeight: 0,
    price: laundryServices[2].price,
  });

  useEffect(() => {
    if (laundryCart && laundryCart?.length > 0) {
      laundryCart?.forEach((cartItem) => {
        const serviceName = cartItem?.serviceName;
        const serviceAddons = cartItem?.productAddons || [];
        const serviceGarments = [];

        laundryCart.forEach((item) => {
          if (item.serviceName === serviceName) {
            item.products?.forEach((product) => {
              serviceGarments.push({
                cartId: item?._id,
                productDetails: product.productDetails,
                quantity: product.quantity,
                garmentType: product.garmentType,
                additionalServices: product.additionalServices || [],
                requirements: product.requirements || null,
                comments: product.comments || [],
                serviceName: serviceName,
              });
            });
          }
        });

        if (cartItem.serviceName === serviceName) {
          const serviceData = {
            totalSelectedWeight: cartItem.weight || 0,
            selectedService: serviceName,
            addons: serviceAddons,
            garments: serviceGarments,
            serviceWeight: cartItem.weight || 0,
          };

          
          switch (serviceName) {
            case "Wash & Fold":
              setServiceWfAddData(serviceData);
              break;
            case "Wash & Iron":
              setServiceAddData(serviceData);
              break;
            case "Premium Laundry":
              setServicePlAddData(serviceData);
              break;
            default:
              break;
          }
        }
      });
    }
  }, [laundryCart, selectedItem]);


  const [cartItemId, setCartItemId] = useState(null);
  const [existingCartItem, setExistingCartItem] = useState(null);

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

  const [selectAddonPopup, setSelectedAddonPopup] = useState(false);
  const [weights, setWeights] = useState(() =>
    laundryServices.reduce((acc, _, index) => {
      acc[index] = 0;
      return acc;
    }, {})
  );
  const [clickedItems, setClickedItems] = useState({});

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState(
    filteredLaundryProducts
  );

  useEffect(() => {
    setFilteredProducts(filteredLaundryProducts);
  }, [filteredLaundryProducts]);

  const [productDetails, setProductDetails] = useState(null);

  const handleIncrement = (item) => {
    setProductDetails(item);
    if (!laundryCart || laundryCart?.length === 0) {
      setIsPopupOpen(true);
    } else {
      setIsPopupOpen(true);
    }
  };

  const deleteCartProduct = async (id) => {
    const token = localStorage.getItem("authToken");
    
    try {
      // Delete from database
      const response = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}api/v1/laundrycarts/delete/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      // Clear the specific item from relevant states based on service type
      const itemToDelete = laundryCart.find(item => item._id === id);
      if (itemToDelete) {
        switch (itemToDelete.serviceName) {
          case "Wash & Fold":
            setServiceWfAddData(prev => ({
              ...prev,
              garments: prev.garments.filter(garment => garment.cartId !== id),
              totalSelectedWeight: prev.totalSelectedWeight - (itemToDelete.weight || 0)
            }));
            break;
          
          case "Wash & Iron":
            setServiceAddData(prev => ({
              ...prev,
              garments: prev.garments.filter(garment => garment.cartId !== id),
              totalSelectedWeight: prev.totalSelectedWeight - (itemToDelete.weight || 0)
            }));
            break;
          
          case "Premium Laundry":
            setServicePlAddData(prev => ({
              ...prev,
              garments: prev.garments.filter(garment => garment.cartId !== id),
              totalSelectedWeight: prev.totalSelectedWeight - (itemToDelete.weight || 0)
            }));
            break;
        }
      }
  
      // Refresh the cart after state updates
      refreshCart();
      toast.success("Deleted Successfully");
    } catch (error) {
      toast.error("Error Deleting");
      console.log("Error deleting product: ", error, error.message);
    }
  };

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    filterProducts(query);
  };

  const handleAlphabetClick = (letter) => {
    const query = letter ? letter.toLowerCase() : "";
    filterProducts(query);
    setSearchQuery("");
  };

  const filterProducts = (query) => {
    if (!query) {
      setFilteredProducts(filteredLaundryProducts);
    } else {
      const filtered = filteredLaundryProducts?.filter((product) =>
        product?.name?.toLowerCase().startsWith(query)
      );
      setFilteredProducts(filtered);
    }
  };

  const handleAddProductClick = (index, itemName) => {
    if (!validateMobileNumber()) return;

    setClickedItems((prev) => ({ ...prev, [index]: true }));

    let serviceWeight = 0;
    if (index === 0) {
      serviceWeight = serviceWfAddData?.serviceWeight || 0;
    } else if (index === 1) {
      serviceWeight = serviceAddData?.serviceWeight || 0;
    } else if (index === 2) {
      serviceWeight = servicePlAddData?.serviceWeight || 0;
    }
    if (serviceWeight > 0) {
      handleServiceSelection(itemName);
    }
  };

  const handleWeightChange = (index, value) => {
    const newValue = Math.max(0, Number(value));
    setWeights((prev) => ({ ...prev, [index]: newValue }));
    setClickedItems((prev) => ({ ...prev, [index]: false }));

    if (index === 1) {
      setServiceAddData((prev) => ({
        ...prev,
        serviceWeight: newValue,
      }));
    } else if (index === 0) {
      setServiceWfAddData((prevData) => ({
        ...prevData,
        serviceWeight: newValue,
      }));
    } else {
      setServicePlAddData((prevData) => ({
        ...prevData,
        serviceWeight: newValue,
      }));
    }
  };

  useEffect(() => {
    if (selectedItem === null) {
      setHiddenElement(false);
    }
  }, [selectedItem]);

  const handleServiceSelection = (itemName) => {
    setSelectedItem(itemName);
    setHiddenElement(true);
    if (selectedItem === "Wash & Iron") {
      setServiceAddData((prev) => ({
        ...prev,
        selectedService: itemName,
        serviceWeight: prev.serviceWeight,
      }));
    } else if (selectedItem === "Wash & Fold") {
      setServiceWfAddData((prev) => ({
        ...prev,
        selectedService: itemName,
        serviceWeight: prev.serviceWeight,
      }));
    } else {
      setServicePlAddData((prev) => ({
        ...prev,
        selectedService: itemName,
        serviceWeight: prev?.serviceWeight,
      }));
    }
    setFilteredProducts(filteredLaundryProducts);
    setSearchQuery("");
    setSelectedAddonPopup(true);
  };

  const handleAddonSelect = (addon) => {
    if (selectedItem === "Wash & Iron") {
      setServiceAddData((prev) => ({
        ...prev,
        addons: prev.addons.some((a) => a.id === addon.id)
          ? prev.addons.filter((a) => a.id !== addon.id)
          : [...prev.addons, addon],
      }));
    } else if (selectedItem === "Wash & Fold") {
      setServiceWfAddData((prev) => ({
        ...prev,
        addons: prev.addons.some((a) => a.id === addon.id)
          ? prev.addons.filter((a) => a.id !== addon.id)
          : [...prev.addons, addon],
      }));
    } else {
      setServicePlAddData((prev) => ({
        ...prev,
        addons: prev.addons.some((a) => a.id === addon.id)
          ? prev.addons.filter((a) => a.id !== addon.id)
          : [...prev.addons, addon],
      }));
    }
  };

  const handleWeightAdjustment = (newWeight) => {
    if (selectedItem === "Wash & Iron") {
      setServiceAddData((prev) => ({
        ...prev,
        serviceWeight: Math.max(0, newWeight),
      }));
    } else if (selectedItem === "Wash & Fold") {
      setServiceWfAddData((prev) => ({
        ...prev,
        serviceWeight: Math.max(0, newWeight),
      }));
    } else {
      setServicePlAddData((prev) => ({
        ...prev,
        serviceWeight: Math.max(0, newWeight),
      }));
    }
  };

  const addToCart = async () => {
    const mobileNumber = localStorage.getItem("mobileNumber");
    const userId = localStorage.getItem("userId");
  
    if (mobileNumber === "" || !userId) {
      toast.error("Please enter mobile number");
      return;
    }
  
    if (selectedItem === "Wash & Iron" && !serviceAddData?.garments?.length) {
      toast.error("Add garments before confirming");
      return;
    } else if (selectedItem === "Premium Laundry" && !servicePlAddData?.garments?.length) {
      toast.error("Add garments before confirming");
      return;
    } else if (selectedItem === "Wash & Fold" && !serviceWfAddData?.garments?.length) {
      toast.error("Add garments before confirming");
      return;
    }
  
    const token = localStorage.getItem("authToken");
  
    const currentServiceData =
      selectedItem === "Wash & Iron"
        ? serviceAddData
        : selectedItem === "Wash & Fold"
        ? serviceWfAddData
        : servicePlAddData;
  
    if (currentServiceData?.serviceWeight === 0) {
      toast.error("Please increase weight before adding");
      return;
    }
  
    const price =
      selectedItem === "Wash & Iron"
        ? serviceAddData?.price || 20
        : selectedItem === "Wash & Fold"
        ? serviceWfAddData?.price || 12
        : selectedItem === "Premium Laundry"
        ? servicePlAddData?.price || 40
        : 0;
  
    const newData = {
      weight: currentServiceData?.serviceWeight || 0,
      productAddons: currentServiceData?.addons || [],
      products: currentServiceData?.garments || [],
      pieceCount: currentServiceData?.garments?.length || 0,
      totalPrice: price,
      isInCart: true
    };
  
    try {
      if (isInCart && cartItemId) {
        // Update the cart without merging arrays
        const response = await axios.put(
          `${import.meta.env.VITE_BACKEND_URL}api/v1/Laundrycarts/update/${cartItemId}`,
          newData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        toast.success("Cart updated successfully");
      } else {
        // Add new cart item (if not already in cart)
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}api/v1/Laundrycarts/add`,
          newData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        toast.success("Added to cart successfully");
      }
      refreshCart();
      setServiceWfAddData(null)
      setServiceAddData(null)
      setServicePlAddData(null)
    } catch (error) {
      if (!userId) {
        toast.error("Please enter mobile number");
      } else {
        toast.error("Internal server error");
      }
      console.error(error);
    } finally {
      setSelectedItem(null);
    }
  };
  
  

  return (
    <>
      <div className="w-full h-fit text-center">
        {selectedItem === null ? (
          <>
            <div className="grid grid-cols-3 w-full items-center gap-3 h-full">
              {laundryServices?.map((item, index) => {
                const isSelected = laundryCart?.some(
                  (cartItem) =>
                    cartItem.serviceName === item.name && cartItem?.isInCart
                );

                return (
                  <div
                    key={index}
                    className={`group relative flex flex-col h-full justify-between w-full rounded-xl border p-5 border-[#eef0f2] 
                ${
                  isSelected
                    ? "bg-[#004d57] text-white"
                    : mode === "B2B"
                    ? "hover:bg-[#66BDC5]"
                    : "hover:bg-[#004D57] hover:text-white"
                } transition-colors`}
                  >
                    {isSelected && (
                      <p className="absolute top-1 right-1 text-blue-500">
                        <MdVerified size={25} />
                      </p>
                    )}
                    <img
                      src={item.image}
                      alt=""
                      className="xl:w-14 xl:h-14 lg:w-12 w-12 h-12 mx-auto rounded-full"
                    />
                    <h3
                      className={`capitalize lg:text-[10px] xl:text-lg mt-1 
                  ${
                    isSelected
                      ? "text-white"
                      : mode === "B2B"
                      ? "text-[#66BDC5] group-hover:text-white"
                      : "text-[#006370] group-hover:text-white"
                  }`}
                    >
                      {item.name}
                    </h3>
                    <p
                      className={`lg:text-[8px] xl:text-[12px] mt-1.5 
                  ${
                    isSelected
                      ? "text-white"
                      : mode === "B2B"
                      ? "text-gray-500 group-hover:text-white"
                      : "text-gray-700 group-hover:text-white"
                  }`}
                    >
                      {item.description}
                    </p>
                    <p
                      className={`mt-1.5 lg:text-[10px] xl:text-lg 
                  ${
                    isSelected
                      ? "text-white"
                      : mode === "B2B"
                      ? "text-[#66BDC5] group-hover:text-white"
                      : "text-[#006370] group-hover:text-white"
                  }`}
                    >
                      ₹ {mode === "B2B" ? item.price * 2 : item?.price}/Kg
                    </p>
                    {isSelected ? (
                      <div className="text-sm">
                        Added Weight:{" "}
                        {index === 1
                          ? serviceAddData?.serviceWeight || 0
                          : index === 0
                          ? serviceWfAddData?.serviceWeight || 0
                          : index === 2
                          ? servicePlAddData?.serviceWeight || 0
                          : 0}
                      </div>
                    ) : (
                      <div className="flex items-center w-full justify-center mt-3 gap-3">
                        <label
                          htmlFor={`totalWeight-${index}`}
                          className={`text-[10px] ${
                            isSelected
                              ? "text-white"
                              : mode === "B2B"
                              ? "text-gray-400 group-hover:text-white"
                              : "text-gray-500 group-hover:text-white"
                          }`}
                        >
                          Total Weight
                        </label>
                        <input
                          id={`totalWeight-${index}`}
                          type="number"
                          value={
                            index === 1
                              ? serviceAddData?.serviceWeight || 0
                              : index === 0
                              ? serviceWfAddData?.serviceWeight || 0
                              : index === 2
                              ? servicePlAddData?.serviceWeight || 0
                              : 0
                          }
                          onChange={(e) =>
                            handleWeightChange(index, e.target.value)
                          }
                          className={`border border-gray-300 py-0.5 text-[12px] outline-none pl-3 lg:w-20 xl:w-14 rounded-md pr-2
                    ${
                      isSelected
                        ? "bg-[#004d57] text-white"
                        : mode === "B2B"
                        ? "group-hover:bg-[#66BDC5] group-hover:text-white"
                        : "group-hover:bg-[#004D57] group-hover:text-white"
                    }`}
                        />
                      </div>
                    )}
                    {isSelected
                      ? null
                      : clickedItems[index] &&
                        weights[index] === 0 && (
                          <p className="text-red-500 font-medium group-hover:text-white text-xs py-2 mt-1">
                            Increase Weight To Add
                          </p>
                        )}
                    <button
                      onClick={() => handleAddProductClick(index, item.name)}
                      className={`text-xs w-full gap-2 mt-2 py-2 rounded-lg ${
                        isSelected
                          ? "bg-white text-[#004d57]"
                          : mode === "B2B"
                          ? "bg-[#66BDC5] text-white group-hover:text-[#66BDC5] group-hover:bg-white"
                          : "bg-[#00414E] text-gray-200 group-hover:bg-white group-hover:text-[#004d57]"
                      }`}
                    >
                      {isSelected ? "View Details" : "Add Product"}
                    </button>
                  </div>
                );
              })}
            </div>
            <div className="w-full invisible">
              <AlphabetsComponent />
            </div>
          </>
        ) : (
          <div>
            {selectAddonPopup ? (
              <div
                className={`border border-gray-300 w-full rounded-lg py-1 relative ${
                  mode === "B2B" ? "text-[#66BDC5]" : "text-[#004d57]"
                }`}
              >
                <div className="flex justify-between">
                  <div className="flex justify-start gap-4 font-semibold items-center text-md px-4 py-1">
                    <button
                      className="bg-gray-100 text-red-500 px-2  py-1 rounded-lg"
                      onClick={() => setSelectedItem(null)}
                    >
                      <RxCross2 size={15} />
                    </button>
                    <div>
                      <p>{selectedItem}</p>
                    </div>
                  </div>
                </div>
                <div className="p-2 border-b border-gray-300">
                  <div className="">
                    <div className="grid grid-cols-2 gap-3">
                      {addons?.map((addon) => (
                        <div
                          key={addon.id}
                          className={`flex items-center gap-4 border rounded-lg px-3 py-1.5 cursor-pointer transition-colors ${
                            (selectedItem === "Wash & Iron" &&
                              serviceAddData?.addons?.some(
                                (a) => a.id === addon.id
                              )) ||
                            (selectedItem === "Wash & Fold" &&
                              serviceWfAddData?.addons?.some(
                                (a) => a.id === addon.id
                              )) ||
                            (selectedItem === "Premium Laundry" &&
                              servicePlAddData?.addons?.some(
                                (a) => a.id === addon.id
                              ))
                              ? mode === "B2B"
                                ? "border-[#66BDC5] bg-[#66BDC5]/10"
                                : "border-[#004d57] bg-[#004d57]/10"
                              : "border-gray-300 hover:border-gray-400"
                          }`}
                          onClick={() => handleAddonSelect(addon)}
                        >
                          <input
                            type="checkbox"
                            checked={
                              (selectedItem === "Wash & Iron" &&
                                serviceAddData?.addons?.some(
                                  (a) => a.id === addon.id
                                )) ||
                              (selectedItem === "Wash & Fold" &&
                                serviceWfAddData?.addons?.some(
                                  (a) => a.id === addon.id
                                )) ||
                              (selectedItem === "Premium Laundry" &&
                                servicePlAddData?.addons?.some(
                                  (a) => a.id === addon.id
                                ))
                            }
                            onChange={(e) => e.stopPropagation()}
                            className="w-4 h-4"
                          />
                          <div className="flex-1">
                            <p className="text-xs font-medium">
                              {addon.name} | ₹{addon.price}/KG
                            </p>
                            <p className="text-gray-500 text-[10px]">
                              {addon.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <button
                      onClick={() => setSelectedAddonPopup(false)}
                      className={
                        mode === "B2B"
                          ? "bg-[#66BDC5] w-full py-2 mt-2 text-sm text-white rounded-md group-hover:text-[#66BDC5] group-hover:bg-white"
                          : "bg-[#00414E] w-full py-2 mt-2 rounded-md text-sm text-gray-200 group-hover:bg-white group-hover:text-[#004d57]"
                      }
                    >
                      Add Garments
                    </button>
                  </div>
                </div>

                <div className=" text-start p-2">
                  <p className="text-sm text-gray-500">Garment Details: </p>
                  <div className="w-full h-[280px] text-xs overflow-y-scroll pb-28">
                    {Array.isArray(serviceAddData?.garments) ||
                    Array.isArray(serviceWfAddData?.garments) ||
                    Array.isArray(servicePlAddData?.garments) ? (
                      <div>
                        {(selectedItem === "Wash & Iron" &&
                        Array.isArray(serviceAddData?.garments)
                          ? serviceAddData.garments
                          : selectedItem === "Wash & Fold" &&
                            Array.isArray(serviceWfAddData?.garments)
                          ? serviceWfAddData.garments
                          : selectedItem === "Premium Laundry" &&
                            Array.isArray(servicePlAddData?.garments)
                          ? servicePlAddData.garments
                          : []
                        ).map((item) => {
                          return (
                            <div
                              key={item?.productDetails?._id || Math.random()}
                              className="border border-gray-300 p-2 rounded-lg capitalize mt-0.5 mb-1"
                            >
                              <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1">
                                  <button
                                    onClick={() => {
                                      setCartPId(item?.cartId);
                                      setProductDetails(item?.productDetails);
                                      setIsEditOpen(true);
                                    }}
                                    className="text-green-500"
                                  >
                                    <MdModeEditOutline />
                                  </button>
                                  <button
                                    onClick={() =>
                                      deleteCartProduct(item?.cartId)
                                    }
                                    className="text-red-500 text-lg font-bold"
                                  >
                                    <RxCross2 />
                                  </button>
                                </div>
                                {item?.productDetails?.name && (
                                  <div className="font-semibold">
                                    {item.productDetails.name}
                                    {item?.garmentType
                                      ? ` [${item?.garmentType?.label}]`
                                      : ""}{" "}
                                    X {item?.quantity || 1}
                                  </div>
                                )}
                              </div>
                              <div className="text-[10px] flex flex-col">
                                {Array.isArray(item?.requirements) &&
                                  item.requirements.length > 0 && (
                                    <p>
                                      <span className="font-semibold">
                                        Requirements:{" "}
                                      </span>{" "}
                                      {item.requirements.map((req, index) => (
                                        <span key={index}>
                                          {req.name} (₹ {req.price})
                                          {index <
                                            item.requirements.length - 1 &&
                                            ", "}
                                        </span>
                                      ))}
                                    </p>
                                  )}
                                {Array.isArray(item?.additionalServices) &&
                                  item.additionalServices.length > 0 && (
                                    <p>
                                      <span className="font-semibold">
                                        Additional Services:
                                      </span>{" "}
                                      {item.additionalServices.map(
                                        (service, index) => (
                                          <span key={index}>
                                            {service.name} (₹ {service.price})
                                            {index <
                                              item.additionalServices.length -
                                                1 && ", "}
                                          </span>
                                        )
                                      )}
                                    </p>
                                  )}
                              </div>
                              {Array.isArray(item?.comments) &&
                                item.comments.length > 0 && (
                                  <div className="text-[10px]">
                                    <span className=" font-semibold">
                                      Comments:
                                    </span>{" "}
                                    <span>{item.comments.join(", ")}</span>
                                  </div>
                                )}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-center w-full">No Garments Added</p>
                    )}
                  </div>
                </div>
                <div className="absolute bg-white w-full bottom-0 p-3 border-t border-gray-300">
                  <div className="flex justify-center gap-10 mx-2  items-center w-full">
                    <div className="flex items-center font-medium gap-3">
                      <p className="text-sm">Count</p>
                      <div className="border border-gray-300 w-44 py-2 justify-center rounded-lg my-1 px-2 text-sm flex items-center">
                        <button
                          className={`rounded-sm px-2 py-0.5 ${
                            mode === "B2B"
                              ? "bg-gray-600 text-white"
                              : "bg-gray-600 text-white"
                          }`}
                          disabled
                        >
                          +
                        </button>
                        <div className="flex items-center gap-1 w-full px-2">
                          <input
                            type="number"
                            value={
                              selectedItem === "Wash & Iron"
                                ? serviceAddData?.garments?.length || 0
                                : selectedItem === "Wash & Fold"
                                ? serviceWfAddData?.garments?.length || 0
                                : selectedItem === "Premium Laundry"
                                ? servicePlAddData?.garments?.length || 0
                                : 0
                            }
                            className="w-16 font-semibold outline-none text-sm py-1 px-2"
                            readOnly
                            disabled
                          />
                          <span className="font-semibold text-sm uppercase">
                            pc
                          </span>
                        </div>
                        <button
                          className={`rounded-sm px-2 py-0.5 ${
                            mode === "B2B"
                              ? "bg-gray-600 text-white"
                              : "bg-gray-600 text-white"
                          }`}
                          disabled
                        >
                          -
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <p className="text-sm">Weight</p>
                      <div className="border border-gray-300 w-44 py-2 justify-center rounded-lg my-1 px-2  text-sm flex items-center">
                        <button
                          onClick={() =>
                            handleWeightAdjustment(
                              selectedItem === "Wash & Iron"
                                ? serviceAddData.serviceWeight + 1
                                : selectedItem === "Wash & Fold"
                                ? serviceWfAddData.serviceWeight + 1
                                : selectedItem === "Premium Laundry"
                                ? servicePlAddData.serviceWeight + 1
                                : 0
                            )
                          }
                          className={`rounded-sm px-2 py-0.5 ${
                            mode === "B2B"
                              ? "bg-[#66BDC5] text-white"
                              : "bg-[#004d57] text-white"
                          }`}
                        >
                          +
                        </button>
                        <div className="flex items-center gap-1 w-full px-2">
                          <input
                            type="number"
                            value={
                              selectedItem === "Wash & Iron"
                                ? serviceAddData?.serviceWeight || 0
                                : selectedItem === "Wash & Fold"
                                ? serviceWfAddData?.serviceWeight || 0
                                : selectedItem === "Premium Laundry"
                                ? servicePlAddData?.serviceWeight || 0
                                : 0
                            }
                            onChange={(e) =>
                              handleWeightAdjustment(Number(e.target.value))
                            }
                            className="w-16 font-semibold outline-none text-sm py-1 px-2"
                          />
                          <span className="font-semibold text-sm uppercase">
                            Kg
                          </span>
                        </div>
                        <button
                         onClick={() =>
                          handleWeightAdjustment(
                            selectedItem === "Wash & Iron"
                              ? serviceAddData.serviceWeight - 1
                              : selectedItem === "Wash & Fold"
                              ? serviceWfAddData.serviceWeight - 1
                              : selectedItem === "Premium Laundry"
                              ? servicePlAddData.serviceWeight - 1
                              : 0
                          )
                        }
                          className={`rounded-sm px-2 py-0.5 ${
                            mode === "B2B"
                              ? "bg-[#66BDC5] text-white"
                              : "bg-[#004d57] text-white"
                          }`}
                        >
                          -
                        </button>
                      </div>
                    </div>

                    <div></div>
                  </div>
                  <div>
                    <button
                      onClick={() => addToCart()}
                      className={`text-sm w-full gap-2 my-2 py-3 rounded-lg ${
                        mode === "B2B"
                          ? "bg-[#66BDC5] text-white group-hover:text-[#66BDC5] group-hover:bg-white"
                          : "bg-[#00414E] text-gray-200 group-hover:bg-white group-hover:text-[#004d57]"
                      }`}
                    >
                      {isInCart ? "Update" : "Confirm"}
                    </button>
                  </div>
                </div>
                <div className="w-full invisible">
                  <AlphabetsComponent />
                </div>
              </div>
            ) : (
              <>
                <div
                  className={`border border-gray-300 py-2 rounded-lg font-semibold capitalize flex items-center gap-3 px-3 ${
                    mode === "B2B" ? "text-[#66BDC5]" : "text-[#004d57]"
                  }`}
                >
                  <button onClick={() => setSelectedAddonPopup(true)}>
                    <IoChevronBackCircle size={25} />
                  </button>
                  <h2
                    className={`text-sm text-center w-full ${
                      mode === "B2B" ? "text-[#66BDC5]" : "text-[#004d57]"
                    }`}
                  >
                    {selectedItem}
                  </h2>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <div className="border rounded-lg border-gray-300 w-72 ml-1 flex items-center justify-between">
                    <input
                      type="text"
                      className="py-1.5 text-xs pl-2 rounded-xl focus:outline-none w-full"
                      placeholder="Search Product"
                      value={searchQuery}
                      onChange={handleSearch}
                    />
                    <button
                      type="submit"
                      className="p-1 focus:outline-none items-end-end focus:shadow-outline"
                    >
                      <svg
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        className="w-4 h-4"
                      >
                        <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                      </svg>
                    </button>
                  </div>
                  <div className="flex gap-1 items-center">
                    <div className="text-xs rounded-lg px-8 py-2  text-gray-500">
                      Total Count:{" "}
                      {!laundryCart || laundryCart?.length === 0
                        ? "0"
                        : laundryCart?.length}
                    </div>
                    {/* <button
                      onClick={handlePreviewClick}
                      className={`text-xs rounded-md px-4 py-1.5 ${
                        mode === "B2B"
                          ? "bg-[#66BDC5] text-white"
                          : "bg-[#004d57] text-white"
                      }`}
                    >
                      Preview
                    </button> */}
                  </div>
                </div>

                <div className="mt-3">
                  <AlphabetsComponent onAlphabetClick={handleAlphabetClick} />
                </div>
                <div className="grid relative lg:grid-cols-4 xl:grid-cols-5 gap-4 my-2 h-[400px] justify-center items-start overflow-scroll custom-scrollbar">
                  {filteredProducts?.map((item, index) => {
                    const cartItem = laundryCart?.find((cartItem) =>
                      cartItem?.products?.some(
                        (lItem) =>
                          lItem?.productDetails?._id === item?._id &&
                          cartItem?.serviceName === selectedItem
                      )
                    );
                    console.log(cartItem, "cit");
                    const isInCart = !!cartItem;
                    const productInCart = cartItem?.products?.find(
                      (lItem) => lItem?.productDetails?._id === item?._id
                    );
                    const productQuantity = productInCart?.quantity || 0;
                    return (
                      <div
                        key={index}
                        className={`border cursor-pointer border-gray-300 rounded-lg p-1 flex flex-col justify-center items-center relative ${
                          isInCart ? "bg-[#006370] text-white" : ""
                        }`}
                      >
                        <img
                          src={item.image}
                          alt=""
                          className="w-12 h-12 mx-auto"
                        />
                        <p className="text-xs pt-2 capitalize">{item.name}</p>
                        <p className="text-xs py-1">
                          ₹{" "}
                          {mode === "B2B" ? item?.price?.B2B : item?.price?.B2C}
                          /-
                        </p>

                        <div className="border border-gray-300 rounded-lg my-1 p-1 text-sm flex items-center">
                          <button
                            className={`rounded-sm px-1 ${
                              mode === "B2B"
                                ? "bg-[#66BDC5] text-white"
                                : "bg-[#004d57] text-white"
                            }`}
                            onClick={() => handleIncrement(item)}
                          >
                            +
                          </button>
                          <span className="px-3">
                            {isInCart ? productQuantity : "0"}
                          </span>
                          <button
                            className={`rounded-sm px-1 ${
                              mode === "B2B"
                                ? "bg-[#66BDC5] text-white"
                                : "bg-[#004d57] text-white"
                            }`}
                          >
                            -
                          </button>
                        </div>

                        {isInCart && (
                          <div className="absolute w-full top-1">
                            <div className="relative w-full">
                              <button
                                onClick={() => {
                                  setIsEditOpen(true);
                                  setCartPId(cartItem?._id);
                                  setProductDetails(cartItem?.products[0]?.productDetails);
                                }}
                                className="absolute left-1 text-green-500 rounded-sm text-xs"
                              >
                                <MdEdit size={20} />
                              </button>
                              <button
                                className="absolute right-1 text-red-500 rounded-sm text-xs"
                                onClick={() => deleteCartProduct(cartItem?._id)}
                              >
                                <MdDelete size={20} />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}

                  <div className="absolute w-full bottom-0">
                    <button
                      onClick={() => setSelectedAddonPopup(true)}
                      className={
                        mode === "B2B"
                          ? "bg-[#66BDC5] text-sm text-white w-full py-1.5 rounded-md group-hover:text-[#66BDC5] group-hover:bg-white"
                          : "bg-[#00414E] text-sm text-gray-200 py-1.5 w-full rounded-md group-hover:bg-white group-hover:text-[#004d57]"
                      }
                    >
                      Confirm
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
      <LaundryAddDataPopup
        serviceAddData={serviceAddData}
        servicePlAddData={servicePlAddData}
        serviceWfAddData={serviceWfAddData}
        setServiceAddData={setServiceAddData}
        setServiceWfAddData={setServiceWfAddData}
        setServicePlAddData={setServicePlAddData}
        selectedItem={selectedItem}
        isOpen={isPopupOpen}
        setIsOpen={setIsPopupOpen}
        productDetails={productDetails}
        isEditOrder={isEditOrder}
        orderDetails={orderDetails}
        setUpdatedLaundryProductDetails={setUpdatedLaundryProductDetails}
      />
      {/* <AddedProductPreviewPopup
        isOpen={isAddedPopupOpen}
        setIsOpen={setIsAddedPopupOpen}
        cartItems={cartItems}
        mode={mode}
        productDetails={productDetails}
      /> */}
      <LaundryEditDataPopup
        productDetails={productDetails}
        isOpen={isEditOpen}
        setIsOpen={setIsEditOpen}
        cartId={cartPId}
      />
    </>
  );
};

export default Laundry;
