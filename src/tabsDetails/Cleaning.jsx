import AlphabetsComponent from "../components/alphabetsComponent";
import sofa from "../assets/sofa.png";
import { useState } from "react";
import SidebarPopup from "../components/SidebarPopup";
import AddedProductPreviewPopup from "../components/AddedProductPreviewPopup";
import { useCart } from "../context/CartContenxt";
import axios from "axios";

const Cleaning = ({ filteredCleaningProducts }) => {
  const { cartItems, refreshCart } = useCart();

  const sofaTypes = [
    { type: "2 Seater", price: "$ 200.00/Pc", img: sofa, category: "sofa" },
    {
      type: "Single Seater",
      price: "$ 100.00/Pc",
      img: sofa,
      category: "sofa",
    },
    { type: "3 Seater", price: "$ 300.00/Pc", img: sofa, category: "sofa" },
  ];

  const [selectedItem, setSelectedItem] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAlphabet, setSelectedAlphabet] = useState("");
  const [isPreviewPopupOpen, setIsPreviewPopupOpen] = useState(false);
  const dryCleaningProduct = [
    {
      type: "Shirt",
      price: "$ 10.00/Pc",
      // img: shirt,
    },
    {
      type: "Pant",
      price: "$ 12.00/Pc",
      // img: shirt,
    },
    {
      type: "T-Shirt",
      price: "$ 8.00/Pc",
      // img: shirt,
    },
    {
      type: "Jacket",
      price: "$ 15.00/Pc",
      // img: shirt,
    },
    {
      type: "Shirt",
      price: "$ 10.00/Pc",
      // img: shirt,
    },
    {
      type: "Shirt",
      price: "$ 10.00/Pc",
      // img: shirt,
    },
  ];

  const [quantities, setQuantities] = useState(
    dryCleaningProduct?.map(() => 1)
  );
  const [productDetails, setProductDetails] = useState(null);

  const handleAlphabetClick = (alphabet) => {
    setSelectedAlphabet(alphabet);
    setSearchTerm("");
  };

  const filteredProducts = filteredCleaningProducts?.filter((item) => {
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

  const handleIncrement = async (
    index,
    productId,
    serviceName,
    productName
  ) => {
    const token = localStorage.getItem("authToken");
    const userId = localStorage.getItem("userId");

    try {
      const response = await axios.post(
        "http://localhost:8888/api/v1/carts/add",
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

  const handleDecrement = (index) => {
    const updatedQuantities = [...quantities];
    if (updatedQuantities[index] > 1) {
      updatedQuantities[index] -= 1;
      setQuantities(updatedQuantities);
    }
  };

  return (
    <div>
      {selectedItem ? (
        <div>
          
          <p>Select {selectedItem} type: </p>
          <div className="grid grid-cols-3 text-center mx-auto justify-center mt-2 gap-3">
          {sofaTypes.map((item, index) => (
                  <div
                    key={index}
                    className="border cursor-pointer border-gray-300 rounded-xl p-5 flex flex-col justify-center items-center"
                  >
                    <img src={item.img} alt={item.type} className="w-16 h-16 mx-auto" />
                    <p className="text-sm mt-2">{item.type}</p>
                    <p className="text-gray-400 text-xs my-2">Starting from</p>
                    <p className="text-sm text-[#006370]">{item.price}</p>
                  </div>
                ))}
          </div>
          <button onClick={() => setSelectedItem(null)} className="text-center mx-auto mt-4 bg-[#006370] text-white px-3 py-1 rounded-full">
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
