import { useState } from "react";
import HomeDeliveryPopup from "./HomeDeliveryPopup";
import { Space, DatePicker, TimePicker } from "antd";

const BillingSection = () => {
  const [isChecked, setIsChecked] = useState(false);
  const [isHomeDeliveryPopupOpen, setIsHomeDeliveryPopupOpen] = useState(false);
  const [value, setValue] = useState(null);

  const products = [
    { name: "Sofa", qty: "02", price: "20" },
    { name: "Jeans ", qty: "02", price: "20" },
    { name: "Pant ", qty: "02", price: "20" },
    { name: "Shirt ", qty: "02", price: "20" },
    { name: "Shoes ", qty: "02", price: "20" },
  ];

  const handleCheckboxChange = () => {
    setIsChecked((prevState) => !prevState);
    if (!isChecked) {
      setIsHomeDeliveryPopupOpen(true);
    }
  };
  const onChange = (date, dateString) => {
    console.log(date, dateString);
  };
  const onChangeForTime = (time) => {
    setValue(time);
  };

  return (
    <div className="col-span-1 bg-white mt-8 border-2 mr-4 mb-4 border-[#eef0f2] rounded-xl">
      <div className="p-5">
        <h3 className="font-semibold">Billing Section</h3>
        <div className="mt-3">
          <input
            type="text"
            className=" border border-gray-300 focus:outline-none text-sm rounded-lg  block w-full p-2.5"
            placeholder="Main"
            required
          />
        </div>
        <div className="mt-3 flex items-center space-x-4 border p-3 border-gray-300 rounded-xl">
          <div className="flex items-center">
            <input
              type="radio"
              id="walk_in"
              name="option"
              className="peer w-4 h-4 text-[#00414e] accent-[#00414e] focus:ring-0"
              required
            />
            <label
              htmlFor="walk_in"
              className="ml-2 text-sm  text-gray-400 cursor-pointer"
            >
              Walk In
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="radio"
              id="pick_up"
              name="option"
              className="peer w-4 h-4 text-[#00414e] accent-[#00414e] focus:ring-0"
              required
            />
            <label
              htmlFor="pick_up"
              className="ml-2 text-sm  text-gray-400 cursor-pointer"
            >
              Pick Up
            </label>
          </div>
        </div>
        <div className="relative overflow-x-auto  border-[#eef0f2] rounded-xl mt-3 border">
          <table className="w-full text-left ">
            <thead className=" text-[11px]  ">
              <tr>
                <th scope="col" className="px-4 py-2">
                  Item
                </th>
                <th scope="col" className="px-4 py-2">
                  Qty Item
                </th>
                <th scope="col" className="px-4 py-2">
                  Price
                </th>
                <th scope="col" className="px-4 py-2">
                  Delete
                </th>
              </tr>
            </thead>
            <tbody className="text-[10px]">
              {products.map((product, index) => (
                <tr key={index}>
                  <th scope="row" className="px-3 py-2  whitespace-nowrap">
                    {product.name}
                  </th>
                  <td className="px-4 py-2">{product.qty}</td>
                  <td className="px-4 py-2">{product.price}</td>
                  <td className="px-4 py-2">
                    <button className=" text-red-500">Delete</button>
                  </td>
                </tr>
              ))}
              <tr className="border-t ">
                <th scope="row" className="px-3 py-2  whitespace-nowrap">
                  Total
                </th>
                <td className="px-4">100</td>
                <td className="px-4">10</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="flex justify-between gap-1 text-xs">
          <div className="flex items-center border-[#eef0f2] rounded-xl mt-3 space-x-4 border py-1.5 px-2 w-full">
            <Space direction="vertical" className="w-full">
              <DatePicker
                className="border-none outline-none focus:outline-none focus:border-transparent w-full text-gray-400 placeholder:text-gray-400"
                onChange={onChange}
                placeholder="Delivery Date"
              />
            </Space>
          </div>

          <div className="flex items-center border-[#eef0f2] justify-start rounded-xl mt-3 space-x-4 border px-2 py-1.5 w-full">
            <Space direction="verticle">
              <TimePicker
                value={value}
                onChange={onChangeForTime}
                format="HH:mm"
                className="border-none outline-none focus:outline-none focus:border-transparent w-full text-gray-400 placeholder:text-gray-400"
                placeholder="Delivery Time"
              />
            </Space>
          </div>
        </div>

        <div
          className={`mt-3 flex gap-3 items-center justify-start border  p-3 rounded-xl  ${
            isChecked ? "border-[#00414e]" : "border-[#eef0f2]"
          }`}
        >
          <input
            type="checkbox"
            id="home_delivery"
            checked={isChecked}
            onChange={handleCheckboxChange}
            className="peer hidden"
          />
          <label
            htmlFor="home_delivery"
            className="w-3 h-3 rounded-full border border-[#00414e] flex items-center justify-center cursor-pointer
             peer-checked:bg-[#00414e]"
          ></label>

          <label
            htmlFor="home_delivery"
            className="ml-2 text-sm text-gray-400 cursor-pointer"
          >
            Home Delivery
          </label>
        </div>
        {isChecked && (
          <HomeDeliveryPopup
            isOpen={isHomeDeliveryPopupOpen}
            setIsOpen={setIsHomeDeliveryPopupOpen}
          />
        )}

        <div className="flex items-center border-[#eef0f2] rounded-xl mt-3 space-x-4 border p-2">
          <input
            type="text"
            className=" text-sm rounded-lg py-3 focus:outline-none block w-full"
            placeholder="Coupon Code"
            required
          />
          <button className="bg-[#016370] text-white text-[8px] px-6 py-2 rounded-lg">
            Apply Coupon
          </button>
        </div>

        <div className="mt-3">
          <h3 className="font-semibold">Payment Mode</h3>
          <div className="mt-3 flex items-center space-x-4 border p-3 border-gray-300 rounded-xl">
            <div className="flex items-center">
              <input
                type="radio"
                id="cash"
                name="payment_option"
                className="peer w-4 h-4 text-[#00414e] accent-[#00414e] focus:ring-0"
                required
              />
              <label
                htmlFor="cash"
                className="ml-2 text-sm  text-gray-400 cursor-pointer"
              >
                Cash
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="radio"
                id="card"
                name="payment_option"
                className="peer w-4 h-4 text-[#00414e] accent-[#00414e] focus:ring-0"
                required
              />
              <label
                htmlFor="card"
                className="ml-2 text-sm  text-gray-400 cursor-pointer"
              >
                Card
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="radio"
                id="cod"
                name="payment_option"
                className="peer w-4 h-4 text-[#00414e] accent-[#00414e] focus:ring-0"
                required
              />
              <label
                htmlFor="cod"
                className="ml-2 text-sm  text-gray-400 cursor-pointer"
              >
                COD
              </label>
            </div>
          </div>
          <div className="flex mt-3 gap-2 justify-between text-sm">
            <button className=" border border-[#016370] text-[#016370]  w-full gap-2  py-3 rounded-lg">
              Cancel Order
            </button>
            <button className="bg-[#016370] text-white  w-full gap-2  py-3 rounded-lg">
              Apply Coupon
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingSection;
