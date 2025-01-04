import { RxCross2 } from "react-icons/rx";
import { useCart } from "../context/CartContenxt";
import { MdDelete, MdEdit } from "react-icons/md";
import { useState } from "react";
import OrderEditPopup from "./OrderEditPopup";
import axios from "axios";
import toast from "react-hot-toast";

const OtherServicesMultipleEdit = ({ serviceName, isOpen, setIsOpen, mode }) => {
  const { refreshCart, cartProdcuts } = useCart();
  const [editGarmentsOpen, setEditGarmentsOpen] = useState(false);
  const [cartPId, setCartPId] = useState(null);
  const [productDetails, setProductDetails] = useState(null);

  const dcProducts = cartProdcuts?.filter((item) => item?.serviceName === serviceName);
  
  const getPrice = (priceObj) => {
    if (!priceObj) return 0;
    return mode === "B2B" ? priceObj?.B2B : priceObj?.B2C;
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
      setIsOpen(false)
      await refreshCart();
    } catch (error) {
      toast.error("Error Deleting");
      console.log("Error deleting product: ", error, error.message);
    }
  };


  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg relative">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Edit Garments</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700 font-semibold text-xl"
              >
                <RxCross2 />
              </button>
            </div>
            <div className="mt-4 relative flex justify-center items-center gap-3 w-full">
              {dcProducts?.map((item, index) => {
                return (
                  <div
                    key={index}
                    className="border cursor-pointer border-gray-300 rounded-lg px-8 flex flex-col justify-center items-center relative mb-4¯"
                  >
                      <div className="absolute w-full top-2">
                        <div className="flex justify-between items-center">
                          <button
                            className="p-1  text-green-500"
                            onClick={() => {
                              setCartPId(item?._id);
                              setEditGarmentsOpen(true);
                              setProductDetails(item?.productId);
                            }}
                          >
                            <MdEdit size={20} />
                          </button>
                          <button
                            className="p-1 text-red-500"
                            onClick={() =>
                              deleteCartProduct(item?._id)
                            }
                          >
                            <MdDelete size={20} />
                          </button>
                        </div>
                      </div>
                    <img
                      src={item?.productId?.image}
                      alt=""
                      className="w-12 h-12 mx-auto mt-8"
                    />
                    <p className="text-sm pt-2 capitalize">{item?.productId?.name}</p>
                    <p className="text-sm  capitalize">[{item?.garmentType[0]?.name}]</p>
                    <p className="text-xs py-1">₹ {getPrice(item?.productId?.price)}/-</p>
                    <div className="border border-gray-300 rounded-lg my-1 p-1 text-sm flex items-center">
                      <button
                        className={`rounded-sm px-1 ${
                          mode === "B2B"
                            ? "bg-[#66BDC5] text-white"
                            : "bg-[#004d57] text-white"
                        }`}
                      >
                        +
                      </button>
                      <span className="px-3">
                        {item?.quantity || 0}
                      </span>
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
                  </div>
                );
              })}
            </div>
          </div>
          <OrderEditPopup
            productDetails={productDetails}
            isOpen={editGarmentsOpen}
            setIsOpen={setEditGarmentsOpen}
            cartId={cartPId}
          />
        </div>
      )}
    </>
  );
};

export default OtherServicesMultipleEdit;