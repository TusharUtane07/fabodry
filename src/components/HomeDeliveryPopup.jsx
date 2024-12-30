import axios from "axios";
import { useState, useMemo } from "react";
import toast from "react-hot-toast";
import { useCart } from "../context/CartContenxt";
import { Autocomplete, useJsApiLoader } from "@react-google-maps/api";

// Define libraries array outside component to prevent recreating on each render
const libraries = ["places"];

const HomeDeliveryPopup = ({ isOpen, setIsOpen, onAddressChange }) => {
  const togglePopup = () => setIsOpen(!isOpen);
  const { refreshCart } = useCart();

  const [location, setLocation] = useState("");
  const [fullAddress, setFullAddress] = useState("");
  const [plotNumber, setPlotNumber] = useState("");
  const [landmark, setLandmark] = useState("");
  const [label, setLabel] = useState("Home");
  const [postalCode, setPostalCode] = useState("");
  const [errors, setErrors] = useState({});

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries 
  });
  
  const [autocomplete, setAutocomplete] = useState(null);

  const validateForm = () => {
    const newErrors = {};
    if (!location.trim()) newErrors.location = "Location is required";
    if (!fullAddress.trim()) newErrors.fullAddress = "Address is required";
    if (!plotNumber.trim()) newErrors.plotNumber = "Plot number is required";
    if (!landmark.trim()) newErrors.landmark = "City is required";
    if (!postalCode.trim()) newErrors.postalCode = "Postal code is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onLoad = (autocompleteInstance) => {
    setAutocomplete(autocompleteInstance);
  };

  const onPlaceChanged = () => {
    if (autocomplete) {
      const place = autocomplete.getPlace();
      const addressComponents = place.address_components || [];
      const formattedAddress = place.formatted_address || "";

      let plot = "";
      let city = "";
      let postal = "";

      addressComponents.forEach((component) => {
        if (component.types.includes("street_number")) {
          plot = component.long_name;
        } else if (component.types.includes("locality")) {
          city = component.long_name;
        } else if (component.types.includes("postal_code")) {
          postal = component.long_name;
        }
      });

      setLocation(formattedAddress);
      setFullAddress(formattedAddress);
      setPlotNumber(plot);
      setLandmark(city);
      setPostalCode(postal);
      setErrors({});
    }
  };

  const addAddressForCustomer = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const userId = localStorage.getItem("userId");
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}api/v1/customers/${userId}/address`,
        {
          label,
          addressLine1: fullAddress,
          addressLine2: plotNumber,
          city: landmark,
          postalCode,
          state: "state",
          country: "country",
        }
      );
      if (response) {
        toast.success("New Address added successfully");
      }
      refreshCart();
      onAddressChange();
      setIsOpen(false);
    } catch (error) {
      toast.error("Error Adding new Address");
      console.error("Error Adding Address", error);
    }
  };

  if (loadError) {
    return <div>Error loading Google Maps API</div>;
  }

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="relative">
        {isOpen && (
          <div
            className="fixed inset-0 bg-gray-800 bg-opacity-50 z-50"
            onClick={() => setIsOpen(false)}
          ></div>
        )}
        <div
          className={`fixed inset-y-0 right-0 bg-white w-[450px] h-full shadow-lg pt-2 z-50 p-5 transform transition-transform duration-300 ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <h2 className="text-xl font-semibold mb-4 pt-3">Delivery Details</h2>
          <button
            onClick={togglePopup}
            className="absolute top-3 right-3 text-xl text-gray-200 px-2 py-1 rounded-xl bg-gray-800"
          >
            ✕
          </button>
          <div className="flex w-full h-full pb-10 justify-between">
            <form
              onSubmit={addAddressForCustomer}
              className="w-[350px] rounded-xl p-5"
            >
              <div className="mb-4">
                <label
                  htmlFor="fullAddress"
                  className="block text-sm text-gray-400 mb-1"
                >
                  Enter Location *
                </label>
                <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
                  <input
                    id="fullAddress"
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className={`w-full px-3 py-2 border ${
                      errors.location ? 'border-red-500' : 'border-gray-300'
                    } focus:outline-none rounded-md shadow-sm placeholder:text-gray-300`}
                    placeholder="Enter your location"
                  />
                </Autocomplete>
                {errors.location && (
                  <p className="text-red-500 text-sm mt-1">{errors.location}</p>
                )}
              </div>
              <div className="mb-4">
                <label
                  htmlFor="selected-address"
                  className="block text-sm text-gray-400 mb-1"
                >
                  Selected Address *
                </label>
                <input
                  type="text"
                  id="selected-address"
                  value={fullAddress}
                  onChange={(e) => setFullAddress(e.target.value)}
                  className={`w-full px-3 py-2 border ${
                    errors.fullAddress ? 'border-red-500' : 'border-gray-300'
                  } focus:outline-none rounded-md shadow-sm placeholder:text-gray-300`}
                  placeholder="Enter your selected address"
                />
                {errors.fullAddress && (
                  <p className="text-red-500 text-sm mt-1">{errors.fullAddress}</p>
                )}
              </div>
              <div className="mb-4">
                <label
                  htmlFor="plot-number"
                  className="block text-sm text-gray-400 mb-1"
                >
                  Plot Number *
                </label>
                <input
                  type="text"
                  id="plot-number"
                  value={plotNumber}
                  onChange={(e) => setPlotNumber(e.target.value)}
                  className={`w-full px-3 py-2 border ${
                    errors.plotNumber ? 'border-red-500' : 'border-gray-300'
                  } focus:outline-none rounded-md shadow-sm placeholder:text-gray-300`}
                  placeholder="Enter your plot number"
                />
                {errors.plotNumber && (
                  <p className="text-red-500 text-sm mt-1">{errors.plotNumber}</p>
                )}
              </div>
              <div className="mb-4">
                <label
                  htmlFor="city"
                  className="block text-sm text-gray-400 mb-1"
                >
                  City *
                </label>
                <input
                  type="text"
                  id="city"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  className={`w-full px-3 py-2 border ${
                    errors.landmark ? 'border-red-500' : 'border-gray-300'
                  } focus:outline-none rounded-md shadow-sm placeholder:text-gray-300`}
                  placeholder="Enter your city"
                />
                {errors.landmark && (
                  <p className="text-red-500 text-sm mt-1">{errors.landmark}</p>
                )}
              </div>
              <div className="mb-4">
                <label
                  htmlFor="postal-code"
                  className="block text-sm text-gray-400 mb-1"
                >
                  Postal Code *
                </label>
                <input
                  type="text"
                  id="postal-code"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  className={`w-full px-3 py-2 border ${
                    errors.postalCode ? 'border-red-500' : 'border-gray-300'
                  } focus:outline-none rounded-md shadow-sm placeholder:text-gray-300`}
                  placeholder="Enter your postal code"
                />
                {errors.postalCode && (
                  <p className="text-red-500 text-sm mt-1">{errors.postalCode}</p>
                )}
              </div>
              <div className="mb-4">
                <label
                  htmlFor="label"
                  className="block text-sm text-gray-400 mb-1"
                >
                  Select Label 
                </label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setLabel("Home")}
                    className={`px-4 py-1 ${
                      label === "Home" ? "bg-[#00414e] text-white" : "border border-[#00414e] text-gray-700"
                    } rounded-full`}
                  >
                    Home
                  </button>
                  <button
                    type="button"
                    onClick={() => setLabel("Office")}
                    className={`px-4 py-1 ${
                      label === "Office" ? "bg-[#00414e] text-white" : "border border-[#00414e] text-gray-700"
                    } rounded-full`}
                  >
                    Office
                  </button>
                  <button
                    type="button"
                    onClick={() => setLabel("Other")}
                    className={`px-4 py-1 ${
                      label === "Other" ? "bg-[#00414e] text-white" : "border border-[#00414e] text-gray-700"
                    } rounded-full`}
                  >
                    Other
                  </button>
                </div>
              </div>
              <button
                type="submit"
                className="w-full px-4 py-2 bg-[#00414e] text-white rounded-md"
              >
                Add Address
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomeDeliveryPopup;