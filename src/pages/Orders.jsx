import axios from "axios";
import { useEffect, useState } from "react";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import EditConfirmedOrderPopup from "../components/EditConfirmedOrderPopup";
import {
  MdCancel,
  MdDelete,
  MdFileDownload,
  MdOutlinePendingActions,
} from "react-icons/md";
import { TbTruckDelivery } from "react-icons/tb";
import { FcFactory } from "react-icons/fc";
import { LiaStoreAltSolid } from "react-icons/lia";
import { Button, DatePicker, Dropdown, Select } from "antd";
import { FaAngleDown, FaEye } from "react-icons/fa";
import toast from "react-hot-toast";

const Orders = () => {
  const [orders, setOrders] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  

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

  const onChange = (date, dateString) => {
    setSelectedDate(dateString);
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("authToken");
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}api/v1/admin/orders/delete/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Order Deleted Successfully")
      await getCustomerOrders();
    } catch (error) {
      console.log("Error Deleting Order", error.message);
    }
  };

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

  const exportToExcel = () => {
    if (!orders || orders.length === 0) {
      alert("No orders to export");
      return;
    }
    const exportData = orders?.map((order, index) => ({
      'Sr. No': index + 1,
      'Order ID': order?.orderId,
      'Delivery Date': formatDate(order?.deliveryDate),
      'Time Slot': order?.deliveryTimeSlot || 'No Time Slot',
      'Customer Name': order?.customerName,
      'Customer Number': order?.customerNumber,
      'Branch': order?.branchName,
      'Order Status': order?.orderStatus,
      'Order Type': order?.orderType,
      'Total Amount': `₹ ${order?.totalAmount}/-`,
      'Payment Status': order?.paymentStatus.toUpperCase()
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");

    const excelBuffer = XLSX.write(workbook, { 
      bookType: 'xlsx', 
      type: 'array' 
    });

    const blob = new Blob([excelBuffer], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });
    saveAs(blob, `Orders_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const items = [
    {
      key: "1",
      label: (
        <div onClick={exportToExcel}>
          Download Excel Sheet
        </div>
      ),
    },
  ];

  const filteredOrders = orders?.filter(
    (order) =>
      order?.orderType !== "B2B" && 
      (
        order?.orderId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order?.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order?.paymentStatus?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order?.branchName?.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );


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

  return (
    <div className="overflow-x-auto pt-20 ml-[264px] h-screen">
      <h2 className="text-lg py-2">All Orders </h2>
      <div className="border border-gray-300 rounded-lg mr-3 text-sm">
        {/* <div className="flex mb-2 justify-evenly mt-3 gap-3 p-2 rounded-md">
          <div className="w-full">
            <Select
              showSearch
              className="border w-full border-gray-300 rounded-md"
              placeholder="Main"
              variant="borderless"
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
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
          <div className="flex items-center border-[#eef0f2] rounded-md space-x-4 border  px-2 w-full">
            <DatePicker
              size="middle"
              variant="borderless"
              className="border-none outline-none w-full text-black placeholder:text-gray-400"
              onChange={onChange}
              placeholder="Start Date"
            />
          </div>
          <div className="flex items-center border-[#eef0f2] rounded-md space-x-4 border  px-2 w-full">
            <DatePicker
              size="middle"
              variant="borderless"
              className="border-none outline-none w-full text-black placeholder:text-gray-400"
              onChange={onChange}
              placeholder="End Date"
            />
          </div>
          <div className="flex gap-2 items-center w-full">
            <button className="px-4 py-2 bg-gray-200 text-[#00414e] w-full rounded-md">
              Clear
            </button>
            <button className="px-4 py-2 bg-[#00414e] text-white w-full rounded-md">
              Show Data
            </button>
          </div>
        </div> 
        <hr />
        */}
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
          <div className="min-w-full border-collapse mb-4">
  {filteredOrders?.length > 0 ? (
    <table className="min-w-full">
      <thead className="bg-gray-100">
        <tr>
          <th className="px-4 py-2 text-left text-gray-900 font-medium">
            Sr. No
          </th>
          <th className="px-4 py-2 text-left text-gray-900 font-medium">
            Order ID
          </th>
          <th className="px-4 py-2 text-left text-gray-900 font-medium">
            Delivery Date
          </th>
          <th className="px-4 py-2 text-left text-gray-900 font-medium">
            Time Slot
          </th>
          <th className="px-4 py-2 text-left text-gray-900 font-medium">
            Customer
          </th>
          <th className="px-4 py-2 text-left text-gray-900 font-medium">
            Branch
          </th>
          <th className="px-4 py-2 text-left text-gray-900 font-medium">
            Order Status
          </th>
          <th className="px-4 py-2 text-left text-gray-900 font-medium">
            Order Type
          </th>
          <th className="px-4 py-2 text-left text-gray-900 font-medium">
            Total Amount
          </th>
          <th className="px-4 py-2 text-left text-gray-900 font-medium">
            Payment Method
          </th>
          <th className="px-4 py-2 text-left text-gray-900 font-medium">
            Payment Status
          </th>
          <th className="px-4 py-2 text-left text-gray-900 font-medium">
            Action
          </th>
        </tr>
      </thead>
      <tbody className="bg-white">
        {filteredOrders.map((row, index) => (
          <tr key={index} className="text-gray-600">
            <td className="px-4 py-2">{index + 1}</td>
            <td className="px-4 py-2">{row?.orderId}</td>
            <td className="px-4 py-2">{formatDate(row?.deliveryDate)}</td>
            <td className="px-4 py-2">
              {row?.deliveryTimeSlot ? row?.deliveryTimeSlot : "No Time Slot"}
            </td>
            <td className="px-4 py-2">
              <div className="flex flex-col">
                <p>{row?.customerName}</p>
                <p>{row?.customerNumber}</p>
              </div>
            </td>
            <td className="px-4 py-2">{row?.branchName}</td>
            <td className="px-4 py-2">{row?.orderStatus}</td>
            <td className="px-4 py-2">{row?.orderType}</td>
            <td className="px-4 py-2">₹ {row?.totalAmount}/-</td>
            <td className="px-4 py-2">NaN</td>
            <td
              className={`px-4 py-2 uppercase ${
                row?.paymentStatus === "paid"
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              {row?.paymentStatus}
            </td>
            <td className="px-4 py-2">
              <div className="flex items-center justify-center text-lg gap-2">
                <button
                  onClick={() => handleEdit(row)}
                  className="text-green-500"
                >
                  <FaEye />
                </button>
                <button
                  onClick={() => handleDelete(row?._id)}
                  className="text-red-500"
                >
                  <MdDelete />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  ) : (
    <div className="flex justify-center items-center  text-lg text-gray-600">
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
