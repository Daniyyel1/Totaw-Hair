// "use client";
// import { useOils } from "@/app/context/page";
// import { LoaderIcon, Trash2 } from "lucide-react";
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import Image from "next/image";
// import Footer from "../../layouts/footer/page";

// const CartPage = () => {
//   const { cart, removeFromCart, updateQuantity } = useOils();

//   const [loading, setLoading] = useState(true);
//   const [isCheckOut, setIsCheckOut] = useState(false);

//   const total = cart.reduce((sum, ct) => sum + ct.oil.price * ct.quantity, 0);

//   const handleCheckout = async () => {
//     setIsCheckOut(true);

//     try {
//       const response = await axios.post(
//         "/api/checkout",
//         {},
//         { withCredentials: true },
//       );
//       window.location.href = response.data.url; // redirect to Paystack
//     } catch (e) {
//       console.error(e);
//     } finally {
//       setIsCheckOut(false);
//     }
//   };

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setLoading(false);
//     }, 2000);

//     return () => clearTimeout(timer);
//   }, []);

//   return (
//     <div className="max-w-275 mx-auto mt-20 sm:mt-24 md:mt-30 font-oldstandard px-4 sm:px-6 md:px-0">
//       {loading ? (
//         <div className="flex justify-center items-center ">
//           <LoaderIcon
//             role="status"
//             aria-label="Loading"
//             className="size-14 sm:size-20 text-[#FFC0CB] mt-20 sm:mt-30 animate-spin"
//           />
//         </div>
//       ) : (
//         <div>
//           {cart.length > 0 ? (
//             <div className="flex flex-col gap-4">
//               {cart.map((ct) => (
//                 <div
//                   key={ct._id}
//                   className="flex flex-wrap sm:flex-nowrap items-center gap-3 sm:gap-4 border-b pb-4"
//                 >
//                   <Image
//                     width={50}
//                     height={50}
//                     src={
//                       ct.oil.itemImage?.startsWith("/9j/")
//                         ? `data:image/jpeg;base64,${ct.oil.itemImage}`
//                         : ct.oil.itemImage || "/placeholder.jpg"
//                     }
//                     alt={ct.oil.name}
//                     className="h-20 w-14 sm:h-24 sm:w-16 object-cover rounded-md"
//                   />
//                   <div className="flex-1 min-w-[120px] sm:min-w-[140px]">
//                     <h2 className="capitalize text-sm sm:text-base">{ct.oil.name}</h2>
//                     <span className="text-sm sm:text-base">
//                       ₦{" "}
//                       {ct.oil.price.toLocaleString("en-US", {
//                         minimumFractionDigits: 2,
//                         maximumFractionDigits: 2,
//                       })}
//                     </span>
//                   </div>

//                   {/* quantity controls */}
//                   <div className="flex items-center gap-2 border px-2 h-8 text-sm sm:text-base">
//                     <button
//                       disabled={ct.quantity === 1}
//                       onClick={() => updateQuantity(ct._id, ct.quantity - 1)}
//                       className={ct.quantity === 1 ? "opacity-20" : ""}
//                     >
//                       -
//                     </button>
//                     <span>{ct.quantity}</span>
//                     <button
//                       onClick={() => updateQuantity(ct._id, ct.quantity + 1)}
//                     >
//                       +
//                     </button>
//                   </div>

//                   <span className="w-full sm:w-20 text-right text-sm sm:text-base">
//                     ₦
//                     {(ct.oil.price * ct.quantity).toLocaleString("en-US", {
//                       minimumFractionDigits: 2,
//                       maximumFractionDigits: 2,
//                     })}
//                   </span>

//                   {/* remove button */}
//                   <button
//                     onClick={() => removeFromCart(ct._id)}
//                     className="text-red-400 hover:text-red-600 cursor-pointer"
//                   >
//                     <Trash2 className="size-4 sm:size-5" />
//                   </button>
//                 </div>
//               ))}

//               {/* total */}
//               <div className="flex justify-end gap-3 sm:gap-4 mt-4 text-base sm:text-lg font-medium">
//                 <span>Total:</span>
//                 <span>
//                   ₦
//                   {total.toLocaleString("en-US", {
//                     minimumFractionDigits: 2,
//                     maximumFractionDigits: 2,
//                   })}
//                 </span>
//               </div>

//               <div className="flex justify-end mt-4">
//                 <button
//                   onClick={handleCheckout}
//                   className="h-11 sm:h-12 w-full sm:w-40 text-sm sm:text-base border rounded-md hover:bg-black hover:text-white cursor-pointer"
//                 >
//                   {isCheckOut ? (
//                     <div className="flex justify-center items-center">
//                       <LoaderIcon
//                         role="status"
//                         aria-label="Loading"
//                         className="size-6 text-[#D3D3FF]"
//                       />
//                     </div>
//                   ) : (
//                     "Checkout"
//                   )}
//                 </button>
//               </div>
//             </div>
//           ) : (
//             <div className="flex justify-center items-center h-40 sm:h-50">
//               <h1 className="text-xl sm:text-2xl">Your cart is empty</h1>
//             </div>
//           )}
//         </div>
//       )}
//         <div>
//            {
//             loading ? '' :  <Footer />
//            }
//         </div>
//     </div>
//   );
// };

// export default CartPage;

"use client";
import { useOils } from "@/app/context/page";
import { LoaderIcon, Trash2, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import Footer from "../../layouts/footer/page";
import { toast } from "sonner";

interface DeliveryDetails {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
}

const emptyDelivery: DeliveryDetails = {
  fullName: "",
  phone: "",
  address: "",
  city: "",
  state: "",
};

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity } = useOils();

  const [loading, setLoading] = useState(true);
  const [isCheckOut, setIsCheckOut] = useState(false);

  const [deliveryDetails, setDeliveryDetails] =
    useState<DeliveryDetails | null>(null);
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const [deliveryForm, setDeliveryForm] =
    useState<DeliveryDetails>(emptyDelivery);
  const [savingDelivery, setSavingDelivery] = useState(false);

  const total = cart.reduce((sum, ct) => sum + ct.oil.price * ct.quantity, 0);

  const fetchDeliveryDetails = async () => {
    try {
      const response = await axios.get("/api/delivery-details", {
        withCredentials: true,
      });
      setDeliveryDetails(response.data.data);
    } catch (e) {
      console.error(e);
    }
  };

  const proceedToPaystack = async () => {
    setIsCheckOut(true);

    try {
      const response = await axios.post(
        "/api/checkout",
        {},
        { withCredentials: true },
      );
      window.location.href = response.data.url; // redirect to Paystack
    } catch (e) {
      console.error(e);
      if (axios.isAxiosError(e) && e.response?.status === 400) {
        // server-side check caught missing delivery details even though
        // the client thought it had them (e.g. stale state) — reopen the modal
        toast.error(
          e.response.data?.message || "Please add your delivery details",
        );
        setDeliveryForm(emptyDelivery);
        setShowDeliveryModal(true);
      } else {
        toast.error("Something went wrong starting checkout");
      }
    } finally {
      setIsCheckOut(false);
    }
  };

  const handleCheckout = () => {
    if (!deliveryDetails) {
      setDeliveryForm(emptyDelivery);
      setShowDeliveryModal(true);
      return;
    }

    proceedToPaystack();
  };

  const handleSaveDelivery = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { fullName, phone, address, city, state } = deliveryForm;
    if (!fullName || !phone || !address || !city || !state) {
      toast.error("Please fill out all delivery fields");
      return;
    }

    setSavingDelivery(true);

    try {
      const response = await axios.post(
        "/api/delivery-details",
        deliveryForm,
        { withCredentials: true },
      );
      setDeliveryDetails(response.data.data);
      toast.success("Delivery details saved");
      setShowDeliveryModal(false);
      proceedToPaystack();
    } catch (e) {
      console.error(e);
      toast.error("Failed to save delivery details");
    } finally {
      setSavingDelivery(false);
    }
  };

  useEffect(() => {
    fetchDeliveryDetails();

    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="max-w-275 mx-auto mt-20 sm:mt-24 md:mt-30 font-oldstandard px-4 sm:px-6 md:px-0">
      {loading ? (
        <div className="flex justify-center items-center ">
          <LoaderIcon
            role="status"
            aria-label="Loading"
            className="size-14 sm:size-20 text-[#FFC0CB] mt-20 sm:mt-30 animate-spin"
          />
        </div>
      ) : (
        <div>
          {cart.length > 0 ? (
            <div className="flex flex-col gap-4">
              {cart.map((ct) => (
                <div
                  key={ct._id}
                  className="flex flex-wrap sm:flex-nowrap items-center gap-3 sm:gap-4 border-b pb-4"
                >
                  <Image
                    width={50}
                    height={50}
                    src={
                      ct.oil.itemImage?.startsWith("/9j/")
                        ? `data:image/jpeg;base64,${ct.oil.itemImage}`
                        : ct.oil.itemImage || "/placeholder.jpg"
                    }
                    alt={ct.oil.name}
                    className="h-20 w-14 sm:h-24 sm:w-16 object-cover rounded-md"
                  />
                  <div className="flex-1 min-w-[120px] sm:min-w-[140px]">
                    <h2 className="capitalize text-sm sm:text-base">{ct.oil.name}</h2>
                    <span className="text-sm sm:text-base">
                      ₦{" "}
                      {ct.oil.price.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>

                  {/* quantity controls */}
                  <div className="flex items-center gap-2 border px-2 h-8 text-sm sm:text-base">
                    <button
                      disabled={ct.quantity === 1}
                      onClick={() => updateQuantity(ct._id, ct.quantity - 1)}
                      className={ct.quantity === 1 ? "opacity-20" : ""}
                    >
                      -
                    </button>
                    <span>{ct.quantity}</span>
                    <button
                      onClick={() => updateQuantity(ct._id, ct.quantity + 1)}
                    >
                      +
                    </button>
                  </div>

                  <span className="w-full sm:w-20 text-right text-sm sm:text-base">
                    ₦
                    {(ct.oil.price * ct.quantity).toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>

                  {/* remove button */}
                  <button
                    onClick={() => removeFromCart(ct._id)}
                    className="text-red-400 hover:text-red-600 cursor-pointer"
                  >
                    <Trash2 className="size-4 sm:size-5" />
                  </button>
                </div>
              ))}

              {/* saved delivery details preview */}
              {deliveryDetails && (
                <div className="flex justify-between items-start gap-3 mt-2 border rounded-md p-3 text-sm sm:text-base">
                  <div>
                    <h3 className="font-bold mb-1">Delivering to:</h3>
                    <p>{deliveryDetails.fullName}</p>
                    <p>{deliveryDetails.phone}</p>
                    <p>
                      {deliveryDetails.address}, {deliveryDetails.city},{" "}
                      {deliveryDetails.state}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setDeliveryForm(deliveryDetails);
                      setShowDeliveryModal(true);
                    }}
                    className="text-[#FFC0CB] underline cursor-pointer shrink-0"
                  >
                    Edit
                  </button>
                </div>
              )}

              {/* total */}
              <div className="flex justify-end gap-3 sm:gap-4 mt-4 text-base sm:text-lg font-medium">
                <span>Total:</span>
                <span>
                  ₦
                  {total.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>

              <div className="flex justify-end mt-4">
                <button
                  onClick={handleCheckout}
                  disabled={isCheckOut}
                  className="h-11 sm:h-12 w-full sm:w-40 text-sm sm:text-base border rounded-md hover:bg-black hover:text-white cursor-pointer disabled:opacity-60"
                >
                  {isCheckOut ? (
                    <div className="flex justify-center items-center">
                      <LoaderIcon
                        role="status"
                        aria-label="Loading"
                        className="size-6 text-[#D3D3FF]"
                      />
                    </div>
                  ) : (
                    "Checkout"
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex justify-center items-center h-40 sm:h-50">
              <h1 className="text-xl sm:text-2xl">Your cart is empty</h1>
            </div>
          )}
        </div>
      )}
        <div>
           {
            loading ? '' :  <Footer />
           }
        </div>

      {showDeliveryModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-md w-full max-w-md p-6 relative">
            <button
              onClick={() => setShowDeliveryModal(false)}
              className="absolute top-3 right-3 cursor-pointer text-gray-400 hover:text-gray-600"
            >
              <X className="size-5" />
            </button>

            <h2 className="text-xl font-bold mb-1">Delivery Details</h2>
            <p className="text-sm text-gray-500 mb-4">
              {"Save your details once — we'll use them for future orders too."}
            </p>

            <form onSubmit={handleSaveDelivery} className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-bold">Full name</label>
                <input
                  value={deliveryForm.fullName}
                  onChange={(e) =>
                    setDeliveryForm((prev) => ({
                      ...prev,
                      fullName: e.target.value,
                    }))
                  }
                  className="border-b-2 outline-0 border-b-[#FFC0CB] py-1"
                  type="text"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-bold">Phone number</label>
                <input
                  value={deliveryForm.phone}
                  onChange={(e) =>
                    setDeliveryForm((prev) => ({
                      ...prev,
                      phone: e.target.value,
                    }))
                  }
                  className="border-b-2 outline-0 border-b-[#FFC0CB] py-1"
                  type="tel"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-bold">Delivery address</label>
                <input
                  value={deliveryForm.address}
                  onChange={(e) =>
                    setDeliveryForm((prev) => ({
                      ...prev,
                      address: e.target.value,
                    }))
                  }
                  className="border-b-2 outline-0 border-b-[#FFC0CB] py-1"
                  type="text"
                />
              </div>

              <div className="flex gap-3">
                <div className="flex flex-col gap-1 flex-1">
                  <label className="text-sm font-bold">City</label>
                  <input
                    value={deliveryForm.city}
                    onChange={(e) =>
                      setDeliveryForm((prev) => ({
                        ...prev,
                        city: e.target.value,
                      }))
                    }
                    className="border-b-2 outline-0 border-b-[#FFC0CB] py-1"
                    type="text"
                  />
                </div>

                <div className="flex flex-col gap-1 flex-1">
                  <label className="text-sm font-bold">State</label>
                  <input
                    value={deliveryForm.state}
                    onChange={(e) =>
                      setDeliveryForm((prev) => ({
                        ...prev,
                        state: e.target.value,
                      }))
                    }
                    className="border-b-2 outline-0 border-b-[#FFC0CB] py-1"
                    type="text"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={savingDelivery}
                className="h-11 mt-3 bg-[#FFC0CB] hover:bg-[#ffd4db] rounded-md font-bold cursor-pointer flex items-center justify-center disabled:opacity-60"
              >
                {savingDelivery ? (
                  <LoaderIcon className="size-5 animate-spin" />
                ) : (
                  "Save & continue to payment"
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;