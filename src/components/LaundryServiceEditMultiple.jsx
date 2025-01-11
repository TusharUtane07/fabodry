import { RxCross2 } from "react-icons/rx";
import { useCart } from "../context/CartContenxt";
import { MdDelete, MdEdit, MdModeEditOutline } from "react-icons/md";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import LaundryEditDataPopup from "../components/LaundryEditDataPopup";

const LaundryServiceEditMultiple = ({ isOpen, setIsOpen, products }) => {
  const { refreshCart, laundryProducts } = useCart();
  const [isProductEditOpen, setIsProductEditOpen] = useState(false);
  const [cartPId, setCartPId] = useState(null);
  const [productDetails, setProductDetails] = useState(null);

  const handleClose = () => {
    setIsOpen(false);
    setIsProductEditOpen(false);
    setCartPId(null);
    setProductDetails(null);
  };
  const deleteCartProduct = async (cartId, id) => {
    const token = localStorage.getItem("authToken");

    try {
      // Delete from database
      const response = await axios.delete(
        `${
          import.meta.env.VITE_BACKEND_URL
        }api/v1/laundrycarts/remove-product/${cartId}/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Refresh the cart after state updates
      refreshCart();
      toast.success("Deleted Successfully");
    } catch (error) {
      toast.error("Error Deleting");
      console.log("Error deleting product: ", error, error.message);
    }
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 w-[600px] rounded-lg shadow-lg relative">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">
                Added {products[0]?.serviceName} Garments
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700 font-semibold text-2xl"
              >
                <RxCross2 />
              </button>
            </div>
            <div className="mt-4 relative flex flex-col justify-center items-center gap-3 w-full">
              {products?.map((item) => {
                return (
                  <div
                    key={item?.productDetails?._id || Math.random()}
                    className="border border-gray-300 p-2 rounded-lg capitalize mt-0.5 mb-1 w-full"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            setCartPId(item?.cartId);
                            setProductDetails(item?.productDetails);
                            setIsProductEditOpen(true);
                          }}
                          className="text-green-500"
                        >
                          <MdModeEditOutline />
                        </button>
                      
                      </div>
                      {item?.productDetails?.name && (
                        <div className="font-semibold">
                          {item.productDetails.name}
                          {item?.garmentType
                            ? ` [${item?.garmentType?.label}]`
                            : ""}{" "}
                          X {item?.quantity || 1}
                        </div>
                      )}
                    </div>
                    <div className="text-[10px] flex flex-col">
                      {Array.isArray(item?.requirements) &&
                        item.requirements.length > 0 && (
                          <p>
                            <span className="font-semibold">
                              Requirements:{" "}
                            </span>{" "}
                            {item.requirements.map((req, index) => (
                              <span key={index}>
                                {req.name} (₹ {req.price})
                                {index < item.requirements.length - 1 && ", "}
                              </span>
                            ))}
                          </p>
                        )}
                      {Array.isArray(item?.additionalServices) &&
                        item.additionalServices.length > 0 && (
                          <p>
                            <span className="font-semibold">
                              Additional Services:
                            </span>{" "}
                            {item.additionalServices.map((service, index) => (
                              <span key={index}>
                                {service.name} (₹ {service.price})
                                {index < item.additionalServices.length - 1 &&
                                  ", "}
                              </span>
                            ))}
                          </p>
                        )}
                    </div>
                    {Array.isArray(item?.comments) &&
                      item.comments.length > 0 && (
                        <div className="text-[10px]">
                          <span className=" font-semibold">Comments:</span>{" "}
                          <span>{item.comments.join(", ")}</span>
                        </div>
                      )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
      <LaundryEditDataPopup
        productDetails={productDetails}
        isOpen={isProductEditOpen}
        setIsOpen={setIsProductEditOpen}
        cartId={cartPId}
        onClose={handleClose}
      />
    </>
  );
};

export default LaundryServiceEditMultiple;
