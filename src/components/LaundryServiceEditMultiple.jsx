import { RxCross2 } from "react-icons/rx";
import { useCart } from "../context/CartContenxt";
import { MdDelete, MdModeEditOutline } from "react-icons/md";
import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import LaundryEditDataPopup from "../components/LaundryEditDataPopup";

const LaundryServiceEditMultiple = ({
  isOpen,
  setIsOpen,
  products,
  productId,
}) => {
  const { refreshCart, laundryProducts } = useCart();
  const [isProductEditOpen, setIsProductEditOpen] = useState(false);
  const [cartPId, setCartPId] = useState(null);
  const [productDetails, setProductDetails] = useState(null);
  const [selectedProductIndex, setSelectedProductIndex] = useState(null);
  const [normalizedProducts, setNormalizedProducts] = useState([]);

  const handleClose = () => {
    setIsOpen(false);
    setIsProductEditOpen(false);
    setCartPId(null);
    setProductDetails(null);
    setSelectedProductIndex(null);
  };

  useEffect(() => {
    if (!products?.length) return;

    // Filter products and add unique instance IDs if they don't exist
    const filtered = products
      ?.filter((item) => item.productDetails?._id === productId)
      .map((item, index) => ({
        ...item,
        instanceId:
          item.instanceId || `${item.productDetails._id}-${index}-${Date.now()}`,
      }));

    // Find a valid cartId from any product that has one
    const validCartId = filtered.find(product => product.cartId)?.cartId;

    // Normalize products with the valid cartId
    const normalized = filtered.map(product => ({
      ...product,
      cartId: product.cartId || validCartId
    }));

    setNormalizedProducts(normalized);
  }, [products, productId]);

  const deleteCartProduct = async (cartId, id) => {
    const token = localStorage.getItem("authToken");

    try {
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

      refreshCart();
      setIsOpen(false);
      toast.success("Deleted Successfully");
    } catch (error) {
      toast.error("Error Deleting");
      console.log("Error deleting product: ", error);
    }
  };

  const handleEditClick = (item, index) => {
    // Use the normalized cartId when setting up edit
    const validCartId = item.cartId || normalizedProducts.find(p => p.cartId)?.cartId;
    setCartPId(validCartId);
    setProductDetails({
      ...item?.productDetails,
      _instanceIndex: index,
      instanceId: item.instanceId,
    });
    setSelectedProductIndex(index);
    setIsProductEditOpen(true);
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
              {normalizedProducts?.map((item, index) => (
                <div
                  key={item.instanceId}
                  className="border border-gray-300 p-2 rounded-lg capitalize mt-0.5 mb-1 w-full"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleEditClick(item, index)}
                        className="text-green-500"
                      >
                        <MdModeEditOutline />
                      </button>
                      <button
                        onClick={() =>
                          deleteCartProduct(item.cartId, item?.productId)
                        }
                        className="text-red-500"
                      >
                        <MdDelete />
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
                          <span className="font-semibold">Requirements: </span>
                          {item.requirements.map((req, idx) => (
                            <span key={idx}>
                              {req.name} (₹ {req.price})
                              {idx < item.requirements.length - 1 && ", "}
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
                          {item.additionalServices.map((service, idx) => (
                            <span key={idx}>
                              {service.name} (₹ {service.price})
                              {idx < item.additionalServices.length - 1 && ", "}
                            </span>
                          ))}
                        </p>
                      )}
                  </div>
                  {Array.isArray(item?.comments) &&
                    item.comments.length > 0 && (
                      <div className="text-[10px]">
                        <span className="font-semibold">Comments:</span>{" "}
                        <span>{item.comments.join(", ")}</span>
                      </div>
                    )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      <LaundryEditDataPopup
        productDetails={productDetails}
        productId={productId}
        isOpen={isProductEditOpen}
        setIsOpen={setIsProductEditOpen}
        cartId={cartPId}
        selectedIndex={selectedProductIndex}
        onClose={handleClose}
      />
    </>
  );
};

export default LaundryServiceEditMultiple;