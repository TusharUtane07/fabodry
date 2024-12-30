import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import fabodry from '../assets/fabodry.svg';

const PrintLabelsPage = ({orderData}) => {
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
        // eslint-disable-next-line no-unsafe-optional-chaining
        ...order?.cartItems?.map((product, index) => {
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
            isExpress: product.expressCharge ? true : false
          };
        }),
        // eslint-disable-next-line no-unsafe-optional-chaining
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
            isExpress: product?.expressCharge?.length > 0 ? true : false
          };
        }),
      ];
      
      // After constructing labelData, call setLabels to set the state
      setLabels(labelData);
      
      const printTimer = setTimeout(() => {
        window.print();
      }, 100);
      const afterPrint = () => {
        navigate('/orders/all');
      };

      window.addEventListener('afterprint', afterPrint);
      return () => {
        clearTimeout(printTimer);
        window.removeEventListener('afterprint', afterPrint);
      };
    }
  }, [location, navigate]);

  const printStyles = `
    @media print {
      body * {
        visibility: hidden;
      }
      #print-section, #print-section * {
        visibility: visible;
      }
      #print-section > div {
        break-inside: avoid;
        page-break-inside: avoid;
        text-align: center; /* Center content */
        margin: 0 auto; /* Center the div within the page */
        width: 70mm; /* Set a fixed width for labels */
        padding: 10mm; /* Add padding inside the label */
        border: 1px solid black; /* Optional for a border around the label */
        border-bottom: 1px dotted black; /* Dotted line for separation */
      }
      #print-section > div:last-child {
        border-bottom: none;
      }
      img {
        display: block;
        margin: 0 auto 5px; /* Center image and add spacing below */
        width: 100px; /* Adjust image width */
        height: auto;
      }
      @page {
        size: auto;
        margin: 10mm; /* Add margin for thermal printers */
      }
    }
  `;

  return (
    <>
      <style>{printStyles}</style>
      <div id="print-section" style={{ fontFamily: 'Arial, sans-serif' }}>
        {labels?.map((label, index) => (
          <div  className='relative' key={index}>
            <img src={fabodry} alt="" />
            <p>
              <strong></strong> {label.date}, {label.time}
            </p>
            <p><strong>{label.orderId.slice(0, 6)}</strong></p>
            <p>
              <strong> {label.customerName}</strong>
            </p>
            <p className='absolute top-2 right-2'>
              <p className='bg-black text-white p-1 rounded-full border border-gray-800'>{label.isPremium ? "PR" : "RG"}</p> 
              {/* {label.orderId} */}
            </p>
            <p className='absolute top-2 left-2'>
              <p className='bg-black text-white p-1 rounded-full border border-gray-800'>{label.isExpress ? "EX": "RG"}</p> 
              {/* {label.orderId} */}
            </p>
            <p>
              <strong> {label.garment}</strong>
            </p>
            <p
              style={{
                border: '1px solid black',
                padding: '2px',
                display: 'inline-block',
              }}
            >
              <strong>Service:</strong> {label.serviceName}
            </p>
            <p style={{
              padding:'2px'
            }}>
              <strong>DD:</strong> {label.dd} - [{label.count}]
            </p>
          </div>
        ))}
      </div>
    </>
  );
};

export default PrintLabelsPage;
