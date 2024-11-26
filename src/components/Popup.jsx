import { useState } from "react";

const Popup = ({isOpen, setIsOpen}) => {
  const togglePopup = () => {
    setIsOpen(!isOpen);
  };

  const [count, setCount] = useState(1);

  const handleIncrement = () => {
    setCount(count + 1);
  };

  const handleDecrement = () => {
    if (count > 1) {
      setCount(count - 1);
    }
  };

  const [isPremium, setIsPremium] = useState(false);

  const handleToggle = () => {
    setIsPremium(!isPremium);
  };

  return (
    <div className="flex justify-center items-center">
      {isOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50 p-5 pb-10">
          <div className="bg-white rounded-lg p-6">
            <h2 className="text-xl text-[#00414e] mb-4">
              Sherwani Service Form
            </h2>
            <div className="space-y-2 mt-5 mx-8">
              <p className="text-gray-600">Select Sherwani Type</p>
              <div className="flex justify-start gap-3">
                <button className="rounded-lg text-sm text-black/80 px-5 py-2 border border-[#88A5BF]">
                  Kids
                </button>
                <button className="rounded-lg text-sm text-black/80 px-5 py-2 border border-[#88A5BF]">
                  Silk
                </button>
                <button className="rounded-lg text-sm text-black/80 px-5 py-2 border border-[#88A5BF]">
                  Linen
                </button>
                <button className="rounded-lg text-sm text-black/80 px-5 py-2 border border-[#88A5BF]">
                  Cotton
                </button>
                <button className="rounded-lg text-sm text-black/80 px-5 py-2 border border-[#88A5BF]">
                  Wedding
                </button>
              </div>
            </div>
            <div className="space-y-2 mt-5 mx-8">
              <p className="text-gray-600">Select One or More Services</p>
              <div className="flex justify-start gap-3">
                <button className="rounded-lg text-sm text-black/80 px-5 py-2 border border-[#88A5BF]">
                  Dry Clean (Rs 800/pc)
                </button>
                <button className="rounded-lg text-sm text-black/80 px-5 py-2 border border-[#88A5BF]">
                  Steam Press (Rs 800/pc)
                </button>
                <button className="rounded-lg text-sm text-black/80 px-5 py-2 border border-[#88A5BF]">
                  Starching (Rs 800/pc)
                </button>
              </div>
            </div>
            <div className="space-y-2 mt-5 mx-8">
              <p className="text-gray-600">Requirements</p>
              <div className="flex justify-start gap-3">
                <button className="rounded-lg text-sm text-black/80 px-5 py-2 border border-[#88A5BF]">
                  Fold (Rs 10/pc)
                </button>
                <button className="rounded-lg text-sm text-black/80 px-5 py-2 border border-[#88A5BF]">
                  Hanger (Rs 10/pc)
                </button>
                <button className="rounded-lg text-sm text-black/80 px-5 py-2 border border-[#88A5BF]">
                  On Hanger (Rs 20/pc)
                </button>
              </div>
            </div>
            <div className="space-y-2 mt-5 mx-8">
              <p className="text-gray-600">Comments</p>
              <div className="grid grid-cols-4 justify-start gap-3">
                <button className="rounded-lg text-sm text-black/80 px-5 py-2 border border-[#88A5BF]">
                  Beads Damaged
                </button>
                <button className="rounded-lg text-sm text-black/80 px-5 py-2 border border-[#88A5BF]">
                  Beads Missing
                </button>
                <button className="rounded-lg text-sm text-black/80 px-5 py-2 border border-[#88A5BF]">
                  Bleach Mark
                </button>
                <button className="rounded-lg text-sm text-black/80 px-5 py-2 border border-[#88A5BF]">
                  Button Missing
                </button>
                <button className="rounded-lg text-sm text-black/80 px-5 py-2 border border-[#88A5BF]">
                  Part Missing
                </button>
                <button className="rounded-lg text-sm text-black/80 px-5 py-2 border border-[#88A5BF]">
                  No Guarantee for Stain
                </button>
                <button className="rounded-lg text-sm text-black/80 px-5 py-2 border border-[#88A5BF]">
                  Fungus Stain
                </button>
                <button className="rounded-lg text-sm text-black/80 px-5 py-2 border border-[#88A5BF]">
                  Lining Damaged
                </button>
                <button className="rounded-lg text-sm text-black/80 px-5 py-2 border border-[#88A5BF]">
                  Hole
                </button>
                <button className="rounded-lg text-sm text-black/80 px-5 py-2 border border-[#88A5BF]">
                  Lining Damaged
                </button>
              </div>
            </div>
            <div className="space-y-2 mt-5 mx-8">
              <p className="text-gray-600">Count</p>
              <div className="flex justify-start gap-3">
                <div className="border border-gray-300 rounded-lg my-2 p-1 flex items-center">
                  <button
                    className="bg-[#006370] text-white rounded-full p-0.5 px-2.5"
                    onClick={handleIncrement}
                  >
                    +
                  </button>
                  <span className="text-gray-500 px-5">{count}</span>
                  <button
                    className="bg-[#006370] text-white rounded-full p-0.5 px-2.5"
                    onClick={handleDecrement}
                  >
                    -
                  </button>
                </div>
              </div>
            </div>
            <div
              className={`flex mt-3 mx-8 items-center justify-between w-96 h-12 px-1 text-sm bg-gray-300 rounded-full cursor-pointer`}
              onClick={handleToggle}
            >
              <div
                className={`flex-1 text-center py-2 rounded-full px-3 transition-all ${
                  !isPremium ? "bg-[#006370] text-white" : "text-black"
                }`}
              >
                Steam Press
              </div>
              <div
                className={`flex-1 text-center py-2  rounded-full px-3 transition-all ${
                  isPremium ? "bg-[#006370] text-white" : "text-black"
                }`}
              >
                Premium Steam Press
              </div>
            </div>
            <div className="mt-4 mx-8">
                <button onClick={togglePopup} className="text-sm bg-[#006370] text-white px-20 py-2 rounded-lg">Add</button>
                <button onClick={togglePopup} className="text-sm bg-[#006370] ml-3 text-white px-20 py-2 rounded-lg">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Popup;
