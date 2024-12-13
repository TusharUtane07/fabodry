import { useEffect, useState } from "react";
import AlphabetsComponent from "../components/alphabetsComponent";
import shirt from "../assets/shirt.png";
import AddedProductPreviewPopup from "../components/AddedProductPreviewPopup";
import useFetch from "../hooks/useFetch";
import productGif from "../assets/product.gif";
import LaundryPreviewTab from "../components/LaundryPreviewTab";
import { useCart } from "../context/CartContenxt";

const Laundry = ({ filteredLaundryProducts }) => {
  const { cartItems } = useCart();
  const [selectedItem, setSelectedItem] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isPreviewPopupOpen, setIsPreviewPopupOpen] = useState(false);

  const { data } = useFetch("http://51.21.62.30/api/v1/services");

  const laundryServices = [
    {
      name: "Wash & Iron",
      price: 12,
      description: "Updated description for Laundry Services",
      image: productGif,
    },
    {
      name: "Wash & Fold",
      price: 12,
      description: "Updated description for Laundry Services",
      image: productGif,
    },
    {
      name: "Premium Laundry",
      price: 12,
      description: "Updated description for Laundry Services",
      image: productGif,
    },
  ];

  const [weights, setWeights] = useState(() =>
    laundryServices.reduce((acc, _, index) => {
      acc[index] = 1;
      return acc;
    }, {})
  );

  const dryCleaningProduct = [
    { type: "Shirt", price: "$ 10.00/Pc", img: shirt },
    { type: "Pant", price: "$ 10.00/Pc", img: shirt },
    { type: "Shirt", price: "$ 10.00/Pc", img: shirt },
    { type: "Pant", price: "$ 10.00/Pc", img: shirt },
    { type: "Shirt", price: "$ 10.00/Pc", img: shirt },
  ];

  const [quantities, setQuantities] = useState(dryCleaningProduct.map(() => 1));
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState(
    filteredLaundryProducts
  );

  useEffect(() => {
    setFilteredProducts(filteredLaundryProducts);
  }, [filteredLaundryProducts]);

  const handleWeightChange = (index, value) => {
    const weightValue = Math.max(Number(value), 1);
    setWeights((prevWeights) => ({
      ...prevWeights,
      [index]: weightValue,
    }));
  };

  const [productDetails, setProductDetails] = useState(null);

  const handleIncrement = (
    index,
    productId,
    serviceName,
    productName,
    quantity
  ) => {
    setProductDetails({
      productId,
      selectedItem,
      serviceName,
      productName,
      quantity,
    });
    setIsPopupOpen(true);
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

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    filterProducts(query);
  };

  const handleAlphabetClick = (letter) => {
    const query = letter.toLowerCase();
    setSearchQuery(query);
    filterProducts(query);
  };

  const filterProducts = (query) => {
    const filtered = filteredLaundryProducts.filter((product) =>
      product.name.toLowerCase().startsWith(query)
    );
    setFilteredProducts(filtered);
  };

  const handlePreviewClick = () => {
    setIsPreviewPopupOpen(true);
  };

  const handleServiceSelection = (itemName) => {
    setSelectedItem(itemName);
    // Reset products whenever a service is selected
    setFilteredProducts(filteredLaundryProducts);
    setSearchQuery("");
  };

  return (
    <>
      <div className="w-full text-center">
        {selectedItem === null ? (
          <>
            <div className="grid grid-cols-3 w-full items-center gap-3">
              {laundryServices.map((item, index) => (
                <div
                  key={index}
                  className="group flex flex-col h-full justify-between w-full rounded-xl border p-5 border-[#eef0f2] hover:bg-[#004D57] hover:text-white transition-colors"
                >
                  <img
                    src={item.image}
                    alt=""
                    className="xl:w-14 xl:h-14 lg:w-12 w-12 h-12 mx-auto rounded-full"
                  />
                  <h3 className="text-[#006370] capitalize lg:text-[10px] xl:text-lg mt-1 group-hover:text-white">
                    {item.name}
                  </h3>
                  <p className="lg:text-[8px] xl:text-[12px] mt-1.5 text-gray-700 group-hover:text-white">
                    {item.description}
                  </p>
                  <p className="mt-1.5 text-[#006370] group-hover:text-white lg:text-[10px] xl:text-lg">
                    ₹ {item.price * weights[index]}/Kg
                  </p>
                  <div className="flex items-center w-full justify-center mt-3 gap-3">
                    <label
                      htmlFor="totalWeight"
                      className="text-[10px] text-gray-400 group-hover:text-white"
                    >
                      Total Weight
                    </label>
                    <input
                      id="totalWeight"
                      type="number"
                      value={weights[index]}
                      onChange={(e) =>
                        handleWeightChange(index, e.target.value)
                      }
                      className="border border-gray-300 py-0.5 text-[12px] outline-none pl-3 lg:w-20 xl:w-14 rounded-md group-hover:bg-[#004d57] pr-2"
                    />
                  </div>
                  <button
                    onClick={() => handleServiceSelection(item.name)}
                    className="bg-[#004D57] text-white group-hover:bg-white group-hover:text-[#004d57] text-xs w-full gap-2 mt-2 py-2 rounded-lg"
                  >
                    Add Product
                  </button>
                </div>
              ))}
            </div>
            <div className="w-full invisible">
              <AlphabetsComponent />
            </div>
          </>
        ) : (
          <div>
            {/* Product listing */}
            <h2 className="text-sm font-semibold capitalize">{selectedItem}</h2>
            <div className="flex justify-between items-center mt-3">
              <div className="border rounded-lg border-gray-300 w-72 ml-4 flex items-center justify-between">
                <input
                  type="text"
                  className="py-1.5 text-xs pl-3 focus:outline-none w-full"
                  placeholder="Search Product"
                  value={searchQuery}
                  onChange={handleSearch}
                />
                <button
                  type="submit"
                  className="p-1 focus:outline-none items-end-end focus:shadow-outline"
                >
                  <svg
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    className="w-4 h-4"
                  >
                    <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </button>
              </div>
              <div className="flex gap-1 items-center">
                <div className="text-xs rounded-lg px-8 py-2  text-gray-500">
                  Total Count: {cartItems?.length}
                </div>
                <button
                  onClick={handlePreviewClick}
                  className="bg-[#004D57] text-white text-xs rounded-md px-4 py-1.5"
                >
                  Preview
                </button>
              </div>
            </div>

            <div className="mt-3">
              <AlphabetsComponent onAlphabetClick={handleAlphabetClick} />
            </div>
            <div className="grid lg:grid-cols-4 xl:grid-cols-6 gap-4  my-4">
              {filteredProducts?.map((item, index) => {
                const isInCart = cartItems?.some(
                  (cartItem) =>
                    cartItem.productId[0]?.id === item.id &&
                    cartItem.serviceId === selectedItem
                );

                return (
                  <div
                    key={index}
                    className={`border cursor-pointer border-gray-300 rounded-lg p-1 flex flex-col justify-center items-center 
          ${isInCart ? "bg-[#006370] text-white" : ""}`}
                  >
                    <img
                      src={item.image}
                      alt=""
                      className="w-12 h-12 mx-auto"
                    />
                    <p className="text-xs pt-2 capitalize">{item.name}</p>
                    <p className="text-xs py-1 ">
                      ₹ {item.price}/-
                    </p>
                    <div className="border border-gray-300 rounded-lg my-1 p-1 text-sm flex items-center">
                      <button
                        className="bg-[#006370] text-white rounded-sm px-1"
                        onClick={() =>
                          handleIncrement(
                            index,
                            item.id,
                            item.serviceName,
                            item.name,
                            item.quantity
                          )
                        }
                      >
                        +
                      </button>
                      <span className=" px-3">
                        {item.quantity === 0 ? 1 : item.quantity}
                      </span>
                      <button
                        className="bg-[#006370] text-white rounded-sm px-1"
                        onClick={() => handleDecrement(index)}
                      >
                        -
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
      <AddedProductPreviewPopup
        isOpen={isPopupOpen}
        setIsOpen={setIsPopupOpen}
        productDetails={productDetails}
      />
      <LaundryPreviewTab
        cartItems={cartItems}
        selectedItem={selectedItem}
        isOpen={isPreviewPopupOpen}
        setIsOpen={setIsPreviewPopupOpen}
      />
    </>
  );
};

export default Laundry;
