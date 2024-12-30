import React from 'react';
import { MdModeEditOutline } from 'react-icons/md';
import { RxCross2 } from 'react-icons/rx';

const calculateTotalItemPrice = (item) => {
  const garmentPrice =
    (item?.garmentType[0]?.price || 0) * (item?.quantity || 0);

  const requirementsPrice =
    item?.requirements?.reduce(
      (acc, req) => acc + (req?.price || 0) * (item?.quantity || 0),
      0
    ) || 0;

  const serviceAddonsPrice =
    item?.serviceAddons?.reduce(
      (acc, addon) => acc + (addon?.price || 0) * (item?.quantity || 0),
      0
    ) || 0;

  return garmentPrice + requirementsPrice + serviceAddonsPrice;
};


const ProductDetailsCard = ({ productData }) => {
  // Check if productData exists and has any entries
  const hasValidData = productData && Object.keys(productData).length > 0;

  if (!hasValidData) {
    return null;
  }

  return (
   <div className="w-full">
     {productData?.length > 0 &&
      productData?.map((item) => {
        return (
          <div
            key={item?._id}
            className="border border-gray-300 p-2 rounded-lg capitalize mt-0.5 mb-2"
          >
            <div className="flex justify-between px-2 w-full gap-2">
              <div className="flex items-center gap-3">
                {/* <div className="flex items-center gap-1">
                { item?.serviceAddons[0]?.name === "cleaning" ? " " :  <button className="text-green-500">
                  <MdModeEditOutline />
                </button>}
                <button
                  // onClick={() => deleteCartProduct(item?._id)}
                  className="text-red-500 text-lg font-bold"
                >
                  <RxCross2 />
                </button>
              </div> */}
                {item?.productId?.name && (
                  <div className="font-semibold">
                    {item?.productId?.name}
                    {item?.garmentType[0]?.name
                      ? ` [${item?.garmentType[0]?.name}]`
                      : ""}{" "}
                    {item?.serviceAddons[0]?.name === "cleaning"
                      ? ""
                      : ` X ${item?.quantity || 1}`}
                  </div>
                )}
              </div>
              {item?.garmentType[0]?.price &&
                (item?.serviceAddons[0]?.name === "cleaning" ? (
                  <div className="font-semibold text-sm">
                    ₹ {item?.garmentType[0]?.price}
                  </div>
                ) : (
                  <div className="font-semibold text-sm">
                    ₹
                    {(item?.garmentType[0]?.price || 0) *
                      (item?.quantity || 0)}
                    {/* Check if there are valid prices for requirements or addons */}
                    {item?.requirements?.some(
                      (req) => req?.price
                    ) ||
                    item?.serviceAddons?.some(
                      (addon) => addon?.price
                    ) ? (
                      <>
                        {item?.requirements?.length > 0 &&
                          item?.requirements?.some(
                            (req) => req?.price
                          ) &&
                          " + "}
                        {item?.requirements?.map((req, index) =>
                          req?.price ? (
                            <span key={req?._id}>
                              ₹
                              {(req?.price || 0) *
                                (item?.quantity || 0)}
                              {index <
                                item?.requirements?.length - 1 &&
                                item?.requirements[index + 1]
                                  ?.price &&
                                " + "}
                            </span>
                          ) : null
                        )}

                        {item?.serviceAddons?.length > 0 &&
                          item?.serviceAddons?.some(
                            (addon) => addon?.price
                          ) &&
                          " + "}
                        {item?.serviceAddons?.map(
                          (addon, index) =>
                            addon?.price ? (
                              <span key={addon?._id}>
                                ₹
                                {(addon?.price || 0) *
                                  (item?.quantity || 0)}
                                {index <
                                  item?.serviceAddons?.length -
                                    1 &&
                                  item?.serviceAddons[index + 1]
                                    ?.price &&
                                  " + "}
                              </span>
                            ) : null
                        )}

                        {" = ₹"}
                        {calculateTotalItemPrice(item)}
                      </>
                    ) : null}
                  </div>
                ))}
            </div>
            {item?.serviceAddons[0]?.name === "cleaning" ? (
              <div className="text-[12px]">
                <p>
                  {item?.isPremium === true
                    ? "Premium"
                    : "Regular"}
                </p>
                <p>Service: {item?.serviceName}</p>
              </div>
            ) : (
              <div className="text-[12px]">
                <div className="flex items-center gap-1">
                  <p className="font-medium">
                    {item?.isPremium === true
                      ? "Premium"
                      : "Regular"}{" "}
                    -
                  </p>
                  <p className="font-medium">
                    Service: {item?.serviceName}
                  </p>
                </div>
                {item?.requirements[0]?.name && (
                  <p>
                    Requirements: {item?.requirements[0]?.name} (₹{" "}
                    {item?.requirements[0]?.price || 0})
                  </p>
                )}
                {item?.serviceAddons?.length > 0 && (
                  <p>
                    Additional Services:{" "}
                    {item?.serviceAddons?.map(
                      (service, index) => (
                        <span key={index}>
                          {service?.name} (₹ {service?.price})
                          {index <
                            item?.serviceAddons?.length - 1 &&
                            ", "}
                        </span>
                      )
                    )}
                  </p>
                )}
                {/* {item?.comments?.length > 0 && (
              <p>Comments: {item.comments.join(", ")}</p>
            )} */}
              </div>
            )}
          </div>
        );
      })}
   </div>
  );
};

export default ProductDetailsCard;