import axios from "axios";
import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import orderPng from "../assets/cargo.png";
import EditConfirmedOrderPopup from "../components/EditConfirmedOrderPopup";
import {
  MdCancel,
  MdFileDownload,
  MdOutlinePendingActions,
} from "react-icons/md";
import { TbTruckDelivery } from "react-icons/tb";
import { FcFactory } from "react-icons/fc";
import { LiaStoreAltSolid } from "react-icons/lia";
import { Button, DatePicker, Dropdown, Select } from "antd";
import { FaAngleDown, FaAngleLeft, FaAngleRight } from "react-icons/fa";
import dayjs from "dayjs";

const Orders = () => {  
  const [orders, setOrders] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isOpen, setIsOpen] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const getCustomerOrders = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.warn("No auth token found. Cannot fetch cart items.");
      return;
    }

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}api/v1/admin/orders/all`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const reversedOrders = response.data.data.reverse();
      setOrders(reversedOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  // const onChange = (date, dateString) => {
  //   setSelectedDate(dateString);
  // };

  // const handleDelete = async (id) => {
  //   const token = localStorage.getItem("authToken");
  //   try {
  //     const response = await axios.delete(
  //       `${import.meta.env.VITE_BACKEND_URL}api/v1/admin/orders/delete/${id}`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );
  //     toast.success("Order Deleted Successfully");
  //     await getCustomerOrders();
  //   } catch (error) {
  //     console.log("Error Deleting Order", error.message);
  //   }
  // };

  const handleEdit = (order) => {
    setSelectedOrder(order);
    setIsOpen(true);
  };

  useEffect(() => {
    getCustomerOrders();
  }, []);

  function formatDate(isoDate) {
    const date = new Date(isoDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  const handleBranchChange = (value) => {
    setSelectedBranch(value);
    setCurrentPage(1);
  };

  const handleStartDateChange = (date, dateString) => {
    setStartDate(dateString);
    setCurrentPage(1);
  };

  const handleEndDateChange = (date, dateString) => {
    setEndDate(dateString);
    setCurrentPage(1);
  };

  const handleClear = () => {
    setSelectedBranch(null);
    setStartDate(null);
    setEndDate(null);
    setCurrentPage(1);
  };

  const exportToExcel = () => {
    if (!orders || orders.length === 0) {
      alert("No orders to export");
      return;
    }
    const exportData = orders?.map((order, index) => ({
      "Sr. No": index + 1,
      "Order ID": order?.orderId,
      "Order Date": formatDate(order?.updatedAt),
      "Delivery Date": formatDate(order?.deliveryDate),
      "Time Slot": order?.deliveryTimeSlot || "No Time Slot",
      "Customer Name": order?.customerName,
      "Customer Number": order?.customerNumber,
      Branch: order?.branchName,
      "Order Status": order?.orderStatus,
      "Order Type": order?.orderType,
      Address: order?.address,
      "Total Amount": `₹ ${order?.totalAmount}/-`,
      "Payment Status": order?.paymentStatus.toUpperCase(),
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, `Orders_${new Date().toISOString().split("T")[0]}.xlsx`);
  };

  const items = [
    {
      key: "1",
      label: <div onClick={exportToExcel}>Download Excel Sheet</div>,
    },
  ];

  const getFilteredOrders = () => {
    let filtered = orders.filter(order => order?.orderType !== "B2B");

    if (selectedBranch) {
      filtered = filtered.filter(order => order.branchName === selectedBranch);
    }

    if (startDate && endDate) {
      filtered = filtered.filter(order => {
        const orderDate = formatDate(order.updatedAt);
        return orderDate >= startDate && orderDate <= endDate;
      });
    }

    if (searchQuery) {
      filtered = filtered.filter(
        order =>
          order?.orderId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order?.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order?.paymentStatus?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order?.branchName?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  };

   const disabledDate = (current) => {
      return current && current < dayjs().startOf("day");
    };
    const filteredOrders = getFilteredOrders();

  const orderDetailsStatus = [
    {
      name: "Pending",
      count: filteredOrders?.length,
      css: "text-red-500",
      icon: <MdOutlinePendingActions size={20} />,
    },
    {
      name: "Delivered",
      count: 0,
      css: "text-green-500",
      icon: <TbTruckDelivery size={20} />,
    },
    {
      name: "Cancelled",
      count: 0,
      css: "text-red-500",
      icon: <MdCancel size={20} />,
    },
    {
      name: "Store Processing",
      count: 0,
      css: "text-green-500",
      icon: <LiaStoreAltSolid size={20} />,
    },
    {
      name: "Factory Processing",
      count: 0,
      icon: <FcFactory size={20} />,
    },
    {
      name: "Store Ready",
      count: 0,
      css: "text-green-500",
      icon: <LiaStoreAltSolid size={20} />,
    },
    {
      name: "Factory Ready",
      count: 0,
      icon: <FcFactory size={20} />,
    },
  ];

  const totalPages = Math.ceil(filteredOrders?.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const visibleOrders = filteredOrders?.slice(startIndex, endIndex);

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="overflow-x-auto pt-20 ml-[264px] h-screen">
      <div className="flex items-center gap-3 m-2">
        <img src={orderPng} alt="" className="w-7 h-7" />
        <h2 className="text-lg py-2">
          All Orders{" "}
          <span className="text-xs bg-gray-300  ml-2 rounded-lg p-1">
            {filteredOrders?.length}
          </span>
        </h2>
      </div>
      <div className="border border-gray-300 rounded-lg mr-3 text-sm">
        <div className="flex mb-2 justify-evenly mt-3 gap-3 p-2 rounded-md">
        <div className="w-full">
            <Select
              showSearch
              className="border w-full border-gray-300 rounded-md"
              placeholder="Main"
              variant="borderless"
              value={selectedBranch}
              onChange={handleBranchChange}
              filterOption={(input, option) =>
                (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
              }
              options={[
                {
                  value: "main",
                  label: "Main",
                },
                {
                  value: "Branch-One",
                  label: "Branch-One",
                },
                {
                  value: "Branch-Two",
                  label: "Branch-Two",
                },
                {
                  value: "Branch-Three",
                  label: "Branch-Three",
                },
                {
                  value: "Branch-Four",
                  label: "Branch-Four",
                },
              ]}
            />
          </div>
          <div className="flex items-center border-[#eef0f2] rounded-md space-x-4 border px-2 w-full">
            <DatePicker
              size="middle"
              variant="borderless"
              className="border-none outline-none w-full text-black placeholder:text-gray-400"
              onChange={handleStartDateChange}
              // disabledDate={disabledDate}
              placeholder="Start Date"
            />
          </div>
          <div className="flex items-center border-[#eef0f2] rounded-md space-x-4 border px-2 w-full">
            <DatePicker
              size="middle"
              variant="borderless"
              className="border-none outline-none w-full text-black placeholder:text-gray-400"
              onChange={handleEndDateChange}
              // disabledDate={disabledDate}
              placeholder="End Date"
            />
          </div>
          <div className="flex gap-2 items-center w-full">
            <button 
              onClick={handleClear}
              className="px-4 py-2 bg-gray-200 text-[#00414e] w-full rounded-md"
            >
              Clear
            </button>
            <button 
              className="px-4 py-2 bg-[#00414e] text-white w-full rounded-md"
            >
              Show Data
            </button>
          </div>
        </div>
        <hr />
       
        <div className="grid grid-cols-4 mt-2">
          {orderDetailsStatus.map((item, index) => {
            return (
              <div
                key={index}
                className="flex items-center justify-between border border-gray-300 p-2 py-3 my-2 mx-2 rounded-lg bg-gray-100 text-gray-600"
              >
                <div className="flex gap-2 items-center">
                  <p className={item.css}>{item.icon}</p>
                  <p>{item.name}</p>
                </div>
                <div>
                  <p className="bg-[#00414e] text-white rounded-md px-3 py-1">
                    {item.count}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="border border-gray-300 mr-3 mt-4 rounded-md">
        <div className="flex justify-between items-center mr-3">
          <div className="flex rounded-md my-2 mx-3 gap-2">
            <input
              type="text"
              className=" text-xs block ml-0.5 w-72  p-2 border rounded-md border-gray-300 h-10 active:outline-none focus:outline-none"
              placeholder="Search by Name, Order ID, Payment status"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="py-2">
            <Dropdown
              menu={{
                items,
              }}
              placement="bottomLeft"
            >
              <Button>
                <MdFileDownload />
                <p>Export</p>
                <FaAngleDown />
              </Button>
            </Dropdown>
          </div>
        </div>
        <div className=" mx-3 mt-2 text-sm">
          <div className="overflow-x-auto">
            <div className="min-w-full mb-4">
              {visibleOrders?.length > 0 ? (
                <>
                  <div className="overflow-auto">
                    <table className="min-w-full">
                      <thead className="bg-[#f4f7fb]">
                        <tr>
                          {[
                            "Sr. No",
                            "Customer",
                            "Order Type",
                            "Order ID",
                            "No.of Garments",
                            "Order Date",
                            "Delivery Date",
                            "Time Slot",
                            "Current Status",
                            "Branch",
                            "Address",
                            "Total Amount",
                            "Payment Method",
                            "Payment Status",
                            "Action",
                          ].map((header, index) => (
                            <th
                              key={index}
                              className="px-6 py-4 text-left text-gray-900 font-medium whitespace-nowrap"
                            >
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="bg-white">
                        {visibleOrders?.map((row, index) => (
                          <tr
                            key={index}
                            className="text-gray-600 hover:bg-gray-100"
                          >
                            <td className="px-6 py-2 whitespace-nowrap">
                              {startIndex + index + 1}
                            </td>
                            <td className="px-6 py-2 whitespace-nowrap">
                              <div className="flex flex-col capitalize">
                                <p>{row?.customerName}</p>
                                <p>{row?.customerNumber}</p>
                              </div>
                            </td>
                            <td className="px-6 py-2 whitespace-nowrap">
                            <p className="bg-blue-50 text-blue-500 py-1.5 rounded-md border border-blue-500 text-center px-1.5">
                              {row?.orderType}
                              </p>
                            </td>
                            <td className="px-6 py-2 whitespace-nowrap">
                            {row?._id ? <p className="bg-yellow-50 text-yellow-500 py-1.5 rounded-md border border-yellow-500 text-center px-1.5">                                
                              {row?._id.slice(0, 6)}
                              </p>: ""}
                            </td>
                            <td className="px-6 py-2 whitespace-nowrap text-center">
                              {row?.totalCount}
                            </td>
                            <td className="px-6 py-2 whitespace-nowrap">
                              {formatDate(row?.updatedAt)}
                            </td>
                            <td className="px-6 py-2 whitespace-nowrap">
                              {formatDate(row?.deliveryDate)}
                            </td>
                            <td className="px-6 py-2 whitespace-nowrap">
                              {row?.deliveryTimeSlot || "No Time Slot"}
                            </td>
                            <td className="px-6 py-2 whitespace-nowrap">
                              {row?.orderStatus}
                            </td>
                            <td className="px-6 py-2 whitespace-nowrap">
                              <p className="bg-[#ddf7fb] text-[#004D57] py-1.5 rounded-md border border-[#004D57] text-center px-1.5">
                                {row?.branchName}
                              </p>
                            </td>
                            <td className="px-6 py-2 whitespace-nowrap">
                              {row?.address
                                ? row?.address?.length > 30
                                  ? `${row?.address?.substring(0, 30)}...`
                                  : row?.address
                                : "No Address Added"}
                            </td>
                            <td className="px-6 py-2 whitespace-nowrap">
                              ₹ {row?.totalAmount}/-
                            </td>
                            <td className="px-6 py-2 whitespace-nowrap">
                              <p className=" text-green-400 bg-green-50 py-1.5 rounded-md border-green-300 border text-center">
                                Cash
                              </p>
                            </td>
                            <td
                              className={`px-6 py-2 whitespace-nowrap capitalize`}
                            >
                              <p
                                className={
                                  row?.paymentStatus === "paid"
                                    ? "text-green-500 bg-gray-100"
                                    : "text-red-400 bg-red-50/50 text-center py-1.5 rounded-md border-red-300 border "
                                }
                              >
                                {row?.paymentStatus}
                              </p>
                            </td>
                            <td className="px-6 py-2 whitespace-nowrap">
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  onClick={() => handleEdit(row)}
                                  className="bg-gray-200 text-gray-700 px-2 py-1 rounded-md"
                                >
                                  Action
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="flex justify-end items-center text-lg mt-4 bg-white py-4">
                    <button
                      onClick={handlePrevious}
                      disabled={currentPage === 1}
                      className={`mx-1 p-2 rounded-md ${
                        currentPage === 1
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                      }`}
                    >
                      <FaAngleLeft />
                    </button>
                    {Array.from({ length: totalPages }).map((_, pageIndex) => (
                      <button
                        key={pageIndex}
                        onClick={() => setCurrentPage(pageIndex + 1)}
                        className={`mx-1 px-3 py-1 rounded-md ${
                          currentPage === pageIndex + 1
                            ? "bg-[#004D57] text-white"
                            : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                        }`}
                      >
                        {pageIndex + 1}
                      </button>
                    ))}
                    <button
                      onClick={handleNext}
                      disabled={currentPage === totalPages}
                      className={`mx-1 p-2 rounded-md ${
                        currentPage === totalPages
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      <FaAngleRight />
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex justify-center items-center text-lg text-gray-600">
                  No Orders Found
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <EditConfirmedOrderPopup
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        order={selectedOrder}
      />
    </div>
  );
};

export default Orders;
