import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import fabodry from "../assets/fabodry.svg";

const PrintLabelsPage = () => {
  const [labels, setLabels] = useState([]);
  const location = useLocation();
  const [items, setItems] = useState(null);
  const navigate = useNavigate();
  const [address, setAddress] = useState("");

  useEffect(() => {
    const orderData = location.state?.order;
    if (orderData) {
      const order = JSON.parse(orderData);
      setAddress(order?.address)
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

      function formatDate(isoDate) {
        const date = new Date(isoDate);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      }

      const deliveryDate = formatDate(order?.deliveryDate);
      const labelData = order.productIds.map((product, index) => {
        const serviceName =
          order?.serviceIds[index] === "Wash & Iron"
            ? "W&I"
            : order?.serviceIds[index] === "Wash & Fold"
            ? "W&F"
            : order?.serviceIds[index] === "Premium Laundry"
            ? "PL"
            : order?.serviceIds[index];
        return {
          orderId: order?.orderId,
          customerName: order?.customerName,
          garment: product,
          branchName: order?.branchName,
          customerNumber: order?.customerNumber,
          price: order?.totalAmount,
          serviceName,
          count: `${index + 1}/${order?.productIds?.length}`,
          date: formattedDate,
          dd: deliveryDate,
          time: formattedTime,
        };
      });
      setItems(order.productIds);
      setLabels(labelData);
      const printTimer = setTimeout(() => {
        window.print();
      }, 100);
      const afterPrint = () => {
        navigate("/orders/all");
      };

      window.addEventListener("afterprint", afterPrint);
      return () => {
        clearTimeout(printTimer);
        window.removeEventListener("afterprint", afterPrint);
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
          fontFamily: "Arial, sans-serif",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100vh",
            maxHeight: "6in",
            padding: "10mm",
            boxSizing: "border-box",
            fontSize: "10px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            border: "1px solid black",
            margin: "0 auto",
          }}
        >
          <img src={fabodry} alt="" />
          <p className="my-1 capitalize font-semibold text-lg ">
            {labels.branchName}
          </p>
          <p>Phone: +91-7234578342</p>
          <p>
            .........................................................................................................
          </p>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "3px",
              marginTop: "3px",
              fontSize: "10px",
            }}
          >
            <p style={{ margin: "1mm 0" }}>Order ID: {labels[0]?.orderId},</p>
            <p style={{ margin: "1mm" }}>
              {labels[0]?.date} {labels[0]?.time}
            </p>
          </div>
          <p style={{ margin: "1mm 0" }}>
            <span className="font-semibold">Customer Name: </span>
            {labels[0]?.customerName}
          </p>
          <p style={{ margin: "1mm 0" }}>
            <span className="font-semibold">Phone:</span>{" "}
            {labels[0]?.customerNumber}
          </p>

          {labels[0]?.customerAddress && (
            <p style={{ margin: "1mm 0" }}>{address}</p>
          )}
          <p>
            .........................................................................................................
          </p>
          <div className="w-full">
            <table className="border-collapse mx-auto w-[200px]">
              <thead className="font-semibold">
                <tr>
                  <th className="text-start ">Sr.No</th>
                  <th className="text-start ">DESC</th>
                </tr>
              </thead>
              <tbody>
                {items?.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td className="text-start ">{index + 1} </td>

                      <td className="text-start ">{item}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <hr />
          <hr />
          <p className="mt-0.5">Total Amount: {labels[0]?.price}</p>
          <p>
            .........................................................................................................
          </p>
          <p>----Thank You----</p>
        </div>
      </div>
    </>
  );
};

export default PrintLabelsPage;
