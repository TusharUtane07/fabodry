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
import OrderEditPopup from "../components/OrderEditPopup";
import { useUtility } from "../context/UtilityContext";
import OtherServicesMultipleEdit from "../components/OtherServicesMultipleEdit";

const StarchingTab = ({ mode, filteredStarchingProducts, orderDetails, isEditOrder, setUpdatedOrderProductDetails }) => {
  const { cartItems, refreshCart, cartProdcuts } = useCart();
  const {validateMobileNumber} = useUtility();

  const [editOpen, setEditOpen] = useState(false);
  const [editGarmentsOpen, setEditGarmentsOpen] = useState(false);
  const [cartPId, setCartPId] = useState(null);
  const [productsId, setProductsId] = useState(null);

  const [isAddedPopupOpen, setIsAddedPopupOpen] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState(
    filteredStarchingProducts
  );
  const [isPreviewPopupOpen, setIsPreviewPopupOpen] = useState(false);
  const [productDetails, setProductDetails] = useState(null);
  const isProductInCart = (productId) => {
    return cartProdcuts?.some(
      (cartItem) => cartItem.productId?._id === productId
    );
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

  const handleIncrement = (index, item) => {
    setProductDetails(item);
    if(!validateMobileNumber()) return;
    setIsPopupOpen(true);
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

  const getPrice = (priceObj) => {
    if (!priceObj) return 0;
    return mode === "B2B" ? priceObj?.B2B : priceObj?.B2C;
  };

  const getTotalCount = () => {
    let count = 0;
  
      cartProdcuts?.filter(product => product?.serviceName === "Starching")
      .forEach(product => {
        count += product.quantity;
      });
  
    return count;
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
            Total Count:{" "}
            {getTotalCount()}
          </div>
          {/* <button
            onClick={handlePreviewClick}
            className={`text-xs rounded-md px-4 py-1.5 ${
              mode === "B2B" ? "bg-[#66BDC5] text-white" : "bg-[#004d57] text-white"
            }`}
          >
            Preview
          </button> */}
        </div>
      </div>

      <div className="mt-3">
        <AlphabetsComponent onAlphabetClick={handleAlphabetClick} />
      </div>
      <div className="grid lg:grid-cols-4 xl:grid-cols-6 gap-4 my-4">
        {filteredProducts?.map((item, index) => {
          const correspondingCartItem = cartProdcuts?.filter(
            (cartItem) => cartItem.productId?._id === item?._id
          );

          let quantity = 0;
          const quantityToDisplay = correspondingCartItem?.map((item) => {
            quantity += item?.quantity;
          })
          return (
            <div
              key={index}
              className={`border cursor-pointer border-gray-300 rounded-lg p-1 flex flex-col justify-center items-center relative ${
                isProductInCart(item._id) ? "bg-[#006370] text-white" : ""
              }`}
            >
              <img src={item?.image} alt="" className="w-12 h-12 mx-auto " />
              <p className="text-sm pt-2 capitalize">{item.name}</p>
              <p className="text-xs py-1 ">₹ {getPrice(item?.price)}/-</p>
              <div className="border border-gray-300 rounded-lg my-1 p-1 text-sm flex items-center">
                <button
                  className={`rounded-sm px-1 ${
                    mode === "B2B"
                      ? "bg-[#66BDC5] text-white"
                      : "bg-[#004d57] text-white"
                  }`}
                  onClick={() => handleIncrement(index, item)}
                >
                  +
                </button>
                <span className=" px-3">{quantity}</span>
                <button
                  className={`rounded-sm px-1 ${
                    mode === "B2B"
                      ? "bg-[#66BDC5] text-white"
                      : "bg-[#004d57] text-white"
                  }`}
                >
                  -
                </button>
              </div>
              {isProductInCart(item?._id) && (
                <div className="absolute w-full top-1">
                  <div className="relative w-full">
                    <button
                      className="absolute left-1 text-green-500 rounded-sm text-xs"
                      onClick={() => {
                        const oneOrMore = cartProdcuts?.filter((litem) => litem?.serviceName === item.serviceName && litem?.productId?._id === item?._id);
                        setCartPId(correspondingCartItem[0]?._id);

                        if(oneOrMore && oneOrMore.length === 1){
                          setEditOpen(true)
                          setProductDetails(item);
                        }else {
                          setProductsId(item?._id)
                          setEditGarmentsOpen(true)
                        }
                      }}
                    >
                      <MdEdit size={20} />
                    </button>
                    <button
                      className="absolute right-1 text-red-500 rounded-sm text-xs"
                      onClick={() => {
                        const oneOrMore = cartProdcuts?.filter((litem) => litem?.serviceName === item.serviceName && litem?.productId?._id === item?._id);
                        setCartPId(correspondingCartItem[0]?._id);
                        if(oneOrMore && oneOrMore.length === 1){
                          deleteCartProduct(correspondingCartItem[0]?._id)
                        }else{
                          setProductsId(item?._id)
                            setEditGarmentsOpen(true)
                        }
                      }}
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

      <Popup
        isOpen={isPopupOpen}
        setIsOpen={setIsPopupOpen}
        productDetails={productDetails}
        isEditOrder={isEditOrder} 
        orderDetails={orderDetails}
        setUpdatedOrderProductDetails={setUpdatedOrderProductDetails}
      />
      {/* <AddedProductPreviewPopup
        isOpen={isAddedPopupOpen}
        setIsOpen={setIsAddedPopupOpen}
        cartItems={cartItems}
        productDetails={productDetails}
      /> */}
      <OrderEditPopup
        productDetails={productDetails}
        isOpen={editOpen}
        setIsOpen={setEditOpen}
        cartId={cartPId}
      />
      {/* <SidebarPopup
        isOpen={isPreviewPopupOpen}
        setIsOpen={setIsPreviewPopupOpen}
        cartItems={cartItems}
        productDetails={productDetails}
      /> */}      
           <OtherServicesMultipleEdit  serviceName={"Starching"}  isOpen={editGarmentsOpen} setIsOpen={setEditGarmentsOpen} mode={mode}  productId={productsId}/>

    </div>
  );
};

export default StarchingTab;
