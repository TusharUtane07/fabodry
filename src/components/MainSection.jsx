import { useState, useEffect } from "react";
import Laundry from "../tabsDetails/LaundryTab";
import DryCleaning from "../tabsDetails/DryCleaning";
import Ironing from "../tabsDetails/IroningTab";
import Starching from "../tabsDetails/StarchingTab";
import Cleaning from "../tabsDetails/Cleaning";
import BillingSection from "./BillingSection";
import { Switch } from "antd";
import useFetch from "../hooks/useFetch";
import debounce from "lodash.debounce";
import { useCart } from "../context/CartContenxt";
import axios from "axios";
import toast from "react-hot-toast";
import indiaflagimg from "../assets/flag.svg";
import { number } from "prop-types";
const MainSection = ({ products }) => {
  const [selectedTab, setSelectedTab] = useState("Laundry");
  const [mode, setMode] = useState("B2C");
  const [customerAddress, setCustomerAddress] = useState(null);
  const { cartItems, cartProdcuts, laundryCart, refreshCart } = useCart();
  const [hiddenElement, setHiddenElement] = useState(false);
  const [errormessage, setErrorMessage] = useState(false);
  const [isInputDisabled, setIsInputDisabled] = useState(false);
  const [customerNewOld, setCustomerNewOld] = useState("New Customer");
  const [debouncedUserName, setDebouncedUserName] = useState("");
  const [userName, setUserName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [CustomerStatus, setCustomerStatus] = useState(false);

  useEffect(() => {
    const handleStorageChange = () => {
      const storedMobile = localStorage.getItem("mobileNumber");
      const storedName = localStorage.getItem("userName");
      if (!storedMobile && !storedName) {
        setUserName("");
        setMobileNumber("");
        setCustomerAddress(null);
        setCustomerNewOld("New Customer");
        setIsInputDisabled(false);
        setCustomerStatus(false);
        refreshCart();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    handleStorageChange();

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [cartProdcuts, laundryCart]);

  const { data } = useFetch(
    mobileNumber
      ? `${
          import.meta.env.VITE_BACKEND_URL
        }api/v1/customers/search?mobile=${mobileNumber}`
      : null,
    {},
    [mobileNumber]
  );

  // useEffect(() => {
  //   if (data?.data?.customer?.name && mobileNumber.length === 10) {
  //     localStorage.setItem("userId", data?.data?.customer?._id);
  //     refreshCart();
  //     setUserName(data?.data?.customer?.name);
  //     setIsInputDisabled(true);
  //     setCustomerAddress(data?.data?.customer?.addresses);
  //     // if (customerNewOld !== "Old Customer" && mobileNumber.length === 10) {
  //     //   setCustomerNewOld("Old Customer");
  //     //   toast("Old Customer", {
  //     //     style: {
  //     //       background: "green",
  //     //       color: "white",
  //     //     },
  //     //   });
  //     // }
  //   //  else if (customerNewOld === "Old Customer" && mobileNumber.length === 10) {
  //   //     setCustomerNewOld("Old Customer");
  //   //     toast("Old Customer", {
  //   //       style: {
  //   //         background: "green",
  //   //         color: "white",
  //   //       },
  //   //     });
  //   //   }
  //   // else if (mobileNumber) {
  //     // }
  //     createCustomer();
  //   } else{
  //     createCustomer();

  //       setIsInputDisabled(false);
  //       setUserName("");
  //   }
  // }, [data, mobileNumber, debouncedUserName]);
  useEffect(() => {
    const debounced = debounce(() => {
      setDebouncedUserName(userName);
    }, 2000);

    debounced();
    return () => debounced.cancel();
  }, [userName]);

  useEffect(() => {
    if (mobileNumber && userName) {
      localStorage.setItem("mobileNumber", mobileNumber);
      localStorage.setItem("userName", userName);
    }
  }, [mobileNumber, userName]);

  useEffect(() => {
    if (mobileNumber.trim() === "") {
      setUserName("");
      setCustomerAddress(null);
      // setCustomerNewOld("New Customer");
      localStorage.removeItem("mobileNumber");
      localStorage.removeItem("userName");
      localStorage.removeItem("userId");
      refreshCart();
    } else {
      refreshCart();
    }
  }, [mobileNumber]);

  function filterProductsByServiceName(products, serviceName) {
    return products?.filter(
      (product) =>
        product.serviceName.toLowerCase() === serviceName.toLowerCase()
    );
  }

  const filteredLaundryProducts = filterProductsByServiceName(
    products?.data,
    "laundry"
  );
  const filteredStarchingProducts = filterProductsByServiceName(
    products?.data,
    "starching"
  );
  const filteredIroningProducts = filterProductsByServiceName(
    products?.data,
    "Ironing"
  );
  const filteredDcProducts = filterProductsByServiceName(products?.data, "dc");
  const filteredCleaningProducts = filterProductsByServiceName(
    products?.data,
    "dc"
  );

  const componentsMap = {
    Laundry: (
      <Laundry
        mode={mode}
        filteredLaundryProducts={filteredLaundryProducts}
        hiddenElement={hiddenElement}
        setHiddenElement={setHiddenElement}
      />
    ),
    "Dry Cleaning": (
      <DryCleaning mode={mode} filteredDcProducts={filteredDcProducts} />
    ),
    Ironing: (
      <Ironing mode={mode} filteredIroningProducts={filteredIroningProducts} />
    ),
    Starching: (
      <Starching
        mode={mode}
        filteredStarchingProducts={filteredStarchingProducts}
      />
    ),
    Cleaning: (
      <Cleaning
        mode={mode}
        filteredCleaningProducts={filteredCleaningProducts}
      />
    ),
  };

  const onChange = (checked) => {
    setMode(checked ? "B2C" : "B2B");
    toast.success(`${mode === "B2C" ? "B2B" : "B2C"} Mode Selected`);
  };

  const fetchAddress = async () => {
    const responseSearching = await axios.get(
      `${
        import.meta.env.VITE_BACKEND_URL
      }api/v1/customers/search?mobile=${mobileNumber}`
    );
  setCustomerAddress(responseSearching?.data?.data?.customer?.addresses);
  };

  useEffect(() => {
    // Check if mobileNumber has more than 5 digits
    if (mobileNumber.length > 5) {
      fetchAddress();
      const debouncedSave = debounce(() => {
        // Set errorMessage based on mobileNumber length
        setErrorMessage(mobileNumber.length !== 10);
      }, 200);

      debouncedSave();

      // Cleanup function for the debounce
      return () => debouncedSave.cancel();
    } else {
      // Reset errorMessage if mobileNumber length is less than or equal to 5
      setErrorMessage(false);
    }
  }, [mobileNumber]);


  const handleMobileChange = async (e) => {
    const number = e.target.value;
    setMobileNumber(number);
    if (number.length === 10) {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_BACKEND_URL
          }api/v1/customers/search?mobile=${number}`
        );

        const customer = response?.data?.data?.customer;
        if (response?.data?.data?.message === "Customer found") {
          // Customer exists
          toast.success("Old Customer", {
            style: { background: "green", color: "white" },
          });
          setUserName(customer.name);
          setCustomerNewOld("Old Customer");
          // setIsInputDisabled(true);
          // setCustomerStatus("Old Customer");

          // Save details in localStorage
          // alert(customer.name)
          localStorage.setItem("userId", customer._id);
          localStorage.setItem("userName", customer.name);
          localStorage.setItem("mobileNumber", number);
          setCustomerStatus(false);
          refreshCart();
        } else {
          // Customer doesn't exist
          toast.success("New Customer", {
            style: { background: "blue", color: "white" },
          });
          setUserName("");
          setIsInputDisabled(false);
          setCustomerStatus(true);
          setCustomerNewOld("New Customer");
        }
      } catch (error) {
        console.error("Error fetching customer:", error);
        toast.error("Error fetching customer data", {
          style: { background: "orange", color: "white" },
        });
      }
    } else {
      // setCustomerStatus("");
      setUserName("");
      setIsInputDisabled(true);
      setCustomerNewOld("New Customer");
    }
  };

  const handleCreateCustomer = async () => {
    if (mobileNumber.length === 10 && userName) {
      try {
        const token = localStorage.getItem("authToken");
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}api/v1/admin/customers/create`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ name: userName, mobile: mobileNumber }),
          }
        );

        if (response.ok) {
          toast.success("New Customer created", {
            style: { background: "green", color: "white" },
          });
          setCustomerStatus(false);
          // Fetch the newly created customer details
          const customerResponse = await axios.get(
            `${
              import.meta.env.VITE_BACKEND_URL
            }api/v1/customers/search?mobile=${mobileNumber}`
          );
          const customer = customerResponse?.data?.data?.customer;

          setUserName(customer.name);
          setIsInputDisabled(true);
          // setCustomerStatus("Old Customer");

          // Save details in localStorage
          localStorage.setItem("userId", customer._id);
          localStorage.setItem("userName", customer.name);
          localStorage.setItem("mobileNumber", mobileNumber);

          refreshCart(); // Refresh the cart for the new customer
        } else {
          console.error("Error creating new customer", await response.json());
        }
      } catch (error) {
        console.error("Error creating customer:", error);
        toast.error("Error creating customer", {
          style: { background: "red", color: "white" },
        });
      }
    } else {
      toast.warn("Enter valid details to create a new customer");
    }
  };
  return (
    <div className="flex ml-[240px] pt-8 h-screen gap-10 text-[#00414e] relative">
      <div className="flex-1 lg:w-[580px] xl:w-[700px]">
        <div
          className={`border-2 border-[#eef0f2] rounded-xl mx-5 my-2 w-full mt-8 ${
            hiddenElement ? "hidden" : ""
          }`}
        >
          <div className="p-5">
            <div className="w-full flex justify-between">
              <div
                className={`flex justify-between items-center  gap-3 w-40 py-1 px-2 text-xs rounded-lg ${
                  mode === "B2B"
                    ? "bg-[#66BDC5] text-white"
                    : "bg-[#00414E] text-gray-200"
                }`}
              >
                <span>B2B</span>
                <Switch defaultChecked onChange={onChange} />
                <span>B2C</span>
              </div>
              <h3 className="text-[10px] text-gray-600 text-center">
                Current Mode: <span className="text-[#00414e]">{mode}</span>
              </h3>
            </div>
            <div className="flex gap-4 items-center">
              <div
                className="w-full"
                style={{
                  position: "relative",
                }}
              >
                <label className="block mb-2 text-xs font-medium mt-3">
                  New Walk In
                </label>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                  className="border border-gray-300 text-xs rounded-md  block w-full p-2 h-10 active:outline-none focus:outline-none"
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                    }}
                  >
                    <img
                      src={indiaflagimg}
                      alt=""
                      style={{
                        width: "20px",
                      }}
                    />
                    <span>+91</span>
                  </div>
                  <input
                    type="text"
                    style={{
                      width: "100%",
                      outline: "none",
                    }}
                    placeholder="Enter Mobile Number"
                    value={mobileNumber}
                    onChange={handleMobileChange}
                    autoComplete="new-password" // Prevents browsers from showing saved info
                    name="mobileNumber" // Use a unique name to avoid autofill
                  />
                </div>
                {errormessage && (
                  <span
                    style={{
                      fontSize: "10px",
                      position: "absolute",
                      left: "1%",
                      // bottom:'1%'
                      paddingTop: "2px",
                    }}
                  >
                    Number must me 10 digit
                  </span>
                )}
              </div>

              <div className="w-full mt-3">
                <p
                  className={`text-[10px] p-1 rounded-bl-3xl rounded-tr-3xl py-1.5 px-4 mb-[-1px] items-end justify-self-end ${
                    mode === "B2B"
                      ? "bg-[#66BDC5] text-gray-100"
                      : "bg-[#00414E] text-gray-200"
                  } ${
                    customerNewOld === "Old Customer"
                      ? "bg-[#00414E]"
                      : "bg-blue-100 text-gray-800"
                  }`}
                >
                  {customerNewOld}
                </p>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <input
                    type="text"
                    className="border border-gray-300 text-xs rounded-md block w-full p-2 h-10"
                    placeholder="Enter New User"
                    value={userName}
                    disabled={isInputDisabled}
                    onChange={(e) => setUserName(e.target.value)}
                  />
                  {CustomerStatus && mobileNumber.length === 10 && (
                    <div
                      className="btn"
                      style={{
                        padding: "5px 7px",
                        borderRadius: "5px",
                        color: "white",
                        backgroundColor: isInputDisabled
                          ? "skyblue"
                          : "#00414E",
                        cursor: isInputDisabled ? "not-allowed" : "pointer",
                      }}
                      onClick={handleCreateCustomer}
                    >
                      Add
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className={`border-2 border-[#eef0f2] rounded-xl mx-5 w-full ${
            hiddenElement ? "mt-8" : ""
          }`}
        >
          <div className="flex px-4 py-1 pt-1.5 justify-between items-center gap-4 text-xs">
            {[
              "Laundry",
              "Dry Cleaning",
              "Ironing",
              "Starching",
              "Cleaning",
            ].map((tab) => (
              <button
                key={tab}
                className={`lg:px-3.5 xl:px-5 py-3 w-full rounded-lg ${
                  selectedTab === tab
                    ? mode === "B2B"
                      ? "bg-[#66BDC5] text-white"
                      : "bg-[#004D57] text-white"
                    : mode === "B2C"
                    ? "bg-blue-100 text-gray-600"
                    : "bg-[#d5e7ec] text-[#00414e]"
                }`}
                onClick={() => {
                  setSelectedTab(tab);
                  setHiddenElement(false);
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="p-3">{componentsMap[selectedTab]}</div>
        </div>
      </div>

      <BillingSection
        data={data}
        customerAddress={customerAddress}
        cartItems={cartItems}
        mode={mode}
        setSelectedTab={setSelectedTab}
        mobileNumber={mobileNumber}
        onAddressChange={fetchAddress}
      />
    </div>
  );
};

export default MainSection;
