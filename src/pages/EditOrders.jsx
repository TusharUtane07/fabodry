// import { useState, useEffect, useRef } from "react";
// import Laundry from "../tabsDetails/LaundryTab";
// import DryCleaning from "../tabsDetails/DryCleaning";
// import Ironing from "../tabsDetails/IroningTab";
// import Starching from "../tabsDetails/StarchingTab";
// import Cleaning from "../tabsDetails/Cleaning";
// import { Select, Switch } from "antd";
// import useFetch from "../hooks/useFetch";
// import debounce from "lodash.debounce";
// import { useCart } from "../context/CartContenxt";
// import axios from "axios";
// import toast from "react-hot-toast";
// import { useNavigate, useParams } from "react-router-dom";
// import { MdModeEditOutline } from "react-icons/md";
// import { RxCross2 } from "react-icons/rx";
// import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
// import ProductDetailsCard from "../components/ShowAddedInOrder";
// import ShowAddedInOrderLaundry from "../components/ShowAddedInOrderLaundry";

// const EditOrders = () => {
//   const [selectedTab, setSelectedTab] = useState("Laundry");
//   const [mode, setMode] = useState("B2C");
//   const [customersOrderProducts, setCustomersOrderProducts] = useState(null);
//   const scrollContainerRefs = useRef({});
//   const [isEditOrder, setIsEditOrder] = useState(true);
//   const [updatedOrderProductDetails, setUpdatedOrderProductDetails] =
//     useState(null);
//     const [updatedLaundryProductDetails, setUpdatedLaundryProductDetails] = useState(null);

//   const { id } = useParams();

//   const [products, setProducts] = useState(null);
//   const navigate = useNavigate();
//   const { data } = useFetch(`${
//     import.meta.env.VITE_BACKEND_URL}api/v1/products`);
//   useEffect(() => {
//     if (data) {
//       setProducts(data);
//     }
//   }, [data]);
//   useEffect(() => {
//     const token = localStorage.getItem("authToken");
//     if (!token) {
//       navigate("/login");
//     }
//   }, [navigate]);

//   const getCustomerOrders = async () => {
//     const token = localStorage.getItem("authToken");
//     if (!token) {
//       console.warn("No auth token found. Cannot fetch cart items.");
//       return;
//     }

//     try {
//       const response = await axios.get(
//         `${import.meta.env.VITE_BACKEND_URL}api/v1/admin/orders/${id}`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       if (response?.data?.data) {
//         setCustomersOrderProducts(response?.data?.data);
//       }
//     } catch (error) {
//       console.error("Error fetching orders:", error);
//     }
//   };

//   useEffect(() => {
//     getCustomerOrders();
//   }, []);

//   function filterProductsByServiceName(products, serviceName) {
//     return products?.filter(
//       (product) =>
//         product.serviceName.toLowerCase() === serviceName.toLowerCase()
//     );
//   }

//   const filteredLaundryProducts = filterProductsByServiceName(
//     products?.data,
//     "laundry"
//   );
//   const filteredStarchingProducts = filterProductsByServiceName(
//     products?.data,
//     "starching"
//   );
//   const filteredIroningProducts = filterProductsByServiceName(
//     products?.data,
//     "Ironing"
//   );
//   const filteredDcProducts = filterProductsByServiceName(products?.data, "dc");
//   const filteredCleaningProducts = filterProductsByServiceName(
//     products?.data,
//     "dc"
//   );

//   const componentsMap = {
//     Laundry: (
//       <Laundry
//         mode={mode}
//         filteredLaundryProducts={filteredLaundryProducts}
//         isEditOrder={isEditOrder}
//         orderDetails={customersOrderProducts}
//         setUpdatedLaundryProductDetails={setUpdatedLaundryProductDetails}
//       />
//     ),
//     "Dry Cleaning": (
//       <DryCleaning
//         mode={mode}
//         filteredDcProducts={filteredDcProducts}
//         isEditOrder={isEditOrder}
//         orderDetails={customersOrderProducts}
//         setUpdatedOrderProductDetails={setUpdatedOrderProductDetails}
//       />
//     ),
//     Ironing: (
//       <Ironing
//         mode={mode}
//         filteredIroningProducts={filteredIroningProducts}
//         isEditOrder={isEditOrder}
//         orderDetails={customersOrderProducts}
//         setUpdatedOrderProductDetails={setUpdatedOrderProductDetails}
//       />
//     ),
//     Starching: (
//       <Starching
//         mode={mode}
//         filteredStarchingProducts={filteredStarchingProducts}
//         isEditOrder={isEditOrder}
//         orderDetails={customersOrderProducts}
//         setUpdatedOrderProductDetails={setUpdatedOrderProductDetails}
//       />
//     ),
//     Cleaning: (
//       <Cleaning
//         mode={mode}
//         filteredCleaningProducts={filteredCleaningProducts}
//         isEditOrder={isEditOrder}
//         orderDetails={customersOrderProducts}
//         setUpdatedOrderProductDetails={setUpdatedOrderProductDetails}
//       />
//     ),
//   };

//   const calculateTotalItemPrice = (item) => {
//     const garmentPrice =
//       (item?.garmentType[0]?.price || 0) * (item?.quantity || 0);

//     const requirementsPrice =
//       item?.requirements?.reduce(
//         (acc, req) => acc + (req?.price || 0) * (item?.quantity || 0),
//         0
//       ) || 0;

//     const serviceAddonsPrice =
//       item?.serviceAddons?.reduce(
//         (acc, addon) => acc + (addon?.price || 0) * (item?.quantity || 0),
//         0
//       ) || 0;

//     return garmentPrice + requirementsPrice + serviceAddonsPrice;
//   };

//   const calculateTotalPrice = (item) => {
//     const addonsPriceSum =
//       item.productAddons?.reduce((total, addon) => {
//         return total + addon.price;
//       }, 0) || 0;
//     const totalPricePerKg = item.totalPrice + addonsPriceSum;
//     return totalPricePerKg * Number(item.weight);
//   };

//   const scrollLeft = (cartIndex) => {
//     if (scrollContainerRefs.current[cartIndex]) {
//       scrollContainerRefs.current[cartIndex].scrollBy({
//         left: -200,
//         behavior: "smooth",
//       });
//     }
//   };

//   const scrollRight = (cartIndex) => {
//     if (scrollContainerRefs.current[cartIndex]) {
//       scrollContainerRefs.current[cartIndex].scrollBy({
//         left: 200,
//         behavior: "smooth",
//       });
//     }
//   };

//   const calculateOrderTotals = (
//     customersOrderProducts,
//     updatedOrderProductDetails, 
//     updatedLaundryProductDetails
//   ) => {
//     let totalCount = 0;
//     let totalAmount = 0;

//     // Calculate for laundryCartItems
//     if (customersOrderProducts?.laundryCartItems?.length > 0) {
//       customersOrderProducts.laundryCartItems.forEach((item) => {
//         // Add to count
//         totalCount += 1;

//         // Calculate price for laundry items
//         const addonsPriceSum =
//           item.productAddons?.reduce(
//             (total, addon) => total + (addon.price || 0),
//             0
//           ) || 0;
//         const totalPricePerKg = (item.totalPrice || 0) + addonsPriceSum;
//         const itemTotal = totalPricePerKg * Number(item.weight || 0);
//         totalAmount += itemTotal;
//       });
//     }

//     // Calculate for regular cartItems
//     if (customersOrderProducts?.cartItems?.length > 0) {
//       customersOrderProducts.cartItems.forEach((item) => {
//         // Add to count (multiply by quantity for non-cleaning items)
//         if (item?.serviceAddons?.[0]?.name === "cleaning") {
//           totalCount += 1;
//         } else {
//           totalCount += 1;
//         }

//         // Calculate price
//         const garmentPrice =
//           (item?.garmentType?.[0]?.price || 0) * (item?.quantity || 1);
//         const requirementsPrice =
//           item?.requirements?.reduce(
//             (acc, req) => acc + (req?.price || 0) * (item?.quantity || 1),
//             0
//           ) || 0;
//         const serviceAddonsPrice =
//           item?.serviceAddons?.reduce(
//             (acc, addon) => acc + (addon?.price || 0) * (item?.quantity || 1),
//             0
//           ) || 0;

//         totalAmount += garmentPrice + requirementsPrice + serviceAddonsPrice;
//       });
//     }

//     // Calculate for updatedOrderProductDetails
//     if (
//       updatedOrderProductDetails
//     ){
//       updatedOrderProductDetails.forEach((item) => {
//         // Add to count (multiply by quantity for non-cleaning items)
//         if (item?.serviceAddons?.[0]?.name === "cleaning") {
//           totalCount += 1;
//         } else {
//           totalCount += 1;
//         }

//         // Calculate price
//         const garmentPrice =
//           (item?.garmentType?.[0]?.price || 0) * (item?.quantity || 1);
//         const requirementsPrice =
//           item?.requirements?.reduce(
//             (acc, req) => acc + (req?.price || 0) * (item?.quantity || 1),
//             0
//           ) || 0;
//         const serviceAddonsPrice =
//           item?.serviceAddons?.reduce(
//             (acc, addon) => acc + (addon?.price || 0) * (item?.quantity || 1),
//             0
//           ) || 0;

//         totalAmount += garmentPrice + requirementsPrice + serviceAddonsPrice;
//       });
//     }
//     if(updatedLaundryProductDetails){
//       updatedLaundryProductDetails.forEach((item) => {
//         totalCount+=1;
//           const addonsPriceSum = item.productAddons?.reduce((total, addon) => {
//             return total + addon.price;
//           }, 0) || 0;
//           const totalPricePerKg = item.totalPrice + addonsPriceSum;
//           totalAmount+= totalPricePerKg * Number(item.weight);
//       })
//     }

//     return {
//       totalCount,
//       totalAmount: Number(totalAmount.toFixed(2)),
//     };
//   };
//   const updateOrder = async (id) => {
//     const token = localStorage.getItem("authToken");
//     // const totalAmount = calculateOrderTotals(customersOrderProducts, updatedOrderProductDetails)?.totalAmount
    
//     const totalCount = calculateOrderTotals(customersOrderProducts, updatedOrderProductDetails, updatedLaundryProductDetails)?.totalCount
//     if(!token){
//       toast.error("Internal error occured")
//       return 
//     }
//     try {
//       const response = await  axios.put(
//         `${import.meta.env.VITE_BACKEND_URL}api/v1/admin/orders/update/${id}`,
//         {
//           totalAmount: calculateOrderTotals(
//             customersOrderProducts,
//             updatedOrderProductDetails, updatedLaundryProductDetails
//           ).totalAmount,
//           totalCount: totalCount,
//           cartItems: [
//             ...customersOrderProducts.cartItems, 
//             ...updatedOrderProductDetails || [] // Spread updatedOrderProductDetails array
//           ],
//           laundryCartItems: [
//             ...customersOrderProducts.laundryCartItems,
//             ...updatedLaundryProductDetails || []
//           ]
//         },{
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       if(response){
//         toast.success(
//           "Order Updated Successfully"
//         )
//         navigate('/orders/all')
//       }
//     } catch (error) {
//       toast.error("Error Updating Order");
//       console.error(error)
//     }
//   }

//   return (
//     <div className="flex ml-[240px] pt-8 h-screen gap-10 text-[#00414e] relative">
//       <div className="flex-1 lg:w-[580px] xl:w-[700px]">
//         <div className="border-2 border-[#eef0f2] rounded-xl mx-5 mt-10 w-full ">
//           <div className="flex px-4 py-1 pt-1.5 justify-between items-center gap-4 text-xs">
//             {[
//               "Laundry",
//               "Dry Cleaning",
//               "Ironing",
//               "Starching",
//               "Cleaning",
//             ].map((tab) => (
//               <button
//                 key={tab}
//                 className={`lg:px-3.5 xl:px-5 py-3 w-full rounded-lg ${
//                   selectedTab === tab
//                     ? mode === "B2B"
//                       ? "bg-[#66BDC5] text-white"
//                       : "bg-[#004D57] text-white"
//                     : mode === "B2C"
//                     ? "bg-blue-100 text-gray-600" // Inactive button in B2C
//                     : "bg-[#d5e7ec] text-[#00414e]" // Inactive button in B2B
//                 }`}
//                 onClick={() => setSelectedTab(tab)}
//               >
//                 {tab}
//               </button>
//             ))}
//           </div>

//           <div className="p-3">{componentsMap[selectedTab]}</div>
//         </div>
//       </div>

//       <div
//         className="col-span-1 relative bg-white mt-10  w-full border-2 mr-4  border-[#eef0f2] rounded-xl overflow-y-scroll h-[100vh-62px] "
//         style={{ scrollbarWidth: "none" }}
//       >
//         <div className="flex items-center justify-evenly pt-3 gap-3">
//           <div>Tagger- [{customersOrderProducts?._id?.slice(0, 6)}]</div>
//           <div className="flex items-center justify-center">
//             <p>{customersOrderProducts?.customerName}</p>
//             <p>-{customersOrderProducts?.address}</p>
//           </div>
//         </div>

//         <div className="relative overflow-x-auto border border-gray-300 rounded-xl mt-3 p-2 w-full ">
//           <p>Added Garments: </p>
//           <div className="w-full h-full overflow-auto">
//             <ShowAddedInOrderLaundry products={updatedLaundryProductDetails} />
//             <ProductDetailsCard productData={updatedOrderProductDetails} />
//             {customersOrderProducts?.cartItems?.length > 0 ||
//             customersOrderProducts?.laundryCartItems?.length > 0 ? (
//               <>
//                 <>
//                   {customersOrderProducts?.laundryCartItems?.map(
//                     (lItem, cartIndex) => {
//                       const addonsPriceSum =
//                         lItem.productAddons?.reduce(
//                           (total, addon) => total + addon.price,
//                           0
//                         ) || 0;
//                       const totalPricePerKg = lItem.totalPrice + addonsPriceSum;

//                       return (
//                         <div
//                           key={cartIndex}
//                           className="mb-4 border border-gray-300 p-2 rounded-lg capitalize"
//                         >
//                           <div className="w-full flex justify-between items-center gap-2 px-2">
//                             <div className="flex items-center gap-3">
//                               {/* <div className="flex items-center gap-1">
//                                 <button onClick={() => {
//                                     setSelectedTab("Laundry")
//                                     // setSelectedItem(lItem?.serviceName)
//                                 }} className="text-green-500">
//                                   <MdModeEditOutline />
//                                 </button>
//                                 <button onClick={() => handleDelete(lItem?._id)} className="text-red-500 text-lg font-bold">
//                                   <RxCross2 />
//                                 </button>
//                               </div> */}
//                               <p className="font-semibold text-md capitalize">
//                                 {lItem?.serviceName}
//                               </p>
//                             </div>
//                             <div>
//                               <p className="text-sm font-semibold">
//                                 ₹{totalPricePerKg}/KG × {lItem?.weight}KG = ₹
//                                 {calculateTotalPrice(lItem)}
//                               </p>
//                             </div>
//                           </div>

//                           <div className="text-[12px] flex items-center gap-2 font-medium">
//                             <p>
//                               {lItem?.isPremium === true
//                                 ? "Premium"
//                                 : "Regular"}
//                             </p>
//                             <p>- Piece count: {lItem?.pieceCount}</p>
//                           </div>

//                           {lItem?.productAddons?.length > 0 ? (
//                             <div className="flex items-center text-xs font-medium w-full mt-0.5 gap-1">
//                               <p>Addons: </p>
//                               <div className="flex items-center gap-2 justify-start w-full">
//                                 {lItem?.productAddons?.map((item, index) => {
//                                   return (
//                                     <div key={item}>
//                                       <p>
//                                         {item?.name} (₹ {item?.price})
//                                         {index <
//                                           lItem?.productAddons?.length - 1 &&
//                                           ", "}
//                                       </p>
//                                     </div>
//                                   );
//                                 })}
//                               </div>
//                             </div>
//                           ) : (
//                             " "
//                           )}

//                           <div className="relative w-full text-xs">
//                             <button
//                               className="absolute left-0 top-1/2 transform -translate-y-1/2 px-1 py-2 rounded-md"
//                               onClick={() => scrollLeft(cartIndex)}
//                             >
//                               <FaAngleLeft />
//                             </button>
//                             <div
//                               ref={(el) =>
//                                 (scrollContainerRefs.current[cartIndex] = el)
//                               }
//                               className="flex gap-1 bg-gray-200 p-2 rounded-md m-1 overflow-x-auto scroll-smooth mx-7"
//                               style={{
//                                 scrollBehavior: "smooth",
//                                 scrollbarWidth: "none",
//                               }}
//                             >
//                               {lItem?.products?.map((item, index) => {
//                                 const isLastProduct =
//                                   index === lItem?.products?.length - 1;
//                                 return (
//                                   <div
//                                     key={index}
//                                     className="min-w-max rounded-md"
//                                   >
//                                     <p>
//                                       <span className="font-semibold">
//                                         {item?.productDetails?.name}
//                                       </span>
//                                       {item?.comments?.length > 0
//                                         ? `(${item.comments
//                                             .map((comment, cIndex) => {
//                                               const isLastComment =
//                                                 cIndex ===
//                                                 item.comments.length - 1;
//                                               return (
//                                                 `${
//                                                   comment.text ||
//                                                   comment.content ||
//                                                   comment
//                                                 }` + (!isLastComment ? "," : "")
//                                               );
//                                             })
//                                             .join("")})`
//                                         : ""}
//                                       {!isLastProduct && ","}
//                                     </p>
//                                   </div>
//                                 );
//                               })}
//                             </div>
//                             <button
//                               className="absolute right-0 top-1/2 transform -translate-y-1/2 px-1 py-2 rounded-md"
//                               onClick={() => scrollRight(cartIndex)}
//                             >
//                               <FaAngleRight />
//                             </button>
//                           </div>
//                         </div>
//                       );
//                     }
//                   )}
//                 </>
//                 <div className="pb-40">
//                   {customersOrderProducts?.cartItems?.length > 0 &&
//                     customersOrderProducts?.cartItems?.map((item) => {
//                       return (
//                         <div
//                           key={item?._id}
//                           className="border border-gray-300 p-2 rounded-lg capitalize mt-0.5 mb-2"
//                         >
//                           <div className="flex justify-between px-2 w-full gap-2">
//                             <div className="flex items-center gap-3">
//                               {/* <div className="flex items-center gap-1">
//                               { item?.serviceAddons[0]?.name === "cleaning" ? " " :  <button className="text-green-500">
//                                 <MdModeEditOutline />
//                               </button>}
//                               <button
//                                 // onClick={() => deleteCartProduct(item?._id)}
//                                 className="text-red-500 text-lg font-bold"
//                               >
//                                 <RxCross2 />
//                               </button>
//                             </div> */}
//                               {item?.productId?.name && (
//                                 <div className="font-semibold">
//                                   {item?.productId?.name}
//                                   {item?.garmentType[0]?.name
//                                     ? ` [${item?.garmentType[0]?.name}]`
//                                     : ""}{" "}
//                                   {item?.serviceAddons[0]?.name === "cleaning"
//                                     ? ""
//                                     : ` X ${item?.quantity || 1}`}
//                                 </div>
//                               )}
//                             </div>
//                             {item?.garmentType[0]?.price &&
//                               (item?.serviceAddons[0]?.name === "cleaning" ? (
//                                 <div className="font-semibold text-sm">
//                                   ₹ {item?.garmentType[0]?.price}
//                                 </div>
//                               ) : (
//                                 <div className="font-semibold text-sm">
//                                   ₹
//                                   {(item?.garmentType[0]?.price || 0) *
//                                     (item?.quantity || 0)}
//                                   {/* Check if there are valid prices for requirements or addons */}
//                                   {item?.requirements?.some(
//                                     (req) => req?.price
//                                   ) ||
//                                   item?.serviceAddons?.some(
//                                     (addon) => addon?.price
//                                   ) ? (
//                                     <>
//                                       {item?.requirements?.length > 0 &&
//                                         item?.requirements?.some(
//                                           (req) => req?.price
//                                         ) &&
//                                         " + "}
//                                       {item?.requirements?.map((req, index) =>
//                                         req?.price ? (
//                                           <span key={req?._id}>
//                                             ₹
//                                             {(req?.price || 0) *
//                                               (item?.quantity || 0)}
//                                             {index <
//                                               item?.requirements?.length - 1 &&
//                                               item?.requirements[index + 1]
//                                                 ?.price &&
//                                               " + "}
//                                           </span>
//                                         ) : null
//                                       )}

//                                       {item?.serviceAddons?.length > 0 &&
//                                         item?.serviceAddons?.some(
//                                           (addon) => addon?.price
//                                         ) &&
//                                         " + "}
//                                       {item?.serviceAddons?.map(
//                                         (addon, index) =>
//                                           addon?.price ? (
//                                             <span key={addon?._id}>
//                                               ₹
//                                               {(addon?.price || 0) *
//                                                 (item?.quantity || 0)}
//                                               {index <
//                                                 item?.serviceAddons?.length -
//                                                   1 &&
//                                                 item?.serviceAddons[index + 1]
//                                                   ?.price &&
//                                                 " + "}
//                                             </span>
//                                           ) : null
//                                       )}

//                                       {" = ₹"}
//                                       {calculateTotalItemPrice(item)}
//                                     </>
//                                   ) : null}
//                                 </div>
//                               ))}
//                           </div>
//                           {item?.serviceAddons[0]?.name === "cleaning" ? (
//                             <div className="text-[12px]">
//                               <p>
//                                 {item?.isPremium === true
//                                   ? "Premium"
//                                   : "Regular"}
//                               </p>
//                               <p>Service: {item?.serviceName}</p>
//                             </div>
//                           ) : (
//                             <div className="text-[12px]">
//                               <div className="flex items-center gap-1">
//                                 <p className="font-medium">
//                                   {item?.isPremium === true
//                                     ? "Premium"
//                                     : "Regular"}{" "}
//                                   -
//                                 </p>
//                                 <p className="font-medium">
//                                   Service: {item?.serviceName}
//                                 </p>
//                               </div>
//                               {item?.requirements[0]?.name && (
//                                 <p>
//                                   Requirements: {item?.requirements[0]?.name} (₹{" "}
//                                   {item?.requirements[0]?.price || 0})
//                                 </p>
//                               )}
//                               {item?.serviceAddons?.length > 0 && (
//                                 <p>
//                                   Additional Services:{" "}
//                                   {item?.serviceAddons?.map(
//                                     (service, index) => (
//                                       <span key={index}>
//                                         {service?.name} (₹ {service?.price})
//                                         {index <
//                                           item?.serviceAddons?.length - 1 &&
//                                           ", "}
//                                       </span>
//                                     )
//                                   )}
//                                 </p>
//                               )}
//                               {/* {item?.comments?.length > 0 && (
//                             <p>Comments: {item.comments.join(", ")}</p>
//                           )} */}
//                             </div>
//                           )}
//                         </div>
//                       );
//                     })}
//                 </div>
//               </>
//             ) : (
//               <p className="text-sm text-gray-600 flex items-center justify-center h-full">
//                 No garments added
//               </p>
//             )}
//           </div>
//         </div>
//         <div className=" px-5 mt-5 text-[14px] py-3 fixed  w-[calc(100%-1000px)] bottom-2 bg-white border-t border-gray-300">
//           <div className="text-gray-400">
//             <div className="flex justify-between mt-1">
//               <p>Total Count:</p>
//               <span>
//                 {
//                   calculateOrderTotals(
//                     customersOrderProducts,
//                     updatedOrderProductDetails, updatedLaundryProductDetails
//                   ).totalCount
//                 }
//               </span>
//             </div>
//             <hr />
//             <div className="flex justify-between mt-2 mb-3">
//               <p className="font-medium text-gray-600">Total Amount:</p>
//               <span className="font-medium text-gray-600">
//                 <span>
//                   ₹{" "}
//                   {
//                     calculateOrderTotals(
//                       customersOrderProducts,
//                       updatedOrderProductDetails, updatedLaundryProductDetails
//                     ).totalAmount
//                   }{" "}
//                   /-
//                 </span>
//               </span>
//             </div>
//           </div>
//           <div className="">
//             <button onClick={() => updateOrder(id)} className="bg-[#004D57] text-white w-full rounded-md py-2">
//               Retag Order
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EditOrders;


import React from 'react'

const EditOrders = () => {
  return (
    <div>EditOrders</div>
  )
}

export default EditOrders
