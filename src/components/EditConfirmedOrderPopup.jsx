import React, { useState, useEffect } from 'react';

const EditConfirmedOrderPopup = ({ isOpen, setIsOpen, order }) => {
  if (!isOpen || !order) return null;

  const [labels, setLabels] = useState([]);
  const [printMode, setPrintMode] = useState(false);

  const handlePrintLabels = () => {
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

    const labelData = order.productNames.map((product, index) => ({
      orderId: order._id,
      customerName: order.customerName,
      garment: product,
      serviceName: order.serviceNames[index], 
      count: `${index + 1}/${order.productNames.length}`,
      date: formattedDate,
      time: formattedTime,
    }));
    
    
    setLabels(labelData);
    setPrintMode(true);
  };

  useEffect(() => {
    if (printMode && labels.length > 0) {
      const timer = setTimeout(() => {
        window.print();
        setPrintMode(false);
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [printMode, labels]);

  const printStyles = `
    @media print {
      body * {
        visibility: hidden;
      }
      #print-section, #print-section * {
        visibility: visible;
      }
      #print-section {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        display: block;
        page-break-inside: avoid;
      }
      @page {
        size: A4;
        margin: 10mm;
      }
    }
  `;

  return (
    <>
      <style>{printStyles}</style>
      
      <div className="flex justify-center text-center items-center">
        {isOpen && (
          <div
            id="popup-overlay"
            className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50 p-5 pb-10 text-sm"
          >
            <div
              className="bg-white rounded-lg p-6 w-[45vw] h-[40vh] mx-auto"
            >
              <div className='flex items-center justify-between gap-5'>
              <h2 className="text-lg text-[#00414e] mb-4 ml-5">
                Order Created successfully
              </h2>
              <button onClick={() => setIsOpen(false)} className='mb-4 bg-gray-500 p-2 rounded-full px-3.5 text-white'>X</button>
              </div>
              <p>Order Id: {order?._id}</p>
              <div className="mt-5 p-5">
                <button
                  className="px-3 py-1 bg-[#004D57] rounded-md text-white text-sm mx-2"
                  onClick={handlePrintLabels}
                >
                  Print Label
                </button>
                <button
                  className="px-3 py-1 bg-[#004D57] rounded-md text-white text-sm mx-2"
                >
                  Print Receipt
                </button>
                <button
                  className="px-3 py-1 bg-[#004D57] rounded-md text-white text-sm mx-2"
                >
                  Edit Order
                </button>
                <button
                  className="px-3 py-1 bg-[#004D57] rounded-md text-white text-sm mx-2"
                >
                  Collect Payments
                </button>
              </div>
            </div>
          </div>
        )}

        {printMode && (
          <div 
            id="print-section" 
            className="hidden print:block"
            style={{
              width: '210mm', // A4 width
              height: '297mm', // A4 height
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)', // 3 columns
              gridTemplateRows: 'repeat(4, 1fr)', // 4 rows
              gap: '5mm', // space between labels
              padding: '10mm',
              boxSizing: 'border-box',
              fontFamily: 'Arial, sans-serif'
            }}
          >
            {labels.map((label, index) => (
              <div 
                key={index} 
                style={{
                  border: '1px solid black',
                  padding: '5mm',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  textAlign: 'center'
                }}
              >
                <div style={{display: "flex", alignItems: "center", gap: "3px"}}>
                <p style={{ margin: '1mm 0' }}> {label.date},</p>
                <p style={{ margin: '1mm 0' }}> {label.time}</p>
                </div>
                <p style={{ margin: '1mm 0' }}>{label.customerName}</p>
                <p style={{ margin: '1mm 0', fontWeight: "bold", fontSize: "10px" }}>Order ID: {label.orderId}</p>
                <p style={{ margin: '1mm 0' }}>{label.garment}</p>
                <p style={{ margin: '1mm 0', border: "2px solid black", padding: "2px" }}>{label.serviceName}</p>
                <p style={{ margin: '1mm 0', fontWeight: 'bold', display:'flex' }}>
                  <span>https://fabodry.in</span>
                  <span>{label.count}</span>
                  </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default EditConfirmedOrderPopup;