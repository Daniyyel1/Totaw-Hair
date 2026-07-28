

"use client"
import Image from "next/image";
import React from "react";
import all from "../../../../public/all.png";
import { MoveRight } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

const Banner = () => {
  return (
    <section className="font-comorantInfant">
      <div className=" mt-24 sm:mt-32 md:mt-40 lg:mt-50 max-w-275 mx-auto px-4 sm:px-6 lg:px-0">
        <motion.div
          className="flex flex-col lg:flex-row gap-6 lg:gap-0"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        >
          <h1 className="text-[32px] sm:text-[42px] md:text-[50px] lg:text-[60px] w-full lg:w-120 flex-1 mt-4 lg:mt-10">
            Hair Cares That{" "}
            <span className="text-[#FFC0CB] font-bold text-[38px] sm:text-[48px] md:text-[58px] lg:text-[70px]">Powers</span>{" "}
            Your Day
          </h1>
          <div className="h-90 sm:h-80 md:h-100 lg:h-140 w-full flex-1">
            <Image
              src={all}
              alt="banner"
              className="h-full w-full object-cover rounded-md"
            ></Image>
          </div>
        </motion.div>

        <div className="min-h-30 bg-[#FFC0CB] w-full mt-6 lg:mt-10 rounded-md flex flex-col lg:flex-row justify-between items-center gap-4 lg:gap-0 px-4 sm:px-5 py-4 lg:py-3">
          <h1 className="w-full lg:w-150 text-[16px] sm:text-[16px] lg:text-[17px] text-center lg:text-left">
            Discover plant-powered hair care solutions and smart hair wellness
            programs designed to nourish your scalp, strengthen your hair, and
            support healthy, beautiful hair every day.
          </h1>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-2.5 w-full lg:w-auto">
             <Link href='/components/pages/Products' className="w-full sm:w-auto">
            <button className="border cursor-pointer h-12 w-full sm:w-50 hover:border hover:border-white rounded-3xl flex justify-center items-center gap-2 ">
              Explore our products <MoveRight />
            </button>
            </Link>
            <Link href='/components/pages/About'>
            <button className="border h-12 w-35 sm:w-30 rounded-3xl hover:border hover:border-white cursor-pointer">
              Know more
            </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;