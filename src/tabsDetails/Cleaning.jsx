import AlphabetsComponent from "../components/alphabetsComponent";
import sofa from "../assets/sofa.png";
import kitchen from "../assets/kitchen.png";
import toilet from "../assets/toilet.png";
import { useEffect, useState } from "react";
import SidebarPopup from "../components/SidebarPopup";
import AddedProductPreviewPopup from "../components/AddedProductPreviewPopup";
import { useCart } from "../context/CartContenxt";
import axios from "axios";
import useFetch from "../hooks/useFetch";
import { IoChevronBackCircle } from "react-icons/io5";
import { MdDelete, MdVerified } from "react-icons/md";
import toast from "react-hot-toast";

const Cleaning = ({ mode, orderDetails, isEditOrder, setUpdatedOrderProductDetails }) => {
  const { refreshCart, cartProdcuts } = useCart();

  const categories = [
    {
      image: sofa,
      name: "sofa",
      price: 120,
    },
    {
      image: kitchen,
      name: "kitchen",
      price: 120,
    },
    {
      image: toilet,
      name: "toilet",
      price: 120,
    },
    {
      image: sofa,
      name: "car",
      price: 120,
    },
  ];

  const [selectedItem, setSelectedItem] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAlphabet, setSelectedAlphabet] = useState("");
  const [isPreviewPopupOpen, setIsPreviewPopupOpen] = useState(false);
  const [sofaProducts, setSofaProducts] = useState([]);
  const [carProducts, setCarProducts] = useState([]);
  const [toiletProducts, setToiletProducts] = useState([]);
  const [kitchenProducts, setKitchenProducts] = useState([]);
  const [isPremium, setIsPremium] = useState("Regular");

  const togglePress = () => {
    setIsPremium((prevState) => (prevState === "Regular" ? "Premium" : "Regular"));
  };

  const { data } = useFetch(
    `${import.meta.env.VITE_BACKEND_URL}api/v1/products`
  );

  const categoryProductsMap = {
    sofa: { products: sofaProducts, setter: setSofaProducts },
    kitchen: { products: kitchenProducts, setter: setKitchenProducts },
    toilet: { products: toiletProducts, setter: setToiletProducts },
    car: { products: carProducts, setter: setCarProducts },
  };

  useEffect(() => {
    if (data?.data) {
      const products = data.data;
      Object.keys(categoryProductsMap).forEach((category) => {
        const categoryProducts = products.filter(
          (product) => product?.serviceName === category
        );
        categoryProductsMap[category].setter(categoryProducts);
      });
    }
  }, [data]);

  const handleAlphabetClick = (alphabet) => {
    if (selectedAlphabet === alphabet) {
      setSelectedAlphabet("");
    } else {
      setSelectedAlphabet(alphabet);
      setSearchTerm("");
    }
  };

  const filteredProducts = categories?.filter((item) => {
    const matchesSearchTerm = item?.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesAlphabet = selectedAlphabet
      ? item.name.toLowerCase().startsWith(selectedAlphabet.toLowerCase())
      : true;

    return matchesSearchTerm && matchesAlphabet;
  });

  const handlePreviewClick = () => {
    setIsPreviewPopupOpen(true);
  };

  const addToCart = async (productId, serviceName, item, price, productName) => {
    if(isEditOrder){
      setUpdatedOrderProductDetails(prevState => {
        return [
          ...(prevState || []), 
          {
            productId: item,
            serviceName: selectedItem || "",
            quantity: 1,
            garmentType: mode == "B2B" ? [{ price: price?.B2B }] : [{ price: price?.B2C }],
            serviceAddons: [{ name: "cleaning" }],
            requirements: [{ "": "" }],
            comments: [""],
            isPremium: isPremium === "Regular" ? false : true,
          }
        ];
      });
      toast.success("Added New Garment")
      return
    } else {
    const token = localStorage.getItem("authToken");
    const userId = localStorage.getItem("userId");
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}api/v1/carts/add`,
        {
          customerId: userId,
          productId: [productId],
          serviceName: selectedItem,
          quantity: 1,
          garmentType:
            mode == "B2B" ? [{ price: price?.B2B }] : [{ price: price?.B2C }],
          serviceAddons: [{ name: "cleaning" }],
          requirements: [{ "": "" }],
          comments: [""],
          isPremium: isPremium === "Regular" ? false : true,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(`${productName} added`);
      await refreshCart();
    } catch (error) {
      if (userId == null) {
        toast.error("please enter mobile number");
      } else {
        toast.error("Internal server error");
      }
      console.error("Error updating cart:", error);
    }
  }
  };

  const deleteCartProduct = async (id) => {
    const token = localStorage.getItem("authToken");
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}api/v1/carts/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Delete response: ", response);
      toast.success("Deleted Successfully");
      await refreshCart();
    } catch (error) {
      toast.error("Error Deleting");
      console.log("Error deleting product: ", error, error.message);
    }
  };

  const getCategoryProducts = () => {
    let products = [];
    switch (selectedItem) {
      case "sofa":
        products = sofaProducts;
        break;
      case "kitchen":
        products = kitchenProducts;
        break;
      case "toilet":
        products = toiletProducts;
        break;
      case "car":
        products = carProducts;
        break;
      default:
        products = [];
    }

    return products.filter((product) => {
      const matchesSearchTerm = product.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesAlphabet = selectedAlphabet
        ? product.name.toLowerCase().startsWith(selectedAlphabet.toLowerCase())
        : true;

      return matchesSearchTerm && matchesAlphabet;
    });
  };

  const getPrice = (priceObj) => {
    if (!priceObj) return 0;
    return mode === "B2B" ? priceObj?.B2B : priceObj?.B2C;
  };

  return (
    <div>
      {selectedItem ? (
        <div>
          <div
            className={`border border-gray-300 py-2 rounded-lg font-semibold capitalize flex items-center gap-3 px-3 ${
              mode === "B2B" ? "text-[#66BDC5]" : "text-[#004d57]"
            }`}
          >
            <button onClick={() => setSelectedItem(null)}>
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
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setSelectedAlphabet("");
                }}
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
                Total Count: {" "}
                {cartProdcuts?.length > 0 ? cartProdcuts?.length : 0}
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
          <div className="grid lg:grid-cols-4 xl:grid-cols-4 mx-auto justify-center gap-4  my-4">
            {getCategoryProducts()?.map((item, index) => {
              const isInCart = cartProdcuts?.some(
                (cartItem) =>
                  cartItem?.productId?._id === item?._id
              );

              const correspondingCartItem = cartProdcuts?.find(
                (cartItem) =>
                  cartItem?.productId?._id === item?._id
              );

              return (
                <div
                  key={index}
                  className={`border cursor-pointer border-gray-300 rounded-lg p-2 flex flex-col justify-center items-center relative
      ${isInCart ? "bg-[#006370] text-white" : ""}`}
                >
                  <img src={sofa} alt="" className="w-14 h-14 mx-auto" />
                  <p className="text-sm pt-2 capitalize">{item?.name}</p>
                  <p className="text-sm py-1">₹ {getPrice(item?.price)}/-</p>

                  <div className="w-full mx-2">
                    <button
                      className={`px-4 w-full py-0.5 mt-1 rounded-lg
          ${
            isInCart
              ? "bg-white text-gray-600"
              : "bg-[#006370] text-white hover:bg-blue-100 hover:text-gray-600"
          }`}
                      onClick={() =>
                        addToCart(
                          item?._id,
                          item?.serviceName,
                          item,
                          item?.price,
                          item?.name
                        )
                      }
                    >
                      {isInCart ? "Added" : "Add"}
                    </button>
                  </div>

                  {isInCart && (
                    <div className="absolute w-full top-1">
                      <div className="relative w-full">
                        <button
                          className="absolute right-1 text-red-500 rounded-sm text-xs"
                          onClick={() =>
                            deleteCartProduct(correspondingCartItem?._id)
                          }
                        >
                          <MdDelete size={20} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center">
            <div className="border rounded-lg border-gray-300 w-72 ml-4 flex items-center justify-between">
              <input
                type="text"
                className="py-1.5 text-xs pl-3 rounded-xl focus:outline-none w-full"
                placeholder="Search Product"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setSelectedAlphabet("");
                }}
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
            <div className="text-xs rounded-lg px-4 py-2  text-gray-500">
                Total Count: {" "}
                {cartProdcuts?.length > 0 ? cartProdcuts?.length : 0}
              </div>
              <div
              className={`flex mt-1  items-center justify-between w-60 py-0.5 h-8 px-1 text-[10px] bg-gray-300 rounded-full cursor-pointer`}
              onClick={togglePress}
            >
              <div
                className={`flex-1 text-center py-1 rounded-full px-3 transition-all ${
                  isPremium === "Regular"
                    ? "bg-[#006370] text-white"
                    : "text-black"
                }`}
              >
                Regular
              </div>
              <div
                className={`flex-1 text-center py-1 rounded-full px-3 transition-all ${
                  isPremium === "Premium"
                    ? "bg-[#006370] text-white"
                    : "text-black"
                }`}
              >
                Premium
              </div>
            </div>
            </div>
          </div>
          <div className="mt-3">
            <AlphabetsComponent onAlphabetClick={handleAlphabetClick} />
          </div>
          <div className="grid lg:grid-cols-4 xl:grid-cols-4 gap-4 my-4">
            {filteredProducts?.map((item, index) => {
              const hasItemsInCart = cartProdcuts?.some(
                cartItem => cartItem?.serviceName === item.name
              );

              return (
                <div
                  key={index}
                  className={`border relative border-gray-300 rounded-xl p-5 flex flex-col justify-center items-center ${
                    hasItemsInCart
                      ? mode === "B2B"
                        ? "bg-[#66BDC5] text-white"
                        : "bg-[#004d57] text-white"
                      : ""
                  }`}
                >
                  {hasItemsInCart && (
                    <p className="absolute top-1 right-1 text-blue-500">
                      <MdVerified size={25} />
                    </p>
                  )}
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 mx-auto"
                  />
                  <p className="text-sm capitalize mt-2">{item.name}</p>
                  <p
                    className={`text-xs my-2 ${
                      hasItemsInCart ? "text-white" : "text-gray-400"
                    }`}
                  >
                    Starting from
                  </p>
                  <p
                    className={`text-xs ${
                      hasItemsInCart ? "text-white" : "text-[#006370]"
                    }`}
                  >
                    ₹ {item?.price}/-
                  </p>

                  <button
                    className={`text-xs px-3 py-1.5 rounded-md mt-2 ${
                      hasItemsInCart
                        ? "bg-white text-[#006370]"
                        : mode === "B2B"
                        ? "bg-[#66BDC5] text-white"
                        : "bg-[#004d57] text-white"
                    }`}
                    onClick={() => setSelectedItem(item.name)}
                  >
                    {hasItemsInCart ? "View Details" : "Add Product"}
                  </button>
                </div>
              );
            })}
          </div>
        </>
      )}
      {/* <AddedProductPreviewPopup
        isOpen={isPopupOpen}
        setIsOpen={setIsPopupOpen}
        cartItems={cartItems}
      /> */}
      {/* <SidebarPopup
        isOpen={isPreviewPopupOpen}
        setIsOpen={setIsPreviewPopupOpen}
        cartItems={cartItems}
      /> */}
    </div>
  );
};

export default Cleaning;
