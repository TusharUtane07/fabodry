import { useEffect, useRef, useState } from "react";
import HomeDeliveryPopup from "./HomeDeliveryPopup";
import { Space, DatePicker, Select } from "antd";
import { MdDelete, MdEdit, MdModeEditOutline } from "react-icons/md";
import CouponPopup from "./CouponPopup";
import dayjs from "dayjs";
import { useCart } from "../context/CartContenxt";
import axios from "axios";
import OrderEditPopup from "./OrderEditPopup";
import { useNavigate } from "react-router-dom";
import {
  FaAngleLeft,
  FaAngleRight,
  FaCheck,
  FaRegAddressCard,
} from "react-icons/fa";
import { RiDiscountPercentLine } from "react-icons/ri";
import toast from "react-hot-toast";
import EditConfirmedOrderPopup from "./EditConfirmedOrderPopup";
import { useSelectedAddons } from "../context/AddonContext";
import { RxCross2 } from "react-icons/rx";
import LaundryCartComponent from "./LaundryCartComponent";

const BillingSection = ({
  customerAddress,
  mode,
  onAddressChange,
  setSelectedTab,
}) => {
  const [isChecked, setIsChecked] = useState(false);
  const [isHomeDeliveryPopupOpen, setIsHomeDeliveryPopupOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [savedAddress, setSavedAddress] = useState(false);
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [cartPId, setCartPId] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isExpressDelivery, setIsExpressDelivery] = useState(false);
  const [productDetails, setProductDetails] = useState(null);
  const [expressDeliveryValue, setExpressDeliveryValue] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedExpressDeliveryRate, setSelectedExpressDeliveryRate] =
    useState(25);
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedRadio, setSelectedRadio] = useState("");
  const [formErrors, setFormErrors] = useState({
    branch: false,
    deliveryMethod: false,
    deliveryDate: false,
    deliveryTime: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { selectedAddons, updateAddons } = useSelectedAddons();

  useEffect(() => {
    customerAddress?.map((item) => {
      if (item) {
        setSavedAddress(true);
      }
    });
  }, [customerAddress]);

  const { cartItems, refreshCart, cartProdcuts, laundryCart } = useCart();

  const onChange = (date, dateString) => {
    setSelectedDate(dateString);
    setFormErrors((prev) => ({ ...prev, deliveryDate: false }));
  };

  const handleRadioChange = (event) => {
    setSelectedRadio(event.target.value);
    setFormErrors((prev) => ({ ...prev, deliveryMethod: false }));
  };

  const handleSelectChange = (value) => {
    setSelectedOption(value);
    setFormErrors((prev) => ({ ...prev, branch: false }));
  };

  const handleChangeForDeliveryAddress = (value) => {
    setSelectedAddress(value);
  };

  const handleCouponSelect = (coupon) => {
    setSelectedCoupon(coupon);
    setIsDrawerOpen(false);
  };

  const calculateTotalItemPrice = (item) => {
    const garmentPrice =
      (item.isPremium===true ? item?.productId?.premiumPrice?.B2C : item?.garmentType[0]?.price || 0) * (item?.quantity || 0);

    const requirementsPrice =
      item?.requirements?.reduce(
        (acc, req) => acc + (req?.price || 0) * (item?.quantity || 0),
        0
      ) || 0;

    const serviceAddonsPrice =
      item?.serviceAddons?.reduce(
        (acc, addon) => acc + (addon?.price || 0) * (item?.quantity || 0),
        0
      ) || 0;

    return garmentPrice + requirementsPrice + serviceAddonsPrice;
  };

  const removeCoupon = () => {
    setSelectedCoupon(null);
  };
  const [selectedLabel, setSelectedLabel] = useState(null);

  const handleTimeChange = (value, option) => {
    setSelectedLabel(option.label);
    setFormErrors((prev) => ({ ...prev, deliveryTime: false }));
  };

  const validateForm = () => {
    const errors = {
      branch: !selectedOption,
      deliveryMethod: !selectedRadio,
      deliveryDate: !selectedDate,
      deliveryTime: !selectedLabel,
    };

    setFormErrors(errors);
    return !Object.values(errors).some((error) => error);
  };
  const disabledDate = (current) => {
    return current && current < dayjs().startOf("day");
  };

  const calculateAddonsTotal = () => {
    return 0;
  };

  const calculateTotalPrice = (item) => {
    const productsAddonsAndRequirements =
      item?.products?.reduce((total, product) => {
        const additionalServicesTotal =
          product.additionalServices?.reduce(
            (sum, service) => sum + (service?.price || 0),
            0
          ) || 0;
        const requirementsTotal =
          product.requirements?.reduce(
            (sum, req) => sum + (req?.price || 0),
            0
          ) || 0;
        return total + additionalServicesTotal + requirementsTotal;
      }, 0) || 0;

    const addonsPriceSum =
      item?.productAddons?.reduce((total, addon) => {
        return total + addon?.price;
      }, 0) || 0;
    const totalPricePerKg = item?.totalPrice + addonsPriceSum;
    console.log(totalPricePerKg, "ttp");
    return (
      totalPricePerKg * Number(item?.weight) + productsAddonsAndRequirements
    );
  };

  const calculateGrossTotal = () => {
    const itemsTotal = cartProdcuts?.reduce(
      (total, item) => total + calculateTotalItemPrice(item),
      0
    );

    const lItemTotal = laundryCart?.reduce(
      (total, item) => total + calculateTotalPrice(item),
      0
    );
    const finalTotal = lItemTotal + itemsTotal;
    return finalTotal;
  };
  const grossTotal = calculateGrossTotal();

  const handleChangeForExpressDelivery = (value) => {
    setSelectedExpressDeliveryRate(value);
    const expressChargeValue = (grossTotal * value) / 100;
    setExpressDeliveryValue(expressChargeValue);
    calculateTotalAmount();
  };

  const calculateTotalAmount = () => {
    const discountAmount = selectedCoupon
      ? (grossTotal * selectedCoupon.discountValue) / 100
      : 0;
    const expressCharge = isExpressDelivery
      ? (grossTotal * selectedExpressDeliveryRate) / 100
      : 0;

    const totalAmount = grossTotal - discountAmount + expressCharge;

    return {
      grossTotal,
      discountAmount,
      expressCharge,
      totalAmount,
    };
  };

  const deleteCartProduct = async (id) => {
    const token = localStorage.getItem("authToken");
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}api/v1/carts/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      await refreshCart();
      toast.success("Deleted Successfully");
    } catch (error) {
      toast.error("Error Deleting");
      console.log("Error deleting product: ", error, error.message);
    }
  };

  const createOrder = async () => {
    if (!validateForm()) {
      return;
    }
    if (laundryCart?.length === 0 && cartProdcuts?.length === 0) {
      toast.error("Add items for creating order");
      return;
    }

    const { discountAmount, expressCharge, totalAmount } =
      calculateTotalAmount();

    const productName = [];
    const serviceName = [];

    
    const token = localStorage.getItem("authToken");
    const userName = localStorage.getItem("userName");
    const userId = localStorage.getItem("userId");
    const mobileNumber = localStorage.getItem("mobileNumber");
    setIsSubmitting(true);
    try {
      const address = selectedAddress
        ? selectedAddress
        : customerAddress && customerAddress[0]
        ? `${customerAddress[0]?.label || ""} ${
            customerAddress[0]?.addressLine1 || ""
          }, ${customerAddress[0]?.city || ""}`.trim()
        : "No Saved Address";

        const tc = calculateTotalCount();
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}api/v1/admin/orders/create`,
        {
          productIds: productName,
          serviceNames: serviceName,
          branchName: selectedOption,
          totalCount: String(tc),
          totalAmount: String(totalAmount) || "0",
          discountAmount: String(discountAmount) || "0",
          expressCharge: String(expressCharge) || "0",
          customerName: userName,
          address: address,
          customer: userId,
          customerNumber: mobileNumber,
          deliveryDate: selectedDate,
          deliveryTimeSlot: selectedLabel,
          orderStatus: "pending",
          orderType: mode,
          deliveryMethod: selectedRadio,
          paymentMethod: "CARD",
          paymentStatus: "unpaid",
          cart: cartProdcuts,
          laundryCart: laundryCart,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSelectedOrder(response?.data?.data);
      toast.success("Order Created Successfully");
      setIsOpen(true);
      deleteAllCartItems();
    } catch (error) {
      console.error("Error creating order:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteAllCartItems = async () => {
    const customerId = localStorage.getItem("userId");
    const token = localStorage.getItem("authToken");
    setIsDeleting(true);

    try {
      const response = await axios.delete(
        `${
          import.meta.env.VITE_BACKEND_URL
        }api/v1/carts/customer/${customerId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      await axios.delete(
        `${
          import.meta.env.VITE_BACKEND_URL
        }api/v1/laundrycarts/delete-all/${customerId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      refreshCart();
    } catch (error) {
      if (customerId == null) {
        toast.error("No Order to Cancel");
      }
      console.error("Error Deleting All Cart Items: ", error.message, error);
    } finally {
      setIsDeleting(false);
    }
  };

  const calculateTotalCount = () => {
    let quantity = 0;
  
    cartProdcuts?.map((item) => {
      if (item?.serviceAddons?.[0]?.name !== 'cleaning') {
        quantity += item?.quantity || 0; 
      }
    });
  
    laundryCart?.map((item) => quantity+=item?.products?.length)
    return quantity
  };
  

  const isDisabled =
    isSubmitting || Object.values(formErrors).some((error) => error);

  const truncateString = (str, length) => {
    if (str?.length > length) {
      return str?.substring(0, length) + "...";
    }
    return str;
  };
  return (
    <div
      className="col-span-1 relative bg-white mt-8  w-full border-2 mr-4  border-[#eef0f2] rounded-xl overflow-y-scroll h-[100vh-62 w-fullpx] "
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
              { value: "main", label: "Main" },
              { value: "Branch-One", label: "Branch-One" },
              { value: "Branch-Two", label: "Branch-Two" },
              { value: "Branch-Three", label: "Branch-Three" },
              { value: "Branch-Four", label: "Branch-Four" },
            ]}
            value={selectedOption}
            onChange={handleSelectChange}
          />
          {formErrors.branch && (
            <p className="text-red-500 text-xs mt-1">
              Branch selection is required
            </p>
          )}
          <div className="mt-2 flex items-center space-x-4 border p-2 border-gray-300 rounded-xl">
            <div className="flex items-center">
              <input
                type="radio"
                id="walk_in"
                name="option"
                value="walk_in"
                className="peer w-3 h-3 text-[#00414e] accent-[#00414e] focus:ring-0"
                checked={selectedRadio === "walk_in"}
                onChange={handleRadioChange}
                required
              />
              <label
                htmlFor="walk_in"
                className="ml-2 text-xs text-gray-400 cursor-pointer"
              >
                Walk In
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="radio"
                id="pick_up"
                name="option"
                value="pick_up"
                className="peer w-3 h-3 text-[#00414e] accent-[#00414e] focus:ring-0"
                checked={selectedRadio === "pick_up"}
                onChange={handleRadioChange}
                required
              />
              <label
                htmlFor="pick_up"
                className="ml-2 text-xs text-gray-400 cursor-pointer"
              >
                Pick Up
              </label>
            </div>
          </div>
          {formErrors.deliveryMethod && (
            <p className="text-red-500 text-xs mt-1">
              Delivery method is required
            </p>
          )}
        </div>
        <div className="relative overflow-x-auto border border-gray-300 rounded-xl mt-3 p-2 w-full ">
          <p>Added Garments: </p>
          <div className="w-full h-72">
            {cartProdcuts?.length > 0 || laundryCart?.length > 0 ? (
              <div className="pb-10">
                <LaundryCartComponent setSelectedTab={setSelectedTab} />
                {cartProdcuts?.length > 0 &&
                  cartProdcuts?.map((item) => {
                    return (
                      <div
                        key={item?._id}
                        className="border border-gray-300 p-2 rounded-lg capitalize mt-0.5 mb-2"
                      >
                        <div className="flex justify-between px-2 w-full gap-2">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1">
                              {item?.serviceAddons[0]?.name === "cleaning" ? (
                                " "
                              ) : (
                                <button
                                  onClick={() => {
                                    setCartPId(item?._id);
                                    setIsEditPopupOpen(true);
                                    setProductDetails(item?.productId);
                                  }}
                                  className="text-green-500"
                                >
                                  <MdModeEditOutline />
                                </button>
                              )}
                              <button
                                onClick={() => deleteCartProduct(item?._id)}
                                className="text-red-500 text-lg font-bold"
                              >
                                <RxCross2 />
                              </button>
                            </div>
                            {item?.productId?.name && (
                              <div className="font-semibold">
                                {item?.productId?.name}
                                {item?.garmentType[0]?.name
                                  ? ` [${item?.garmentType[0]?.name}]`
                                  : ""}{" "}
                                {item?.serviceAddons[0]?.name === "cleaning"
                                  ? ""
                                  : ` X ${item?.quantity || 1}`}
                              </div>
                            )}
                          </div>
                          {item?.garmentType[0]?.price &&
                            (item?.serviceAddons[0]?.name === "cleaning" ? (
                              <div className="font-semibold text-sm">
                                ₹{" "}
                                {item?.isPremium === true
                                  ? item?.productId?.premiumPrice?.B2C
                                  : item?.productId?.price?.B2C}
                              </div>
                            ) : (
                              <div className="font-semibold text-sm">
                                ₹
                                {( item?.isPremium === true ? item?.productId?.premiumPrice?.B2C:  item?.garmentType[0]?.price || 0) *
                                  (item?.quantity || 0)}
                                {/* Check if there are valid prices for requirements or addons */}
                                {item?.requirements?.some(
                                  (req) => req?.price
                                ) ||
                                item?.serviceAddons?.some(
                                  (addon) => addon?.price
                                ) ? (
                                  <>
                                    {item?.requirements?.length > 0 &&
                                      item?.requirements?.some(
                                        (req) => req?.price
                                      ) &&
                                      " + "}
                                    {item?.requirements?.map((req, index) =>
                                      req?.price ? (
                                        <span key={req?._id}>
                                          ₹
                                          {(req?.price || 0) *
                                            (item?.quantity || 0)}
                                          {index <
                                            item?.requirements?.length - 1 &&
                                            item?.requirements[index + 1]
                                              ?.price &&
                                            " + "}
                                        </span>
                                      ) : null
                                    )}

                                    {item?.serviceAddons?.length > 0 &&
                                      item?.serviceAddons?.some(
                                        (addon) => addon?.price
                                      ) &&
                                      " + "}
                                    {item?.serviceAddons?.map((addon, index) =>
                                      addon?.price ? (
                                        <span key={addon?._id}>
                                          ₹
                                          {(addon?.price || 0) *
                                            (item?.quantity || 0)}
                                          {index <
                                            item?.serviceAddons?.length - 1 &&
                                            item?.serviceAddons[index + 1]
                                              ?.price &&
                                            " + "}
                                        </span>
                                      ) : null
                                    )}

                                    {" = ₹"}
                                    {calculateTotalItemPrice(item)}
                                  </>
                                ) : null}
                              </div>
                            ))}
                        </div>
                        {item?.serviceAddons[0]?.name === "cleaning" ? (
                          <div className="text-[12px]">
                            <p>
                              {item?.isPremium === true ? "Premium" : "Regular"}
                            </p>
                            <p>Service: {item?.serviceName}</p>
                          </div>
                        ) : (
                          <div className="text-[12px]">
                            <div className="flex items-center gap-1">
                              <p className="font-medium">
                                {item?.isPremium === true
                                  ? "Premium"
                                  : "Regular"}{" "}
                                -
                              </p>
                              <p className="font-medium">
                                Service: {item?.serviceName}
                              </p>
                            </div>
                            {item?.requirements[0]?.name && (
                              <p>
                                Requirements: {item?.requirements[0]?.name} (₹{" "}
                                {item?.requirements[0]?.price || 0})
                              </p>
                            )}
                            {item?.serviceAddons?.length > 0 && (
                              <p>
                                Additional Services:{" "}
                                {item?.serviceAddons?.map((service, index) => (
                                  <span key={index}>
                                    {service?.name} (₹ {service?.price})
                                    {index < item?.serviceAddons?.length - 1 &&
                                      ", "}
                                  </span>
                                ))}
                              </p>
                            )}
                            {/* {item?.comments?.length > 0 && (
                            <p>Comments: {item.comments.join(", ")}</p>
                          )} */}
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            ) : (
              <p className="text-sm text-gray-600 flex items-center justify-center h-full">
                No garments added
              </p>
            )}
          </div>
        </div>
      </div>
      <hr />
      {isChecked && (
        <HomeDeliveryPopup
          isOpen={isHomeDeliveryPopupOpen}
          onAddressChange={onAddressChange}
          setIsOpen={setIsHomeDeliveryPopupOpen}
        />
      )}
      <div className="text-center mx-5 mt-4">
        {selectedCoupon ? (
          <div className="text-center text-sm mt-4">
            <div className="border border-gray-300 rounded-md py-1.5 px-2 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <p className="uppercase font-semibold text-[13px]">
                  {selectedCoupon.code} -
                </p>
                <p className="text-[12px] text-gray-600">
                  {selectedCoupon?.discountValue}% off
                </p>
              </div>
              <button
                onClick={removeCoupon}
                className="text-red-500 hover:text-red-700"
              >
                <MdDelete size={17} />
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center mt-4">
            {cartProdcuts?.length >= 1 ? (
              <button
                onClick={() => setIsDrawerOpen(true)}
                className="px-3 py-2 flex items-center justify-center gap-2 text-xs bg-gray-200 text-gray-600 rounded-lg w-full"
              >
                <RiDiscountPercentLine size={16} />
                <p>Add Coupon</p>
              </button>
            ) : (
              " "
            )}
          </div>
        )}
      </div>
      <div className="w-full px-5 mt-3 text-[13px] relative">
        <div className="text-gray-400">
          <div className="flex justify-between mt-1">
            <p>Total Count:</p>
            <span>
             { calculateTotalCount()}
            </span>
          </div>
          <div className="flex justify-between mt-1">
            <p>Gross Total:</p>
            <span>₹ {grossTotal ? grossTotal : 0}</span>
          </div>

          {calculateAddonsTotal() > 0 && (
            <div className="flex justify-between mt-1">
              <p>Addons Total:</p>
              <span>₹ {calculateTotalAmount().addonsTotal}</span>
            </div>
          )}

          {selectedCoupon && (
            <div className="flex justify-between mt-1">
              <p>Discount:</p>
              <span>- ₹ {calculateTotalAmount().discountAmount}</span>
            </div>
          )}

          {isExpressDelivery && (
            <div className="flex justify-between mt-1 pb-2">
              <p>Express Amount:</p>
              <span>₹ {calculateTotalAmount().expressCharge}</span>
            </div>
          )}
          <hr />
          <div className="flex justify-between mt-2 mb-3">
            <p className="font-medium text-gray-600">Total Amount:</p>
            <span className="font-medium text-gray-600">
              ₹ {calculateTotalAmount().totalAmount}
            </span>
          </div>
        </div>
        <div className="flex gap-1 text-[8px]">
          <div className="flex items-center border-[#eef0f2] rounded-md mt-1.5 space-x-4 border  px-2 w-full">
            <DatePicker
              size="middle"
              variant="borderless"
              className="border-none outline-none w-full text-black placeholder:text-gray-400"
              onChange={onChange}
              placeholder="Delivery Date"
              disabledDate={disabledDate}
            />
          </div>

          <div className="w-full mt-1.5">
            <Select
              showSearch
              size="middle"
              placeholder="Delivery Time "
              className="border w-full border-[#eef0f2]  rounded-md px-2"
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
          </div>
        </div>
        <div className="flex mx-2 justify-between gap-2 items-center">
          {formErrors.deliveryDate && (
            <p className="text-red-500 text-xs mt-1">
              Delivery date is required
            </p>
          )}
          {formErrors.deliveryTime && (
            <p className="text-red-500 text-xs mt-1">
              Delivery time is required
            </p>
          )}
        </div>
        <div className="flex  mt-3 mb-20 gap-3 w-full">
          <div className="flex flex-col  w-full gap-2">
            {customerAddress && (
              <div className="flex items-center justify-start gap-2">
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={isChecked}
                    onChange={(e) => setIsChecked(e.target.checked)}
                  />
                  <div className="relative w-11 h-5 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border after:rounded-full after:h-4 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                </label>
                <label
                  htmlFor="home_delivery"
                  className="ml-2 text-[14px] text-gray-400 cursor-pointer"
                >
                  Home Delivery
                </label>
              </div>
            )}
            {isChecked && (
              <div className="">
                {savedAddress ? (
                  <div className="flex gap-2 w-full">
                    <div className="w-full">
                      <Select
                        variant="borderless"
                        className="text-[10px] border w-full border-gray-300 rounded-lg"
                        defaultValue={
                          customerAddress && customerAddress[0]?.label
                            ? truncateString(
                                `${customerAddress[0]?.label} ${customerAddress[0]?.addressLine1}, ${customerAddress[0]?.city}`,
                                40
                              )
                            : "No Saved Address"
                        }
                        onChange={handleChangeForDeliveryAddress}
                        options={customerAddress?.map((address) => ({
                          value: `(${address?.label}) ${address?.addressLine1}, ${address?.city}`,
                          label: truncateString(
                            `(${address?.label}) ${address?.addressLine1}, ${address?.city}`,
                            40
                          ),
                        }))}
                      />
                    </div>
                    <div className="w-full">
                      <button
                        onClick={() => setIsHomeDeliveryPopupOpen(true)}
                        className="text-[10px] text-gray-600 flex items-center justify-center gap-2 bg-gray-200 px-4 py-2 rounded-md w-full"
                      >
                        <FaRegAddressCard size={16} />
                        <p>Add new Address</p>
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsHomeDeliveryPopupOpen(true)}
                    className="text-[10px] text-gray-600 flex items-center justify-center gap-2 bg-gray-200 w-40 py-2 mt-1 rounded-md"
                  >
                    <FaRegAddressCard size={16} />
                    <p>Add new Address</p>
                  </button>
                )}
              </div>
            )}

            {cartProdcuts?.length > 0 ? (
              <div className="flex gap-2 w-full items-center">
                <div className="flex gap-2">
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      onChange={(e) => setIsExpressDelivery(e.target.checked)}
                      checked={isExpressDelivery}
                    />
                    <div className="relative w-11 h-5 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:rounded-full after:h-4 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                  </label>
                  <label
                    htmlFor="express"
                    className="ml-2 text-[14px] text-gray-400 cursor-pointer"
                  >
                    Express Delivery
                  </label>
                </div>
                {isExpressDelivery && (
                  <div className=" border border-gray-300 rounded-lg">
                    <Select
                      bordered={false}
                      className="outline-none border-none focus:border-none focus:outline-none"
                      defaultValue={selectedExpressDeliveryRate}
                      onChange={handleChangeForExpressDelivery}
                      options={[
                        {
                          value: 25,
                          label: `25% (₹${(grossTotal * 0.25)?.toFixed(2)})`,
                        },
                        {
                          value: 50,
                          label: `50% (₹${(grossTotal * 0.5)?.toFixed(2)})`,
                        },
                        {
                          value: 75,
                          label: `75% (₹${(grossTotal * 0.75)?.toFixed(2)})`,
                        },
                        {
                          value: 100,
                          label: `100% (₹${grossTotal?.toFixed(2)})`,
                        },
                      ]}
                    />
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>
      </div>
      <div className="fixed w-[calc(100%-1000px)] bottom-0 border-t border-gray-300 bg-white py-2 flex items-center justify-center gap-3 px-2 ">
        <button
          onClick={() => createOrder()}
          disabled={isDisabled}
          className={`px-5 flex items-center justify-center gap-2 py-2.5 text-xs w-full text-gray-200 rounded-lg ${
            isDisabled ? "bg-[#00414e]/50 cursor-not-allowed" : "bg-[#00414e]"
          }`}
        >
          <FaCheck />
          <p>{isSubmitting ? "Processing..." : "Create Order"}</p>
        </button>
        <button
          onClick={() => deleteAllCartItems()}
          className="px-5 flex items-center justify-center gap-2 py-2.5  bg-red-500/90 text-xs w-full text-gray-200 rounded-lg"
        >
          <MdDelete />
          <p>{isDeleting ? "Cancelling..." : "Cancel Order"}</p>
        </button>
      </div>
      <CouponPopup
        isOpen={isDrawerOpen}
        setIsOpen={setIsDrawerOpen}
        onCouponSelect={handleCouponSelect}
      />
      <EditConfirmedOrderPopup
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        order={selectedOrder}
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
