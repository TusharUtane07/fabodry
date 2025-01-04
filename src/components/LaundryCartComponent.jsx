import { useRef } from "react";
import { MdModeEditOutline } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { useCart } from "../context/CartContenxt";
import axios from "axios";
import toast from "react-hot-toast";

const commentsData = [
  {
    comment: "Breads Missing",
    shortForm: "BM",
  },
  {
    comment: "Breads Damaged",
    shortForm: "BD",
  },
  {
    comment: "Bleach Mark",
    shortForm: "BMK",
  },
  {
    comment: "Button Missing",
    shortForm: "BTM",
  },
  {
    comment: "Cold Stain",
    shortForm: "CS",
  },
  {
    comment: "Fungus Stain",
    shortForm: "FS",
  },
  {
    comment: "Hole",
    shortForm: "H",
  },
  {
    comment: "Lining Damaged",
    shortForm: "LD",
  },
  {
    comment: "Breads Missing",
    shortForm: "BM",
  },
  {
    comment: "No Gaurantee For Stain",
    shortForm: "NGFS",
  },
  {
    comment: "Part Missing",
    shortForm: "PM",
  },
];

const addonData = [
  {
    addon: "Antiviral Cleaning",
    shortForm: "AC",
  },
  {
    addon: "Fabric Softener",
    shortForm: "FS",
  },
  {
    addon: "Stain Treatment",
    shortForm: "ST",
  },
  {
    addon: "Premium Detergent",
    shortForm: "PD",
  },
];

const productAddonsData = [
  {
    name: "Dry Clean",
    shortForm: "DC",
  },
  {
    name: "Stream Press",
    shortForm: "SP",
  },
];
const requirementsData = [
  {
    name: "Fold",
    shortForm: "F",
  },
  {
    name: "On Hanger",
    shortForm: "OH",
  },
  {
    name: "Hanger",
    shortForm: "H",
  },
];

const LaundryCartComponent = ({ setSelectedTab }) => {
  const { laundryCart, refreshCart } = useCart();
  const scrollContainerRefs = useRef({});

  const calculateTotalPrice = (item) => {
    const productsAddonsAndRequirements =
      item?.products?.reduce((total, product) => {
        const additionalServicesTotal =
          product.additionalServices?.reduce(
            (sum, service) => sum + (service?.price || 0),
            0
          ) || 0;
        const requirementsTotal =
          product.requirements?.reduce(
            (sum, req) => sum + (req?.price || 0),
            0
          ) || 0;
        return total + additionalServicesTotal + requirementsTotal;
      }, 0) || 0;

    const addonsPriceSum =
      item?.productAddons?.reduce((total, addon) => {
        return total + addon?.price;
      }, 0) || 0;
    const totalPricePerKg = item?.totalPrice + addonsPriceSum;
    console.log(totalPricePerKg, "ttp");
    return (
      totalPricePerKg * Number(item?.weight) + productsAddonsAndRequirements
    );
  };

  const scrollLeft = (cartIndex) => {
    if (scrollContainerRefs.current[cartIndex]) {
      scrollContainerRefs.current[cartIndex].scrollBy({
        left: -200,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = (cartIndex) => {
    if (scrollContainerRefs.current[cartIndex]) {
      scrollContainerRefs.current[cartIndex].scrollBy({
        left: 200,
        behavior: "smooth",
      });
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("authToken");
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}api/v1/laundrycarts/delete/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      await refreshCart();
      toast.success("Deleted Successfully");
    } catch (error) {
      toast.error("Error Deleting");
      console.log("Error deleting product: ", error, error.message);
    }
  };

  const shortFormLookup = commentsData.reduce((acc, { comment, shortForm }) => {
    acc[comment] = shortForm;
    return acc;
  }, {});

  return (
    <>
      {laundryCart
        ?.filter((item) => item?.isInCart)
        ?.map((lItem, cartIndex) => {
          const productsAddonsAndRequirements =
            lItem?.products?.reduce((total, product) => {
              const additionalServicesTotal =
                product.additionalServices?.reduce(
                  (sum, service) => sum + (service?.price || 0),
                  0
                ) || 0;
              const requirementsTotal =
                product.requirements?.reduce(
                  (sum, req) => sum + (req?.price || 0),
                  0
                ) || 0;
              return total + additionalServicesTotal + requirementsTotal;
            }, 0) || 0;
          const addonsPriceSum =
            lItem.productAddons?.reduce(
              (total, addon) => total + addon.price,
              0
            ) || 0;
          const totalPricePerKg = lItem.totalPrice + addonsPriceSum;

          return (
            <div
              key={cartIndex}
              className="mb-4 border border-gray-300 p-2 rounded-lg capitalize"
            >
              <div className="w-full flex justify-between items-center gap-2 px-2">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        setSelectedTab("Laundry");
                      }}
                      className="text-green-500"
                    >
                      <MdModeEditOutline />
                    </button>
                    <button
                      onClick={() => handleDelete(lItem?._id)}
                      className="text-red-500 text-lg font-bold"
                    >
                      <RxCross2 />
                    </button>
                  </div>
                  <p className="font-semibold text-md capitalize">
                    {lItem?.serviceName}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold">
                    ₹{totalPricePerKg}/KG × {lItem?.weight}KG + ₹
                    {productsAddonsAndRequirements} = ₹
                    {calculateTotalPrice(lItem)}
                  </p>
                </div>
              </div>

              <div className="text-[12px] flex items-center gap-2 font-medium">
                <p> Piece count: {lItem?.pieceCount}</p>
              </div>

              {lItem?.productAddons?.length > 0 ? (
                <div className="flex items-center text-xs font-medium w-full mt-0.5 gap-1">
                  <p>Addons: </p>
                  <div className="flex items-center justify-start gap-1 w-full">
                    {lItem?.productAddons?.map((item, index) => {
                      const matchedAddon = addonData.find(
                        (addon) => addon.addon === item?.name
                      );

                      return (
                        <div key={item}>
                          <p>
                            {matchedAddon
                              ? `${matchedAddon.shortForm} (₹ ${item?.price})`
                              : `${item?.name} (₹ ${item?.price})`}
                            {index < lItem?.productAddons?.length - 1 && ", "}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                " "
              )}

              <div className="relative w-full text-xs">
                <button
                  className="absolute left-0 top-1/2 transform -translate-y-1/2 px-1 py-2 rounded-md"
                  onClick={() => scrollLeft(cartIndex)}
                >
                  <FaAngleLeft />
                </button>
                <div
                  ref={(el) => (scrollContainerRefs.current[cartIndex] = el)}
                  className="flex gap-1  p-2 rounded-md m-1 overflow-x-auto scroll-smooth mx-7"
                  style={{ scrollBehavior: "smooth", scrollbarWidth: "none" }}
                >
                  {lItem?.products?.map((item, index) => {
                    return (
                      <div
                        key={index}
                        className="min-w-max rounded-md bg-gray-200 p-1 px-2"
                      >
                        <p>
                          <span className="font-semibold">
                            {item?.productDetails?.name}{" "}
                          </span>
                          <span>
                            {item?.additionalServices?.map((service, index) => {
                              const matchedAddon = productAddonsData.find(
                                (addon) => addon.name === service?.name
                              );

                              return (
                                <span key={service}>
                                  {matchedAddon
                                    ? `(${matchedAddon.shortForm} ₹${service?.price})`
                                    : `(${service?.name} ₹${service?.price})`}
                                  {index <
                                    item?.additionalServices?.length - 1 &&
                                    ", "}
                                </span>
                              );
                            })}
                          </span>
                          <span>
                            {item?.requirements?.map((requirement, index) => {
                              const matchedRequirement = requirementsData.find(
                                (req) => req.name === requirement?.name
                              );

                              return (
                                <span key={requirement}>
                                  [
                                  {matchedRequirement
                                    ? `${matchedRequirement.shortForm}`
                                    : `${requirement?.name}`}{" "}
                                  ₹{requirement?.price}]
                                  {index < item?.requirements?.length - 1 &&
                                    " "}
                                </span>
                              );
                            })}
                          </span>
                          {item?.comments?.length > 0
                            ? `(${item.comments
                                .map((comment, cIndex) => {
                                  const isLastComment =
                                    cIndex === item.comments.length - 1;
                                  const commentText =
                                    comment.text || comment.content || comment;
                                  const shortForm =
                                    shortFormLookup[commentText] || commentText;

                                  return `${shortForm}${
                                    !isLastComment ? ", " : ""
                                  }`;
                                })
                                .join("")})`
                            : ""}
                        </p>
                      </div>
                    );
                  })}
                </div>
                <button
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 px-1 py-2 rounded-md"
                  onClick={() => scrollRight(cartIndex)}
                >
                  <FaAngleRight />
                </button>
              </div>
            </div>
          );
        })}
    </>
  );
};

export default LaundryCartComponent;
