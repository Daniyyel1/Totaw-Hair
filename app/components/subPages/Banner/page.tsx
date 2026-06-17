import Image from "next/image";
import React from "react";
import banner from "../../../../public/banner.png";
import { MoveRight } from "lucide-react";

const Banner = () => {
  return (
    <section className="font-comorantInfant">
      <div className=" mt-50 max-w-275 mx-auto">
        <div className="flex">
          <h1 className="text-[60px] w-120 flex-1 mt-10">
            Hair Cares That{" "}
            <span className="text-[#FFC0CB] font-bold text-[70px]">Powers</span>{" "}
            Your Day
          </h1>
          <div className="h-140 w-full flex-1">
            <Image
              src={banner}
              alt="banner"
              className="h-full w-full object-cover rounded-md"
            ></Image>
          </div>
        </div>

        <div className="h-30  bg-[#FFC0CB] w-full mt-10 rounded-md flex justify-between items-center px-5 py-3">
          <h1 className="w-150 text-[17px]">
            Discover plant-powered hair care solutions and smart hair wellness
            programs designed to nourish your scalp, strengthen your hair, and
            support healthy, beautiful hair every day.
          </h1>
          <div className="flex justify-center items-center gap-2.5">
            <button className="border cursor-pointer h-12 w-50 hover:border hover:border-white rounded-3xl flex justify-center items-center gap-2 ">
              Explore our products <MoveRight />
            </button>
            <button className="border h-12 w-30 rounded-3xl hover:border hover:border-white cursor-pointer">Know more</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;
