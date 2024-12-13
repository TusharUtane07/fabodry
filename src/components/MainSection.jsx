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

const MainSection = ({ products }) => {
  const [selectedTab, setSelectedTab] = useState("Laundry");
  const [mode, setMode] = useState("B2C");
  const [mobileNumber, setMobileNumber] = useState(
    localStorage.getItem("mobileNumber") || ""
  );
  const [userName, setUserName] = useState(
    localStorage.getItem("userName") || ""
  );
  const [customerAddress, setCustomerAddress] = useState(null);
  const [debouncedUserName, setDebouncedUserName] = useState("");
  const { cartItems, refreshCart } = useCart();
  const [customerNewOld, setCustomerNewOld] = useState("New Customer")

  const { data } = useFetch(
    mobileNumber
      ? `https://api.fabodry.in/api/v1/customers/search?mobile=${mobileNumber}`
      : null,
    {},
    [mobileNumber]
  );

  useEffect(() => {
    if (data?.data?.customer?.name) {
      localStorage.setItem("userId", data?.data?.customer?._id);
      refreshCart();
      setUserName(data?.data?.customer?.name);
      setCustomerAddress(data?.data?.customer?.addresses);
      if(data?.data?.customer?.addresses.length >= 1){
        setCustomerNewOld("Old Customer")
      }else{
        setCustomerNewOld("New Customer")
      }
    } else if (mobileNumber) {
      setUserName("");
    }
    createCustomer();
  }, [data, mobileNumber, debouncedUserName, customerNewOld]);

  useEffect(() => {
    const debounced = debounce(() => {
      setDebouncedUserName(userName);
    }, 2000);

    debounced();
    return () => debounced.cancel();
  }, [userName]);

  useEffect(() => {
    localStorage.setItem("mobileNumber", mobileNumber);
    localStorage.setItem("userName", userName);
  }, [mobileNumber, userName]);

  useEffect(() => {
    if (mobileNumber) {
      createCustomer();
      refreshCart();
    }
  }, []);

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
    "cleaning"
  );

  const componentsMap = {
    Laundry: (
      <Laundry mode={mode} filteredLaundryProducts={filteredLaundryProducts} />
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
  };

  const createCustomer = async () => {
    if (
      data?.data?.message === "Customer found" &&
      mobileNumber?.length === 10
    ) {
      return;
    } else if (mobileNumber.length === 10 && debouncedUserName) {
      try {
        const token = localStorage.getItem("authToken");
        const response = await fetch(
          "https://api.fabodry.in/api/v1/admin/customers/create",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: debouncedUserName,
              mobile: mobileNumber,
            }),
          }
        );
        refreshCart();
        const responseSearching = await axios.get(
          `https://api.fabodry.in/api/v1/customers/search?mobile=${mobileNumber}`
        );
        setUserName(data?.data?.customer?.name)
        if(data.data.data.customer.addresses.length >= 1){
          setCustomerNewOld("Old Customer")
        }

        if (response.ok) {
          console.log("New user created successfully");
        } else {
          console.error("Error creating new customer", await response.json());
        }
      } catch (error) {
        console.error("Network error while creating customer", error);
      }
    }
  };

  return (
    <div className="flex ml-[240px] mt-12 gap-10 h-screen text-[#00414e]">
      <div className="flex-1 lg:w-[580px] xl:w-[800px]">
        <div className="border-2 border-[#eef0f2] rounded-xl m-5 w-full mt-8">
          <div className="p-5">
            <div className="w-full flex justify-between ">
              <div className={`flex justify-between items-center gap-3 w-40 py-1 px-2 text-xs rounded-lg ${mode === "B2B"? "bg-[#66BDC5] text-white" :  "bg-[#00414E] text-gray-200"}`}>
                <span>B2B</span>
                <Switch defaultChecked onChange={onChange} />
                <span>B2C</span>
              </div>
              <h3 className="text-[10px] text-gray-600 text-center">
                Current Mode: <span className="text-[#00414e]">{mode}</span>
              </h3>
            </div>
            <div className="flex gap-4 items-center">

              <div className="w-full">

            <label className="block mb-2 text-xs font-medium mt-3">
              New Walk In
            </label>
              <input
                type="text"
                className="border border-gray-300 text-xs rounded-md  block w-full p-2 h-10 active:outline-none focus:outline-none"
                placeholder="Enter Mobile Number"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                />
                </div>
              
              <div className="w-full mt-3">
              <p className={`text-[10px] p-1 rounded-bl-3xl rounded-tr-3xl py-1.5 px-4 mb-[-1px] items-end justify-self-end  ${mode === "B2B"? "bg-[#66BDC5] text-white" :  "bg-[#00414E] text-gray-200"}`}>{customerNewOld}</p>

              <input
                type="text"
                className="border border-gray-300 text-xs rounded-md block w-full p-2 h-10"
                placeholder="Enter New User"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                />

                </div>
            </div>
          </div>
        </div>
        <div className="border-2 border-[#eef0f2] rounded-xl mx-5 w-full my-4">
          <div className="flex p-5 justify-between items-center gap-6 text-xs">
            {[
              "Laundry",
              "Dry Cleaning",
              "Ironing",
              "Starching",
              "Cleaning",
            ].map((tab) => (
              <button
                key={tab}
                className={`lg:px-3.5 xl:px-6 py-3 rounded-lg ${
                  selectedTab === tab
                    ? mode === "B2B"
                      ? "bg-[#66BDC5] text-white"
                      : "bg-[#004D57] text-white"
                    : mode === "B2C"
                    ? "bg-blue-100 text-gray-600" // Inactive button in B2C
                    : "bg-[#d5e7ec] text-[#00414e]" // Inactive button in B2B
                }`}
                onClick={() => setSelectedTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="p-5">{componentsMap[selectedTab]}</div>
        </div>
      </div>
      <BillingSection
        data={data}
        customerAddress={customerAddress}
        cartItems={cartItems}
      />
    </div>
  );
};

export default MainSection;
