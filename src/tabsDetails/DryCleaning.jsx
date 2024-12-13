import { useState } from "react";
import AlphabetsComponent from "../components/alphabetsComponent";
import shirt from "../assets/shirt.png";
import SidebarPopup from "../components/SidebarPopup";
import AddedProductPreviewPopup from "../components/AddedProductPreviewPopup";
import axios from "axios";
import { useCart } from "../context/CartContenxt";

const DryCleaning = ({filteredDcProducts}) => {
  const {cartItems} = useCart();
  
  const [quantities, setQuantities] = useState(
    filteredDcProducts.map(() => 1)
  );

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState(filteredDcProducts);
  const [isPreviewPopupOpen, setIsPreviewPopupOpen] = useState(false);
  const [productDetails, setProductDetails] = useState(null);

  // Function to check if a product is in the cart
  const isProductInCart = (productId) => {
    return cartItems?.some((cartItem) => 
      cartItem?.productId?.some((product) => product._id === productId)
    );
  };

  const handleIncrement = (index, productId, serviceName, productName, quantity) => {
    setProductDetails({
      productId,
      selectedItem: serviceName,
      serviceName,
      productName,
      quantity
    });
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
    setSearchTerm(query);
    filterProducts(query);
  };

  const handleAlphabetClick = (letter) => {
    setSearchTerm(letter.toLowerCase());
    filterProducts(letter.toLowerCase());
    setSearchTerm("");
  };

  const filterProducts = (query) => {
    const filtered = filteredDcProducts?.filter((product) =>
      product.name.toLowerCase().startsWith(query)
    );
    setFilteredProducts(filtered);
  };

  const handlePreviewClick = () => {
    setIsPreviewPopupOpen(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center">
        <div className="border rounded-lg border-gray-300 w-72 ml-4 flex items-center justify-between">
          <input
            type="text"
            className="py-1.5 text-xs pl-3 focus:outline-none w-full"
            placeholder="Search Product"
            value={searchTerm}
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
          <div className="text-xs rounded-lg px-8 text-gray-500">
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
      <div className="mt-3">
        <AlphabetsComponent onAlphabetClick={handleAlphabetClick} />
      </div>
      <div className="grid lg:grid-cols-4 xl:grid-cols-6 gap-4 my-4">
        {filteredProducts.map((item, index) => (
          <div
            key={index}
            className={`border cursor-pointer border-gray-300 rounded-lg p-1 flex flex-col justify-center items-center ${
              isProductInCart(item.id) ? 'bg-[#006370] text-white' : ''
            }`}
          >
            <img src={item.image} alt="" className="w-12 h-12 mx-auto " />
            <p className="text-sm pt-2 capitalize">{item.name}</p>
            <p className="text-xs py-1">₹ {item.price}/-</p>
            <div className="border border-gray-300 rounded-lg my-1 p-1 text-sm flex items-center">
              <button
                className="bg-[#006370] text-white rounded-sm px-1"
                onClick={() => handleIncrement(index, item.id, item.serviceName, item.name, item.quantity)}
              >
                +
              </button>
              <span className=" px-3">{item.quantity === 0 ? 1 : item.quantity}</span>
              <button
                className="bg-[#006370] text-white rounded-sm px-1"
                onClick={() => handleDecrement(index)}
              >
                -
              </button>
            </div>
          </div>
        ))}
      </div>
      <AddedProductPreviewPopup 
        isOpen={isPopupOpen} 
        setIsOpen={setIsPopupOpen} 
        cartItems={cartItems} 
        productDetails={productDetails}
      />
      <SidebarPopup 
        isOpen={isPreviewPopupOpen} 
        setIsOpen={setIsPreviewPopupOpen}  
        cartItems={cartItems}  
        productDetails={productDetails}
      />
    </div>
  );
};

export default DryCleaning;