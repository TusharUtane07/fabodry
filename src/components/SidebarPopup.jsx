import { useState } from "react";
import shirt from "../assets/shirt.png";
import { MdDelete, MdEdit } from "react-icons/md";
import { useCart } from "../context/CartContenxt";
import axios from "axios";
import OrderEditPopup from "./OrderEditPopup";
import toast from "react-hot-toast";

const SidebarPopup = ({ isOpen, setIsOpen }) => {

  const {cartItems, refreshCart} = useCart();
  const [pCartId, setPCartId] = useState(null);
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);

  const products = [
    {
      productId: 1,
      type: "Shirt",
      price: "$ 10.00/Pc",
      services: "DC",
      comments: "NGFS",
      img: shirt,
    },
    {
      productId: 2,
      type: "Pant",
      price: "$ 12.00/Pc",
      services: "SP",
      comments: "NGFS",
      img: shirt,
    },
    {
      productId: 3,
      type: "T-Shirt",
      price: "$ 8.00/Pc",
      services: "DC",
      comments: "NGFS",
      img: shirt,
    },
    {
      productId: 4,
      type: "Jacket",
      price: "$ 15.00/Pc",
      services: "SP",
      comments: "NGFS",
      img: shirt,
    },
    {
      productId: 5,
      type: "Shirt",
      price: "$ 10.00/Pc",
      services: "DC",
      comments: "NGFS",
      img: shirt,
    },
  ];

  const [productDetails, setProductDetails] = useState(null);
 
  const handleIncrement = (index, productId, serviceName, productName, pId, quantity) => {
    setPCartId(pId)
    setProductDetails( {
      productId,
      selectedItem: serviceName,
      serviceName,
      productName,
      quantity
    })
    setIsEditPopupOpen(true)
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

  return (
    <div className="relative">
      {isOpen && (
        <div
          className="fixed inset-0 bg-gray-800 bg-opacity-50 z-50"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
      <div
        className={`fixed inset-y-0 right-0 bg-white w-[450px] h-full shadow-lg pt-2 z-50 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center p-3 border-b">
          <h2 className="text-lg font-bold">Added Garments</h2>
          <button
            className="text-gray-300 font-bold  bg-gray-800 px-2 py-1 rounded-lg"
            onClick={() => setIsOpen(false)}
          >
            X
          </button>
        </div>

        <div className="p-4 space-y-6">
        <table className="table-auto w-full border-collapse">
  {cartItems?.length > 0 ? (
    <tbody className="text-[12px]">
      {cartItems
        .reduce((acc, product) => {
          const serviceName = product.productId[0]?.serviceName?.toLowerCase();
          if (serviceName === "laundry") {
            const existingLaundry = acc.find(
              (item) => item.productId[0]?.serviceName?.toLowerCase() === "laundry"
            );
            if (existingLaundry) {
              // Add quantities for Laundry service
              existingLaundry.quantity += product.quantity;
            } else {
              // Add as a new grouped Laundry item
              acc.push({ ...product });
            }
          } else {
            // Add non-Laundry items as they are
            acc.push(product);
          }
          return acc;
        }, [])
        .map((product, index) => (
          <tr key={product?.productId[0]?._id}>
            <td className="px-2 border border-gray-200">
              {product?.productId[0]?.serviceName?.toLowerCase() === "laundry" ? `${product?.serviceId} X ${product?.quantity}`  : `${product?.productId[0]?.name} X ${product?.quantity}` }
            </td>
            <td className="text-center px-2 border border-gray-200">
              ₹{product?.productId[0]?.price}
            </td>
            <td className="px-2 text-sm border border-gray-200">
              {product.productId[0]?.serviceName === "Cleaning" ? (
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
      <OrderEditPopup isOpen={isEditPopupOpen} setIsOpen={setIsEditPopupOpen} productDetails={productDetails} cartId={pCartId}/>
    </div>
  );
};

export default SidebarPopup;
