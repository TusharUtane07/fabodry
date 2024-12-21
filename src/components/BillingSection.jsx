import { useEffect, useState } from "react";
import HomeDeliveryPopup from "./HomeDeliveryPopup";
import { Space, DatePicker, Select } from "antd";
import { MdDelete, MdEdit } from "react-icons/md";
import CouponPopup from "./CouponPopup";
import dayjs from "dayjs";
import { useCart } from "../context/CartContenxt";
import axios from "axios";
import OrderEditPopup from "./OrderEditPopup";
import { useNavigate } from "react-router-dom";
import { FaCheck, FaRegAddressCard } from "react-icons/fa";
import { RiDiscountPercentLine } from "react-icons/ri";
import toast from "react-hot-toast";
import EditConfirmedOrderPopup from "./EditConfirmedOrderPopup";
import { useSelectedAddons } from "../context/AddonContext";

const BillingSection = ({ customerAddress, mode, onAddressChange }) => {
  const [isChecked, setIsChecked] = useState(false);
  const [isHomeDeliveryPopupOpen, setIsHomeDeliveryPopupOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [savedAddress, setSavedAddress] = useState(true);
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [productDetails, setProductDetails] = useState(null);
  const [cartPId, setCartPId] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isExpressDelivery, setIsExpressDelivery] = useState(false);
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

  const { cartItems, refreshCart } = useCart();

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
    return cartItems?.reduce((total, item) => {
      if (item.productId[0]?.serviceName?.toLowerCase() === "laundry") {
        let addonCost = 0;
        if (selectedAddons.antiviralCleaning) {
          addonCost += 5 * item.quantity;
        }
        if (selectedAddons.fabricSoftener) {
          addonCost += 5 * item.quantity;
        }
        return total + addonCost;
      }
      return total;
    }, 0);
  };

  const calculateGrossTotal = () => {
    const itemsTotal = cartItems?.reduce(
      (total, item) => total + item?.productId[0]?.price * item.quantity,
      0
    );
    
    return mode === "B2B" ? itemsTotal *2 : itemsTotal;
  };

  const grossTotal = calculateGrossTotal();

  const handleChangeForExpressDelivery = (value) => {
    setSelectedExpressDeliveryRate(value);
    const expressChargeValue = (grossTotal * value) / 100;
    setExpressDeliveryValue(expressChargeValue);
    calculateTotalAmount();
  };

  const calculateTotalAmount = () => {
    const itemsTotal = cartItems?.reduce(
      (total, item) => total + item?.productId[0]?.price * item.quantity,
      0
    );
    const addonsTotal = mode === "B2B" ?  calculateAddonsTotal()*2 : calculateAddonsTotal();
    const grossTotal =  mode === "B2B" ? itemsTotal *2 : itemsTotal;

    const discountAmount = selectedCoupon
      ? (grossTotal * selectedCoupon.discountValue) / 100
      : 0;
    const expressCharge = isExpressDelivery
      ? (grossTotal * selectedExpressDeliveryRate) / 100
      : 0;

    const totalAmount =
      grossTotal - discountAmount + expressCharge + addonsTotal;

    return {
      grossTotal: grossTotal?.toFixed(2),
      discountAmount: discountAmount?.toFixed(2),
      expressCharge: expressCharge?.toFixed(2),
      totalAmount: totalAmount?.toFixed(2),
      addonsTotal: addonsTotal?.toFixed(2),
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

  const navigate = useNavigate();
  const createOrder = async () => {
    if (!validateForm()) {
      return;
    }
    if(cartItems?.length === 0 || !cartItems){
      toast.error("Add items for creating order");
      return;
    }

    const { discountAmount, expressCharge, totalAmount } =
      calculateTotalAmount();

    const productName = [];
    const serviceName = [];
    cartItems?.map((item) => productName.push(item?.productId[0]?.name));
    cartItems?.map((item) => serviceName.push(item?.serviceId));

    const token = localStorage.getItem("authToken");
    const userName = localStorage.getItem("userName");
    const mobileNumber = localStorage.getItem("mobileNumber");
    setIsSubmitting(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}api/v1/admin/orders/create`,
        {
          productIds: productName,
          serviceIds: serviceName,
          branchName: selectedOption,
          totalCount: cartItems?.length,
          totalAmount:
            mode === "B2B" ? Number(totalAmount) * 2 : Number(totalAmount),
          discountAmount: Number(discountAmount),
          expressCharge: Number(expressCharge),
          customerName: userName,
          address: selectedAddress,
          customerNumber: mobileNumber,
          deliveryDate: selectedDate,
          deliveryTimeSlot: selectedLabel,
          orderStatus: "pending",
          orderType: mode,
          deliveryMethod: selectedRadio,
          paymentMethod: "CARD",
          paymentStatus: "unpaid",
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
  const isDisabled =
    isSubmitting || Object.values(formErrors).some((error) => error);
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
          <div className="w-[421px] h-72 pb-8">
            {cartItems?.length > 0 ? (
              <div className="">
                {cartItems
                  .reduce((acc, product) => {
                    const serviceName =
                      product.productId[0]?.serviceName?.toLowerCase();
                    const serviceId = product?.serviceId;

                    if (serviceName === "laundry") {
                      const existingLaundry = acc.find(
                        (item) =>
                          item.productId[0]?.serviceName?.toLowerCase() ===
                            "laundry" && item?.serviceId === serviceId
                      );

                      if (existingLaundry) {
                        existingLaundry.quantity += product.quantity;
                      } else {
                        acc.push({ ...product });
                      }
                    } else {
                      acc.push(product);
                    }
                    return acc;
                  }, [])
                  .map((product, index) => (
                    <div
                      key={index}
                      className="border border-gray-300 my-1.5 p-1 rounded-md"
                    >
                      <div className="flex gap-2 items-start mx-1">
                        <div className="flex gap-2 items-center">
                          {product.additionalServices[0]?.toLowerCase() === "cleaning" ? (
                            " "
                          ) : (
                            <button
                              onClick={() => {
                                setIsEditPopupOpen(true);
                                setCartPId(product?._id);
                                setProductDetails({
                                  productId: product.productId[0]?._id,
                                  selectedItem:
                                    product?.productId[0]?.serviceName,
                                  serviceName:
                                    product?.productId[0]?.serviceName,
                                  productName: product.productId[0]?.name,
                                  quantity: product.quantity,
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
                        <div className="text-[14px] flex items-center justify-between w-full">
                          <p className="capitalize">
                            {product.productId[0]?.serviceName?.toLowerCase() ===
                            "laundry"
                              ? product?.serviceId
                              : product?.productId[0]?.name}
                            {!product?.garmentType ||
                            ["kitchen", "toilet", "car", "sofa"].includes(
                              product?.serviceId
                            )
                              ? null
                              : ` [${product?.garmentType}]`}
                          </p>

                          <p>
                            {product?.quantity}
                            {product?.productId[0]?.serviceName?.toLowerCase() ===
                            "laundry"
                              ? "/Kg"
                              : ""}{" "}
                            X{" "}
                            {mode === "B2B"
                              ? product?.productId[0]?.price * 2
                              : product?.productId[0]?.price}{" "}
                            = ₹
                            {mode === "B2B"
                              ? product?.productId[0]?.price *
                                product.quantity *
                                2
                              : product?.productId[0]?.price * product.quantity}
                          </p>
                        </div>
                      </div>
                      <p className="text-xs">
                        {product?.productId[0]?.serviceName?.toLowerCase() ===
                        "laundry" ? (
                          <>
                            {selectedAddons.antiviralCleaning && (
                              <>
                                [ Antiviral Cleaning + ₹{5 * product.quantity} ]
                              </>
                            )}
                            {selectedAddons.fabricSoftener && (
                              <>
                                [{selectedAddons.antiviralCleaning && " "}Fabric
                                Softener + ₹{5 * product.quantity}]
                              </>
                            )}
                          </>
                        ) : (
                          " "
                        )}
                      </p>

                      <div>
                        {product.productId[0]?.serviceName?.toLowerCase() ===
                        "laundry" ? null : (
                          <p className="text-[12px] text-gray-500 ">
                            Service:{" "}
                            <span className="uppercase">
                              {product?.productId[0]?.serviceName}
                            </span>
                          </p>
                        )}
                        {product.comments.length > 1 ? (
                          <p className="text-[12px] text-gray-500">
                            Comments: {`[ ${product.comments.join(", ")} ]`}
                          </p>
                        ) : (
                          " "
                        )}
                      </div>
                    </div>
                  ))}
                <p className="py-1"></p>
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
            {cartItems?.length >= 1 ? (
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
      <div className="w-full px-5 mt-3 text-[13px]">
        <div className="text-gray-400">
          <div className="flex justify-between mt-1">
            <p>Total Count:</p>
            <span>
              {!cartItems || cartItems.length === 0 ? "0" : cartItems.length}
            </span>
          </div>
          <div className="flex justify-between mt-1">
            <p>Gross Total:</p>
            <span>₹ {grossTotal ? grossTotal?.toFixed(2) : 0}</span>
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
        {customerAddress && (
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
              className="ml-2 text-[14px] text-gray-400 cursor-pointer"
            >
              Home Delivery
            </label>
          </div>
        )}
        {isChecked && (
          <div>
            {savedAddress ? (
              <div className="w-full">
                <Select
                  variant="borderless"
                  className="w-full text-[10px] border border-gray-300 rounded-lg"
                  defaultValue={
                    savedAddress ? `Select address` : "No Saved Address"
                  }
                  onChange={handleChangeForDeliveryAddress}
                  options={customerAddress?.map((address) => ({
                    value: `(${address?.label}) ${address?.addressLine1}, ${address?.city}`,
                    label: `(${address?.label}) ${address?.addressLine1}, ${address?.city}`,
                  }))}
                />

                <div className="">
                  <button
                    onClick={() => setIsHomeDeliveryPopupOpen(true)}
                    className="text-[10px] text-gray-600 flex items-center justify-center gap-2 bg-gray-200 w-full py-2 mt-1.5 rounded-md"
                  >
                    <FaRegAddressCard size={16} />
                    <p>Add new Address</p>
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setIsHomeDeliveryPopupOpen(true)}
                className="text-[10px] text-gray-600 flex items-center justify-center gap-2 bg-gray-200 w-full py-2 mt-1.5 rounded-md"
              >
                <FaRegAddressCard size={16} />
                <p>Add new Address</p>
              </button>
            )}
          </div>
        )}

        {cartItems?.length > 0 ? (
          <div className="flex items-center justify-start gap-2 mt-3 pb-32">
            <>
              {" "}
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
                htmlFor="express"
                className="ml-2 text-[14px] text-gray-400 cursor-pointer"
              >
                Express Delivery
              </label>
            </>
            {isExpressDelivery ? (
              <div className="border border-gray-300 rounded-lg ">
                <Select
                  bordered={false}
                  className="outline-none border-none focus:border-none focus:outline-none"
                  defaultValue={selectedExpressDeliveryRate}
                  style={{ width: 170, outline: "none", border: "none" }}
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
            ) : null}
          </div>
        ) : (
          ""
        )}
        <div className=" fixed bottom-2 w-[400px] py-2 flex items-center gap-2 ">
          <button
            onClick={() => createOrder()}
            disabled={isDisabled}
            className={`px-5 flex items-center justify-center gap-2 w-full py-2.5 text-xs text-gray-200 rounded-lg ${
              isDisabled ? "bg-[#00414e]/50 cursor-not-allowed" : "bg-[#00414e]"
            }`}
          >
            <FaCheck />
            <p>{isSubmitting ? "Processing..." : "Create Order"}</p>
          </button>
          <button
            onClick={() => deleteAllCartItems()}
            className="px-5 flex items-center justify-center gap-2 py-2.5 w-full bg-red-500/90 text-xs text-gray-200 rounded-lg"
          >
            <MdDelete />
            <p>{isDeleting ? "Cancelling..." : "Cancel Order"}</p>
          </button>
        </div>
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
