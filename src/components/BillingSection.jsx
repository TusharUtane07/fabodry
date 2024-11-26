import { useState } from "react";

const BillingSection = () => {
  const [isChecked, setIsChecked] = useState(false);

  const products = [
    { name: "Sofa", qty: "02", price: "20" },
    { name: "Jeans ", qty: "02", price: "20" },
    { name: "Pant ", qty: "02", price: "20" },
    { name: "Shirt ", qty: "02", price: "20" },
    { name: "Shoes ", qty: "02", price: "20" },
  ];

  const handleCheckboxChange = () => {
    setIsChecked((prevState) => !prevState);
  };

  return (
    <div className="col-span-2 mt-8 border-2 mr-4 mb-4 border-[#eef0f2] rounded-xl">
      <div className="p-5">
        <h3 className="font-semibold">Billing Section</h3>
        <div className="mt-3">
          <input
            type="text"
            className=" border border-gray-300 text-sm rounded-lg  block w-full p-2.5"
            placeholder="Main"
            required
          />
        </div>
        <div className="mt-3 flex items-center space-x-4 border p-3 border-gray-300 rounded-xl">
          <div className="flex items-center">
            <input
              type="radio"
              id="walk_in"
              name="option"
              className="peer w-4 h-4 text-[#00414e] accent-[#00414e] focus:ring-0"
              required
            />
            <label
              htmlFor="walk_in"
              className="ml-2 text-sm font-medium text-gray-400 cursor-pointer"
            >
              Walk In
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="radio"
              id="pick_up"
              name="option"
              className="peer w-4 h-4 text-[#00414e] accent-[#00414e] focus:ring-0"
              required
            />
            <label
              htmlFor="pick_up"
              className="ml-2 text-sm font-medium text-gray-400 cursor-pointer"
            >
              Pick Up
            </label>
          </div>
        </div>
        <div className="relative overflow-x-auto  border-[#eef0f2] rounded-xl mt-3 border">
          <table className="w-full text-left ">
            <thead className=" text-[14px]  ">
              <tr>
                <th scope="col" className="px-4 py-2">
                  Item
                </th>
                <th scope="col" className="px-4 py-2">
                  Qty Item
                </th>
                <th scope="col" className="px-4 py-2">
                  Price
                </th>
                <th scope="col" className="px-4 py-2">
                  Delete
                </th>
              </tr>
            </thead>
            <tbody className="text-[12px]">
              {products.map((product, index) => (
                <tr key={index}>
                  <th scope="row" className="px-3 py-2  whitespace-nowrap">
                    {product.name}
                  </th>
                  <td className="px-4 py-2">{product.qty}</td>
                  <td className="px-4 py-2">{product.price}</td>
                  <td className="px-4 py-2">
                    <button className=" text-red-500">Delete</button>
                  </td>
                </tr>
              ))}
              <tr className="border-t ">
                <th scope="row" className="px-3 py-2  whitespace-nowrap">
                  Total
                </th>
                <td className="px-4">100</td>
                <td className="px-4">10</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="flex justify-between gap-1 text-xs">
          <div className="flex items-center border-[#eef0f2] rounded-xl mt-3 space-x-4 border py-1.5 px-2 w-full">
            <input
              type="date"
              id="delivery-date"
              className="peer focus:outline-none outline-none w-4 h-4 text-[#00414e] accent-[#00414e] focus:ring-0"
              required
            />
            <label
              htmlFor="delivery-date"
              className="ml-2 text-sm font-medium text-gray-400 cursor-pointer"
            >
              Delivery Date
            </label>
          </div>

          <div className="flex items-center border-[#eef0f2] justify-start rounded-xl mt-3 space-x-4 border px-2 py-1.5 w-full">
            <input
              type="time"
              id="delivery-time-slot"
              className="peer w-4 h-4 focus:outline-none outline-none text-[#00414e] accent-[#00414e] focus:ring-0"
              required
            />
            <div className="flex justify-between gap-3 items-center w-full">
              <label
                htmlFor="delivery-time-slot"
                className="ml-2 text-sm font-medium text-gray-400 cursor-pointer"
              >
                Delivery Time Slot
              </label>
              <svg
                width="28"
                height="28"
                viewBox="0 0 28 28"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M21.1022 14.1435C19.9558 14.1435 18.8729 14.5172 17.9705 15.2243C17.7925 15.3638 17.7612 15.6212 17.9007 15.7992C18.0402 15.9772 18.2977 16.0084 18.4757 15.8689C19.2325 15.2759 20.1408 14.9624 21.1022 14.9624C23.4532 14.9624 25.3659 16.8751 25.3659 19.2261C25.3659 21.5772 23.4532 23.4899 21.1022 23.4899C18.7512 23.4899 16.8385 21.5772 16.8385 19.2261C16.8385 18.4222 17.0644 17.6384 17.4917 16.9593C17.6122 16.7679 17.5546 16.5151 17.3632 16.3946C17.1718 16.2742 16.9189 16.3318 16.7985 16.5231C16.2889 17.333 16.0194 18.2677 16.0194 19.2261C16.0194 22.0288 18.2995 24.3089 21.1022 24.3089C23.9049 24.3089 26.185 22.0288 26.185 19.2261C26.185 16.4236 23.9049 14.1435 21.1022 14.1435Z"
                  fill="#004D57"
                />
                <path
                  d="M24.314 19.4277H21.5117V16.6254C21.5117 16.3993 21.3284 16.2159 21.1022 16.2159C20.8761 16.2159 20.6927 16.3993 20.6927 16.6254V19.8373C20.6927 20.0634 20.8761 20.2468 21.1022 20.2468H24.314C24.5402 20.2468 24.7235 20.0634 24.7235 19.8373C24.7235 19.6112 24.5402 19.4277 24.314 19.4277Z"
                  fill="#004D57"
                />
                <path
                  d="M25.0217 13.5536V6.45017C25.0217 5.38278 24.1532 4.51434 23.0858 4.51434H22.2069V3.50651C22.2069 2.60739 21.4755 1.87595 20.5763 1.87595C19.6772 1.87595 18.9458 2.60739 18.9458 3.50651V4.51429H16.83V3.50651C16.83 2.60739 16.0985 1.87595 15.1994 1.87595C14.3003 1.87595 13.5688 2.60739 13.5688 3.50651V4.51429H11.453V3.50651C11.453 2.60739 10.7216 1.87595 9.82248 1.87595C8.92336 1.87595 8.19191 2.60739 8.19191 3.50651V4.51429H6.07611V3.50651C6.07611 2.60739 5.34466 1.87595 4.44555 1.87595C3.54643 1.87595 2.81482 2.60739 2.81482 3.50651V4.51429H1.93583C0.868437 4.51429 0 5.38267 0 6.45017V6.65219C0 6.87832 0.183367 7.06169 0.4095 7.06169C0.635633 7.06169 0.819 6.87832 0.819 6.65219V6.45017C0.819 5.83439 1.32005 5.33334 1.93583 5.33334H2.81471C2.81471 5.33334 2.81471 6.34107 2.81471 6.34113C2.81471 7.24024 3.54616 7.97169 4.44527 7.97169C5.34439 7.97169 6.07584 7.24024 6.07584 6.34107V5.33334H8.19164C8.19164 5.33334 8.19164 6.34107 8.19164 6.34113C8.19164 7.24024 8.92309 7.97169 9.8222 7.97169C10.7213 7.97169 11.4528 7.24024 11.4528 6.34107V5.33334H13.5686C13.5686 5.33334 13.5686 6.34107 13.5686 6.34113C13.5686 7.24024 14.3 7.97169 15.1991 7.97169C16.0982 7.97169 16.8297 7.24024 16.8297 6.34107V5.33334H18.9455C18.9455 5.33334 18.9455 6.34107 18.9455 6.34113C18.9455 7.24024 19.6769 7.97169 20.5761 7.97169C21.4752 7.97169 22.2066 7.24024 22.2066 6.34107V5.33334H23.0855C23.7013 5.33334 24.2024 5.83439 24.2024 6.45017V9.34041H0.819V8.29019C0.819 8.06405 0.635633 7.88069 0.4095 7.88069C0.183367 7.88069 0 8.064 0 8.29019V22.4226C0 23.4901 0.868437 24.3585 1.93583 24.3585H16.4988C17.7207 25.4556 19.3347 26.1241 21.1022 26.1241C22.5781 26.1241 23.986 25.6641 25.1739 24.7941C25.3564 24.6604 25.3959 24.4041 25.2623 24.2217C25.1286 24.0392 24.8723 23.9997 24.6899 24.1333C23.6434 24.8999 22.4028 25.305 21.1022 25.305C17.7503 25.305 15.0234 22.5781 15.0234 19.2263C15.0234 15.8745 17.7504 13.1475 21.1022 13.1475C21.7086 13.1475 22.3127 13.2383 22.8924 13.4166C22.9039 13.4201 22.9152 13.4238 22.9267 13.4274C25.3898 14.2041 27.1809 16.5098 27.1809 19.2263C27.1809 20.6277 26.6924 21.9954 25.8054 23.0773C25.6621 23.2522 25.6875 23.5103 25.8624 23.6536C26.0374 23.797 26.2954 23.7715 26.4387 23.5966C27.4455 22.3687 28 20.8166 28 19.2263C28 16.8777 26.8198 14.7998 25.0217 13.5536ZM5.25684 6.34107C5.25684 6.78858 4.89278 7.15263 4.44527 7.15263C3.99777 7.15263 3.63371 6.78863 3.63371 6.34107V3.50651C3.63371 3.059 3.99771 2.69495 4.44527 2.69495C4.89278 2.69495 5.25684 3.05895 5.25684 3.50651V6.34107ZM10.6338 6.34107C10.6338 6.78858 10.2698 7.15263 9.82226 7.15263C9.37475 7.15263 9.0107 6.78863 9.0107 6.34107V3.50651C9.0107 3.059 9.37475 2.69495 9.82226 2.69495C10.2698 2.69495 10.6338 3.05895 10.6338 3.50651V6.34107ZM16.0109 6.34107C16.0109 6.78858 15.6468 7.15263 15.1993 7.15263C14.7518 7.15263 14.3877 6.78863 14.3877 6.34107V3.50651C14.3877 3.059 14.7518 2.69495 15.1993 2.69495C15.6468 2.69495 16.0109 3.05895 16.0109 3.50651V6.34107ZM21.3878 6.34107C21.3878 6.78858 21.0238 7.15263 20.5763 7.15263C20.1288 7.15263 19.7647 6.78863 19.7647 6.34107V3.50651C19.7647 3.059 20.1288 2.69495 20.5763 2.69495C21.0238 2.69495 21.3878 3.05895 21.3878 3.50651V6.34107ZM10.5001 10.1594H14.5216V14.0734H10.5001V10.1594ZM4.8405 23.5395H1.93583C1.32005 23.5395 0.819 23.0384 0.819 22.4226V19.6254H4.84045L4.8405 23.5395ZM4.8405 18.8064H0.819V14.8924H4.84045L4.8405 18.8064ZM4.8405 14.0734H0.819V10.1594H4.84045L4.8405 14.0734ZM5.6595 14.8924H9.68095V18.8064H5.6595V14.8924ZM9.68105 23.5395H5.65961V19.6255H9.68105V23.5395ZM9.68105 14.0734H5.65961V10.1594H9.68105V14.0734ZM10.5 14.8924H14.5215V17.1576C14.356 17.683 14.2521 18.2355 14.2176 18.8065H10.5V14.8924ZM15.7175 23.5395H10.5001V19.6255H14.216C14.2971 21.071 14.8182 22.4239 15.7175 23.5395ZM15.3406 15.4384V14.8924H15.7404C15.5985 15.0676 15.4651 15.2498 15.3406 15.4384ZM19.3621 12.5511C18.2929 12.83 17.3241 13.3598 16.5222 14.0734H15.3406V10.1594H19.3621V12.5511ZM24.2026 13.0632C23.817 12.8689 23.4147 12.7126 23.0011 12.5944C22.9923 12.5919 22.9834 12.5893 22.9747 12.5868C22.3664 12.415 21.7344 12.3284 21.1023 12.3284C20.7899 12.3285 20.4825 12.3497 20.1811 12.3901V10.1593H24.2026V13.0632Z"
                  fill="#004D57"
                />
              </svg>
            </div>
          </div>
        </div>

        <div
          className={`mt-3 flex gap-3 items-center justify-start border  p-3 rounded-xl  ${
            isChecked ? "border-[#00414e]" : "border-[#eef0f2]"
          }`}
        >
          <input
            type="checkbox"
            id="home_delivery"
            checked={isChecked}
            onChange={handleCheckboxChange}
            className="peer hidden"
          />
          <label
            htmlFor="home_delivery"
            className="w-3 h-3 rounded-full border border-[#00414e] flex items-center justify-center cursor-pointer
             peer-checked:bg-[#00414e]"
          ></label>

          <label
            htmlFor="home_delivery"
            className="ml-2 text-sm font-medium text-gray-400 cursor-pointer"
          >
            Home Delivery
          </label>
        </div>
        {isChecked && (
          <div className="mt-3">
            <div className="mb-3">
              <input
                type="text"
                className="border border-gray-300 text-sm rounded-lg block w-full p-2.5"
                placeholder="Enter Pin Code"
                required
              />
            </div>
            <div>
              <textarea
                className="border border-gray-300 text-sm rounded-lg block w-full p-2.5"
                placeholder="Enter Full Address"
                rows="3"
                required
              ></textarea>
            </div>
          </div>
        )}

        <div className="flex items-center border-[#eef0f2] rounded-xl mt-3 space-x-4 border p-2">
          <input
            type="text"
            className=" text-sm rounded-lg py-3  block w-full"
            placeholder="Coupon Code"
            required
          />
          <button className="bg-[#016370] text-white text-[8px] px-6 py-2 rounded-lg">
            Apply Coupon
          </button>
        </div>

        <div className="mt-3">
          <h3 className="font-semibold">Payment Mode</h3>
          <div className="mt-3 flex items-center space-x-4 border p-3 border-gray-300 rounded-xl">
            <div className="flex items-center">
              <input
                type="radio"
                id="cash"
                name="payment_option"
                className="peer w-4 h-4 text-[#00414e] accent-[#00414e] focus:ring-0"
                required
              />
              <label
                htmlFor="cash"
                className="ml-2 text-sm font-medium text-gray-400 cursor-pointer"
              >
                Cash
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="radio"
                id="card"
                name="payment_option"
                className="peer w-4 h-4 text-[#00414e] accent-[#00414e] focus:ring-0"
                required
              />
              <label
                htmlFor="card"
                className="ml-2 text-sm font-medium text-gray-400 cursor-pointer"
              >
                Card
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="radio"
                id="cod"
                name="payment_option"
                className="peer w-4 h-4 text-[#00414e] accent-[#00414e] focus:ring-0"
                required
              />
              <label
                htmlFor="cod"
                className="ml-2 text-sm font-medium text-gray-400 cursor-pointer"
              >
                COD
              </label>
            </div>
          </div>
          <div className="flex mt-3 gap-2 justify-between text-sm">
            <button className=" border border-[#016370] text-[#016370]  w-full gap-2  py-3 rounded-lg">
              Cancel Order
            </button>
            <button className="bg-[#016370] text-white  w-full gap-2  py-3 rounded-lg">
              Apply Coupon
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingSection;
