import { useEffect, useState } from "react";
import shirt from "../assets/shirt.png";
import { MdDelete, MdEdit } from "react-icons/md";
import { useCart } from "../context/CartContenxt";
import OrderEditPopup from "./OrderEditPopup";
import toast from "react-hot-toast";
import axios from "axios";
import { useSelectedAddons } from "../context/AddonContext";

const LaundryPreviewTab = ({ selectedItem, isOpen, setIsOpen, mode }) => {
  const { cartItems, refreshCart } = useCart();
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [productDetails, setProductDetails] = useState(null);
  const [pCartId, setPCartId] = useState(null);
  const { selectedAddons, updateAddons } = useSelectedAddons();


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

  const handleIncrement = (
    index,
    productId,
    serviceName,
    productName,
    pId,
    quantity
  ) => {
    setPCartId(pId);
    setProductDetails({
      productId,
      selectedItem: serviceName,
      serviceName,
      productName,
      quantity,
    });
    setIsEditPopupOpen(true);
  };

  const handleCheckboxChange = (e) => {
    const { id, checked } = e.target;
    updateAddons(id, checked);
  };
  

  return (
    <div className="relative">
      {isOpen && (
        <div
          className="fixed inset-0 bg-gray-800 bg-opacity-50 z-50 h-screen"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
      <div
        className={`fixed inset-y-0 right-0 bg-white w-[450px] top-0  pt-2 shadow-lg z-50 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center p-3 border-b">
          <h2 className="text-lg capitalize font-semibold">{selectedItem}</h2>
          <button
            className="text-gray-300 font-bold  bg-gray-800 px-2 py-1 rounded-lg"
            onClick={() => setIsOpen(false)}
          >
            X
          </button>
        </div>

        <div className="p-4 space-y-6">
          <div className="border border-gray-300 p-3 rounded-md">
            <p className="capitalize text-sm pb-2">{selectedItem} Addons</p>
            <hr />
            <div className="flex items-center mt-3 gap-3">
        <input
          type="checkbox"
          id="antiviralCleaning"
          checked={selectedAddons.antiviralCleaning}
          onChange={handleCheckboxChange}
        />
        <div>
          <p className="text-xs">Antiviral Cleaning | ₹ 5/kg</p>
          <span className="text-[10px]">Removes 99.9% Germs</span>
        </div>
      </div>
      <div className="flex mt-2 items-center gap-3">
        <input
          type="checkbox"
          id="fabricSoftener"
          checked={selectedAddons.fabricSoftener}
          onChange={handleCheckboxChange}
        />
        <div>
          <p className="text-xs">Fabric Softener | ₹ 5/kg</p>
          <span className="text-[10px]">Unbeatable shine & fragrance</span>
        </div>
      </div>
    </div>
          <table className="table-auto w-full border-collapse">
            {cartItems?.length > 0 ? (
              <tbody className="text-[12px]">
                {cartItems
                  // .reduce((acc, product) => {
                  //   const serviceName =
                  //     product.productId[0]?.serviceName?.toLowerCase();
                  //   const serviceId = product?.serviceName;

                  //   if (serviceName === "laundry") {
                  //     const existingLaundry = acc.find(
                  //       (item) =>
                  //         item.productId[0]?.serviceName?.toLowerCase() ===
                  //           "laundry" && item?.serviceName === serviceId
                  //     );

                  //     if (existingLaundry) {
                  //       existingLaundry.quantity += product.quantity;
                  //     } else {
                  //       acc.push({ ...product });
                  //     }
                  //   } else {
                  //     acc.push(product);
                  //   }
                  //   return acc;
                  // }, [])
                  .map((product, index) => (
                    <tr key={product?.productId[0]?._id}>
                      <td className="px-2 border border-gray-200">
                        {product?.productId[0]?.serviceName?.toLowerCase() ===
                        "laundry"
                          ? `${product?.serviceName} X ${product?.quantity}`
                          : `${product?.productId[0]?.name} X ${product?.quantity}`}/Kg
                      </td>
                      <td className="text-center px-2 border border-gray-200">
                        ₹{product?.productId[0]?.price?.B2C}
                      </td>
                      <td className="px-2 text-sm border border-gray-200">
                     {product?.additionalServices[0]?.toLowerCase() === "cleaning" ? (
                          " "
                        ) : (
                          <button
                            className="text-green-600"
                            onClick={() =>
                              handleIncrement(
                                index,
                                product.productId[0]?.id,
                                product.productId[0]?.serviceName,
                                product.productId[0]?.name,
                                product?._id,
                                product.productId[0]?.quantity
                              )
                            }
                          >
                            <MdEdit />
                          </button>
                        )}
                      </td>
                      <td className="text-sm px-2 border border-gray-200">
                        <button
                          className="text-red-600"
                          onClick={() => deleteCartProduct(product?._id)}
                        >
                          <MdDelete />
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            ) : (
              <p>No Garments Added</p>
            )}
          </table>
        </div>
      </div>
      <OrderEditPopup
        isOpen={isEditPopupOpen}
        setIsOpen={setIsEditPopupOpen}
        productDetails={productDetails}
        cartId={pCartId}
      />
    </div>
  );
};

export default LaundryPreviewTab;
