import AlphabetsComponent from "../components/alphabetsComponent";
import sofa from "../assets/sofa.png";
import kitchen from '../assets/kitchen.png';
import toilet from '../assets/toilet.png';
import { useEffect, useState } from "react";
import SidebarPopup from "../components/SidebarPopup";
import AddedProductPreviewPopup from "../components/AddedProductPreviewPopup";
import { useCart } from "../context/CartContenxt";
import axios from "axios";
import useFetch from "../hooks/useFetch";

const Cleaning = () => {
  const { cartItems, refreshCart } = useCart();

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
  ]

  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAlphabet, setSelectedAlphabet] = useState("");
  const [isPreviewPopupOpen, setIsPreviewPopupOpen] = useState(false);
  const [sofaProducts, setSofaProducts] = useState([]);
  const [carProducts, setCarProducts] = useState([]);
  const [toiletProducts, setToiletProducts] = useState([]);
  const [kitchenProducts, setKitchenProducts] = useState([]);

  const { data } = useFetch("https://api.fabodry.in/api/v1/products");

  // Mapping of category names to their respective product states and setters
  const categoryProductsMap = {
    sofa: { products: sofaProducts, setter: setSofaProducts },
    kitchen: { products: kitchenProducts, setter: setKitchenProducts },
    toilet: { products: toiletProducts, setter: setToiletProducts },
    car: { products: carProducts, setter: setCarProducts }
  };

  useEffect(() => {
    if (data?.data) {
      const products = data.data;

      // Dynamically set products for each category
      Object.keys(categoryProductsMap).forEach(category => {
        const categoryProducts = products.filter(product => 
          product?.serviceName === category
        );
        categoryProductsMap[category].setter(categoryProducts);
      });
    }
  }, [data]);

  const handleAlphabetClick = (alphabet) => {
    setSelectedAlphabet(alphabet);
    setSearchTerm("");
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

  const addToCart = async (
    productId,
    serviceName,
    productName
  ) => {
    const token = localStorage.getItem("authToken");
    const userId = localStorage.getItem("userId");

    try {
      const response = await axios.post(
        "https://api.fabodry.in/api/v1/carts/add",
        {
          customerId: userId,
          productId: [productId],
          serviceId: serviceName,
          quantity: 1,
          garmentType: productName,
          additionalServices: ["Cleaning"],
          onHangerPrice: 0,
          requirements: "",
          comments: [""],
          press: "",
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

  console.log(sofaProducts);
  const getCategoryProducts = () => {
    switch(selectedItem) {
      case 'sofa':
        return sofaProducts;
      case 'kitchen':
        return kitchenProducts;
      case 'toilet':
        return toiletProducts;
      case 'car':
        return carProducts;
      default:
        return [];
    }
  };

  return (
    <div>
      {selectedItem ? (
        <div>
          <p>Select {selectedItem} type: </p>
          <div className="grid grid-cols-3 text-center mx-auto justify-center mt-2 gap-3">
            {getCategoryProducts()?.map((item, index) => {
              console.log(item);
              return (
              <div
                key={index}
                className="border cursor-pointer border-gray-300 rounded-xl p-5 flex flex-col justify-center items-center"
              >
                <img 
                  src={sofa} 
                  alt={item.name} 
                  className="w-16 h-16 mx-auto" 
                />
                <p className="text-sm mt-2">{item.name}</p>
                <p className="text-gray-400 text-xs my-2">Starting from</p>
                <p className="text-sm text-[#006370]">₹ {item.price}/-</p>
                <button 
                  onClick={() => addToCart(item?._id, item.serviceName, item.name)} 
                  className="mt-2 bg-[#006370] text-white px-4 w-full py-1.5 rounded-md"
                >
                  Add
                </button>
              </div>
            )})}
          </div>
          <button 
            onClick={() => {
              setSelectedItem(null);
              setSelectedCategory(null);
            }} 
            className="text-center mx-auto mt-4 bg-[#006370] text-white px-3 py-1 rounded-full"
          >
            back to items
          </button>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center">
            <div className="border rounded-lg border-gray-300 w-72 ml-4 flex items-center justify-between">
              <input
                type="text"
                className="py-1.5 text-xs pl-3 focus:outline-none w-full"
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
                Total Count: {cartItems?.length}
              </div>
              <button
                onClick={handlePreviewClick}
                className="bg-[#004D57] text-white text-xs rounded-md px-4 py-1.5"
              >
                Preview
              </button>
            </div>
          </div>
          <div className="mt-3">
            <AlphabetsComponent onAlphabetClick={handleAlphabetClick} />
          </div>
          <div className="grid lg:grid-cols-4 xl:grid-cols-4 gap-4 my-4">
            {filteredProducts?.map((item, index) => (
              <div
                key={index}
                className="border border-gray-300 rounded-xl p-5 flex flex-col justify-center items-center"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-12 h-12 mx-auto"
                />
                <p className="text-sm capitalize">{item.name}</p>
                <p className="text-gray-400 text-xs my-2">Starting from</p>
                <p className="text-xs text-[#006370]">₹ {item.price}/-</p>

                <button
                  className="text-xs bg-[#006370] w-full text-white px-3 py-1.5 rounded-md mt-2"
                  onClick={() => setSelectedItem(item.name)}
                >
                  Add Product
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      <AddedProductPreviewPopup
        isOpen={isPopupOpen}
        setIsOpen={setIsPopupOpen}
        cartItems={cartItems}
      />
      <SidebarPopup
        isOpen={isPreviewPopupOpen}
        setIsOpen={setIsPreviewPopupOpen}
        cartItems={cartItems}
      />
    </div>
  );
};

export default Cleaning;