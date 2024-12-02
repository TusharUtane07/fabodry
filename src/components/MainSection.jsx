import { useState, useEffect } from "react";
import Laundry from "../tabsDetails/LaundryTab";
import DryCleaning from "../tabsDetails/DryCleaning";
import Ironing from "../tabsDetails/IroningTab";
import Starching from "../tabsDetails/StarchingTab";
import Cleaning from "../tabsDetails/Cleaning";
import BillingSection from "./BillingSection";
import { Switch } from "antd";
import useFetch from "../hooks/useFetch";

const MainSection = () => {
  const [selectedTab, setSelectedTab] = useState("Laundry");
  const [mode, setMode] = useState("B2B");
  const [mobileNumber, setMobileNumber] = useState("");
  const [userName, setUserName] = useState("");

  // Fetch customer data based on mobileNumber
  const { data } = useFetch(
    mobileNumber ? `http://localhost:8888/api/v1/customers/search?mobile=${mobileNumber}` : null,
    {},
    [mobileNumber]
  );

  useEffect(() => {
    if (data?.data?.customer?.name) {
      setUserName(data.data.customer.name); // Update the username if a customer name is found
    } else if (mobileNumber) {
      setUserName(""); // Clear the username if no customer name is found
    }
  }, [data, mobileNumber]);

  const componentsMap = {
    Laundry: <Laundry mode={mode} />,
    "Dry Cleaning": <DryCleaning mode={mode} />,
    Ironing: <Ironing mode={mode} />,
    Starching: <Starching mode={mode} />,
    Cleaning: <Cleaning mode={mode} />,
  };

  const onChange = (checked) => {
    setMode(checked ? "B2B" : "B2C");
  };

  return (
    <div className="flex ml-[240px] gap-10 text-[#00414e]">
      <div className="flex-1 lg:w-[580px] xl:w-[800px]">
        <div className="border-2 border-[#eef0f2] rounded-xl m-5 w-full mt-8">
          <div className="p-5">
            <div className="w-full flex justify-between ">
              <div className="flex justify-between gap-3 w-40 bg-[#00414E] text-gray-200 p-2 rounded-lg">
                <span>B2C</span>
                <Switch defaultChecked onChange={onChange} />
                <span>B2B</span>
              </div>
              <h3 className="text-sm text-center">
                Current Mode: <span className="text-[#00414e]">{mode}</span>
              </h3>
            </div>
            <label className="block mb-2 text-sm font-medium mt-3">
              New Walk In
            </label>
            <div className="flex gap-4">
              <input
                type="text"
                className="border border-gray-300 text-sm rounded-lg block w-full p-2.5 active:outline-none focus:outline-none"
                placeholder="Enter Mobile Number"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
              />
              <input
                type="text"
                className="border border-gray-300 text-sm rounded-lg block w-full p-2.5"
                placeholder="Enter New User"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="border-2 border-[#eef0f2] rounded-xl mx-5 w-full my-4">
          <div className="flex p-5 justify-between items-center gap-2 text-sm">
            {[
              "Laundry",
              "Dry Cleaning",
              "Ironing",
              "Starching",
              "Cleaning",
            ].map((tab) => (
              <button
                key={tab}
                className={`lg:px-4 xl:px-8 py-4 rounded-lg ${
                  selectedTab === tab
                    ? mode === "B2B"
                      ? "bg-[#004D57] text-white"
                      : "bg-blue-600 text-white"
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
      <BillingSection />
    </div>
  );
};

export default MainSection;
