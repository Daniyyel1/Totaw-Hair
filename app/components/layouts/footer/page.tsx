import Image from "next/image";
import React from "react";
import tota from "../../../../public/tota.png";
import Link from "next/link";
import { SiFacebook } from "react-icons/si";
import { FaXTwitter } from "react-icons/fa6";
import { IoLogoInstagram } from "react-icons/io5";

const Footer = () => {
  return (
    <section className="h-auto font-comorantInfant mt-12 sm:mt-16 lg:mt-20 pb-8 lg:pb-0">
      <div className="max-w-275 mx-auto px-4 sm:px-6 lg:px-0">
        <div className="mt-10 justify-center items-center flex flex-col lg:flex-row gap-8 lg:gap-[250px]">
          <Image className="h-10 w-10 sm:h-12 sm:w-12" src={tota} alt="totaw"></Image>
          <div className="flex flex-wrap justify-center items-start gap-x-8 gap-y-6 sm:gap-5">
            <div className="w-24 sm:w-30 text-center sm:text-left">
              <Link
                className="text-base sm:text-lg lg:text-xl font-medium hover:text-[#FFC0CB]"
                href="/"
              >
                Our Story
              </Link>
            </div>
            <div className="w-40 sm:w-45 text-center sm:text-left">
              <Link className="text-base sm:text-lg lg:text-xl font-medium hover:text-[#FFC0CB]" href="/">Services</Link>
                 <ul className="flex flex-col cursor-pointer gap-2 sm:gap-3 text-sm sm:text-base">
                   <li>Expert braiding</li>
                   <li>Hair washing</li>
                   <li>Premium hair care products</li>
                 </ul>
            </div>
            <div className="w-24 sm:w-30 text-center sm:text-left">
              <Link className="text-base sm:text-lg lg:text-xl font-medium hover:text-[#FFC0CB]" href="/">About</Link>
            </div>
            <div className="w-24 sm:w-30 text-center sm:text-left">
              <Link className="text-base sm:text-lg lg:text-xl font-medium hover:text-[#FFC0CB]" href="/">Contacts</Link>
            </div>
            <div className="flex flex-col w-24 sm:w-30 items-center sm:items-start">
              <Link className="text-base sm:text-lg lg:text-xl font-medium hover:text-[#FFC0CB]" href="/">Socials</Link>
                 <ul className="flex flex-col gap-2 sm:gap-3 mt-1.5 cursor-pointer items-center sm:items-start">
                   <li><SiFacebook className="text-lg sm:text-xl" /></li>
                   <li><FaXTwitter className="text-lg sm:text-xl" /></li>
                   <li><IoLogoInstagram className="text-lg sm:text-xl" /></li>
                 </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Footer;