import { useState } from "react";
import Laundry from "../tabsDetails/LaundryTab";
import DryCleaning from "../tabsDetails/DryCleaning";
import Ironing from "../tabsDetails/IroningTab";
import Starching from "../tabsDetails/StarchingTab";
import Cleaning from "../tabsDetails/Cleaning";
import BillingSection from "./BillingSection";

const MainSection = () => {
  const [selectedTab, setSelectedTab] = useState("Laundry");

  const componentsMap = {
    Laundry: <Laundry />,
    "Dry Cleaning": <DryCleaning />,
    Ironing: <Ironing />,
    Starching: <Starching />,
    Cleaning: <Cleaning />,
  };

  return (
    <div className=" flex  w-full gap-10 text-[#00414e]">
      <div className="flex-1">
        <div className="border-2 border-[#eef0f2] rounded-xl m-5 w-full mt-8">
          <div className="p-5">
            <label
              className="block mb-2 text-sm font-medium"
            >
              New Walk In
            </label>
            <div className="flex gap-4">
              <input
                type="text"
                className=" border border-gray-300 text-sm rounded-lg  block w-full p-2.5"
                placeholder="Enter Mobile Number"
                required
              />
              <input
                type="text"
                className=" border border-gray-300 text-sm rounded-lg  block w-full p-2.5"
                placeholder="Enter New User"
                required
              />
            </div>
          </div>
        </div>
        <div className="border-2 border-[#eef0f2] rounded-xl mx-5 w-full  my-4">
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
                    ? "bg-[#004D57] text-white"
                    : "bg-[#d5e7ec] text-[#00414E]"
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
