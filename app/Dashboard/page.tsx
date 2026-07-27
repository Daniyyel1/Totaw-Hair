// "use client";
// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import { toast } from "sonner";
// import { motion } from "framer-motion";
// import { ImagePlus, LoaderIcon } from "lucide-react";
// import Link from "next/link";

// interface Users {
//   id: string;
//   role: string;
// }

// interface Benefits {
//   label: string;
//   benefit: string;
// }

// interface Uses {
//   label: string;
//   usage: string;
// }

// const DashboardPage = () => {
//   const [selected, setSelected] = useState("Overview");
//   const [users, setUsers] = useState<Users[]>([]);
//   const [name, setName] = useState("");
//   const [description, setDescription] = useState("");
//   const [price, setPrice] = useState<number>(0);
//   const [preview, setPreview] = useState<string>("");
//   const [itemImage, setItemImage] = useState("");
//   const [loadingScreen, setLoadingScreen] = useState(true);
//   const [benefits, setBenefits] = useState<Benefits[]>([
//     { label: "", benefit: "" },
//   ]);
//   const [use, setUse] = useState<Uses[]>([{ label: "", usage: "" }]);
//   const [loading, setLoading] = useState(false);

//   const fetchUsers = async () => {
//     try {
//       const response = await axios.get("/api/users");
//       if (response.status === 201) {
//         setUsers(response.data.data);
//         toast.success("Users found");
//         console.log("Users", response.data.data);
//         return;
//       }
//     } catch (e) {
//       console.error(e);
//     }
//   };

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   const addBenefit = () => {
//     setBenefits((prev) => [...prev, { label: "", benefit: "" }]);
//   };

//   const removeBenefit = (index: number) => {
//     setBenefits((prev) => prev.filter((_, i) => i !== index));
//   };

//   const updateBenefit = (
//     index: number,
//     field: keyof Benefits,
//     value: string,
//   ) => {
//     setBenefits((prev) =>
//       prev.map((b, i) => (i === index ? { ...b, [field]: value } : b)),
//     );
//   };
//   const addUse = () => {
//     setUse((prev) => [...prev, { label: "", usage: "" }]);
//   };

//   const removeUse = (index: number) => {
//     setUse((prev) => prev.filter((_, i) => i !== index));
//   };

//   const updateUse = (index: number, field: keyof Uses, value: string) => {
//     setUse((prev) =>
//       prev.map((b, i) => (i === index ? { ...b, [field]: value } : b)),
//     );
//   };

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     if (!file.type.startsWith("image/")) {
//       toast.error("Please select an image file");
//       return;
//     }

//     if (file.size > 2 * 1024 * 1024) {
//       toast.error("Image must be under 2MB");
//       return;
//     }

//     const reader = new FileReader();

//     reader.onload = () => {
//       const base64String = reader.result as string;
//       setItemImage(base64String);
//       setPreview(base64String);
//     };

//     reader.onerror = () => {
//       toast.error("Failed to read image");
//     };

//     reader.readAsDataURL(file);
//   };

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();

//     if (!name || !description || !price || !benefits || !use || !itemImage) {
//       return toast.error("Please fill out all fields and upload product image");
//     }

//     setLoading(true);

//     const payload = {
//       name,
//       description,
//       price,
//       itemImage,
//       benefits,
//       use,
//     };

//     try {
//       const response = await fetch(`/api/products`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       const data = await response.json();

//       if (response.status === 201) {
//         toast.success("Product successfully uploaded");
//       } else {
//         toast.error(data?.message || "Failed to upload item");
//       }
//     } catch (e) {
//       console.error(e);
//       toast.error("Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setLoadingScreen(false);
//     }, 2000);

//     return () => clearTimeout(timer);
//   }, []);

//   const userCount = users?.filter((u) => u.role === "user").length ?? 0;

//   return (
//     <>
//       {loadingScreen ? (
//         <div className="flex justify-center items-center ">
//           <LoaderIcon
//             role="status"
//             aria-label="Loading"
//             className="size-14 sm:size-20 text-[#FFC0CB] mt-20 sm:mt-30 animate-spin"
//           />
//         </div>
//       ) : (
//         <section className="font-comorantInfant bg-[#FFC0CB] min-h-screen">
//           <div className="max-w-275 gap-5 py-6 sm:py-8 mx-auto px-3 sm:px-6 lg:px-0 grid grid-cols-1 md:grid-cols-[180px_1fr] lg:grid-cols-[200px_1fr]">
//             <div className="flex md:flex-col relative gap-3 sm:gap-5 items-center justify-center md:justify-start py-3 sm:py-6 md:py-12 bg-white rounded-md md:rounded-none">
//               <button
//                 onClick={() => setSelected("Overview")}
//                 className={`font-bold text-base sm:text-lg md:text-xl cursor-pointer md:hover:w-full hover:text-gray-400 transition-all duration-300 ease-in-out ${selected === "Overview" ? "text-[#FFC0CB] font-bold text-xl sm:text-2xl md:text-3xl" : ""}`}
//               >
//                 Overview
//               </button>
//               <button
//                 onClick={() => setSelected("Product")}
//                 className={`font-bold text-base sm:text-lg md:text-xl cursor-pointer md:hover:w-full hover:text-gray-400 transition-all duration-300 ease-in-out ${selected === "Product" ? "text-[#FFC0CB] font-bold text-xl sm:text-2xl md:text-3xl" : ""}`}
//               >
//                 Add a product
//               </button>
//               <div className="bottom-3">
//                 <Link href="/">
//                   <button className="border bg-black text-white h-10 w-35 rounded-md cursor-pointer">
//                     Home
//                   </button>
//                 </Link>
//               </div>
//             </div>
//             <div className="md:h-screen">
//               {selected === "Overview" && (
//                 <motion.div
//                   className="px-2 sm:px-4 md:px-6 py-4 sm:py-6"
//                   initial={{ opacity: 0, x: 40 }}
//                   whileInView={{ opacity: 1, x: 0 }}
//                   viewport={{ once: true }}
//                   transition={{ duration: 0.9, ease: "easeOut" }}
//                 >
//                   <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
//                     <div className="h-24 sm:h-28 md:h-30 w-full rounded-md bg-white flex flex-col justify-center items-center">
//                       <h1 className="text-lg sm:text-xl font-bold">Users</h1>
//                       <span className="text-lg sm:text-xl font-bold">
//                         [{userCount}]
//                       </span>
//                     </div>
//                     <div className="h-24 sm:h-28 md:h-30 w-full rounded-md bg-white flex flex-col justify-center items-center">
//                       <h1 className="text-lg sm:text-xl font-bold text-center px-2">
//                         Completed Orders
//                       </h1>
//                       <span className="text-lg sm:text-xl font-bold">[0]</span>
//                     </div>
//                     <div className="h-24 sm:h-28 md:h-30 w-full rounded-md bg-white flex flex-col justify-center items-center">
//                       <h1 className="text-lg sm:text-xl font-bold">Feeds</h1>
//                       <span className="text-lg sm:text-xl font-bold">[0]</span>
//                     </div>
//                   </div>
//                 </motion.div>
//               )}
//               {selected === "Product" && (
//                 <motion.div
//                   initial={{ opacity: 0, x: 40 }}
//                   whileInView={{ opacity: 1, x: 0 }}
//                   viewport={{ once: true }}
//                   transition={{ duration: 0.9, ease: "easeOut" }}
//                 >
//                   <div className="bg-white h-full rounded-md">
//                     <h1 className="text-center py-6 sm:py-8 text-xl sm:text-2xl font-bold px-3">
//                       Add a Product
//                     </h1>
//                     <form
//                       onSubmit={handleSubmit}
//                       className="flex flex-col gap-3 px-3 sm:px-5 pb-6"
//                     >
//                       <div className="flex flex-col gap-1">
//                         <label className="text-[15px] sm:text-[16px] font-bold">
//                           {"Product's name:"}
//                         </label>
//                         <input
//                           value={name}
//                           onChange={(e) => setName(e.target.value)}
//                           className="border-b-2 outline-0 border-b-[#FFC0CB] py-1"
//                           type="text"
//                         />
//                       </div>
//                       <div className="flex flex-col gap-1">
//                         <label className="text-[15px] sm:text-[16px] font-bold">
//                           {"Product's Description:"}
//                         </label>
//                         <input
//                           value={description}
//                           onChange={(e) => setDescription(e.target.value)}
//                           className="border-b-2 outline-0 border-b-[#FFC0CB] py-1"
//                           type="text"
//                         />
//                       </div>
//                       <label className="text-[15px] sm:text-[16px] font-bold">
//                         {"Product's Benefits:"}
//                       </label>

//                       {benefits.map((bt, index) => (
//                         <div
//                           key={index}
//                           className="flex flex-col gap-2 border-b pb-3 mb-3"
//                         >
//                           <div className="flex flex-col gap-1">
//                             <label className="text-[13px] sm:text-[14px] font-bold">
//                               {"*Benefits label"}
//                             </label>
//                             <input
//                               value={bt.label}
//                               onChange={(e) =>
//                                 updateBenefit(index, "label", e.target.value)
//                               }
//                               className="border-b-2 outline-0 border-b-[#FFC0CB] py-1"
//                               type="text"
//                             />
//                           </div>

//                           <div className="flex flex-col gap-1">
//                             <label className="text-[13px] sm:text-[14px] font-bold">
//                               {"*Benefits description"}
//                             </label>
//                             <input
//                               value={bt.benefit}
//                               onChange={(e) =>
//                                 updateBenefit(index, "benefit", e.target.value)
//                               }
//                               className="border-b-2 outline-0 border-b-[#FFC0CB] py-1"
//                               type="text"
//                             />
//                           </div>

//                           {benefits.length > 1 && (
//                             <button
//                               type="button"
//                               onClick={() => removeBenefit(index)}
//                               className="text-red-500 cursor-pointer text-sm self-start"
//                             >
//                               Remove
//                             </button>
//                           )}
//                         </div>
//                       ))}

//                       <button
//                         type="button"
//                         onClick={addBenefit}
//                         className="text-sm cursor-pointer font-bold text-[#FFC0CB] self-start"
//                       >
//                         + Add another benefit
//                       </button>
//                       <label className="text-[15px] sm:text-[16px] font-bold">
//                         {"Product's Uses:"}
//                       </label>

//                       {use.map((us, index) => (
//                         <div
//                           key={index}
//                           className="flex flex-col gap-2 border-b pb-3 mb-3"
//                         >
//                           <div className="flex flex-col gap-1">
//                             <label className="text-[13px] sm:text-[14px] font-bold">
//                               {"*Uses label"}
//                             </label>
//                             <input
//                               value={us.label}
//                               onChange={(e) =>
//                                 updateUse(index, "label", e.target.value)
//                               }
//                               className="border-b-2 outline-0 border-b-[#FFC0CB] py-1"
//                               type="text"
//                             />
//                           </div>

//                           <div className="flex flex-col gap-1">
//                             <label className="text-[13px] sm:text-[14px] font-bold">
//                               {"*Uses description"}
//                             </label>
//                             <input
//                               value={us.usage}
//                               onChange={(e) =>
//                                 updateUse(index, "usage", e.target.value)
//                               }
//                               className="border-b-2 outline-0 border-b-[#FFC0CB] py-1"
//                               type="text"
//                             />
//                           </div>

//                           {use.length > 1 && (
//                             <button
//                               type="button"
//                               onClick={() => removeUse(index)}
//                               className="text-red-500 cursor-pointer text-sm self-start"
//                             >
//                               Remove
//                             </button>
//                           )}
//                         </div>
//                       ))}

//                       <button
//                         type="button"
//                         onClick={addUse}
//                         className="text-sm cursor-pointer font-bold text-[#FFC0CB] self-start"
//                       >
//                         + Add another benefit
//                       </button>
//                       <div className="flex flex-col gap-1">
//                         <label className="text-[15px] sm:text-[16px] font-bold">
//                           {"Product's price:"}
//                         </label>
//                         <input
//                           value={price}
//                           onChange={(e) => {
//                             const val = e.target.value;
//                             setPrice(val === "" ? 0 : Number(val));
//                           }}
//                           className="border-b-2 outline-0 border-b-[#FFC0CB] py-1"
//                           type="text"
//                         />
//                       </div>
//                       <div className="border h-16 w-16 rounded-md overflow-hidden relative flex items-center justify-center shrink-0">
//                         {preview ? (
//                           <>
//                             {/* eslint-disable-next-line @next/next/no-img-element */}
//                             <img
//                               src={preview}
//                               alt="Profile preview"
//                               className="h-full w-full object-cover"
//                             />
//                             <button
//                               type="button"
//                               onClick={() => {
//                                 setPreview("");
//                                 setItemImage("");
//                               }}
//                               className="absolute top-0 right-0 bg-black/60 text-white text-xs w-4 h-4 flex items-center justify-center rounded-bl cursor-pointer"
//                             >
//                               ×
//                             </button>
//                           </>
//                         ) : (
//                           <label
//                             htmlFor="profile-picture-upload"
//                             className="h-full w-full flex items-center justify-center cursor-pointer text-gray-400 hover:text-gray-600 transition-colors"
//                           >
//                             <ImagePlus className="size-6" />
//                             <input
//                               id="profile-picture-upload"
//                               accept="image/*"
//                               type="file"
//                               onChange={handleImageChange}
//                               className="hidden"
//                             />
//                           </label>
//                         )}
//                       </div>
//                       <div className="flex justify-center items-center py-2">
//                         <button
//                           className="border flex justify-center items-center h-10 w-full sm:w-35 bg-[#FFC0CB] hover:text-white hover:bg-[#ffd4db] font-bold cursor-pointer rounded-md text-[16px] sm:text-[17px]"
//                           type="submit"
//                         >
//                           {loading ? (
//                             <LoaderIcon
//                               className="animate-spin size-6"
//                               size={5}
//                             />
//                           ) : (
//                             "Add Product"
//                           )}
//                         </button>
//                       </div>
//                     </form>
//                   </div>
//                 </motion.div>
//               )}
//             </div>
//           </div>
//         </section>
//       )}
//     </>
//   );
// };

// export default DashboardPage;

// "use client";
// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import { toast } from "sonner";
// import { motion } from "framer-motion";
// import { ImagePlus, LoaderIcon } from "lucide-react";
// import Link from "next/link";
// import Image from "next/image";

// interface Users {
//   id: string;
//   role: string;
// }

// interface Benefits {
//   label: string;
//   benefit: string;
// }

// interface Uses {
//   label: string;
//   usage: string;
// }

// interface DeliveryDetails {
//   fullName: string;
//   phone: string;
//   address: string;
//   city: string;
//   state: string;
// }

// interface OrderItem {
//   oil: {
//     _id: string;
//     name: string;
//     itemImage: string;
//   };
//   quantity: number;
//   price: number;
// }

// interface Order {
//   _id: string;
//   userId: string;
//   items: OrderItem[];
//   total: number;
//   status: string;
//   paystackReference: string;
//   deliveryDetails: DeliveryDetails;
//   createdAt: string;
// }

// const DashboardPage = () => {
//   const [selected, setSelected] = useState("Overview");
//   const [users, setUsers] = useState<Users[]>([]);
//   const [name, setName] = useState("");
//   const [description, setDescription] = useState("");
//   const [price, setPrice] = useState<number>(0);
//   const [preview, setPreview] = useState<string>("");
//   const [itemImage, setItemImage] = useState("");
//   const [loadingScreen, setLoadingScreen] = useState(true);
//   const [benefits, setBenefits] = useState<Benefits[]>([
//     { label: "", benefit: "" },
//   ]);
//   const [use, setUse] = useState<Uses[]>([{ label: "", usage: "" }]);
//   const [loading, setLoading] = useState(false);

//   const [orders, setOrders] = useState<Order[]>([]);
//   const [ordersLoading, setOrdersLoading] = useState(true);

//   const fetchUsers = async () => {
//     try {
//       const response = await axios.get("/api/users");
//       if (response.status === 201) {
//         setUsers(response.data.data);
//         toast.success("Users found");
//         console.log("Users", response.data.data);
//         return;
//       }
//     } catch (e) {
//       console.error(e);
//     }
//   };

//   const fetchOrders = async () => {
//     try {
//       const response = await axios.get("/api/orders", {
//         withCredentials: true,
//       });
//       setOrders(response.data.data ?? []);
//     } catch (e) {
//       console.error(e);
//       toast.error("Failed to load completed orders");
//     } finally {
//       setOrdersLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchUsers();
//     fetchOrders();
//   }, []);

//   const addBenefit = () => {
//     setBenefits((prev) => [...prev, { label: "", benefit: "" }]);
//   };

//   const removeBenefit = (index: number) => {
//     setBenefits((prev) => prev.filter((_, i) => i !== index));
//   };

//   const updateBenefit = (
//     index: number,
//     field: keyof Benefits,
//     value: string,
//   ) => {
//     setBenefits((prev) =>
//       prev.map((b, i) => (i === index ? { ...b, [field]: value } : b)),
//     );
//   };
//   const addUse = () => {
//     setUse((prev) => [...prev, { label: "", usage: "" }]);
//   };

//   const removeUse = (index: number) => {
//     setUse((prev) => prev.filter((_, i) => i !== index));
//   };

//   const updateUse = (index: number, field: keyof Uses, value: string) => {
//     setUse((prev) =>
//       prev.map((b, i) => (i === index ? { ...b, [field]: value } : b)),
//     );
//   };

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     if (!file.type.startsWith("image/")) {
//       toast.error("Please select an image file");
//       return;
//     }

//     if (file.size > 2 * 1024 * 1024) {
//       toast.error("Image must be under 2MB");
//       return;
//     }

//     const reader = new FileReader();

//     reader.onload = () => {
//       const base64String = reader.result as string;
//       setItemImage(base64String);
//       setPreview(base64String);
//     };

//     reader.onerror = () => {
//       toast.error("Failed to read image");
//     };

//     reader.readAsDataURL(file);
//   };

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();

//     if (!name || !description || !price || !benefits || !use || !itemImage) {
//       return toast.error("Please fill out all fields and upload product image");
//     }

//     setLoading(true);

//     const payload = {
//       name,
//       description,
//       price,
//       itemImage,
//       benefits,
//       use,
//     };

//     try {
//       const response = await fetch(`/api/products`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       const data = await response.json();

//       if (response.status === 201) {
//         toast.success("Product successfully uploaded");
//       } else {
//         toast.error(data?.message || "Failed to upload item");
//       }
//     } catch (e) {
//       console.error(e);
//       toast.error("Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setLoadingScreen(false);
//     }, 2000);

//     return () => clearTimeout(timer);
//   }, []);

//   const userCount = users?.filter((u) => u.role === "user").length ?? 0;

//   return (
//     <>
//       {loadingScreen ? (
//         <div className="flex justify-center items-center ">
//           <LoaderIcon
//             role="status"
//             aria-label="Loading"
//             className="size-14 sm:size-20 text-[#FFC0CB] mt-20 sm:mt-30 animate-spin"
//           />
//         </div>
//       ) : (
//         <section className="font-comorantInfant bg-[#FFC0CB] min-h-screen">
//           <div className="max-w-275 gap-5 py-6 sm:py-8 mx-auto px-3 sm:px-6 lg:px-0 grid grid-cols-1 md:grid-cols-[180px_1fr] lg:grid-cols-[200px_1fr]">
//             <div className="flex md:flex-col relative gap-3 sm:gap-5 items-center justify-center md:justify-start py-3 sm:py-6 md:py-12 bg-white rounded-md md:rounded-none">
//               <button
//                 onClick={() => setSelected("Overview")}
//                 className={`font-bold text-base sm:text-lg md:text-xl cursor-pointer md:hover:w-full hover:text-gray-400 transition-all duration-300 ease-in-out ${selected === "Overview" ? "text-[#FFC0CB] font-bold text-xl sm:text-2xl md:text-3xl" : ""}`}
//               >
//                 Overview
//               </button>
//               <button
//                 onClick={() => setSelected("Product")}
//                 className={`font-bold text-base sm:text-lg md:text-xl cursor-pointer md:hover:w-full hover:text-gray-400 transition-all duration-300 ease-in-out ${selected === "Product" ? "text-[#FFC0CB] font-bold text-xl sm:text-2xl md:text-3xl" : ""}`}
//               >
//                 Add a product
//               </button>
//               <div className="bottom-3">
//                 <Link href="/">
//                   <button className="border bg-black text-white h-10 w-35 rounded-md cursor-pointer">
//                     Home
//                   </button>
//                 </Link>
//               </div>
//             </div>
//             <div className="md:h-screen">
//               {selected === "Overview" && (
//                 <motion.div
//                   className="px-2 sm:px-4 md:px-6 py-4 sm:py-6"
//                   initial={{ opacity: 0, x: 40 }}
//                   whileInView={{ opacity: 1, x: 0 }}
//                   viewport={{ once: true }}
//                   transition={{ duration: 0.9, ease: "easeOut" }}
//                 >
//                   <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
//                     <div className="h-24 sm:h-28 md:h-30 w-full rounded-md bg-white flex flex-col justify-center items-center">
//                       <h1 className="text-lg sm:text-xl font-bold">Users</h1>
//                       <span className="text-lg sm:text-xl font-bold">
//                         [{userCount}]
//                       </span>
//                     </div>
//                     <button
//                       onClick={() => setSelected("Orders")}
//                       className="h-24 sm:h-28 md:h-30 w-full rounded-md bg-white flex flex-col justify-center items-center cursor-pointer hover:bg-gray-50 transition-colors"
//                     >
//                       <h1 className="text-lg sm:text-xl font-bold text-center px-2">
//                         Completed Orders
//                       </h1>
//                       <span className="text-lg sm:text-xl font-bold">
//                         [{ordersLoading ? "..." : orders.length}]
//                       </span>
//                     </button>
//                     <div className="h-24 sm:h-28 md:h-30 w-full rounded-md bg-white flex flex-col justify-center items-center">
//                       <h1 className="text-lg sm:text-xl font-bold">Feeds</h1>
//                       <span className="text-lg sm:text-xl font-bold">[0]</span>
//                     </div>
//                   </div>
//                 </motion.div>
//               )}

//               {selected === "Orders" && (
//                 <motion.div
//                   className="px-2 sm:px-4 md:px-6 py-4 sm:py-6"
//                   initial={{ opacity: 0, x: 40 }}
//                   whileInView={{ opacity: 1, x: 0 }}
//                   viewport={{ once: true }}
//                   transition={{ duration: 0.9, ease: "easeOut" }}
//                 >
//                   <div className="bg-white rounded-md p-3 sm:p-5">
//                     <div className="flex justify-between items-center mb-4">
//                       <h1 className="text-xl sm:text-2xl font-bold">
//                         Completed Orders
//                       </h1>
//                       <button
//                         onClick={() => setSelected("Overview")}
//                         className="text-sm underline cursor-pointer text-gray-500"
//                       >
//                         Back to Overview
//                       </button>
//                     </div>

//                     {ordersLoading ? (
//                       <div className="flex justify-center items-center py-10">
//                         <LoaderIcon className="size-8 text-[#FFC0CB] animate-spin" />
//                       </div>
//                     ) : orders.length === 0 ? (
//                       <p className="text-gray-500 py-6 text-center">
//                         No completed orders yet.
//                       </p>
//                     ) : (
//                       <div className="flex flex-col gap-4">
//                         {orders.map((order) => (
//                           <div
//                             key={order._id}
//                             className="border rounded-md p-3 sm:p-4 flex flex-col gap-3"
//                           >
//                             <div className="flex flex-wrap justify-between items-start gap-2">
//                               <div>
//                                 <h2 className="font-bold text-[15px] sm:text-base">
//                                   {order.deliveryDetails?.fullName ??
//                                     "No delivery details"}
//                                 </h2>
//                                 {order.deliveryDetails ? (
//                                   <>
//                                     <p className="text-sm text-gray-600">
//                                       {order.deliveryDetails.phone}
//                                     </p>
//                                     <p className="text-sm text-gray-600">
//                                       {order.deliveryDetails.address},{" "}
//                                       {order.deliveryDetails.city},{" "}
//                                       {order.deliveryDetails.state}
//                                     </p>
//                                   </>
//                                 ) : (
//                                   <p className="text-sm text-gray-400 italic">
//                                     Placed before delivery details were required
//                                   </p>
//                                 )}
//                               </div>
//                               <div className="text-right">
//                                 <span className="block text-sm text-gray-500">
//                                   {new Date(order.createdAt).toLocaleDateString(
//                                     "en-NG",
//                                     {
//                                       day: "numeric",
//                                       month: "short",
//                                       year: "numeric",
//                                     },
//                                   )}
//                                 </span>
//                                 <span className="block font-bold text-[15px] sm:text-base">
//                                   ₦
//                                   {order.total.toLocaleString("en-US", {
//                                     minimumFractionDigits: 2,
//                                     maximumFractionDigits: 2,
//                                   })}
//                                 </span>
//                               </div>
//                             </div>

//                             <div className="flex flex-wrap gap-2 border-t pt-2">
//                               {order.items.map((item, i) => (
//                                 <div
//                                   key={i}
//                                   className="flex items-center gap-2 bg-gray-50 rounded-md px-2 py-1"
//                                 >
//                                   {item.oil?.itemImage && (
//                                     <Image
//                                       src={
//                                         item.oil.itemImage.startsWith("/9j/")
//                                           ? `data:image/jpeg;base64,${item.oil.itemImage}`
//                                           : item.oil.itemImage
//                                       }
//                                       alt={item.oil.name}
//                                       width={28}
//                                       height={28}
//                                       className="rounded object-cover size-7"
//                                     />
//                                   )}
//                                   <span className="text-xs sm:text-sm">
//                                     {item.oil?.name ?? "Item"} × {item.quantity}
//                                   </span>
//                                 </div>
//                               ))}
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     )}
//                   </div>
//                 </motion.div>
//               )}

//               {selected === "Product" && (
//                 <motion.div
//                   initial={{ opacity: 0, x: 40 }}
//                   whileInView={{ opacity: 1, x: 0 }}
//                   viewport={{ once: true }}
//                   transition={{ duration: 0.9, ease: "easeOut" }}
//                 >
//                   <div className="bg-white h-full rounded-md">
//                     <h1 className="text-center py-6 sm:py-8 text-xl sm:text-2xl font-bold px-3">
//                       Add a Product
//                     </h1>
//                     <form
//                       onSubmit={handleSubmit}
//                       className="flex flex-col gap-3 px-3 sm:px-5 pb-6"
//                     >
//                       <div className="flex flex-col gap-1">
//                         <label className="text-[15px] sm:text-[16px] font-bold">
//                           {"Product's name:"}
//                         </label>
//                         <input
//                           value={name}
//                           onChange={(e) => setName(e.target.value)}
//                           className="border-b-2 outline-0 border-b-[#FFC0CB] py-1"
//                           type="text"
//                         />
//                       </div>
//                       <div className="flex flex-col gap-1">
//                         <label className="text-[15px] sm:text-[16px] font-bold">
//                           {"Product's Description:"}
//                         </label>
//                         <input
//                           value={description}
//                           onChange={(e) => setDescription(e.target.value)}
//                           className="border-b-2 outline-0 border-b-[#FFC0CB] py-1"
//                           type="text"
//                         />
//                       </div>
//                       <label className="text-[15px] sm:text-[16px] font-bold">
//                         {"Product's Benefits:"}
//                       </label>

//                       {benefits.map((bt, index) => (
//                         <div
//                           key={index}
//                           className="flex flex-col gap-2 border-b pb-3 mb-3"
//                         >
//                           <div className="flex flex-col gap-1">
//                             <label className="text-[13px] sm:text-[14px] font-bold">
//                               {"*Benefits label"}
//                             </label>
//                             <input
//                               value={bt.label}
//                               onChange={(e) =>
//                                 updateBenefit(index, "label", e.target.value)
//                               }
//                               className="border-b-2 outline-0 border-b-[#FFC0CB] py-1"
//                               type="text"
//                             />
//                           </div>

//                           <div className="flex flex-col gap-1">
//                             <label className="text-[13px] sm:text-[14px] font-bold">
//                               {"*Benefits description"}
//                             </label>
//                             <input
//                               value={bt.benefit}
//                               onChange={(e) =>
//                                 updateBenefit(index, "benefit", e.target.value)
//                               }
//                               className="border-b-2 outline-0 border-b-[#FFC0CB] py-1"
//                               type="text"
//                             />
//                           </div>

//                           {benefits.length > 1 && (
//                             <button
//                               type="button"
//                               onClick={() => removeBenefit(index)}
//                               className="text-red-500 cursor-pointer text-sm self-start"
//                             >
//                               Remove
//                             </button>
//                           )}
//                         </div>
//                       ))}

//                       <button
//                         type="button"
//                         onClick={addBenefit}
//                         className="text-sm cursor-pointer font-bold text-[#FFC0CB] self-start"
//                       >
//                         + Add another benefit
//                       </button>
//                       <label className="text-[15px] sm:text-[16px] font-bold">
//                         {"Product's Uses:"}
//                       </label>

//                       {use.map((us, index) => (
//                         <div
//                           key={index}
//                           className="flex flex-col gap-2 border-b pb-3 mb-3"
//                         >
//                           <div className="flex flex-col gap-1">
//                             <label className="text-[13px] sm:text-[14px] font-bold">
//                               {"*Uses label"}
//                             </label>
//                             <input
//                               value={us.label}
//                               onChange={(e) =>
//                                 updateUse(index, "label", e.target.value)
//                               }
//                               className="border-b-2 outline-0 border-b-[#FFC0CB] py-1"
//                               type="text"
//                             />
//                           </div>

//                           <div className="flex flex-col gap-1">
//                             <label className="text-[13px] sm:text-[14px] font-bold">
//                               {"*Uses description"}
//                             </label>
//                             <input
//                               value={us.usage}
//                               onChange={(e) =>
//                                 updateUse(index, "usage", e.target.value)
//                               }
//                               className="border-b-2 outline-0 border-b-[#FFC0CB] py-1"
//                               type="text"
//                             />
//                           </div>

//                           {use.length > 1 && (
//                             <button
//                               type="button"
//                               onClick={() => removeUse(index)}
//                               className="text-red-500 cursor-pointer text-sm self-start"
//                             >
//                               Remove
//                             </button>
//                           )}
//                         </div>
//                       ))}

//                       <button
//                         type="button"
//                         onClick={addUse}
//                         className="text-sm cursor-pointer font-bold text-[#FFC0CB] self-start"
//                       >
//                         + Add another benefit
//                       </button>
//                       <div className="flex flex-col gap-1">
//                         <label className="text-[15px] sm:text-[16px] font-bold">
//                           {"Product's price:"}
//                         </label>
//                         <input
//                           value={price}
//                           onChange={(e) => {
//                             const val = e.target.value;
//                             setPrice(val === "" ? 0 : Number(val));
//                           }}
//                           className="border-b-2 outline-0 border-b-[#FFC0CB] py-1"
//                           type="text"
//                         />
//                       </div>
//                       <div className="border h-16 w-16 rounded-md overflow-hidden relative flex items-center justify-center shrink-0">
//                         {preview ? (
//                           <>
//                             {/* eslint-disable-next-line @next/next/no-img-element */}
//                             <img
//                               src={preview}
//                               alt="Profile preview"
//                               className="h-full w-full object-cover"
//                             />
//                             <button
//                               type="button"
//                               onClick={() => {
//                                 setPreview("");
//                                 setItemImage("");
//                               }}
//                               className="absolute top-0 right-0 bg-black/60 text-white text-xs w-4 h-4 flex items-center justify-center rounded-bl cursor-pointer"
//                             >
//                               ×
//                             </button>
//                           </>
//                         ) : (
//                           <label
//                             htmlFor="profile-picture-upload"
//                             className="h-full w-full flex items-center justify-center cursor-pointer text-gray-400 hover:text-gray-600 transition-colors"
//                           >
//                             <ImagePlus className="size-6" />
//                             <input
//                               id="profile-picture-upload"
//                               accept="image/*"
//                               type="file"
//                               onChange={handleImageChange}
//                               className="hidden"
//                             />
//                           </label>
//                         )}
//                       </div>
//                       <div className="flex justify-center items-center py-2">
//                         <button
//                           className="border flex justify-center items-center h-10 w-full sm:w-35 bg-[#FFC0CB] hover:text-white hover:bg-[#ffd4db] font-bold cursor-pointer rounded-md text-[16px] sm:text-[17px]"
//                           type="submit"
//                         >
//                           {loading ? (
//                             <LoaderIcon
//                               className="animate-spin size-6"
//                               size={5}
//                             />
//                           ) : (
//                             "Add Product"
//                           )}
//                         </button>
//                       </div>
//                     </form>
//                   </div>
//                 </motion.div>
//               )}
//             </div>
//           </div>
//         </section>
//       )}
//     </>
//   );
// };

// export default DashboardPage;



"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { ImagePlus, LoaderIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface Users {
  id: string;
  name?: string;
  email?: string;
  role: string;
}

interface Feed {
  _id: string;
  email: string;
  createdAt?: string;
}

interface Benefits {
  label: string;
  benefit: string;
}

interface Uses {
  label: string;
  usage: string;
}

interface DeliveryDetails {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
}

interface OrderItem {
  oil: {
    _id: string;
    name: string;
    itemImage: string;
  };
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: string;
  paystackReference: string;
  deliveryDetails: DeliveryDetails;
  createdAt: string;
}

const DashboardPage = () => {
  const [selected, setSelected] = useState("Overview");
  const [users, setUsers] = useState<Users[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [preview, setPreview] = useState<string>("");
  const [itemImage, setItemImage] = useState("");
  const [loadingScreen, setLoadingScreen] = useState(true);
  const [benefits, setBenefits] = useState<Benefits[]>([
    { label: "", benefit: "" },
  ]);
  const [use, setUse] = useState<Uses[]>([{ label: "", usage: "" }]);
  const [loading, setLoading] = useState(false);

  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  const [feeds, setFeeds] = useState<Feed[]>([]);
  const [feedsLoading, setFeedsLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("/api/users");
      if (response.status === 201) {
        setUsers(response.data.data);
        console.log("Users", response.data.data);
        return;
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await axios.get("/api/orders", {
        withCredentials: true,
      });
      setOrders(response.data.data ?? []);
    } catch (e) {
      console.error(e);
      toast.error("Failed to load completed orders");
    } finally {
      setOrdersLoading(false);
    }
  };

  const fetchFeeds = async () => {
    try {
      const response = await axios.get("/api/getFeeds", {
        withCredentials: true,
      });
      setFeeds(response.data.data ?? []);
    } catch (e) {
      console.error(e);
      toast.error("Failed to load feeds");
    } finally {
      setFeedsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchOrders();
    fetchFeeds();
  }, []);

  const addBenefit = () => {
    setBenefits((prev) => [...prev, { label: "", benefit: "" }]);
  };

  const removeBenefit = (index: number) => {
    setBenefits((prev) => prev.filter((_, i) => i !== index));
  };

  const updateBenefit = (
    index: number,
    field: keyof Benefits,
    value: string,
  ) => {
    setBenefits((prev) =>
      prev.map((b, i) => (i === index ? { ...b, [field]: value } : b)),
    );
  };
  const addUse = () => {
    setUse((prev) => [...prev, { label: "", usage: "" }]);
  };

  const removeUse = (index: number) => {
    setUse((prev) => prev.filter((_, i) => i !== index));
  };

  const updateUse = (index: number, field: keyof Uses, value: string) => {
    setUse((prev) =>
      prev.map((b, i) => (i === index ? { ...b, [field]: value } : b)),
    );
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be under 2MB");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const base64String = reader.result as string;
      setItemImage(base64String);
      setPreview(base64String);
    };

    reader.onerror = () => {
      toast.error("Failed to read image");
    };

    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name || !description || !price || !benefits || !use || !itemImage) {
      return toast.error("Please fill out all fields and upload product image");
    }

    setLoading(true);

    const payload = {
      name,
      description,
      price,
      itemImage,
      benefits,
      use,
    };

    try {
      const response = await fetch(`/api/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.status === 201) {
        toast.success("Product successfully uploaded");
      } else {
        toast.error(data?.message || "Failed to upload item");
      }
    } catch (e) {
      console.error(e);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoadingScreen(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const userCount = users?.filter((u) => u.role === "user").length ?? 0;

  return (
    <>
      {loadingScreen ? (
        <div className="flex justify-center items-center ">
          <LoaderIcon
            role="status"
            aria-label="Loading"
            className="size-14 sm:size-20 text-[#FFC0CB] mt-20 sm:mt-30 animate-spin"
          />
        </div>
      ) : (
        <section className="font-comorantInfant bg-[#FFC0CB] min-h-screen">
          <div className="max-w-275 gap-5 py-6 sm:py-8 mx-auto px-3 sm:px-6 lg:px-0 grid grid-cols-1 md:grid-cols-[180px_1fr] lg:grid-cols-[200px_1fr]">
            <div className="flex md:flex-col relative gap-3 sm:gap-5 items-center justify-center md:justify-start py-3 sm:py-6 md:py-12 bg-white rounded-md md:rounded-none">
              <button
                onClick={() => setSelected("Overview")}
                className={`font-bold text-base sm:text-lg md:text-xl cursor-pointer md:hover:w-full hover:text-gray-400 transition-all duration-300 ease-in-out ${selected === "Overview" ? "text-[#FFC0CB] font-bold text-xl sm:text-2xl md:text-3xl" : ""}`}
              >
                Overview
              </button>
              <button
                onClick={() => setSelected("Product")}
                className={`font-bold text-base sm:text-lg md:text-xl cursor-pointer md:hover:w-full hover:text-gray-400 transition-all duration-300 ease-in-out ${selected === "Product" ? "text-[#FFC0CB] font-bold text-xl sm:text-2xl md:text-3xl" : ""}`}
              >
                Add a product
              </button>
              <div className="bottom-3">
                <Link href="/">
                  <button className="border bg-black text-white h-10 w-35 rounded-md cursor-pointer">
                    Home
                  </button>
                </Link>
              </div>
            </div>
            <div className="md:h-screen">
              {selected === "Overview" && (
                <motion.div
                  className="px-2 sm:px-4 md:px-6 py-4 sm:py-6"
                  initial={{ opacity: 0, x: 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.9, ease: "easeOut" }}
                >
                  <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
                    <button
                      onClick={() => setSelected("Users")}
                      className="h-24 sm:h-28 md:h-30 w-full rounded-md bg-white flex flex-col justify-center items-center cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      <h1 className="text-lg sm:text-xl font-bold">Users</h1>
                      <span className="text-lg sm:text-xl font-bold">
                        [{userCount}]
                      </span>
                    </button>
                    <button
                      onClick={() => setSelected("Orders")}
                      className="h-24 sm:h-28 md:h-30 w-full rounded-md bg-white flex flex-col justify-center items-center cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      <h1 className="text-lg sm:text-xl font-bold text-center px-2">
                        Completed Orders
                      </h1>
                      <span className="text-lg sm:text-xl font-bold">
                        [{ordersLoading ? "..." : orders.length}]
                      </span>
                    </button>
                    <button
                      onClick={() => setSelected("Feeds")}
                      className="h-24 sm:h-28 md:h-30 w-full rounded-md bg-white flex flex-col justify-center items-center cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      <h1 className="text-lg sm:text-xl font-bold">Feeds</h1>
                      <span className="text-lg sm:text-xl font-bold">
                        [{feedsLoading ? "..." : feeds.length}]
                      </span>
                    </button>
                  </div>
                </motion.div>
              )}

              {selected === "Orders" && (
                <motion.div
                  className="px-2 sm:px-4 md:px-6 py-4 sm:py-6"
                  initial={{ opacity: 0, x: 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.9, ease: "easeOut" }}
                >
                  <div className="bg-white rounded-md p-3 sm:p-5">
                    <div className="flex justify-between items-center mb-4">
                      <h1 className="text-xl sm:text-2xl font-bold">
                        Completed Orders
                      </h1>
                      <button
                        onClick={() => setSelected("Overview")}
                        className="text-sm underline cursor-pointer text-gray-500"
                      >
                        Back to Overview
                      </button>
                    </div>

                    {ordersLoading ? (
                      <div className="flex justify-center items-center py-10">
                        <LoaderIcon className="size-8 text-[#FFC0CB] animate-spin" />
                      </div>
                    ) : orders.length === 0 ? (
                      <p className="text-gray-500 py-6 text-center">
                        No completed orders yet.
                      </p>
                    ) : (
                      <div className="flex flex-col gap-4">
                        {orders.map((order) => (
                          <div
                            key={order._id}
                            className="border rounded-md p-3 sm:p-4 flex flex-col gap-3"
                          >
                            <div className="flex flex-wrap justify-between items-start gap-2">
                              <div>
                                <h2 className="font-bold text-[15px] sm:text-base">
                                  {order.deliveryDetails?.fullName ??
                                    "No delivery details"}
                                </h2>
                                {order.deliveryDetails ? (
                                  <>
                                    <p className="text-sm text-gray-600">
                                      {order.deliveryDetails.phone}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                      {order.deliveryDetails.address},{" "}
                                      {order.deliveryDetails.city},{" "}
                                      {order.deliveryDetails.state}
                                    </p>
                                  </>
                                ) : (
                                  <p className="text-sm text-gray-400 italic">
                                    Placed before delivery details were required
                                  </p>
                                )}
                              </div>
                              <div className="text-right">
                                <span className="block text-sm text-gray-500">
                                  {new Date(order.createdAt).toLocaleDateString(
                                    "en-NG",
                                    {
                                      day: "numeric",
                                      month: "short",
                                      year: "numeric",
                                    },
                                  )}
                                </span>
                                <span className="block font-bold text-[15px] sm:text-base">
                                  ₦
                                  {order.total.toLocaleString("en-US", {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  })}
                                </span>
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-2 border-t pt-2">
                              {order.items.map((item, i) => (
                                <div
                                  key={i}
                                  className="flex items-center gap-2 bg-gray-50 rounded-md px-2 py-1"
                                >
                                  {item.oil?.itemImage && (
                                    <Image
                                      src={
                                        item.oil.itemImage.startsWith("/9j/")
                                          ? `data:image/jpeg;base64,${item.oil.itemImage}`
                                          : item.oil.itemImage
                                      }
                                      alt={item.oil.name}
                                      width={28}
                                      height={28}
                                      className="rounded object-cover size-7"
                                    />
                                  )}
                                  <span className="text-xs sm:text-sm">
                                    {item.oil?.name ?? "Item"} × {item.quantity}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {selected === "Users" && (
                <motion.div
                  className="px-2 sm:px-4 md:px-6 py-4 sm:py-6"
                  initial={{ opacity: 0, x: 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.9, ease: "easeOut" }}
                >
                  <div className="bg-white rounded-md p-3 sm:p-5">
                    <div className="flex justify-between items-center mb-4">
                      <h1 className="text-xl sm:text-2xl font-bold">Users</h1>
                      <button
                        onClick={() => setSelected("Overview")}
                        className="text-sm underline cursor-pointer text-gray-500"
                      >
                        Back to Overview
                      </button>
                    </div>

                    {users.filter((u) => u.role !== "admin").length === 0 ? (
                      <p className="text-gray-500 py-6 text-center">
                        No users found.
                      </p>
                    ) : (
                      <div className="flex flex-col divide-y">
                        {users
                          .filter((u) => u.role !== "admin")
                          .map((u) => (
                          <div
                            key={u.id}
                            className="flex flex-wrap justify-between items-center gap-2 py-3"
                          >
                            <div>
                              <p className="font-bold text-[15px] sm:text-base">
                                {u.name ?? "Unnamed user"}
                              </p>
                              <p className="text-sm text-gray-600">
                                {u.email ?? "No email on record"}
                              </p>
                            </div>
                            <span className="text-xs sm:text-sm font-bold px-2 py-1 rounded-md bg-[#FFC0CB]/40">
                              {u.role}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {selected === "Feeds" && (
                <motion.div
                  className="px-2 sm:px-4 md:px-6 py-4 sm:py-6"
                  initial={{ opacity: 0, x: 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.9, ease: "easeOut" }}
                >
                  <div className="bg-white rounded-md p-3 sm:p-5">
                    <div className="flex justify-between items-center mb-4">
                      <h1 className="text-xl sm:text-2xl font-bold">
                        Newsletter Subscribers
                      </h1>
                      <button
                        onClick={() => setSelected("Overview")}
                        className="text-sm underline cursor-pointer text-gray-500"
                      >
                        Back to Overview
                      </button>
                    </div>

                    {feedsLoading ? (
                      <div className="flex justify-center items-center py-10">
                        <LoaderIcon className="size-8 text-[#FFC0CB] animate-spin" />
                      </div>
                    ) : feeds.length === 0 ? (
                      <p className="text-gray-500 py-6 text-center">
                        No subscribers yet.
                      </p>
                    ) : (
                      <div className="flex flex-col divide-y">
                        {feeds.map((f) => (
                          <div
                            key={f._id}
                            className="flex flex-wrap justify-between items-center gap-2 py-3"
                          >
                            <p className="text-[15px] sm:text-base">
                              {f.email}
                            </p>
                            {f.createdAt && (
                              <span className="text-sm text-gray-500">
                                {new Date(f.createdAt).toLocaleDateString(
                                  "en-NG",
                                  {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  },
                                )}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {selected === "Product" && (
                <motion.div
                  initial={{ opacity: 0, x: 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.9, ease: "easeOut" }}
                >
                  <div className="bg-white h-full rounded-md">
                    <h1 className="text-center py-6 sm:py-8 text-xl sm:text-2xl font-bold px-3">
                      Add a Product
                    </h1>
                    <form
                      onSubmit={handleSubmit}
                      className="flex flex-col gap-3 px-3 sm:px-5 pb-6"
                    >
                      <div className="flex flex-col gap-1">
                        <label className="text-[15px] sm:text-[16px] font-bold">
                          {"Product's name:"}
                        </label>
                        <input
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="border-b-2 outline-0 border-b-[#FFC0CB] py-1"
                          type="text"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[15px] sm:text-[16px] font-bold">
                          {"Product's Description:"}
                        </label>
                        <input
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          className="border-b-2 outline-0 border-b-[#FFC0CB] py-1"
                          type="text"
                        />
                      </div>
                      <label className="text-[15px] sm:text-[16px] font-bold">
                        {"Product's Benefits:"}
                      </label>

                      {benefits.map((bt, index) => (
                        <div
                          key={index}
                          className="flex flex-col gap-2 border-b pb-3 mb-3"
                        >
                          <div className="flex flex-col gap-1">
                            <label className="text-[13px] sm:text-[14px] font-bold">
                              {"*Benefits label"}
                            </label>
                            <input
                              value={bt.label}
                              onChange={(e) =>
                                updateBenefit(index, "label", e.target.value)
                              }
                              className="border-b-2 outline-0 border-b-[#FFC0CB] py-1"
                              type="text"
                            />
                          </div>

                          <div className="flex flex-col gap-1">
                            <label className="text-[13px] sm:text-[14px] font-bold">
                              {"*Benefits description"}
                            </label>
                            <input
                              value={bt.benefit}
                              onChange={(e) =>
                                updateBenefit(index, "benefit", e.target.value)
                              }
                              className="border-b-2 outline-0 border-b-[#FFC0CB] py-1"
                              type="text"
                            />
                          </div>

                          {benefits.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeBenefit(index)}
                              className="text-red-500 cursor-pointer text-sm self-start"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={addBenefit}
                        className="text-sm cursor-pointer font-bold text-[#FFC0CB] self-start"
                      >
                        + Add another benefit
                      </button>
                      <label className="text-[15px] sm:text-[16px] font-bold">
                        {"Product's Uses:"}
                      </label>

                      {use.map((us, index) => (
                        <div
                          key={index}
                          className="flex flex-col gap-2 border-b pb-3 mb-3"
                        >
                          <div className="flex flex-col gap-1">
                            <label className="text-[13px] sm:text-[14px] font-bold">
                              {"*Uses label"}
                            </label>
                            <input
                              value={us.label}
                              onChange={(e) =>
                                updateUse(index, "label", e.target.value)
                              }
                              className="border-b-2 outline-0 border-b-[#FFC0CB] py-1"
                              type="text"
                            />
                          </div>

                          <div className="flex flex-col gap-1">
                            <label className="text-[13px] sm:text-[14px] font-bold">
                              {"*Uses description"}
                            </label>
                            <input
                              value={us.usage}
                              onChange={(e) =>
                                updateUse(index, "usage", e.target.value)
                              }
                              className="border-b-2 outline-0 border-b-[#FFC0CB] py-1"
                              type="text"
                            />
                          </div>

                          {use.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeUse(index)}
                              className="text-red-500 cursor-pointer text-sm self-start"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={addUse}
                        className="text-sm cursor-pointer font-bold text-[#FFC0CB] self-start"
                      >
                        + Add another benefit
                      </button>
                      <div className="flex flex-col gap-1">
                        <label className="text-[15px] sm:text-[16px] font-bold">
                          {"Product's price:"}
                        </label>
                        <input
                          value={price}
                          onChange={(e) => {
                            const val = e.target.value;
                            setPrice(val === "" ? 0 : Number(val));
                          }}
                          className="border-b-2 outline-0 border-b-[#FFC0CB] py-1"
                          type="text"
                        />
                      </div>
                      <div className="border h-16 w-16 rounded-md overflow-hidden relative flex items-center justify-center shrink-0">
                        {preview ? (
                          <>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={preview}
                              alt="Profile preview"
                              className="h-full w-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setPreview("");
                                setItemImage("");
                              }}
                              className="absolute top-0 right-0 bg-black/60 text-white text-xs w-4 h-4 flex items-center justify-center rounded-bl cursor-pointer"
                            >
                              ×
                            </button>
                          </>
                        ) : (
                          <label
                            htmlFor="profile-picture-upload"
                            className="h-full w-full flex items-center justify-center cursor-pointer text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            <ImagePlus className="size-6" />
                            <input
                              id="profile-picture-upload"
                              accept="image/*"
                              type="file"
                              onChange={handleImageChange}
                              className="hidden"
                            />
                          </label>
                        )}
                      </div>
                      <div className="flex justify-center items-center py-2">
                        <button
                          className="border flex justify-center items-center h-10 w-full sm:w-35 bg-[#FFC0CB] hover:text-white hover:bg-[#ffd4db] font-bold cursor-pointer rounded-md text-[16px] sm:text-[17px]"
                          type="submit"
                        >
                          {loading ? (
                            <LoaderIcon
                              className="animate-spin size-6"
                              size={5}
                            />
                          ) : (
                            "Add Product"
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default DashboardPage;