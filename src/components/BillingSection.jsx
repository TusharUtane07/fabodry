import { useState } from "react";
import HomeDeliveryPopup from "./HomeDeliveryPopup";
import { Space, DatePicker, Select } from "antd";
import { MdDelete, MdEdit } from "react-icons/md";
import CouponPopup from "./CouponPopup";
import dayjs from "dayjs";
import { useCart } from "../context/CartContenxt";
import axios from "axios";
import OrderEditPopup from "./OrderEditPopup";
import { useNavigate } from "react-router-dom";

const BillingSection = ({ customerAddress }) => {
  const [isChecked, setIsChecked] = useState(false);
  const [isHomeDeliveryPopupOpen, setIsHomeDeliveryPopupOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [savedAddress, setSavedAddress] = useState(true);
  const [isExpressDelivery, setIsExpressDelivery] = useState(true);
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [productDetails, setProductDetails] = useState(null);
  const [cartPId, setCartPId] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  const [expressDeliverValue, setExpressDeliveryValue] = useState(25);

  const { cartItems, refreshCart } = useCart();

  const onChange = (date, dateString) => {
    setSelectedDate(dateString);
  };

  const handleChangeForExpressDelivery = (value) => {
    const expressValueInRupees = (value * grossTotal) / 100;
    setExpressDeliveryValue(expressValueInRupees);
  };
  const handleChangeForDeliveryAddress = (value) => {
    setSelectedAddress(value);
  };

  const handleCouponSelect = (coupon) => {
    setSelectedCoupon(coupon);
    setIsDrawerOpen(false);
  };

  const removeCoupon = () => {
    setSelectedCoupon(null);
  };
  const [selectedLabel, setSelectedLabel] = useState("04:00PM-05:00PM");

  // const handleTimeChange = (value, option) => {
  //   setSelectedLabel(option.label);
  // };

  const disabledDate = (current) => {
    return current && current < dayjs().startOf("day");
  };

  const calculateGrossTotal = () => {
    return cartItems?.reduce(
      (total, item) => total + item?.productId[0]?.price * item.quantity,
      0
    );
  };

  const grossTotal = calculateGrossTotal();

  const deleteCartProduct = async (id) => {
    const token = localStorage.getItem("authToken");
    try {
      const response = await axios.delete(
        `http://51.21.62.30/api/v1/carts/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Delete response: ", response);
      await refreshCart();
    } catch (error) {
      console.log("Error deleting product: ", error, error.message);
    }
  };

  const calculateTotalAmount = () => {
    const grossTotal = calculateGrossTotal();
    const discountValue = selectedCoupon?.discountValue || 0;
    const expressChargePercentage = isExpressDelivery
      ? expressDeliverValue || 0
      : 0;

    const discount = (grossTotal * discountValue) / 100;
    const expressCharge = (grossTotal * expressChargePercentage) / 100;
    const totalAmount = grossTotal - discount + expressCharge;

    return totalAmount.toFixed(2);
  };

  const navigate = useNavigate();
  const createOrder = async () => {
    const productName = [];
    const serviceName = [];
    cartItems?.map((item) => productName.push(item?.productId[0]?.name));
    cartItems?.map((item) => serviceName.push(item?.serviceId));
    const token = localStorage.getItem("authToken");
    const userName = localStorage.getItem("userName");
    const mobileNumber = localStorage.getItem("mobileNumber");
    const totalAmount = calculateTotalAmount();
    const totalCount = cartItems?.length;
    try {
      const response = await axios.post(
        "http://51.21.62.30/api/v1/admin/orders/create",
        {
          productNames: productName,
          serviceNames: serviceName,
          totalCount: totalCount,
          price: 0,
          totalPrice: Number(totalAmount),
          customerName: userName,
          address: selectedAddress,
          phoneNumber: mobileNumber,
          deliveryDate: selectedDate,
          timeSlot: selectedLabel,
          orderType: "B2B",
          deliveryMethod: "HOME",
          paymentMethod: "CARD",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      navigate("/orders/all");
    } catch (error) {
      console.error("Error creating order:", error);
    }
  };

  const deleteAllCartItems = async () => {
    const customerId = localStorage.getItem("userId");
    const token = localStorage.getItem("authToken");
    try {
      const response = await axios.delete(
        `http://51.21.62.30/api/v1/carts/customer/${customerId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      refreshCart();
    } catch (error) {
      console.error("Error Deleting All Cart Items: ", error.message, error);
    }
  };

  return (
    <div
      className="col-span-1 relative bg-white mt-8   border-2 mr-4  border-[#eef0f2] rounded-xl overflow-y-scroll h-screen "
      style={{ scrollbarWidth: "none" }}
    >
      <div className="p-2">
        <h3 className="text-sm">Billing Section</h3>
        <div className="mt-3">
          <Select
            showSearch
            className="border w-full border-gray-300 rounded-md"
            placeholder="Main"
            variant="borderless"
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            options={[
              {
                value: "main",
                label: "Main",
              },
              {
                value: "2",
                label: "Walk in",
              },
              {
                value: "3",
                label: "Pick up",
              },
            ]}
          />
        </div>
        <div className="mt-2 flex items-center space-x-4 border p-2 border-gray-300 rounded-xl">
          <div className="flex items-center">
            <input
              type="radio"
              id="walk_in"
              name="option"
              className="peer w-3 h-3 text-[#00414e] accent-[#00414e] focus:ring-0"
              required
            />
            <label
              htmlFor="walk_in"
              className="ml-2 text-xs  text-gray-400 cursor-pointer"
            >
              Walk In
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="radio"
              id="pick_up"
              name="option"
              className="peer w-3 h-3 text-[#00414e] accent-[#00414e] focus:ring-0"
              required
            />
            <label
              htmlFor="pick_up"
              className="ml-2 text-xs  text-gray-400 cursor-pointer"
            >
              Pick Up
            </label>
          </div>
        </div>
        <div className="relative overflow-x-auto  border-[#eef0f2] rounded-xl mt-3 p-2  border">
          <table className="w-full text-left  ">
            <thead className=" text-[11px]  "></thead>
            {cartItems?.length > 0 ? (
              <tbody className="text-[10px]">
                {cartItems?.map((product, index) => (
                  <div key={index}>
                    <div className="flex justify-between gap-2 mx-1">
                      <div>
                        <p className="text-xs capitalize mt-1">
                          {index + 1}.{" "}
                          {product.productId[0]?.serviceName == "laundry"
                            ? product.productId[0]?.serviceName
                            : product?.productId[0]?.name}{" "}
                          X {product.quantity} / ₹
                          {product?.productId[0]?.price * product.quantity}
                        </p>
                        <p className="text-[10px] ml-2.5 text-gray-500">
                          {product.comments.length > 1
                            ? `( ${product.comments} )`
                            : " "}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        {product.productId[0]?.serviceName === "Cleaning" ? (
                          " "
                        ) : (
                          <button
                            onClick={() => {
                              setIsEditPopupOpen(true);
                              setCartPId(product?._id);
                              setProductDetails({
                                productId: product.productId[0]?._id,
                                selectedItem:
                                  product?.productid[0]?.serviceName,
                                serviceName: product.productId[0]?.serviceName,
                                productName: product.productId[0]?.name,
                                quantity: product.productId[0]?.quantity,
                              });
                            }}
                            className="text-sm text-green-400 "
                          >
                            <MdEdit />
                          </button>
                        )}
                        <button
                          onClick={() => deleteCartProduct(product?._id)}
                          className="text-sm text-red-400"
                        >
                          <MdDelete />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </tbody>
            ) : (
              <p className="text-xs text-gray-600">No garments added</p>
            )}
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
            <div className="border border-gray-300 rounded-md py-1 px-2 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <p className="uppercase font-semibold text-[10px]">
                  {selectedCoupon.code}
                </p>
                <p className="text-[8px] text-gray-500">
                  {selectedCoupon?.discountValue}% off
                </p>
              </div>
              <button
                onClick={removeCoupon}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                <MdDelete />
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center mt-4">
            {cartItems?.length >= 1 ? (
              <button
                onClick={() => setIsDrawerOpen(true)}
                className="px-3 py-2 text-xs bg-gray-500 text-gray-200 rounded-lg w-full"
              >
                Add Coupon
              </button>
            ) : (
              " "
            )}
          </div>
        )}
      </div>
      <div className="w-full px-5 mt-3 text-[12px]">
        <div className="text-gray-400">
          <div className="flex justify-between mt-1">
            <p>Gross Total:</p>
            <span>₹ {grossTotal ? grossTotal.toFixed(2) : 0}</span>
          </div>

          <div className="flex justify-between mt-1">
            <p>Discount:</p>
            <span>
              {" "}
              {selectedCoupon
                ? selectedCoupon?.discountValue + " % off"
                : "No coupon added"}
            </span>
          </div>

          {isExpressDelivery && (
            <div className="flex justify-between mt-1">
              <p>Express Amount:</p>
              <span>₹ {expressDeliverValue}</span>
            </div>
          )}

          <div className="flex justify-between mt-1">
            <p>Total Count:</p>
            <span>{cartItems?.length}</span>
          </div>

          <div className="flex justify-between mt-2 mb-3">
            <p className="font-medium text-gray-600">Total Amount:</p>
            <span>{calculateTotalAmount()}</span>
          </div>
        </div>
        <div className="flex  flex-col gap-1 text-[8px]">
          <div className="flex items-center border-[#eef0f2] rounded-md mt-1.5 space-x-4 border  px-2 w-full">
            <Space direction="vertical" className="w-full text-[8px]">
              <DatePicker
                size="middle"
                variant="borderless"
                className="border-none outline-none w-full text-gray-400 placeholder:text-gray-400"
                onChange={onChange}
                placeholder="Delivery Date"
                disabledDate={disabledDate}
              />
            </Space>
          </div>
          {/* <div className="w-full mt-1.5">
            <Select
              showSearch
              className="border w-full border-[#eef0f2] rounded-md px-2"
              size="middle"
              placeholder="Delivery Time "
              variant="borderless"
              onChange={handleTimeChange}
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              options={[
                {
                  value: "09-10",
                  label: "09:00AM-10:00AM",
                },
                {
                  value: "10-11",
                  label: "10:00AM-11:00AM",
                },
                {
                  value: "11-12",
                  label: "11:00AM-12:00PM",
                },
                {
                  value: "12-01",
                  label: "12:00PM-01:00PM",
                },
                {
                  value: "01-02",
                  label: "01:00PM-02:00PM",
                },
                {
                  value: "02-03",
                  label: "02:00PM-03:00PM",
                },
                {
                  value: "03-04",
                  label: "03:00PM-04:00PM",
                },
                {
                  value: "04-05",
                  label: "04:00PM-05:00PM",
                },
              ]}
            />
          </div> */}
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
            className="ml-2 text-[10px] text-gray-400 cursor-pointer"
          >
            Home Delivery
          </label>
        </div>
        {isChecked && (
          <div>
            {savedAddress ? (
              <div className="w-full">
                <Select
                  variant="borderless"
                  className="w-full text-[10px] border border-gray-300 rounded-lg"
                  defaultValue="Saved Address"
                  onChange={handleChangeForDeliveryAddress}
                  options={customerAddress?.map((address) => ({
                    value: `(${address.label}) ${address?.addressLine1}, ${address?.city}`,
                    label: `(${address.label}) ${address?.addressLine1}, ${address?.city}`,
                  }))}
                />

                <div className="">
                  <button
                    onClick={() => setIsHomeDeliveryPopupOpen(true)}
                    className="text-[10px] text-gray-100 bg-gray-400 w-full py-1.5 mt-1.5 rounded-md"
                  >
                    Add new Address
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setIsHomeDeliveryPopupOpen(true)}
                className="text-xs text-gray-100 bg-gray-400 px-2 py-1 ml-1 rounded-md"
              >
                Add new Address
              </button>
            )}
          </div>
        )}

        <div className="flex items-center justify-start gap-2 mt-3 mb-16">
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              onChange={(e) => setIsExpressDelivery(e.target.checked)}
              checked={isExpressDelivery}
            />

            <div
              className={`relative w-11 h-5 bg-gray-200 rounded-full peer  peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full  after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white  after:rounded-full after:h-4 after:w-5 after:transition-all peer-checked:bg-green-600`}
            ></div>
          </label>
          <label
            htmlFor="home_delivery"
            className="ml-2 text-[10px] text-gray-400 cursor-pointer"
          >
            Express Delivery
          </label>
          {isExpressDelivery ? (
            <div className="border border-gray-300 rounded-lg ">
              <Select
                bordered={false}
                className="outline-none border-none focus:border-none focus:outline-none"
                defaultValue="25% Extra"
                style={{ width: 120, outline: "none", border: "none" }}
                onChange={handleChangeForExpressDelivery}
                options={[
                  { value: "25", label: "25% Extra" },
                  { value: "50", label: "50% Extra" },
                  { value: "75", label: "75% Extra" },
                  { value: "100", label: "100% Extra" },
                ]}
              />
            </div>
          ) : (
            <div></div>
          )}
        </div>
        <div className=" fixed bottom-2 w-full flex items-center gap-2 ">
          <button
            onClick={() => createOrder()}
            className="px-5 py-2.5   bg-[#00414e] text-xs text-gray-200 rounded-lg"
          >
            Create Order
          </button>
          <button
            onClick={() => deleteAllCartItems()}
            className="px-5 py-2.5  bg-[#00414e] text-xs text-gray-200 rounded-lg"
          >
            Cancel Order
          </button>
        </div>
      </div>
      <CouponPopup
        isOpen={isDrawerOpen}
        setIsOpen={setIsDrawerOpen}
        onCouponSelect={handleCouponSelect}
      />
      <OrderEditPopup
        isOpen={isEditPopupOpen}
        setIsOpen={setIsEditPopupOpen}
        productDetails={productDetails}
        cartId={cartPId}
      />
    </div>
  );
};

export default BillingSection;
