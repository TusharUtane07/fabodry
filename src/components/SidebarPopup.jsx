import { useState } from "react";
import shirt from "../assets/shirt.png";
import { MdDelete, MdEdit } from "react-icons/md";

const SidebarPopup = ({ isOpen, setIsOpen }) => {
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

  const handleIncrement = (index) => {
    const updatedQuantities = [...quantities];
    updatedQuantities[index] += 1;
    setQuantities(updatedQuantities);
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
        className={`fixed inset-y-0 right-0 bg-white w-[550px] h-full shadow-lg z-50 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-bold">Added Garments</h2>
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={() => setIsOpen(false)}
          >
            X
          </button>
        </div>

        <div className="p-4 space-y-6">
          <table className="table-auto w-full border-collapse border border-gray-200">
            <tbody className="text-[10px]">
              {productList.map((product, index) => (
                <tr key={product.productId}>
                  <td className=" px-2 py-1 border border-gray-200">
                    {product.type}
                  </td>
                  <td className=" text-center px-2 py-1 border border-gray-200">
                    {product.price}
                  </td>
                  <td className=" px-2 py-1 border border-gray-200">
                    Services: {product.services}, Comments: {product.comments}
                  </td>
                  <td className=" px-2 py-1 border border-gray-200">
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
                        className="bg-[#006370] text-white rounded-sm p-0.5 px-2"
                        onClick={() => handleDecrement(index)}
                      >
                        -
                      </button>
                    </div> 
                  </td>
                  <td className="px-2 text-xl py-1 border border-gray-200">
                    <button
                      className="text-green-600 "
                      // onClick={() => deleteProduct(product.productId)}
                    >
                      <MdEdit />
                    </button>
                  </td>
                  <td className=" text-xl px-2 py-1 border border-gray-200">
                    <button
                      className="text-red-600 "
                      // onClick={() => deleteProduct(product.productId)}
                    >
                      <MdDelete />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SidebarPopup;
