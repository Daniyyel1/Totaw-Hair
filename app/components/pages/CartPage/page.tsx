"use client";
import { useOils } from "@/app/context/page";
import { LoaderIcon, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import Footer from "../../layouts/footer/page";

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity } = useOils();

  const [loading, setLoading] = useState(true);
  const [isCheckOut, setIsCheckOut] = useState(false);

  const total = cart.reduce((sum, ct) => sum + ct.oil.price * ct.quantity, 0);

  const handleCheckout = async () => {
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
    } finally {
      setIsCheckOut(false);
    }
  };

  useEffect(() => {
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
                  className="h-11 sm:h-12 w-full sm:w-40 text-sm sm:text-base border rounded-md hover:bg-black hover:text-white cursor-pointer"
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
    </div>
  );
};

export default CartPage;