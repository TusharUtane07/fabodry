/* eslint-disable no-unsafe-optional-chaining */
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import fabodry from '../assets/fabodry.svg';

const PrintLabelsPage = () => {
  const [labels, setLabels] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const orderData = location.state?.order;
    if (orderData) {
      const order = JSON.parse(orderData);
      const currentDate = new Date();
      const formattedDate = currentDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });
      const formattedTime = currentDate.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });

      function formatDate(isoDate) {
        const date = new Date(isoDate);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      }

      const deliveryDate = formatDate(order?.deliveryDate);
      const labelData = [
        ...order?.cartItems?.map((product, index) => {
          console.log(order, "orders");
          return {
            orderId: order?._id,
            customerName: order?.customerName,
            garment: product?.productId?.name,
            serviceName: product?.serviceName || product?.productId?.serviceName,
            count: `${index + 1}/${order?.cartItems?.length}`,
            date: formattedDate,
            dd: deliveryDate,
            time: formattedTime,
            isPremium: product.isPremium,
            isExpress: order?.expressCharge > 0  ? true : false
          };
        }),
        ...order?.laundryCartItems?.map((product, index) => {
          return {
            orderId: order?._id,
            customerName: order?.customerName,
            garment: product?.productId?.name,
            serviceName: product?.serviceName || product?.productId?.serviceName,
            count: `${order?.cartItems?.length + index + 1}/${order?.laundryCartItems?.length + order?.cartItems?.length}`,
            date: formattedDate,
            dd: deliveryDate,
            time: formattedTime,
            isPremium: product.isPremium,
            isExpress: order?.expressCharge > 0 ? true : false
          };
        }),
      ];
      
      setLabels(labelData);
    }
  }, [location]);

  const handlePrint = () => {
    window.print();
  };
  const handleBack = () => {
    navigate(-1);
  };

console.log(labels, "labels"
);

  return (
    <div className="min-h-screen font-sans">
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

      {/* Labels Content */}
      <div 
        id="print-section" 
        className="flex flex-col items-center mt-10 mx-auto print:p-0 print:m-0 print:absolute print:top-0 print:left-0 print:w-[90mm] print:min-w-[90mm] print:max-w-[90mm]"
      >
        {labels?.map((label, index) => (
          <div 
            key={index} 
            className="w-[250px] relative mb-4 py-4   border-b-2 border-dashed border-gray-500"
          >
            <div className="w-40 print:w-24 mx-auto mb-4">
              <img src={fabodry} alt="" className="w-full" />
            </div>
            
            <div className="text-center text-sm print:text-[10px]">
              <p className="mb-2">
                {label.date}, {label.time}
              </p>
              <p className="font-bold mb-2">Order ID: {label.orderId.slice(0, 6)}</p>
              <p className="font-bold mb-2"> {label.customerName}</p>
              
              <div className='absolute top-2 right-2'>
                <span className='bg-black text-white p-1.5 rounded-full text-[10px]'>
                  {label.isPremium ? "PR" : "RG"}
                </span>
              </div>
              <div className='absolute top-2 left-2'>
              {label.isExpress &&  <span className='bg-black text-white p-1.5 text-[10px] rounded-full '>
                  EX
                </span>} 
              </div>
              
              <p className="font-bold mb-2">{label.garment}</p>
              
              <p className="inline-block border border-gray-300 px-2 py-1 mb-2">
                <strong>Service:</strong> {label.serviceName}
              </p>
              
              <p className="mb-2">
                <strong>DD:</strong> {label.dd} - [{label.count}]
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Print Styles */}
      <style>
        {`
          @media print {
            @page {
              margin: 0;
              size: 60mm 200mm;
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
            #print-section {
              font-size: 14px;
            }
            #print-section > div {
              border-color: #666;
              break-inside: avoid;
              page-break-inside: avoid;
            }
          }
        `}
      </style>
    </div>
  );
};

export default PrintLabelsPage;