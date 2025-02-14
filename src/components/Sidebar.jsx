import { useState } from "react";
import { BsDot, BsGraphUp } from "react-icons/bs";
import { FaAngleUp, FaRegHandshake } from "react-icons/fa";
import { FaPeopleGroup } from "react-icons/fa6";
import { GiExpense } from "react-icons/gi";
import { GrCatalog, GrUserManager } from "react-icons/gr";
import { IoCart } from "react-icons/io5";
import {
  MdOutlineBusinessCenter,
  MdOutlineDirectionsBike,
  MdOutlineFactory,
  MdOutlineInventory,
  MdOutlinePayments,
  MdOutlineSupportAgent,
} from "react-icons/md";
import { PiSuitcaseSimpleDuotone } from "react-icons/pi";
import {
  RiAdminLine,
  RiCustomerService2Line,
  RiPieChart2Fill,
} from "react-icons/ri";
import { SiGoogleads, SiGoogleanalytics } from "react-icons/si";
import { useLocation, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [openSubmenus, setOpenSubmenus] = useState({});

  const toggleSubmenu = (label) => {
    setOpenSubmenus((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const tabs = [
    {
      label: "Dashboard",
      link: "/dashboard",
      icon: <RiPieChart2Fill className="text-lg" />,
    },
    { label: "POS", link: "/pos", icon: <BsGraphUp className="text-lg" /> },
    {
      label: "B2C Orders",
      link: "/orders/all",
      icon: <IoCart className="text-lg" />,
      submenus: [
        { label: "All", link: "/orders/all" },
        { label: "Pending", link: "/orders/pending" },
        { label: "Delivered", link: "/orders/delivered" },
        { label: "Cancelled", link: "/orders/cancelled" },
        { label: "S.Processing", link: "/orders/s-processing" },
        { label: "F.Processing", link: "/orders/f-processing" },
        { label: "S.Mark Ready", link: "/orders/s-mark-ready" },
        { label: "F.Mark Ready", link: "/orders/f-mark-ready" },
      ],
    },
    {
      label: "Pick up & Drop",
      link: "/pickup-drop",
      icon: <MdOutlineDirectionsBike className="text-lg" />,
    },
    {
      label: "Leads & Enquires",
      link: "/leads-and-enquires",
      icon: <SiGoogleads className="text-lg" />,
    },
    {
      label: "Customer Management",
      link: "/customer-management",
      icon: <RiCustomerService2Line className="text-lg" />,
    },
    {
      label: "B2B Orders",
      link: "/b2b-orders/all",
      icon: <MdOutlineBusinessCenter className="text-lg" />,
      submenus: [
        { label: "All", link: "/b2b-orders/all" },
        { label: "Pending", link: "/b2b-orders/pending" },
        { label: "Delivered", link: "/b2b-orders/delivered" },
        { label: "Cancelled", link: "/b2b-orders/cancelled" },
        { label: "S.Processing", link: "/b2b-orders/s-processing" },
        { label: "F.Processing", link: "/b2b-orders/f-processing" },
        { label: "S.Mark Ready", link: "/b2b-orders/s-mark-ready" },
        { label: "F.Mark Ready", link: "/b2b-orders/f-mark-ready" },
      ],
    },
    {
      label: "Settlements",
      link: "/settlements",
      icon: <FaRegHandshake className="text-lg" />,
    },
    {
      label: "Catalogs & Products",
      link: "/catalogs-and-products",
      icon: <GrCatalog className="text-lg" />,
    },
    {
      label: "Expense Management",
      link: "/expense-management",
      icon: <GiExpense className="text-lg" />,
    },
    {
      label: "Inventory Management",
      link: "/inventory-management",
      icon: <MdOutlineInventory className="text-lg" />,
    },
    {
      label: "Analytics & Reporting",
      link: "/analytics-and-reporting",
      icon: <SiGoogleanalytics className="text-lg" />,
    },
    {
      label: "HR & Staff Management",
      link: "/hr-and-staff-management",
      icon: <FaPeopleGroup className="text-lg" />,
    },
    {
      label: "Factory panel",
      link: "/factory-panel",
      icon: <MdOutlineFactory className="text-lg" />,
    },
    {
      label: "Role Management",
      link: "/role-management",
      icon: <GrUserManager className="text-lg" />,
    },
    {
      label: "Franchise Management",
      link: "/franchise-management",
      icon: <PiSuitcaseSimpleDuotone className="text-lg" />,
    },
    {
      label: "Help & Support",
      link: "/help-and-support",
      icon: <MdOutlineSupportAgent className="text-lg" />,
    },
    {
      label: "Admin & System",
      link: "/admin-and-system",
      icon: <RiAdminLine className="text-lg" />,
    },
    {
      label: "Payments Tracking",
      link: "/payments-tracking",
      icon: <MdOutlinePayments className="text-lg" />,
    },
  ];

  return (
    <section
      className="w-[250px] grid-cols-1 pt-20 bg-[#d5e7ec] min-h-screen h-full fixed left-0 overflow-y-scroll"
      style={{ scrollbarWidth: "none" }}
    >
      {tabs.map((item, index) => {
        if (item.submenus) {
          return (
            <div
              key={index}
              className="flex flex-col items-center mx-1"
            >
              <button
                onClick={() => toggleSubmenu(item.label)}
                className={`flex items-center justify-between w-full gap-6 py-2 rounded-md text-[12px] px-4 mx-2 ${
                  location.pathname === item.link
                    ? "bg-[#004d57] text-white font-semibold"
                    : "text-black font-semibold"
                }`}
              >
                {item.icon}
                <p className="uppercase">{item.label}</p>
                <span
                  className={`ml-auto transform rotate-90 transition-transform duration-300 ${
                    openSubmenus[item.label] ? "rotate-[180deg]" : "rotate-[90deg]"
                  }`}
                >
                  <FaAngleUp size={15} />
                </span>
              </button>

              {openSubmenus[item.label] && (
                <div className="flex flex-col w-full px-8 mx-2">
                  {item.submenus.map((submenu, subIndex) => (
                    <button
                      key={subIndex}
                      onClick={() => navigate(submenu.link)}
                      className={`text-left flex items-center gap-1 text-black font-semibold py-1.5 text-[12px] hover:text-[#004d57] ${
                        location.pathname === submenu.link
                          ? "text-[#004d57] font-semibold"
                          : ""
                      }`}
                    >
                      <BsDot size={20}/>
                      {submenu.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        }

        return (
          <div
            key={index}
            className="flex items-center text-[10px] h-[38px] rounded-lg"
          >
            <button
              onClick={() => navigate(item.link)}
              className={`flex items-center py-2 gap-6 rounded-md text-[12px] w-full px-4 mx-1 ${
                location.pathname === item.link
                  ? "bg-[#004d57] text-white font-semibold"
                  : "text-black font-semibold"
              }`}
            >
              {item.icon}
              <p className="uppercase">{item.label}</p>
            </button>
          </div>
        );
      })}
    </section>
  );
};

export default Sidebar;
