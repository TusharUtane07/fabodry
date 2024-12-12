import { useState } from "react";
import shirt from "../assets/shirt.png";
import { MdDelete, MdEdit } from "react-icons/md";
import { useCart } from "../context/CartContenxt";
import OrderEditPopup from "./OrderEditPopup";

const LaundryPreviewTab = ({ selectedItem, isOpen, setIsOpen }) => {

  const { cartItems, refreshCart } = useCart();
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [productDetails, setProductDetails] = useState(null);
  const [pCartId, setPCartId] = useState(null)

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

  const [productList, setProductList] = useState(products);
  const [quantities, setQuantities] = useState(
    productList.map(() => 1)
  );

  const deleteProduct = (id) => {
    const updatedProducts = productList.filter(
      (product) => product.productId !== id
    );
    setProductList(updatedProducts);

    setQuantities(updatedProducts.map(() => 1));
  };

  const handleIncrement = (index, productId, serviceName, productName, pId, quantity) => {
    console.log("handleIncrement: ", productId, serviceName);
    setPCartId(pId)
    setProductDetails( {
      productId,
      serviceName,
      productName,
      quantity
    })
    setIsEditPopupOpen(true)
  };

  const handleDecrement = (index) => {
    const updatedQuantities = [...quantities];
    if (updatedQuantities[index] > 1) {
      updatedQuantities[index] -= 1;
      setQuantities(updatedQuantities);
    }
  };

  return (
    <div className="relative">
      {isOpen && (
        <div
          className="fixed inset-0 bg-gray-800 bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
      <div
        className={`fixed inset-y-0 right-0 bg-white w-[450px] h-full shadow-lg z-50 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center p-3 border-b">
          <h2 className="text-lg capitalize font-semibold">{selectedItem}</h2>
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={() => setIsOpen(false)}
          >
            X
          </button>
        </div>

        <div className="p-4 space-y-6">
            <div className="border border-gray-300 p-3 rounded-md">
                <p className="capitalize text-sm pb-2">{selectedItem} Addons</p>
                <hr />
                <div  className="flex  items-center mt-3  gap-3">
                    <input type="checkbox" id="item1"/>
                   <div>
                    <p className="text-xs">Antiviral Cleaning | ₹ 5/kg</p>
                    <span className="text-[10px]">Removes 99.9% Germs</span>
                   </div>
                </div>
                <div className="flex mt-2 items-center gap-3">
                    <input type="checkbox" id="item1"/>
                   <div>
                    <p className="text-xs">Fabirc Softener | ₹ 5/kg</p>
                    <span className="text-[10px]">Unbeatable shine & fragrance</span>
                   </div>
                </div>
            </div>
          <table className="table-auto w-full border-collapse border border-gray-200">
            { cartItems?.length> 0 ?( <tbody className="text-[8px]">
              {cartItems?.map((product, index) => (
                <tr key={index}>
                  <td className=" px-2 border border-gray-200">
                    {product?.productId[0]?.name}
                  </td>
                  <td className=" text-center px-2 border border-gray-200">
                    {product?.productId[0]?.price}
                  </td>
                  <td className=" px-2 border border-gray-200">
                    Services: {product?.additionalServices}
                  </td>
                  <td className=" px-2 border border-gray-200">
                  Comments: {product?.comments}
                  </td>
                  <td className=" px-2 border border-gray-200">
                 <div className=" rounded-lg my-2 p-1 flex items-center">
                      <button
                        className="bg-[#006370] text-white rounded-sm p-0.5 px-2"
                        onClick={() => handleIncrement(index)}
                      >
                        +
                      </button>
                      <span className="text-gray-500 px-1.5  mx-1 rounded-sm">
                        {quantities[index]}
                      </span>
                      <button
                        className="bg-[#abbbbd] text-white rounded-sm p-0.5 px-2"
                        onClick={() => handleDecrement(index)}
                      >
                        -
                      </button>
                    </div> 
                  </td>
                  <td className="px-2 text-sm border border-gray-200">
                    <button
                      className="text-green-600 "
                      onClick={() => {handleIncrement(index, product.productId[0]?.id, product.productId[0]?.serviceName,  product.productId[0]?.name, product?._id, product.productId[0]?.quantity)}
                    }>
                    
                      <MdEdit />
                    </button>
                  </td>
                  <td className=" text-sm px-2 border border-gray-200">
                    <button
                      className="text-red-600 "
                      // onClick={() => deleteProduct(product.productId)}
                    >
                      <MdDelete />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>) : (<p>No Garments Added</p>)}
          </table>
        </div>
      </div>
      <OrderEditPopup isOpen={isEditPopupOpen} setIsOpen={setIsEditPopupOpen} productDetails={productDetails} cartId={pCartId}/>
    </div>
  );
};

export default LaundryPreviewTab;
