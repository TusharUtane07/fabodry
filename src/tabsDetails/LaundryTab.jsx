import { useState } from "react";
import productGif from "../assets/product.gif";
import AlphabetsComponent from "./alphabetsComponent";
import shirt from "../assets/shirt.png";
import Popup from "../components/Popup";
import SidebarPopup from "../components/SidebarPopup";

const Laundry = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isPreviewPopupOpen, setIsPreviewPopupOpen] = useState(false);

  const laundryProducts = [
    {
      name: "Wash & Fold",
      description: "lorem ipsumelorem ipsumelorem ipsumelorem",
      price: "$ 50.00/Kg",
      img: productGif,
    },
    {
      name: "Wash & Iron",
      description: "lorem ipsumelorem ipsumelorem ipsumelorem",
      price: "$ 50.00/Kg",
      img: productGif,
    },
    {
      name: "Premium Laundry",
      description: "lorem ipsumelorem ipsumelorem ipsumelorem",
      price: "$ 50.00/Kg",
      img: productGif,
    },
  ];

  const dryCleaningProduct = [
    { type: "Shirt", price: "$ 10.00/Pc", img: shirt },
    { type: "Pant", price: "$ 10.00/Pc", img: shirt },
    { type: "Shirt", price: "$ 10.00/Pc", img: shirt },
    { type: "Pant", price: "$ 10.00/Pc", img: shirt },
    { type: "Shirt", price: "$ 10.00/Pc", img: shirt },
  ];

  const [quantities, setQuantities] = useState(dryCleaningProduct.map(() => 1));
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState(dryCleaningProduct);

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
    setSearchQuery("");
  };

  const filterProducts = (query) => {
    const filtered = dryCleaningProduct.filter((product) =>
      product.type.toLowerCase().startsWith(query)
    );
    setFilteredProducts(filtered);
  };

  const handlePreviewClick = () => {
    setIsPreviewPopupOpen(true);
  };

  return (
    <>
      <div className=" text-center gap-5">
        {selectedItem === null ? (
          <div className="grid grid-cols-3 items-center justify-between gap-3">
          {laundryProducts.map((item, index) => (
            <div
              key={index}
              className="group flex flex-col h-full justify-between rounded-xl border p-5 border-[#eef0f2] hover:bg-[#004D57] hover:text-white transition-colors"
            >
              <img
                src={item.img}
                alt=""
                className="xl:w-20 xl:h-20 lg:w-16  mx-auto rounded-full"
              />
              <h3 className="text-[#006370] lg:text-sm xl:text-xl group-hover:text-white">
                {item.name}
              </h3>
              <p className="lg:text-[10px] xl:text-sm  mt-3 text-gray-400 group-hover:text-white">
                {item.description}
              </p>
              <p className="mt-3 text-[#006370] group-hover:text-white lg:text-sm xl:text-xl">
                {item.price}
              </p>
              <div className="flex items-center w-full justify-center  mt-3 gap-3">
                <label
                  htmlFor="totalWeight"
                  className="lg:text-sm text-[10px] text-gray-400 group-hover:text-white"
                >
                  Total Weight
                </label>
                <input
                  type="number"
                  placeholder="0.00"
                  className="border border-gray-300 py-1 outline-none pl-3 lg:w-20 xl:w-32 rounded-xl group-hover:bg-[#004d57] pr-2"
                />
              </div>
              <button
                onClick={() => setSelectedItem(item.name)}
                className="bg-[#004D57] text-white group-hover:bg-white group-hover:text-[#004d57] text-sm w-full gap-2 mt-3 py-3 rounded-lg"
              >
                Add Product
              </button>
            </div>
          ))}
          </div>
        ) : (
          <div className="text-center w-full">
            <h2 className="text-lg bg-[#004D57] text-white w-full py-2.5 rounded-lg ">
              {selectedItem}
            </h2>

            <div className="flex justify-between items-center">
            <div className="border rounded-lg border-gray-300 w-72 ml-4 mt-5 flex items-center justify-between">
              <input
                type="text"
                className="py-2 pl-3 focus:outline-none w-full"
                placeholder="Search Product"
                value={searchQuery}
                onChange={handleSearch}
              />
              <button
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
            <div className="text-sm rounded-lg px-8 py-2 mt-4 text-gray-500">
                Total Count: 14
            </div>
              <button 
                onClick={handlePreviewClick}
                className="bg-[#004D57] text-white rounded-lg px-8 py-2 mt-4"
              >
                Preview
              </button>
            </div>
            </div>

            <div className="mt-3">
              <AlphabetsComponent onAlphabetClick={handleAlphabetClick} />
            </div>
            <div className="grid grid-cols-5 gap-4 my-4">
              {/* Change the color of selected item when added */}
              {filteredProducts.map((item, index) => (
               <div
               key={index}
               className="group border cursor-pointer border-gray-300 rounded-xl p-5 flex flex-col justify-center items-center hover:bg-[#004D57] hover:text-white"
             >
               <img
                 src={shirt}
                 alt=""
                 className="w-16 h-16 mx-auto group-hover:opacity-75"
               />
               <p className="text-2xl group-hover:text-white">{item.type}</p>
               <p className="text-xl text-[#006370] group-hover:text-gray-400">
                 {item.price}
               </p>
               <div className="border border-gray-300 rounded-lg my-2 p-1 flex items-center group-hover:border-white">
                 <button
                   className="bg-[#006370] text-white rounded-full p-0.5 px-2.5 group-hover:bg-white group-hover:text-[#004D57]"
                   onClick={() => handleIncrement(index)}
                 >
                   +
                 </button>
                 <span className="text-gray-500 px-5 group-hover:text-white">
                   {quantities[index]}
                 </span>
                 <button
                   className="bg-[#006370] text-white rounded-full p-0.5 px-2.5 group-hover:bg-white group-hover:text-[#004D57]"
                   onClick={() => handleDecrement(index)}
                 >
                   -
                 </button>
               </div>
             </div>
             
              ))}
            </div>
          </div>
        )}
      </div>
      <Popup isOpen={isPopupOpen} setIsOpen={setIsPopupOpen} />
      <SidebarPopup isOpen={isPreviewPopupOpen} setIsOpen={setIsPreviewPopupOpen} />
    </>
  );
};

export default Laundry;