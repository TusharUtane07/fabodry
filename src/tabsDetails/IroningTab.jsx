import { useState } from "react";
import AlphabetsComponent from "./alphabetsComponent";
import shirt from "../assets/shirt.png";
import Popup from "../components/Popup";

const Ironing = () => {
  const normalPrice = "$ 10.00/Pc";
  const premiumPrice = "$ 20.00/Pc";

  const dryCleaningProduct = [
    {
      type: "Shirt",
      price: normalPrice,
      img: shirt,
    },
    {
      type: "Trousers",
      price: normalPrice,
      img: shirt,
    },
    {
      type: "Blazer",
      price: normalPrice,
      img: shirt,
    },
    {
      type: "Shirt",
      price: normalPrice,
      img: shirt,
    },
    {
      type: "Curtain",
      price: normalPrice,
      img: shirt,
    },
  ];

  const [quantities, setQuantities] = useState(dryCleaningProduct.map(() => 1));
  const [isPremium, setIsPremium] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); 
  const [filteredProducts, setFilteredProducts] = useState(dryCleaningProduct);

  const handleToggle = () => {
    setIsPremium(!isPremium);
  };

  const handleIncrement = () => {
    setIsPopupOpen(true);
  };

  const handleDecrement = (index) => {
    const updatedQuantities = [...quantities];
    if (updatedQuantities[index] > 1) {
      updatedQuantities[index] -= 1;
      setQuantities(updatedQuantities);
    }
  };

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    filterProducts(query);
  };

  const handleAlphabetClick = (letter) => {
    setSearchQuery(letter.toLowerCase());
    filterProducts(letter.toLowerCase());
  };

  const filterProducts = (query) => {
    const filtered = dryCleaningProduct.filter((product) =>
      product.type.toLowerCase().startsWith(query)
    );
    setFilteredProducts(filtered);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div
          className={`flex items-center justify-between w-96 text-sm bg-[#D5E7EC] rounded-xl cursor-pointer`}
          onClick={handleToggle}
        >
          <div
            className={`flex-1 text-center py-2.5 rounded-xl px-3 transition-all ${
              !isPremium ? "bg-[#006370] text-white" : "text-black"
            }`}
          >
            Steam Press
          </div>
          <div
            className={`flex-1 text-center py-2.5  rounded-xl px-3 transition-all ${
              isPremium ? "bg-[#006370] text-white" : "text-black"
            }`}
          >
            Premium Steam Press
          </div>
        </div>

        <div className="border rounded-lg border-gray-300 w-72 ml-4 flex items-center justify-between">
          <input
            type="text"
            className="py-2 pl-3 focus:outline-none"
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
      </div>

      <div className="mt-3">
        <AlphabetsComponent onAlphabetClick={handleAlphabetClick} />
      </div>

      <div className="grid grid-cols-5 gap-4 my-4">
        {filteredProducts.map((item, index) => (
          <div
            key={index}
            className="border cursor-pointer border-gray-300 rounded-xl p-5 flex flex-col justify-center items-center"
          >
            <img src={shirt} alt="" className="w-16 h-16 mx-auto " />
            <p className="text-2xl">{item.type}</p>
            <p className="text-xl text-[#006370]">
              {isPremium ? premiumPrice : normalPrice}
            </p>
            <div className="border border-gray-300 rounded-lg my-2 p-1 flex items-center">
              <button
                className="bg-[#006370] text-white rounded-full p-0.5 px-2.5"
                onClick={() => handleIncrement(index)}
              >
                +
              </button>
              <span className="text-gray-500 px-5">{quantities[index]}</span>
              <button
                className="bg-[#006370] text-white rounded-full p-0.5 px-2.5"
                onClick={() => handleDecrement(index)}
              >
                -
              </button>
            </div>
          </div>
        ))}
      </div>
      <Popup isOpen={isPopupOpen} setIsOpen={setIsPopupOpen} />
    </div>
  );
};

export default Ironing;