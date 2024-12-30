import { useState } from 'react';
import { IoPrint, IoReceipt } from 'react-icons/io5';
import { MdBorderColor, MdOutlinePayments } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import PaymentPopup from './PaymentsPopup';

const EditConfirmedOrderPopup = ({ isOpen, setIsOpen, order }) => {
  const navigate = useNavigate();
  const [isPaymentPopupOpen, setIsPaymentPopupOpen] = useState(false);
  if (!isOpen || !order) return null;

  const handlePrintLabels = () => {
    const orderData = JSON.stringify(order);
    navigate('/print-labels', { 
      state: { order: orderData } 
    });
  };
  const handlePrintReceipts = () => {
    const orderData = JSON.stringify(order);
    navigate('/print-receipt', { 
      state: { order: orderData } 
    });
  };

  return (
    <>
      <div className="flex justify-center text-center items-center">
        {isOpen && (
          <div
            id="popup-overlay"
            className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50 p-5 pb-10 text-sm"
          >
            <div
              className="bg-white rounded-lg p-6 w-[45vw] mx-auto"
            >
              <div className='flex items-center justify-between gap-5'>
              <h2 className="text-lg text-[#00414e] mb-4 ml-5">
                Order Created successfully
              </h2>
              <button onClick={() => setIsOpen(false)} className='mb-2 bg-gray-200 p-2  rounded-lg px-3.5 text-gray-600 font-semibold'>X</button>
              </div>
              <p className='text-xl'>Order Id: {order?.orderId}</p>
              <div className="mt-4 p-4 flex items-center">
                <button
                  className="px-3 py-1 bg-[#004D57] rounded-md text-white text-sm mx-2 flex items-center justify-center gap-2"
                  onClick={handlePrintLabels}
                >
                  <IoPrint />
                 <p> Print Label</p>
                </button>
                <button
                  className="px-3 py-1 bg-[#004D57] rounded-md text-white text-sm mx-2 flex items-center justify-center gap-2"
                  onClick={handlePrintReceipts}
                >
                  <IoReceipt />
                  <p>Print Receipt</p>
                </button>
                <button
                onClick={() => navigate(`/edit-order/${order?._id}`)}
                  className="px-3 py-1 bg-[#004D57] rounded-md text-white text-sm mx-2 flex items-center justify-center gap-2"
                >
                  <MdBorderColor />
                  Edit Order
                </button>
                <button
                 onClick={() => setIsPaymentPopupOpen(true)}
                 className="px-3 py-1 bg-[#004D57] rounded-md text-white text-sm mx-2 flex items-center justify-center gap-2"
                >
                  <MdOutlinePayments />
                  Collect Payments
                </button>
              </div>
            </div>
          </div>
        )}
        <PaymentPopup setIsOpen={setIsPaymentPopupOpen} isOpen={isPaymentPopupOpen} order={order} />
      </div>
    </>
  );
};

export default EditConfirmedOrderPopup;