import axios from "axios";
import { useEffect, useState } from "react";
import EditConfirmedOrderPopup from "../components/EditConfirmedOrderPopup";
import { MdDelete, MdEdit } from "react-icons/md";
import { IoEyeSharp } from "react-icons/io5";

const Orders = () => {
  const [orders, setOrders] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);  

  const getCustomerOrders = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.warn("No auth token found. Cannot fetch cart items.");
      return;
    }

    try {
      const response = await axios.get(
        "http://51.21.62.30/api/v1/admin/orders/all",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setOrders(response.data.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("authToken");
    try {
      const response = await axios.delete(`http://51.21.62.30/api/v1/admin/orders/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
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
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}



  return (
    <div className="overflow-x-auto mt-20 ml-[260px] rounded-lg border-2 border-gray-300  mr-3">
      <table className="min-w-full text-xs text-left text-gray-500">
        <thead className="text-xs text-gray-700 bg-gray-100">
          <tr>
            <th className="px-4 py-2">Product Name</th>
            <th className="px-4 py-2">Service Name</th>
            <th className="px-4 py-2">Total Count</th>
            <th className="px-4 py-2">Total Price</th>
            <th className="px-4 py-2">Customer Name</th>
            <th className="px-4 py-2">Address</th>
            <th className="px-4 py-2">Phone Number</th>
            <th className="px-4 py-2">Delivery Date</th>
            <th className="px-4 py-2">Time Slot</th>
            <th className="px-4 py-2">Order Type</th>
            <th className="px-4 py-2">Delivery Method</th>
            <th className="px-4 py-2">Payment Method</th>
            <th className="px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody className="text-[10px]">
          {orders?.map((item, index) => (
            <tr key={index}>
              <td className="px-4 py-2 capitalize">{item.productNames?.join(", ")}</td>
              <td className="px-4 py-2 capitalize">{item.serviceNames?.join(", ")}</td>
              <td className="px-4 py-2">{item.totalCount}</td>
              <td className="px-4 py-2">{item.totalPrice}</td>
              <td className="px-4 py-2">{item.customerName}</td>
              <td className="px-4 py-2">{item.address}</td>
              <td className="px-4 py-2">{item.phoneNumber}</td>
              <td className="px-4 py-2">{formatDate(item.deliveryDate)}</td>
              <td className="px-4 py-2">{item.timeSlot}</td>
              <td className="px-4 py-2">{item.orderType}</td>
              <td className="px-4 py-2">{item.deliveryMethod}</td>
              <td className="px-4 py-2">{item.paymentMethod}</td>
              <td className="px-4 py-2">
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(item)}>
                    <IoEyeSharp className="text-green-500" size={16} />
                  </button>
                  <button onClick={() => handleDelete(item?._id)}>
                    <MdDelete className="text-red-500" size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <EditConfirmedOrderPopup isOpen={isOpen} setIsOpen={setIsOpen} order={selectedOrder} />
    </div>
  );
};

export default Orders;
