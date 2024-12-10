import { useState } from "react";
import { MdDelete, MdEdit } from "react-icons/md";
import Popup from "./Popup";
import axios from "axios";
import { useCart } from "../context/CartContenxt";
import OrderEditPopup from "./OrderEditPopup";
const AddedProductPreviewPopup = ({ isOpen, setIsOpen, productDetails }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const { cartItems, refreshCart } = useCart();
  const [pCartId, setPCartId] = useState(null);


  const togglePopup = () => {
    setIsOpen(!isOpen);
  };

  const handleIncrement = (index) => {
    const updatedItems = [...cartItems];
    updatedItems[index].quantity += 1;
    // setCartItems(updatedItems);
  };

  const handleDecrement = (index) => {
    const updatedItems = [...cartItems];
    if (updatedItems[index].quantity > 1) {
      updatedItems[index].quantity -= 1;
      // setCartItems(updatedItems);
    }
  };

  const deleteCartProduct = async (id) => {
    const token = localStorage.getItem("authToken");
    try {
      const response = await axios.delete(`http://localhost:8888/api/v1/carts/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Delete response: ", response);
      await refreshCart();
    } catch (error) {
      console.log("Error deleting product: ", error, error.message);
    }
  };

  return (
    <div className="flex justify-center items-center">
      {isOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50 p-5 pb-10">
          <div className="bg-white rounded-lg p-6 w-[40vw] h-[70vh] mx-auto overflow-hidden">
            <h2 className="text-xl text-[#00414e] mb-4">Added Garments</h2>
            <div
              id="scroll-container"
              className="overflow-y-auto h-[50vh] rounded-lg p-4"
            >
              <table className="table-auto w-full border-collapse text-xs">
                { cartItems?.length > 0 ?
                <tbody>
                  {cartItems?.map((item, index) => (
                    <tr
                      key={index}
                      className={`${
                        index % 2 === 0 ? "bg-gray-50" : "bg-white"
                      }`}
                    >
                      <td className="border border-gray-300 px-2">
                        {item?.productId[0]?.name}
                      </td>
                      <td className="border border-gray-300 px-2">
                        {item?.quantity}
                      </td>
                      <td className="border border-gray-300 px-2">
                        {item?.comments || "-"}
                      </td>
                      <td className="border border-gray-300 px-2">
                        <div className="space-y-2">
                          <div className="flex justify-center gap-3">
                            <div className="p-1 flex items-center">
                              <button
                                className="bg-[#006370] text-white rounded-md py-0.5 px-1.5"
                                onClick={() => handleIncrement(index)}
                              >
                                +
                              </button>
                              <span className="text-gray-500 px-5">
                                {item.quantity}
                              </span>
                              <button
                                className="bg-[#006370] text-white rounded-md py-0.5 px-1.5"
                                onClick={() => handleDecrement(index)}
                              >
                                -
                              </button>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="border border-gray-300">
                        <div className="flex justify-start gap-3 mx-3">
                
                <button onClick={() =>{ setIsEditPopupOpen(true)
                  setPCartId(item?._id)
                 }} className="text-lg text-green-400 ">
                            <MdEdit />
                          </button>
                          <button
                            onClick={() => deleteCartProduct(item?._id)}
                            className="text-lg text-red-400"
                          >
                            <MdDelete />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody> : (<p>No Garments Added</p>)}
              </table>
            </div>
            <div className="mt-4 mx-8">
              <button
                onClick={() => setIsPopupOpen(true)}
                className="text-[8px] bg-[#006370] text-white px-10 py-2 rounded-lg"
              >
                Add More
              </button>
              <button
                onClick={togglePopup}
                className="text-[8px] bg-[#006370] ml-3 text-white px-10 py-2 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      <Popup isOpen={isPopupOpen} setIsOpen={setIsPopupOpen} productDetails={productDetails}/>
      <OrderEditPopup isOpen={isEditPopupOpen} setIsOpen={setIsEditPopupOpen} productDetails={productDetails} cartId={pCartId}/>
    </div>
  );
};

export default AddedProductPreviewPopup