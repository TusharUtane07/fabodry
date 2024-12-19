import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import fabodry from '../assets/fabodry.svg'

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
        day: '2-digit'
      });
      const formattedTime = currentDate.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });

      function formatDate(isoDate) {
        const date = new Date(isoDate);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); 
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      }

      const deliveryDate = formatDate(order?.deliveryDate);
      const labelData = order.productIds.map((product, index) => {
        const serviceName =
          order?.serviceIds[index] === "Wash & Iron" ? "W&I" :
          order?.serviceIds[index] === "Wash & Fold" ? "W&F" :
          order?.serviceIds[index] === "Premium Laundry" ? "PL" :
          order?.serviceIds[index]; 
      
        return {
          orderId: order?.orderId,
          customerName: order?.customerName,
          garment: product,
          serviceName, 
          count: `${index + 1}/${order?.productIds?.length}`,
          date: formattedDate,
          dd: deliveryDate,
          time: formattedTime,
        };
      });
      

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
        page-break-after: always;
      }
      #print-section > div:last-child {
        page-break-after: avoid;
      }
      @page {
        size: 4in 6in; /* Common thermal printer size */
        margin: 0; /* No margin for thermal printers */
      }
    }
  `;

  return (
    <>
      <style>{printStyles}</style>
      <div 
        id="print-section"
        style={{
          fontFamily: 'Arial, sans-serif',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
        }}
      >
        {labels.map((label, index) => (
          <div 
            key={index} 
            style={{
              width: '100%',
              height: '100vh', // Use full screen height
              maxHeight: '6in', // Cap the height to thermal printer size
              padding: '10mm',
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
              border: '1px solid black',
              margin: '0 auto',
            }}
          >
                <img src={fabodry} alt="" />
            <div style={{ display: "flex", alignItems: "center", gap: "3px", marginTop:"3px" }}>
              <p style={{ margin: '1mm 0' }}>{label.date},</p>
              <p style={{ margin: '1mm' }}>{label.time}</p>
            </div>
            <p>.................................................</p>
            <p style={{ margin: '1mm 0' }}>{label.customerName}</p>
            <p style={{ margin: '1mm 0', fontWeight: "bold", fontSize: "10px" }}>Order ID: {label.orderId}</p>
            <p style={{ margin: '1mm 0' }}>{label.garment}</p>
            <p style={{ margin: '1mm 0', border: "1px solid black", padding: "2px" }}>{label.serviceName}</p>
            <p style={{ margin: '1mm 0', fontWeight: 'bold', display: 'flex' }}>
              <span>DD: {label.dd}</span>{" - "}
              <span>{`[${label.count}]`}</span>
            </p>
          </div>
        ))}
      </div>
    </>
  );
};

export default PrintLabelsPage;
