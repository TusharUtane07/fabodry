import { RxCross2 } from "react-icons/rx";
import { useCart } from "../context/CartContenxt";
import { MdDelete, MdEdit, MdModeEditOutline } from "react-icons/md";
import { useState } from "react";
import OrderEditPopup from "./OrderEditPopup";
import axios from "axios";
import toast from "react-hot-toast";

const OtherServicesMultipleEdit = ({
  serviceName,
  isOpen,
  setIsOpen,
  mode,
  productId
}) => {
  const { refreshCart, cartProdcuts } = useCart();
  const [editGarmentsOpen, setEditGarmentsOpen] = useState(false);
  const [cartPId, setCartPId] = useState(null);
  const [productDetails, setProductDetails] = useState(null);

  const filteredProducts = cartProdcuts?.filter(
    (item) =>
    {
      return item?.serviceName === serviceName &&
      item?.productId?._id === productId
    }
  );

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
      setIsOpen(false);
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
          <div className="bg-white p-6 w-[600px] h-[600px] rounded-lg shadow-lg relative flex flex-col">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Added Garments</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700 font-semibold text-2xl"
              >
                <RxCross2 />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto mt-4">
              <div className="flex flex-col justify-center items-center gap-3 w-full">
                {filteredProducts?.map((item) => {
                  return (
                    <div
                      key={item?._id}
                      className="border border-gray-300 p-2 rounded-lg capitalize mt-0.5 mb-2 w-full"
                    >
                      <div className="flex justify-between px-2 w-full gap-2">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1 text-lg">
                            {item?.serviceAddons[0]?.name === "cleaning" ? (
                              " "
                            ) : (
                              <button
                                onClick={() => {
                                  setCartPId(item?._id);
                                  setEditGarmentsOpen(true);
                                  setProductDetails(item?.productId);
                                }}
                                className="text-green-500"
                              >
                                <MdModeEditOutline />
                              </button>
                            )}
                            <button
                              onClick={() => deleteCartProduct(item?._id)}
                              className="text-red-500 text-xl font-bold"
                            >
                              <RxCross2 />
                            </button>
                          </div>
                          {item?.productId?.name && (
                            <div className="font-semibold">
                              {item?.productId?.name}
                              {item?.garmentType[0]?.name
                                ? ` [${item?.garmentType[0]?.name}]`
                                : ""}{" "}
                              {item?.serviceAddons[0]?.name === "cleaning"
                                ? ""
                                : ` X ${item?.quantity || 1}`}
                            </div>
                          )}
                        </div>
                      </div>
                      {item?.serviceAddons[0]?.name === "cleaning" ? (
                        <div className="text-[12px]">
                          <p>
                            {item?.isPremium === true ? "Premium" : "Regular"}
                          </p>
                          <p>Service: {item?.serviceName}</p>
                        </div>
                      ) : (
                        <div className="text-[12px]">
                          <div className="flex items-center gap-1">
                            <p className="font-medium">
                              {item?.isPremium === true ? "Premium" : "Regular"} -
                            </p>
                            <p className="font-medium">
                              Service: {item?.serviceName}
                            </p>
                          </div>
                          {item?.requirements[0]?.name && (
                            <p>
                              Requirements: {item?.requirements[0]?.name} (₹{" "}
                              {item?.requirements[0]?.price || 0})
                            </p>
                          )}
                          {item?.serviceAddons?.length > 0 && (
                            <p>
                              Additional Services:{" "}
                              {item?.serviceAddons?.map((service, index) => (
                                <span key={index}>
                                  {service?.name} (₹ {service?.price})
                                  {index < item?.serviceAddons?.length - 1 &&
                                    ", "}
                                </span>
                              ))}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="sticky bottom-0 pt-4 bg-white">
              <button  onClick={() => setIsOpen(false)} className="w-full bg-[#004d57] text-white text-sm py-2 rounded-md">
                Confirm
              </button>
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