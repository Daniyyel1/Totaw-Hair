


// "use client";
// import { useOils } from "@/app/context/page";
// import { LoaderIcon } from "lucide-react";
// import Image from "next/image";
// import React, { useEffect, useState } from "react";
// import { IoCartOutline } from "react-icons/io5";
// import Footer from "../../layouts/footer/page";
// import Link from "next/link";
// import { toast } from "sonner";
// import { useSession } from "next-auth/react";
// import { useRouter } from "next/navigation";

// const ProductsPage = () => {
//   const { oil, cart, addToCart, updateQuantity, removeFromCart } = useOils();
//   const [searchValue, setSearchValue] = useState("");
//   const [loadingId, setLoadingId] = useState<string | null>(null);
//   const [updatingId, setUpdatingId] = useState<string | null>(null);
//   const [loading, setLoading] = useState(true);
//   const { data: session } = useSession();

//   const router = useRouter();

//   const filteredSearch = oil.filter((ol) =>
//     ol.name.toLowerCase().includes(searchValue.toLowerCase()),
//   );

//   const handleCart = async (oilId: string) => {
//     try {
//       setLoadingId(oilId);

//       if (!session) {
//         toast.error("You need to login to add product to cart");
//         router.push("/Login");
//         return;
//       }

//       await addToCart(oilId, 1);
//       toast.success("Item added to cart");
//     } catch (e) {
//       console.error(e);
//     } finally {
//       setLoadingId(null);
//     }
//   };

//   const handleIncrement = async (cartId: string, currentQty: number) => {
//     try {
//       setUpdatingId(cartId);
//       await updateQuantity(cartId, currentQty + 1);
//     } catch (e) {
//       console.error(e);
//     } finally {
//       setUpdatingId(null);
//     }
//   };

//   const handleDecrement = async (cartId: string, currentQty: number) => {
//     try {
//       setUpdatingId(cartId);
//       if (currentQty <= 1) {
//         await removeFromCart(cartId);
//         toast.success("Item removed from cart");
//       } else {
//         await updateQuantity(cartId, currentQty - 1);
//       }
//     } catch (e) {
//       console.error(e);
//     } finally {
//       setUpdatingId(null);
//     }
//   };

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setLoading(false);
//     }, 2000);

//     return () => clearTimeout(timer);
//   }, []);

//   return (
//     <>
//       {loading ? (
//         <div className="flex justify-center items-center mt-50 sm:mt-24 lg:mt-50">
//           <h1 className="text-center text-[#FFC0CB] lg:text-6xl text-3xl  font-bold animate-pulse">
//             Just a moment...
//           </h1>
//         </div>
//       ) : (
//         <section className="max-w-275 mx-auto font-comorantInfant px-4 sm:px-6 lg:px-0">
//           <div className="mt-20 sm:mt-24 lg:mt-30">
//             <div>
//               <div className="border-2 focus-within:border-[#FFC0CB] flex justify-between items-center py-3 px-3.5 h-12 sm:h-13 w-full rounded-md">
//                 <input
//                   onChange={(e) => setSearchValue(e.target.value)}
//                   className="outline-0 w-full placeholder:text-sm sm:placeholder:text-xl "
//                   type="text"
//                   placeholder="Search all products"
//                 />
//               </div>
//               <div className="mt-8 sm:mt-10">
//                 <h1 className="text-lg sm:text-xl font-bold">All Products</h1>
//                 <div className="">
//                   <div className="py-2.5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-3.5">
//                     {filteredSearch.map((fs) => {
//                       const cartItem = cart.find(
//                         (item) => item.oil._id === fs._id,
//                       );

//                       return (
//                         <div className=" h-auto w-full" key={fs._id}>
//                           <div className="h-36 sm:h-56 lg:h-80 w-full">
//                             <Link href={`/components/pages/Products/${fs._id}`}>
//                               <Image
//                                 src={
//                                   fs.itemImage?.startsWith("/9j/")
//                                     ? `data:image/jpeg;base64,${fs.itemImage}`
//                                     : fs.itemImage || "/placeholder.jpg"
//                                 }
//                                 alt={fs.name}
//                                 width={300}
//                                 height={260}
//                                 className="object-cover h-full w-full rounded-md"
//                               />
//                             </Link>
//                           </div>
//                           <div className="px-1 sm:px-2 ">
//                             <h2 className="text-[13px] sm:text-[15px] lg:text-[17px] truncate font-medium">
//                               {fs.name}
//                             </h2>
//                             <span className="text-sm sm:text-lg lg:text-xl font-bold">
//                               ₦
//                               {fs.price.toLocaleString("en-US", {
//                                 minimumFractionDigits: 2,
//                                 maximumFractionDigits: 2,
//                               })}
//                             </span>

//                             {cartItem ? (
//                               <div className="flex justify-between items-center mt-2 sm:mt-3 rounded-md border h-9 sm:h-10 w-full bg-[#FFC0CB] px-2 sm:px-3">
//                                 <button
//                                   onClick={() =>
//                                     handleDecrement(
//                                       cartItem._id,
//                                       cartItem.quantity,
//                                     )
//                                   }
//                                   disabled={updatingId === cartItem._id}
//                                   className="text-lg sm:text-xl font-bold cursor-pointer disabled:opacity-50 w-6"
//                                 >
//                                   −
//                                 </button>

//                                 {updatingId === cartItem._id ? (
//                                   <LoaderIcon className="size-4 animate-spin" />
//                                 ) : (
//                                   <span className="text-sm sm:text-lg font-semibold">
//                                     {cartItem.quantity}
//                                   </span>
//                                 )}

//                                 <button
//                                   onClick={() =>
//                                     handleIncrement(
//                                       cartItem._id,
//                                       cartItem.quantity,
//                                     )
//                                   }
//                                   disabled={updatingId === cartItem._id}
//                                   className="text-lg sm:text-xl font-bold cursor-pointer disabled:opacity-50 w-6"
//                                 >
//                                   +
//                                 </button>
//                               </div>
//                             ) : (
//                               <button
//                                 onClick={() => handleCart(fs._id)}
//                                 disabled={loadingId === fs._id}
//                                 className="flex hover:text-white cursor-pointer mt-2 sm:mt-3 rounded-md justify-center items-center gap-2 sm:gap-3 border h-9 sm:h-10 w-full bg-[#FFC0CB] text-sm sm:text-lg lg:text-xl disabled:opacity-70"
//                               >
//                                 {loadingId === fs._id ? (
//                                   <div>
//                                     <LoaderIcon className="size-4 animate-spin" />
//                                   </div>
//                                 ) : (
//                                   <div className="flex justify-center items-center gap-2 sm:gap-4">
//                                     Start order <IoCartOutline />
//                                   </div>
//                                 )}
//                               </button>
//                             )}
//                           </div>
//                         </div>
//                       );
//                     })}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//           <Footer />
//         </section>
//       )}
//     </>
//   );
// };

// export default ProductsPage;


"use client";
import { useOils } from "@/app/context/page";
import { LoaderIcon } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { IoCartOutline } from "react-icons/io5";
import Footer from "../../layouts/footer/page";
import Link from "next/link";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const ProductsPage = () => {
  const {
    oil,
    cart,
    addToCart,
    updateQuantity,
    removeFromCart,
    oilsLoading,
    pagination,
    goToPage,
    updateSearch,
  } = useOils();

  const [searchValue, setSearchValue] = useState("");
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const { data: session } = useSession();

  const router = useRouter();

  // debounce the search box before hitting the server
  useEffect(() => {
    const timer = setTimeout(() => {
      updateSearch(searchValue);
    }, 400);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue]);

  const handleCart = async (oilId: string) => {
    try {
      setLoadingId(oilId);

      if (!session) {
        toast.error("You need to login to add product to cart");
        router.push("/Login");
        return;
      }

      await addToCart(oilId, 1);
      toast.success("Item added to cart");
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingId(null);
    }
  };

  const handleIncrement = async (cartId: string, currentQty: number) => {
    try {
      setUpdatingId(cartId);
      await updateQuantity(cartId, currentQty + 1);
    } catch (e) {
      console.error(e);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDecrement = async (cartId: string, currentQty: number) => {
    try {
      setUpdatingId(cartId);
      if (currentQty <= 1) {
        await removeFromCart(cartId);
        toast.success("Item removed from cart");
      } else {
        await updateQuantity(cartId, currentQty - 1);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <>
      {oilsLoading ? (
        <div className="flex justify-center items-center mt-50 sm:mt-24 lg:mt-50">
          <h1 className="text-center text-[#FFC0CB] lg:text-6xl text-3xl  font-bold animate-pulse">
            Just a moment...
          </h1>
        </div>
      ) : (
        <section className="max-w-275 mx-auto font-comorantInfant px-4 sm:px-6 lg:px-0">
          <div className="mt-20 sm:mt-24 lg:mt-30">
            <div>
              <div className="border-2 focus-within:border-[#FFC0CB] flex justify-between items-center py-3 px-3.5 h-12 sm:h-13 w-full rounded-md">
                <input
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="outline-0 w-full placeholder:text-sm sm:placeholder:text-xl "
                  type="text"
                  placeholder="Search all products"
                />
              </div>
              <div className="mt-8 sm:mt-10">
                <h1 className="text-lg sm:text-xl font-bold">All Products</h1>
                <div className="">
                  <div className="py-2.5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-3.5">
                    {oil.map((fs) => {
                      const cartItem = cart.find(
                        (item) => item.oil._id === fs._id,
                      );

                      return (
                        <div className=" h-auto w-full" key={fs._id}>
                          <div className="h-36 sm:h-56 lg:h-80 w-full">
                            <Link href={`/components/pages/Products/${fs._id}`}>
                              <Image
                                src={
                                  fs.itemImage?.startsWith("/9j/")
                                    ? `data:image/jpeg;base64,${fs.itemImage}`
                                    : fs.itemImage || "/placeholder.jpg"
                                }
                                alt={fs.name}
                                width={300}
                                height={260}
                                className="object-cover h-full w-full rounded-md"
                              />
                            </Link>
                          </div>
                          <div className="px-1 sm:px-2 ">
                            <h2 className="text-[13px] sm:text-[15px] lg:text-[17px] truncate font-medium">
                              {fs.name}
                            </h2>
                            <span className="text-sm sm:text-lg lg:text-xl font-bold">
                              ₦
                              {fs.price.toLocaleString("en-US", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </span>

                            {cartItem ? (
                              <div className="flex justify-between items-center mt-2 sm:mt-3 rounded-md border h-9 sm:h-10 w-full bg-[#FFC0CB] px-2 sm:px-3">
                                <button
                                  onClick={() =>
                                    handleDecrement(
                                      cartItem._id,
                                      cartItem.quantity,
                                    )
                                  }
                                  disabled={updatingId === cartItem._id}
                                  className="text-lg sm:text-xl font-bold cursor-pointer disabled:opacity-50 w-6"
                                >
                                  −
                                </button>

                                {updatingId === cartItem._id ? (
                                  <LoaderIcon className="size-4 animate-spin" />
                                ) : (
                                  <span className="text-sm sm:text-lg font-semibold">
                                    {cartItem.quantity}
                                  </span>
                                )}

                                <button
                                  onClick={() =>
                                    handleIncrement(
                                      cartItem._id,
                                      cartItem.quantity,
                                    )
                                  }
                                  disabled={updatingId === cartItem._id}
                                  className="text-lg sm:text-xl font-bold cursor-pointer disabled:opacity-50 w-6"
                                >
                                  +
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => handleCart(fs._id)}
                                disabled={loadingId === fs._id}
                                className="flex hover:text-white cursor-pointer mt-2 sm:mt-3 rounded-md justify-center items-center gap-2 sm:gap-3 border h-9 sm:h-10 w-full bg-[#FFC0CB] text-sm sm:text-lg lg:text-xl disabled:opacity-70"
                              >
                                {loadingId === fs._id ? (
                                  <div>
                                    <LoaderIcon className="size-4 animate-spin" />
                                  </div>
                                ) : (
                                  <div className="flex justify-center items-center gap-2 sm:gap-4">
                                    Start order <IoCartOutline />
                                  </div>
                                )}
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {oil.length === 0 && (
                    <p className="text-center py-10 text-gray-500">
                      No products found.
                    </p>
                  )}

                  {pagination.totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-8 mb-4 flex-wrap">
                      <button
                        onClick={() => goToPage(pagination.page - 1)}
                        disabled={pagination.page === 1}
                        className="h-9 px-3 rounded-md border disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
                      >
                        Prev
                      </button>

                      {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
                        (p) => (
                          <button
                            key={p}
                            onClick={() => goToPage(p)}
                            className={`h-9 w-9 rounded-md border cursor-pointer ${
                              p === pagination.page
                                ? "bg-[#FFC0CB] font-bold"
                                : ""
                            }`}
                          >
                            {p}
                          </button>
                        ),
                      )}

                      <button
                        onClick={() => goToPage(pagination.page + 1)}
                        disabled={pagination.page === pagination.totalPages}
                        className="h-9 px-3 rounded-md border disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <Footer />
        </section>
      )}
    </>
  );
};

export default ProductsPage;