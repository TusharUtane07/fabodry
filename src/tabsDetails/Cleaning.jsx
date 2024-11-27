import AlphabetsComponent from "./alphabetsComponent";
import sofa from "../assets/sofa.png";
import toilet from "../assets/toilet.png";
import kitchen from "../assets/kitchen.png";
import { useState } from "react";
import Popup from "../components/Popup";
import SidebarPopup from "../components/SidebarPopup";

const Cleaning = () => {
  const cleaningProduct = [
    { type: "Sofa", price: "$ 10.00/Pc", img: sofa, category: "sofa" },
    { type: "Toilet", price: "$ 10.00/Pc", img: toilet, category: "toilet" },
    { type: "Kitchen", price: "$ 10.00/Pc", img: kitchen, category: "kitchen" },
    { type: "Sofa", price: "$ 10.00/Pc", img: sofa, category: "sofa" },
    { type: "Kitchen", price: "$ 10.00/Pc", img: kitchen, category: "kitchen" },
  ];

  const sofaTypes = [
    { type: "2 Seater", price: "$ 200.00/Pc", img: sofa, category: "sofa" },
    { type: "Single Seater", price: "$ 100.00/Pc", img: sofa, category: "sofa" },
    { type: "3 Seater", price: "$ 300.00/Pc", img: sofa, category: "sofa" },
  ];

  const [selectedItem, setSelectedItem] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAlphabet, setSelectedAlphabet] = useState("");
  const [isPreviewPopupOpen, setIsPreviewPopupOpen] = useState(false);


  const handleProductClick = (item) => {
    if (item.category === "sofa") {
      setSelectedItem("sofa");
    } else {
      setSelectedItem(item);
    }
  };

  const handleBackToGrid = () => {
    setSelectedItem(null);
  };

  const handleAlphabetClick = (alphabet) => {
    setSelectedAlphabet(alphabet);
    setSearchTerm(""); 
  };

  const filteredProducts = cleaningProduct.filter((item) => {
    const matchesSearchTerm = item.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAlphabet = selectedAlphabet
      ? item.type.toLowerCase().startsWith(selectedAlphabet.toLowerCase())
      : true;

    return matchesSearchTerm && matchesAlphabet;
  });

  const handlePreviewClick = () => {
    setIsPreviewPopupOpen(true);
  };

  return (
    <div>
      {selectedItem ? (
        selectedItem === "sofa" ? (
          <div className="p-4">
            <div className="rounded-lg flex flex-col justify-start">
              <p className="text-lg capitalize text-start self-start">Select Sofa Type</p>
              <div className="grid grid-cols-3 gap-4 my-4">
                {sofaTypes.map((item, index) => (
                  <div
                    key={index}
                    onClick={() => handleProductClick(item)}
                    className="border cursor-pointer border-gray-300 rounded-xl p-5 flex flex-col justify-center items-center"
                  >
                    <img src={item.img} alt={item.type} className="w-16 h-16 mx-auto" />
                    <p className="text-2xl">{item.type}</p>
                    <p className="text-gray-400 text-xs my-2">Starting from</p>
                    <p className="text-xl text-[#006370]">{item.price}</p>
                  </div>
                ))}
              </div>
              <button
                onClick={handleBackToGrid}
                className="bg-[#006370] mx-auto text-white py-2 px-4 w-60 rounded mt-5"
              >
                Back to Items
              </button>
            </div>
          </div>
        ) : (
          <div className="p-4">
            <div className="rounded-lg p-5 flex flex-col items-center">
              <img
                src={selectedItem.img}
                alt={selectedItem.type}
                className="w-20 h-20 mx-auto mb-4"
              />
              <p className="text-2xl">{selectedItem.type}</p>
              <p className="text-xl text-[#006370] mt-2">{selectedItem.price}</p>
              <button
                onClick={handleBackToGrid}
                className="bg-[#006370] mx-auto text-white py-2 px-4 w-60 rounded mt-5"
              >
                Back to Items
              </button>
            </div>
          </div>
        )
      ) : (
        <>
          <div className="flex justify-between items-center">
      <div className="border rounded-lg border-gray-300 w-72 ml-4 flex items-center justify-between">
        <input
          type="text"
          className="py-2 pl-3 focus:outline-none"
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
      <div>
              <button 
                onClick={handlePreviewClick}
                className="bg-[#004D57] text-white rounded-lg px-8 py-2"
              >
                Preview
              </button>
            </div>
      </div>
          <div className="mt-3">
            <AlphabetsComponent onAlphabetClick={handleAlphabetClick} />
          </div>
          <div className="grid grid-cols-5 gap-4 my-4">
            {filteredProducts.map((item, index) => (
              <div
                key={index}
                className="border border-gray-300 rounded-xl p-5 flex flex-col justify-center items-center"
              >
                <img src={item.img} alt={item.type} className="w-16 h-16 mx-auto" />
                <p className="text-2xl">{item.type}</p>
                <p className="text-gray-400 text-xs my-2">Starting from</p>
                <p className="text-xl text-[#006370]">{item.price}</p>
                <button
                  onClick={() => handleProductClick(item)}
                  className="bg-[#004D57] text-white text-sm w-full gap-2 mt-3 py-3 rounded-lg"
                >
                  Add Product
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      <Popup isOpen={isPopupOpen} setIsOpen={setIsPopupOpen} />
      <SidebarPopup isOpen={isPreviewPopupOpen} setIsOpen={setIsPreviewPopupOpen} />

    </div>
  );
};

export default Cleaning;
