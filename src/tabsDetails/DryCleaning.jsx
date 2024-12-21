import { useState } from "react";
import AlphabetsComponent from "../components/alphabetsComponent";
import shirt from "../assets/shirt.png";
import SidebarPopup from "../components/SidebarPopup";
import AddedProductPreviewPopup from "../components/AddedProductPreviewPopup";
import axios from "axios";
import { useCart } from "../context/CartContenxt";
import { MdDelete, MdEdit } from "react-icons/md";
import Popup from "../components/Popup";
import toast from "react-hot-toast";
import OrderEditPopup from "../components/OrderEditPopup";

const DryCleaning = ({ mode, filteredDcProducts }) => {
  const { refreshCart, cartItems } = useCart();
  const [editOpen, setEditOpen] = useState(false);
  const [cartPId, setCartPId] = useState(null);


  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isAddedPopupOpen, setIsAddedPopupOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState(filteredDcProducts);
  const [isPreviewPopupOpen, setIsPreviewPopupOpen] = useState(false);
  const [productDetails, setProductDetails] = useState(null);

  const isProductInCart = (productId) => {
    return cartItems?.some((cartItem) =>
      cartItem?.productId?.some((product) => product._id === productId)
    );
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
            className="py-1.5 text-xs pl-3 rounded-xl focus:outline-none w-full"
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
            Total Count:{" "}
            {!cartItems || cartItems.length === 0 ? "0" : cartItems.length}
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
        {filteredProducts.map((item, index) => {
          const correspondingCartItem = cartItems?.find(
            (cartItem) =>
              cartItem.productId[0]?.id === item.id 
          );
          return (
            <div
              key={index}
              className={`border cursor-pointer border-gray-300 rounded-lg p-1 flex flex-col justify-center items-center relative ${
                isProductInCart(item.id) ? "bg-[#006370] text-white" : ""
              }`}
            >
              <img src={item.image} alt="" className="w-12 h-12 mx-auto " />
              <p className="text-sm pt-2 capitalize">{item.name}</p>
              <p className="text-xs py-1">₹ {mode === "B2B" ? item.price * 2 : item.price}/-</p>
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
                      onClick={() => {
                        setCartPId(item?._id);
                        setEditOpen(true);
                        setProductDetails({
                          productId: item?.productId[0]?._id,
                          selectedItem: item?.productid[0]?.serviceName,
                          serviceName: item?.productId[0]?.serviceName,
                          productName: item?.productId[0]?.name,
                          quantity: item?.productId[0]?.quantity,
                        });
                      }}
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
          );
        })}
      </div>
      <Popup isOpen={isPopupOpen} setIsOpen={setIsPopupOpen} productDetails={productDetails}/>
      <AddedProductPreviewPopup
        isOpen={isAddedPopupOpen}
        setIsOpen={setIsAddedPopupOpen}
        cartItems={cartItems}
        productDetails={productDetails}
      />
      <OrderEditPopup
      productDetails={productDetails}
      isOpen={editOpen}
      setIsOpen={setEditOpen}
      cartId={cartPId}
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
