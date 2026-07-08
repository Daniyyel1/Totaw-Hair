
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import tota from "../../../../public/tota.png";
import Image from "next/image";
import { motion } from "framer-motion";
import { Search, X, Menu } from "lucide-react";
import { RiShoppingBasketFill } from "react-icons/ri";
import { useSession } from "next-auth/react";
import { useOils } from "@/app/context/page";
import { SlHandbag } from "react-icons/sl";
import { RiDeleteBin7Line } from "react-icons/ri";
import axios from "axios";

interface UserData {
  id:string,
  email:string,
  image:string,
  name:string,
  profilePicture:string,
}


const Navbar = () => {
  const pathName = usePathname();
  const [isCart, setIsCart] = useState(false);
  const { cart, removeFromCart } = useOils();
  const total = cart.reduce((sum, ct) => sum + ct.oil.price * ct.quantity, 0);
  const isCartOpen = () => setIsCart(!isCart);
  const { data: session } = useSession();
  const [isSearch, setIsSearch] = useState(false);
  const checkIsSearch = () => setIsSearch(!isSearch);
  const closeCart = () => setIsCart(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

    
  const fetchUser = async()=>{
    
      try{
         const response = await axios.get("/api/user");
    if(response.status === 201){
       setUser(response.data.data)
       return;
    }
      }catch(e){
        console.error(e)
      }
  }

  useEffect(()=>{
    fetchUser();

  }, [])


  useEffect(() => {
    if (isCart || isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isCart, isMenuOpen]);



  
 
  const navLinks = [
    { id: 1, label: "Home", href: "/", protected: false },
    {
      id: 2,
      label: "Products",
      href: "/components/pages/Products",
      protected: false,
    },
    {
      id: 3,
      label: (
        <RiShoppingBasketFill
          onClick={isCartOpen}
          className="text-2xl animate-pulse"
        />
      ),
      href: "",
      protected: false,
    },
    { id: 4, label: "About", href: "/components/pages/About" },
  ];

  const visibleLinks = navLinks.filter((link) => {
    if (link.protected && !session) return false;
    return true;
  });

  

  return (
    <section className="relative">
      {/* NAVBAR */}
      <div className="fixed w-full h-16 sm:h-20 z-50 top-0 border-b bg-[#FFC0CB]">
        <div className="max-w-275 mx-auto flex justify-between items-center h-full py-3 px-3 sm:px-6 font-comorantInfant font-medium">
          <div className="flex justify-center items-center gap-3 sm:gap-8 lg:gap-40">
            <button
              onClick={toggleMenu}
              className="flex lg:hidden justify-center items-center cursor-pointer"
            >
              {isMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
            </button>
            <Image className="h-9 w-9 sm:h-10 sm:w-10 lg:h-12 lg:w-12" src={tota} alt="totaw"></Image>
            <div className="hidden lg:flex justify-center items-center gap-15">
              {visibleLinks.map(({ href, label, id }) => (
                <Link
                  key={id}
                  href={href}
                  className={`text-[18px] ${pathName === href ? "text-[white] font-bold" : "text-black"}`}
                >
                  <div className="relative flex items-center justify-center gap-1">
                    {label}
                    {href === "" && (
                      <span className="flex border h-5 w-5 text-[#FFC0CB] font-extrabold text-[16px] absolute -top-2 -right-3 justify-center bg-white items-center rounded-full">
                        {cart?.length}
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
          <div className="flex lg:hidden justify-center items-center relative">
            <Link href="" onClick={isCartOpen}>
              <div className="relative flex items-center justify-center">
                <RiShoppingBasketFill className="text-2xl animate-pulse" />
                <span className="flex border h-5 w-5 text-[#FFC0CB] font-extrabold text-[16px] absolute -top-2 -right-3 justify-center bg-white items-center rounded-full">
                  {cart?.length}
                </span>
              </div>
            </Link>
          </div>
          <div className="flex justify-center items-center gap-2 sm:gap-3">
            <div className=" cursor-pointer rounded-full flex justify-center items-center">
              <Search onClick={checkIsSearch} />
            </div>
            <motion.div
              className={`${isSearch ? "block rounded-md border-2 h-12 w-48 sm:w-60 absolute top-16 sm:top-20 right-3 lg:right-auto lg:top-15 border-b-[#FFC0CB] px-3 py-2 bg-[#F2F2F2] transition-all duration-400 opacity-100" : "hidden transition-all duration-300 top-0 opacity-0"}`}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: "easeOut" }}
            >
              <input className="outline-0 w-full" type="text" placeholder="Search" />
            </motion.div>
            {user ? (
              <div className="rounded-xl flex justify-center items-center h-9 sm:h-10 w-full px-2 sm:px-3 bg-black text-white font-bold gap-2">
                <Link href="/components/subPages/Profile" className="hidden sm:inline whitespace-nowrap">
                  {user?.name}
                </Link>
                <Image className="h-7 w-7 object-cover rounded-full" src={user?.profilePicture} alt={user?.name} width={10} height={10} />
              
              </div>
            ) : (
              <Link href="/Register">
                <button className=" w-full text-[15px] sm:text-[18px] px-2 sm:px-0 bg-[#FFC0CB] rounded-[12px] cursor-pointer flex justify-center items-center whitespace-nowrap">
                  Login/Register
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* MOBILE MENU BACKDROP */}
      <div
        onClick={closeMenu}
        className={`fixed inset-0 bg-black z-40 transition-opacity duration-300 ${
          isMenuOpen
            ? "opacity-50 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      />

      {/* MOBILE MENU PANEL */}
      <div
        className={`fixed top-0 left-0 h-screen w-72 max-w-[85vw] bg-[#FFC0CB] font-comorantInfant z-50 transition-transform duration-300 lg:hidden ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <Image className="h-10 w-10" src={tota} alt="totaw"></Image>
          <X onClick={closeMenu} className="size-6 cursor-pointer" />
        </div>
        <div className="flex flex-col gap-6 p-6">
          {visibleLinks
            .filter((link) => link.href !== "")
            .map(({ href, label, id }) => (
              <Link
                key={id}
                href={href}
                onClick={closeMenu}
                className={`text-[20px] ${pathName === href ? "text-[white] font-bold" : "text-black"}`}
              >
                {label}
              </Link>
            ))}
        </div>
      </div>

      {/* BACKDROP */}
      <div
        onClick={closeCart}
        className={`fixed inset-0 bg-black z-40 transition-opacity duration-300 ${
          isCart
            ? "opacity-50 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      />

      {/* CART PANEL */}
      <div
        className={`fixed top-16 sm:top-20 h-[calc(100vh-4rem)] sm:h-[calc(100vh-5rem)] w-full sm:w-80 max-w-[92vw] bg-[#F2F2F2] font-comorantInfant border rounded-md z-50 scrollbar-hide overflow-y-auto transition-transform duration-300 ${
          isCart ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ right: 0 }}
      >
        <div className="absolute z-10 right-3 top-3 cursor-pointer">
          <X onClick={closeCart} className="size-5 cursor-pointer" />
        </div>
        <div className="flex border-b-2 pb-4 gap-2.5 mt-2.5 justify-center items-center relative">
          <SlHandbag className="size-10" />
          <h1 className="text-2xl font-bold">Your cart</h1>
          <span className="absolute font-bold text-[15px] top-3 left-27">
            {cart.length}
          </span>
        </div>

        <div>
          {cart.length === 0 ? (
            <div className="text-center mt-6">
              <p className="text-xl">Your cart is empty</p>
            </div>
          ) : (
            <div>
              {cart.map((ct) => (
                <div className="border-b-2 px-3 py-2" key={ct._id}>
                  <div className="flex gap-1.5">
                    <Image
                      width={50}
                      height={50}
                      src={
                        ct.oil.itemImage?.startsWith("/9j/")
                          ? `data:image/jpeg;base64,${ct.oil.itemImage}`
                          : ct.oil.itemImage || "/placeholder.jpg"
                      }
                      alt={ct.oil.name}
                      className="h-24 w-16 object-cover rounded-md"
                    />
                    <div className="flex font-bold justify-center items-center gap-2">
                      <span>{ct.quantity}</span>
                      <span>X</span>₦
                      {ct.oil.price.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                      <span>=</span>
                      <span>
                        ₦
                        {(ct.oil.price * ct.quantity).toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <h1 className="truncate">{ct.oil.name}</h1>
                    <RiDeleteBin7Line
                      className="cursor-pointer"
                      onClick={() => removeFromCart(ct._id)}
                    />
                  </div>
                </div>
              ))}
              <div className="border-2 h-30 bg-[#FFC0CB]">
                <h1 className="text-center font-bold text-xl">Subtotal:</h1>
                <span className="text-center flex justify-center items-center font-bold">
                  ₦
                  {total.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
                <div className="flex justify-center items-center gap-3 mt-4">
                  <Link href="/components/pages/CartPage">
                    <button className="h-8 hover:text-white rounded-xl w-30 border-2 border-black cursor-pointer">
                      View carts
                    </button>
                  </Link>
                  <Link href="">
                    <button className="h-8 rounded-xl hover:text-white w-30 border-2 border-black cursor-pointer">
                      Checkout
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Navbar;