import { useState } from "react";
import shirt from '../assets/shirt.png';

const SidebarPopup = ({ isOpen, setIsOpen }) => {
  const products = [
    {
      productId: 1,
      type: "Shirt",
      price: "$ 10.00/Pc",
      img: shirt,
    },
    {
      productId: 2,
      type: "Pant",
      price: "$ 12.00/Pc",
      img: shirt,
    },
    {
      productId: 3,
      type: "T-Shirt",
      price: "$ 8.00/Pc",
      img: shirt,
    },
    {
      productId: 4,
      type: "Jacket",
      price: "$ 15.00/Pc",
      img: shirt,
    },
    {
      productId: 5,
      type: "Shirt",
      price: "$ 10.00/Pc",
      img: shirt,
    },
  ];

  const [productList, setProductList] = useState(products);
  const [quantities, setQuantities] = useState(
    productList.map(() => 1) // Initialize quantities with 1 for each product
  );

  const deleteProduct = (id) => {
    const updatedProducts = productList.filter(
      (product) => product.productId !== id
    );
    setProductList(updatedProducts);

    // Update quantities to match the filtered product list
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
          <h2 className="text-lg font-bold">Added Products</h2>
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={() => setIsOpen(false)}
          >
            X
          </button>
        </div>

        <div className="p-4 space-y-6">
          <h3 className="text-md font-semibold mb-2">Products</h3>
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Image
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Name
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Price
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Count
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {productList.map((product, index) => (
                <tr key={product.productId}>
                  <td className="border border-gray-300 px-4 py-2">
                    <img src={product.img} className="w-20 h-20 rounded-lg" alt="" />
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {product.type}
                  </td>
                  <td className="border border-gray-300 text-center px-4 py-2">
                    {product.price}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <div className=" rounded-lg my-2 p-1 flex items-center">
                      <button
                                                className="bg-[#006370] text-white rounded-full p-0.5 px-2"

                        onClick={() => handleIncrement(index)}
                      >
                        +
                      </button>
                      <span className="text-gray-500 px-5 border border-gray-300 mx-1 rounded-full">{quantities[index]}</span>
                      <button
                        className="bg-[#006370] text-white rounded-full p-0.5 px-2"
                        onClick={() => handleDecrement(index)}
                      >
                        -
                      </button>
                    </div>
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <button
                      className="text-red-600 hover:underline"
                      onClick={() => deleteProduct(product.productId)}
                    >
                      Delete
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
