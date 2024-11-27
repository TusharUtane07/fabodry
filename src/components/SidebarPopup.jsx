import { useState } from "react";

const SidebarPopup = ({isOpen, setIsOpen}) => {
  const products = [
    { id: 1, name: "Product 1", price: "$10" },
    { id: 2, name: "Product 2", price: "$20" },
    { id: 3, name: "Product 3", price: "$30" },
  ];

  const [productList, setProductList] = useState(products);

  const deleteProduct = (id) => {
    setProductList(productList.filter((product) => product.id !== id));
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
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-bold">Sidebar Popup</h2>
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={() => setIsOpen(false)}
          >
            Close
          </button>
        </div>

        <div className="p-4 space-y-6">
          <div>
            <h3 className="text-md font-semibold mb-2">Choose an Option:</h3>
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="option"
                  className="form-radio text-blue-600"
                />
                <span>Option 1</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="option"
                  className="form-radio text-blue-600"
                />
                <span>Option 2</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="option"
                  className="form-radio text-blue-600"
                />
                <span>Option 3</span>
              </label>
            </div>
          </div>
          <div>
            <h3 className="text-md font-semibold mb-2">Products</h3>
            <table className="table-auto w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Name
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Price
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {productList.map((product) => (
                  <tr key={product.id}>
                    <td className="border border-gray-300 px-4 py-2">
                      {product.name}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {product.price}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      <button
                        className="text-red-600 hover:underline"
                        onClick={() => deleteProduct(product.id)}
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
    </div>
  );
};

export default SidebarPopup;
