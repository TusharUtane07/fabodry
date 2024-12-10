import { useState } from "react";
import AlphabetsComponent from "../components/alphabetsComponent";
import shirt from "../assets/shirt.png";
import SidebarPopup from "../components/SidebarPopup";
import AddedProductPreviewPopup from "../components/AddedProductPreviewPopup";
import { useCart } from "../context/CartContenxt";

const Ironing = ({filteredIroningProducts}) => {

  const {cartItems, refreshCart} = useCart();

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
  const [filteredProducts, setFilteredProducts] = useState(filteredIroningProducts);
  const [isPreviewPopupOpen, setIsPreviewPopupOpen] = useState(false);

  const handleToggle = () => {
    setIsPremium(!isPremium);
  };

  const [productDetails, setProductDetails] = useState(null);


  const handleIncrement = (index, productId, serviceName, productName) => {
    setProductDetails( {
      productId,
      serviceName,
      productName
    })
    setIsPopupOpen(true)
  }

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
    const filtered = filteredIroningProducts?.filter((product) =>
      product.name.toLowerCase().startsWith(query)
    );
    setFilteredProducts(filtered);
  };
  const handlePreviewClick = () => {
    setIsPreviewPopupOpen(true);
  }
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div
          className={`flex items-center justify-between lg:w-80 xl:w-96 text-xs bg-[#D5E7EC] rounded-xl cursor-pointer`}
          onClick={handleToggle}
        >
          <div
            className={`flex-1 text-center text-[8px] lg:py-1.5 xl:py-2.5 rounded-xl px-3 transition-all ${
              !isPremium ? "bg-[#006370] text-white" : "text-black"
            }`}
          >
            Steam Press
          </div>
          <div
            className={`flex-1 text-center lg:py-1.5 text-[8px] xl:py-2.5 rounded-xl px-3 transition-all ${
              isPremium ? "bg-[#006370] text-white" : "text-black"
            }`}
          >
            Premium Steam Press
          </div>
        </div>

        <div className="flex justify-between items-center gap-5">
      <div className="border rounded-lg border-gray-300 lg:w-60 xl:w-72 ml-4 flex items-center justify-between">
        <input
          type="text"
          className="py-1.5 text-xs pl-3 focus:outline-none"
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
            Total Count: {cartItems?.length}
            </div>
              <button 
                onClick={handlePreviewClick}
               className="bg-[#004D57] text-white text-xs rounded-md px-4 py-1.5 "
              >
                Preview
              </button>
            </div>
      </div>
      </div>

      <div className="mt-3">
        <AlphabetsComponent onAlphabetClick={handleAlphabetClick} />
      </div>

      <div className="grid lg:grid-cols-4 xl:grid-cols-6 gap-4 my-4">
        {filteredProducts.map((item, index) => (
          <div
            key={index}
            className="border cursor-pointer border-gray-300 rounded-lg p-1 flex flex-col justify-center items-center"
          >
            <img src={item.image} alt="" className="w-12 h-12 mx-auto " />
            <p className="text-sm pt-2 capitalize">{item.name}</p>
            <p className="text-xs py-1 text-[#006370]">{isPremium ? premiumPrice : normalPrice}</p>
            <div className="border border-gray-300 rounded-lg my-1 p-1 text-sm flex items-center">
              <button
                className="bg-[#006370] text-white rounded-sm px-1"
                onClick={() => handleIncrement(index, item.id, item.serviceName, item.name)}
              >
                +
              </button>
              <span className="text-gray-500 px-3">{quantities[index]}</span>
              <button
                className="bg-[#006370] text-white rounded-sm   px-1"
                onClick={() => handleDecrement(index)}
              >
                -
              </button>
            </div>
          </div>
        ))}
      </div>
      <AddedProductPreviewPopup isOpen={isPopupOpen} setIsOpen={setIsPopupOpen} cartItems={cartItems}  productDetails={productDetails}/>
      <SidebarPopup isOpen={isPreviewPopupOpen} setIsOpen={setIsPreviewPopupOpen} cartItems={cartItems}  productDetails={productDetails}/>

    </div>
  );
};

export default Ironing;