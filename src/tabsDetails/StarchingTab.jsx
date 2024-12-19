import { useState } from "react";
import AlphabetsComponent from "../components/alphabetsComponent";
import shirt from "../assets/shirt.png";
import Popup from "../components/Popup";
import SidebarPopup from "../components/SidebarPopup";
import AddedProductPreviewPopup from "../components/AddedProductPreviewPopup";
import { useCart } from "../context/CartContenxt";
import { MdDelete, MdEdit } from "react-icons/md";
import axios from "axios";
import toast from "react-hot-toast";

const StarchingTab = ({ mode, filteredStarchingProducts }) => {
  const { cartItems, refreshCart } = useCart();

  const [isAddedPopupOpen, setIsAddedPopupOpen] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState(
    filteredStarchingProducts
  );
  const [isPreviewPopupOpen, setIsPreviewPopupOpen] = useState(false);
  const [productDetails, setProductDetails] = useState(null);
  const isProductInCart = (productId) => {
    return cartItems?.some((cartItem) => 
      cartItem.productId?.some((product) => product._id === productId)
    );
  };

  const deleteCartProduct = async (id) => {
    const token = localStorage.getItem("authToken");
    try {
      const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}api/v1/carts/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Delete response: ", response);
      toast.success("Deleted Successfully")
      await refreshCart();
    } catch (error) {
      toast.error("Error Deleting")
      console.log("Error deleting product: ", error, error.message);
    }
  };

  const handleIncrement = (
    index,
    productId,
    serviceName,
    productName,
    quantity
  ) => {
    setProductDetails({
      productId,
      selectedItem: serviceName,
      serviceName,
      productName,
      quantity,
    });
    if(!cartItems || cartItems.length === 0){
      setIsPopupOpen(true);
    }else{
      setIsAddedPopupOpen(true)
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
    const filtered = filteredStarchingProducts?.filter((product) =>
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
            className="py-1.5 text-xs pl-3 rounded-xl focus:outline-none w-full"
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
            Total Count: {!cartItems || cartItems.length === 0 
  ? "0" 
  : cartItems.length}

          </div>
          <button
            onClick={handlePreviewClick}
            className={`text-xs rounded-md px-4 py-1.5 ${
              mode === "B2B" ? "bg-[#66BDC5] text-white" : "bg-[#004d57] text-white"
            }`}
          >
            Preview
          </button>
        </div>
      </div>

      <div className="mt-3">
        <AlphabetsComponent onAlphabetClick={handleAlphabetClick} />
      </div>
      <div className="grid lg:grid-cols-4 xl:grid-cols-6 gap-4 my-4">
        {filteredProducts.map((item, index) =>{ 
const correspondingCartItem = cartItems?.find(
  (cartItem) =>
    cartItem.productId[0]?.id === item.id 
);
          return(
          <div
            key={index}
            className={`border cursor-pointer border-gray-300 rounded-lg p-1 flex flex-col justify-center items-center relative ${
              isProductInCart(item.id) ? 'bg-[#004d57] text-white' : ''
            }`}
          >
            <img src={shirt} alt="" className="w-12 h-12 mx-auto " />
            <p className="text-sm pt-2 capitalize">{item.name}</p>
            <p className="text-xs py-1 ">₹ { mode === "B2B" ? item.price * 2 : item.price}/-</p>
            <div className="border border-gray-300 rounded-lg my-1 p-1 text-sm flex items-center">
              <button
                className={`rounded-sm px-1 ${mode === "B2B" ? "bg-[#66BDC5] text-white" : "bg-[#004d57] text-white"}`}
                onClick={() =>
                  handleIncrement(
                    index,
                    item.id,
                    item.serviceName,
                    item.name,
                    item.quantity
                  )
                }
              >
                +
              </button>
              <span className=" px-3">
                {item.quantity === 0 ? 1 : item.quantity}
              </span>
              <button
                className={`rounded-sm px-1 ${mode === "B2B" ? "bg-[#66BDC5] text-white" : "bg-[#004d57] text-white"}`}
              >
                -
              </button>
            </div>
            {isProductInCart(item?.id) && (
                                        <div className="absolute w-full top-1">
                                          <div className="relative w-full">
                                            <button
                                              className="absolute left-1 bg-green-500 text-white rounded-sm px-1 text-xs"
                                              onClick={() => setIsPopupOpen(true)}
                                            >
                                              <MdEdit size={20} />
                                            </button>
                                            <button
                                              className="absolute right-1 bg-red-500 text-white rounded-sm px-1 text-xs"
                                              onClick={() => deleteCartProduct(correspondingCartItem?._id)} 
                                            >
                                              <MdDelete size={20} />
                                            </button>
                                          </div>
                                        </div>
                                      )}
          </div>
        )})}
      </div>

      <Popup isOpen={isPopupOpen} setIsOpen={setIsPopupOpen} productDetails={productDetails}/>
      <AddedProductPreviewPopup
        isOpen={isAddedPopupOpen}
        setIsOpen={setIsAddedPopupOpen}
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

export default StarchingTab;