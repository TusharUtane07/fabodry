import { useState } from "react";
import HomeDeliveryPopup from "./HomeDeliveryPopup";
import { Space, DatePicker, TimePicker, Select } from "antd";
import { MdDelete, MdEdit } from "react-icons/md";
import CouponPopup from "./CouponPopup";

const BillingSection = () => {
  const [isChecked, setIsChecked] = useState(false);
  const [isHomeDeliveryPopupOpen, setIsHomeDeliveryPopupOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [savedAddress, setSavedAddress]  = useState(true);
  const [isExpressDelivery, setIsExpressDelivery] = useState(true);

  const products = [
    { name: "Sofa", qty: "02", price: "20" },
    { name: "Jeans ", qty: "02", price: "20" },
    { name: "Pant ", qty: "02", price: "20" },
    { name: "Shirt ", qty: "02", price: "20" },
    { name: "Shoes ", qty: "02", price: "20" },
  ];

  // const handleCheckboxChange = () => {
  //   setIsChecked((prevState) => !prevState);
  //   if (!isChecked) {
  //     setIsHomeDeliveryPopupOpen(true);
  //   }
  // };
  const onChange = (date, dateString) => {
    console.log(date, dateString);
  };
  const onChangeForTime = (time) => {
    setValue(time);
  };
  const handleChangeForExpressDelivery = (value) => {
    console.log(`selected ${value}`);
  };

  const handleCouponSelect = (coupon) => {
    setSelectedCoupon(coupon);
    setIsDrawerOpen(false);
  };

  const removeCoupon = () => {
    setSelectedCoupon(null);
  };

  return (
    <div
      className="col-span-1 bg-white mt-8 border-2 mr-4 mb-4 border-[#eef0f2] rounded-xl overflow-scroll min-h-[calc(100vh-120px)] "
      style={{ scrollbarWidth: "none" }}
    >
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
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="text-[10px]">
              {products.map((product, index) => (
                <tr key={index}>
                  <th scope="row" className="px-3 py-1  whitespace-nowrap">
                    {product.name}
                  </th>
                  <td className="px-4 py-1">{product.qty}</td>
                  <td className="px-4 py-1">{product.price}</td>
                  <td className="px-4 py-1">
                    <div className="flex justify-between gap-2 mx-1">
                      <button className="text-lg text-green-500 ">
                        <MdEdit />
                      </button>
                      <button className="text-lg text-red-500">
                        <MdDelete />
                      </button>
                    </div>
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
      </div>
<hr />
      {isChecked && (
        <HomeDeliveryPopup
          isOpen={isHomeDeliveryPopupOpen}
          setIsOpen={setIsHomeDeliveryPopupOpen}
        />
      )}
      <div className="text-center mx-5 mt-4">
      {selectedCoupon ? (
        <div className="text-center text-sm mt-4">
          <div className="border border-gray-400 rounded-lg p-4 flex justify-between items-center">
            <div>
              <p className="uppercase font-semibold">{selectedCoupon.code}</p>
              <p className="text-xs text-gray-500">{selectedCoupon.description}</p>
            </div>
            <button 
              onClick={removeCoupon}
              className="text-red-500 hover:text-red-700 text-xl"
            >
              <MdDelete/>
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center mt-4">
          <button 
            onClick={() => setIsDrawerOpen(true)} 
            className="px-3 py-2 text-xs bg-gray-500 text-gray-200 rounded-lg w-full"
          >
            Add Coupon
          </button>
        </div>
      )}
        </div>
      <div className="w-full px-5 mt-4 text-xs">
        <div className="text-gray-400">
          <div className="flex justify-between mt-1">
            <p>Gross Total:</p>
            <span>120.00</span>
          </div>

          <div className="flex justify-between mt-1">
            <p>Discount Amount:</p>
            <span>120.00</span>
          </div>

          <div className="flex justify-between mt-1">
            <p>Express Amount:</p>
            <span>120.00</span>
          </div>

          <div className="flex justify-between mt-1">
            <p>Total Count:</p>
            <span>120.00</span>
          </div>

          <div className="flex justify-between mt-2 mb-3">
            <p className="font-medium text-gray-600">Total Amount:</p>
            <span>120.00</span>
          </div>
        </div>
        <div className="flex justify-between gap-1 text-xs">
          <div className="flex items-center border-[#eef0f2] rounded-xl mt-3 space-x-4 border py-1.5 px-2 w-full">
            <Space direction="vertical" className="w-full">
              <DatePicker
              bordered={false}
                className="border-none outline-none focus:outline-none focus:border-transparent w-full text-gray-400 placeholder:text-gray-400"
                onChange={onChange}
                placeholder="Delivery Date"
              />
            </Space>
          </div>

          <div className="flex items-center border-[#eef0f2] justify-start rounded-xl mt-3 space-x-4 border px-2 py-1.5 w-full">
            <Space direction="verticle">
              <TimePicker
              bordered={false}
                value={value}
                onChange={onChangeForTime}
                format="HH:mm"
                className="border-none outline-none focus:outline-none focus:border-transparent w-full text-gray-400 placeholder:text-gray-400"
                placeholder="Delivery Time"
              />
            </Space>
          </div>
        </div>
        <div className={`flex items-center justify-start gap-2 mt-3 mb-4`}>
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={isChecked}
              onChange={(e) => setIsChecked(e.target.checked)}
            />

            <div
              className={`relative w-11 h-5 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white  after:border after:rounded-full after:h-4 after:w-5 after:transition-all peer-checked:bg-green-600`}
            ></div>
          </label>
          <label
            htmlFor="home_delivery"
            className="ml-2 text-xs text-gray-400 cursor-pointer"
          >
            Home Delivery
          </label>
          </div>
         {
         isChecked &&
         <div>
          {
            savedAddress ? (
              <div className="flex justify-center gap-2">
                 <Space wrap className="border border-gray-300 rounded-lg">
            <Select
              bordered={false}
              className="outline-none border-none focus:border-none focus:outline-none"
              defaultValue="Saved Address"
              style={{
                width: 120,
                outline: "none",
                border: "none",
              }}
              onChange={handleChangeForExpressDelivery}
              options={[
                {
                  value: "some address here ",
                  label: "add address",
                },
                {
                  value: "some address here ",
                  label: "add address",
                },
                
              ]}
            />
          </Space>
          <div className="">

              <button onClick={() =>setIsHomeDeliveryPopupOpen(true)}  className="text-xs text-gray-100 bg-gray-400 px-2 py-2 ml-1 rounded-md">
              Add new Address
            </button>
          </div>
              </div>
            ) : (
              <button onClick={() =>setIsHomeDeliveryPopupOpen(true)}  className="text-xs text-gray-100 bg-gray-400 px-2 py-1 ml-1 rounded-md">
              Add new Address
            </button>
            )
          }
          </div>
         }
          
        <div className="flex items-center justify-start gap-2 mt-3 mb-4">
          <label className="inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" onChange={(e) => setIsExpressDelivery(e.target.checked)}
          checked={isExpressDelivery}/>

            <div
              className={`relative w-11 h-5 bg-gray-200 rounded-full peer  peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full  after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white  after:rounded-full after:h-4 after:w-5 after:transition-all peer-checked:bg-green-600`}
            ></div>
          </label>
          <label
            htmlFor="home_delivery"
            className="ml-2 text-xs text-gray-400 cursor-pointer"
          >
            Express Delivery
          </label>
          {isExpressDelivery ? (
        <div className="border border-gray-300 rounded-lg">
          <Select
            bordered={false}
            className="outline-none border-none focus:border-none focus:outline-none"
            defaultValue="25% Extra"
            style={{ width: 120, outline: "none", border: "none" }}
            onChange={handleChangeForExpressDelivery}
            options={[
              { value: "25", label: "25% Extra" },
              { value: "50", label: "50% Extra" },
              { value: "100", label: "100% Extra" },
            ]}
          />
        </div>
      ) : (
        <div></div>
      )}
        </div>
        <div>
          <button className="px-3 py-2 bg-[#00414e] text-gray-200 rounded-lg w-full">Create Order</button>
        </div>
      </div>
      <CouponPopup isOpen={isDrawerOpen} setIsOpen={setIsDrawerOpen} onCouponSelect={handleCouponSelect} />
    </div>
  );
};

export default BillingSection;
