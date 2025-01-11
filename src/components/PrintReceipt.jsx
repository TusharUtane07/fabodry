import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import fabodry from "../assets/fabodry.svg";

const PrintReceipt = () => {
  const [receiptData, setReceiptData] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const orderData = location.state?.order;
    if (orderData) {
      const order = JSON.parse(orderData);

      const currentDate = new Date();
      const formattedDate = currentDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
      const formattedTime = currentDate.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });

      const items = order.cartItems.map((item) => ({
        name: item.productId.name,
        price: item.garmentType[0]?.price || item.productId.price.B2C,
        serviceName: item.serviceName,
        addons: item.serviceAddons.map((addon) => addon.name).filter(Boolean),
        quantity: item.quantity,
      }));

      const calculateTotalPrice = (item) => {
        const addonsPriceSum =
          item.productAddons?.reduce((total, addon) => {
            return total + addon.price;
          }, 0) || 0;
        const totalPricePerKg = item.totalPrice + addonsPriceSum;
        return totalPricePerKg * Number(item.weight);
      };

      const items2 = order.laundryCartItems.map((item) => ({
        name: item.serviceName,
        price: calculateTotalPrice(item),
        serviceName: "Laundry",
        addons: item.productAddons.map((addon) => addon.name).filter(Boolean),
        quantity: item.weight,
      }));

      const totalAmount =
        items.reduce((sum, item) => {
          const price = parseFloat(item.price) || 0;
          const quantity = parseInt(item.quantity, 10) || 0;
          return sum + price * quantity;
        }, 0) +
        items2.reduce((sum, item) => {
          const price = parseFloat(item.price) || 0;
          const quantity = parseInt(item.quantity, 10) || 0;
          return sum + price * quantity;
        }, 0);
      setReceiptData({
        orderId: order._id,
        branchName: order?.branchName,
        address: "22, Faridabad, HR",
        phone: "+91-7774838483",
        customerName: order?.customerName,
        cPhone: order?.customerNumber,
        addressC: order?.address,
        express: Number(order?.expressCharge),
        items,
        count: order?.totalCount,
        items2,
        totalAmount: order?.totalAmount,
        discountAmount: Number(order?.discountAmount),
        date: formattedDate,
        time: formattedTime,
      });

      // const afterPrint = () => {
      //   navigate("/orders/all");
      // };

      // window.addEventListener("afterprint", afterPrint);
      // return () => {
      //   window.removeEventListener("afterprint", afterPrint);
      // };
    }
  }, [location, navigate]);

  const handlePrint = () => {
    window.print();
  };

  const handleBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    document.fonts.load("1em Roboto Mono").then(() => {
    });
  }, []);

  return (
    <div
      className="min-h-screen font-sans"
      style={{
        fontFamily: "'Roboto Mono', monospace",
      }}
    >
      {/* Buttons - Only visible on screen */}
      <div className="print:hidden flex items-center justify-center gap-3 pt-20">
        <button
          onClick={handlePrint}
          className="px-4 py-2 bg-[#00414e] text-white rounded"
        >
          Proceed If thermal printer is ready
        </button>
        <button
          onClick={handleBack}
          className="px-4 py-2 bg-gray-500 text-white rounded"
        >
          Back
        </button>
      </div>

      {/* Receipt Content - Centered in print view */}
      <div
        style={{ fontFamily: "Roboto Mono, sans-serif" }}
        className="font-roboto receipt-should-roboto-font print:p-0 print:m-0 print:absolute print:top-0 print:left-0 print:w-[90mm] print:min-w-[90mm] print:max-w-[90mm]"
      >
        <div className="justify-center text-xs print:text-[10px] flex flex-col items-center mt-10 print:border-none">
          {/* Logo */}
          <div className="w-40 print:w-24 my-2">
            <img src={fabodry} alt="Fabodry Logo" className="w-full" />
          </div>
          <div className=" flex flex-col w-[300px] items-center mb-2 text-sm">
            <p className="font-medium  text-sm">{receiptData?.branchName}</p>
            <p className="my-1 text-xs text-gray-500">{receiptData?.address}</p>
            <p className="text-gray-500 text-xs">Phone: {receiptData?.phone}</p>
          </div>

          {/* Header Info */}
          <div className="w-[300px] px-4  text-start border-t-2 border-dashed border-gray-500">
            <div className="flex items-center justify-between my-1 gap-3 text-gray-500">
              <p className="text-xs my-1">
                <span className="font-medium text-black">Order ID:</span>{" "}
                {receiptData?.orderId?.slice(0, 6)}
              </p>
              <p className="text-xs my-1">
                {receiptData?.date} {receiptData?.time}
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <p className="text-gray-500">
                  <span className="font-medium text-black">Name: </span>
                  {receiptData?.customerName}
                </p>
                <p className="text-gray-500">
                  <span className="font-medium text-black">Phone: </span>
                  {receiptData?.cPhone}
                </p>
              </div>
              <p className="text-gray-500">
                <span className="font-medium text-black">Address: </span>
                {receiptData?.addressC}
              </p>
            </div>
          </div>

          {/* Items Table */}
          <div className="w-[300px] border-t-2 border-dashed border-gray-500 pt-2 my-2">
  <table className="w-[300px] text-start border-collapse border border-gray-300">
    <thead>
      <tr className="border border-gray-300">
        <th className="py-1 px-2 text-xs font-semibold text-start border border-gray-300">
          Item
        </th>
        <th className="py-1 px-2 text-xs font-semibold text-right border border-gray-300">
          Qty
        </th>
        <th className="py-1 px-2 text-xs font-semibold text-right border border-gray-300">
          Price
        </th>
      </tr>
    </thead>
    <tbody className="text-xs">
      {receiptData?.items?.map((item, index) => (
        <tr key={index} className="border border-gray-300">
          <td className="py-1 px-2 border border-gray-300">
            <div>{item.name}</div>
            {item.addons.length > 0 && (
              <div className="text-[9px] text-gray-500">
                + {item.addons.join(", ")}
              </div>
            )}
          </td>
          <td className="py-1 px-2 text-right text-[12px] border border-gray-300">
            {item.quantity}
          </td>
          <td className="py-1 px-2 text-right text-[12px] border border-gray-300">
            ₹{item.price}
          </td>
        </tr>
      ))}
      {receiptData?.items2.map((item, index) => (
        <tr key={index} className="border border-gray-300">
          <td className="py-1 px-2 border border-gray-300">
            <div>{item.name}</div>
            {item.addons.length > 0 && (
              <div className="text-[9px] text-gray-500 w-40">
                + {item.addons.join(", ")}
              </div>
            )}
          </td>
          <td className="py-1 px-2 text-right text-[12px] border border-gray-300">
            {item.quantity}/KG
          </td>
          <td className="py-1 px-2 text-right text-[12px] border border-gray-300">
            ₹ {item.price}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>


          {/* Total */}
          <div className="w-[300px] py-1 flex flex-col gap-2">
            <div className="flex justify-between">
              <span className="font-semibold">Total Count:</span>
              <span>{receiptData?.count}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Discount Amount:</span>
              <span>₹{receiptData?.discountAmount}</span>
            </div>
            <div className="flex justify-between ">
              <span className="font-semibold">Express Amount:</span>
              <span>₹{receiptData?.express}</span>
            </div>
            <div className="flex justify-between font-medium mt-2 text-lg">
              <span>Total:</span>
              <span>₹{receiptData?.totalAmount}</span>
            </div>
          </div>

          {/* Footer */}
          <div className="w-[300px] text-center uppercase border-t-2 border-b-2 border-dashed border-gray-500 py-3 text-sm font-bold print:text-[16px]">
            <p>&quot;&quot;&quot;Thank You&quot;&quot;&quot;</p>
          </div>
          <div className="mt-2">
            <p>Copyright &copy; 2024, Fabodry</p>
          </div>
        </div>
      </div>

      {/* Print-specific styles */}
      <style>
        {`
          @media print {
            @page {
              margin: 0;
              size: 80mm 200mm;
            }
            body * {
              visibility: hidden;
            }
            #root {
              visibility: hidden;
            }
            .print\\:absolute {
              visibility: visible;
              position: absolute;
            }
            .print\\:absolute * {
              visibility: visible;
            }
            .print\\:hidden {
              display: none;
            }
          }
        `}
      </style>
    </div>
  );
};

export default PrintReceipt;
