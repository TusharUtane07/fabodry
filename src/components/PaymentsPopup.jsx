import { useState } from "react";

const PaymentPopup = ({ isOpen, setIsOpen, order }) => {
  return (
    <div className="relative">
      {/* Trigger Button */}
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={() => setIsOpen(true)}
      >
        Open Payment Popup
      </button>

      {/* Popup */}
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg text-gray-600 text-xs shadow-lg w-[50vw] flex flex-col items-start ">
            <div className=" flex justify-between w-full">
            <h2 className="text-lg font-medium">
              Settle Order -<span>[{order?._id.slice(0, 6)}]</span>
            </h2>
            <button onClick={() => setIsOpen(false)} className="text-gray-600 bg-gray-200 p-2 px-3 rounded-lg"> X </button>
            </div>
            <div className="flex justify-between my-5 text-sm items-center w-full">
              <div className="flex items-center gap-1">
                <p className="font-medium">Invoice Amount: </p>
                <span>₹ {order?.totalAmount}</span>
              </div>
              <div className="flex items-center gap-1">
                <p className="font-medium">Paid Amount: </p>
                <span>₹ 0</span>
              </div>
              <div className="flex items-center gap-1">
                <p className="font-medium">Due Amount: </p>
                <span>₹ {order?.totalAmount}</span>
              </div>
            </div>
            <div className="text-start p-3 rounded-md border border-gray-300 w-full">
  <p className="pl-2 mb-2 text-sm">Select Payment Medium</p>
  <div className="grid grid-cols-4 gap-2 my-2">
    {[
      "Cash @ Store",
      "UPI (GPay, BHIM, PhonePe, Paytm)",
      "Wallet Paytm",
      "Wallet PhonePe",
      "Wallet Amazon Pay",
      "Wallet Freecharge",
      "Wallet Mobikwik",
      "Other",
      "Prepaid",
      "FAB Credit",
      "FAB Cash",
      "Account @ Transfer",
    ].map((medium) => (
      <button
        key={medium}
        className="w-full py-2 bg-gray-100 px-3 border rounded text-center truncate"
        style={{ whiteSpace: "nowrap" }}
        title={medium}
      >
        {medium}
      </button>
    ))}
  </div>
</div>
<div className="mt-5 text-start  w-full">
    <label htmlFor="amount">Enter Amount</label>
    <input type="number" className="w-full pl-3 border border-gray-300 focus:outline-none py-2  my-1 rounded-lg" />
</div>
<div className="mt-6 flex items-center justify-center w-full gap-1">
    <p>New Due Amount: </p>
    <span>₹ 0</span>
</div>
<div className="mt-3 mx-auto">
    <button className="bg-[#00414E] px-3 w-40 py-1.5 rounded-md text-white">Settle</button>
</div>

          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentPopup;
