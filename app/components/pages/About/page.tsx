"use client"
import Image from "next/image";
import React, { useEffect, useState } from "react";
import ceo from "../../../../public/ceo.jpg";
import ceoo from "../../../../public/ceoo.jpg";
import Footer from "../../layouts/footer/page";
import VideoSection from "../../subPages/VideoSection/page";

const About = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center mt-50 sm:mt-32 md:mt-40 lg:mt-50 px-4">
          <h1 className="text-center text-[#FFC0CB] text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold animate-pulse">
            Just a moment...
          </h1>
        </div>
      ) : (
        <section className="font-comorantInfant">
          <div className="max-w-275 mx-auto mt-30 sm:mt-16 md:mt-24 lg:mt-30 px-4 sm:px-6 md:px-8 lg:px-0">
            <div className="text-center">
              <h1 className="font-bold text-xl sm:text-2xl md:text-3xl">
                Healthy Hair is Our Passion.
              </h1>
              <p className="mt-3 text-base sm:text-base md:text-[17px] max-w-xl sm:max-w-2xl md:max-w-3xl mx-auto">
                Specializing in professional natural hair care, custom styling,
                and flawless braids & cornrows. We blend creativity with healthy
                hair practices to give you styles that look beautiful and last.
              </p>
            </div>
            <div className="flex flex-col md:flex-row gap-6 sm:gap-8 md:gap-9 mt-8 sm:mt-10 md:mt-12">
              <div className="flex-1 h-90 sm:h-80 md:h-96 lg:h-120 w-full">
                <Image
                  className="h-full w-full object-cover rounded-md"
                  src={ceo}
                  alt="ceo"
                  width={300}
                  height={300}
                />
              </div>
              <div className="flex-1">
                <div>
                  <h1 className="font-bold text-xl sm:text-2xl md:text-3xl">Story About Us</h1>
                  <p className="text-base sm:text-base md:text-[17px] mt-2">
                    Our journey began with a simple mission: to provide natural
                    hair care solutions that deliver real results. We believe
                    everyone deserves healthy, vibrant hair powered by nature.
                  </p>
                </div>
                <div className="mt-5">
                  <h1 className="font-bold text-xl sm:text-2xl md:text-3xl">Our Vision</h1>
                  <p className="text-base sm:text-base md:text-[17px] mt-2">
                    Our vision is to make healthy, beautiful hair achievable for
                    everyone through innovative, high-quality, and naturally
                    inspired hair care solutions.
                  </p>
                  <p className="text-base sm:text-base md:text-[17px] mt-1">
                    To become a trusted leader in hair care by empowering people
                    with premium, natural products that inspire confidence,
                    promote healthy hair, and celebrate every unique beauty.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-6 sm:gap-8 md:gap-9 mt-6 sm:mt-3">
              <div className="flex-1">
                <h1 className="font-bold text-xl sm:text-2xl md:text-3xl px-0 sm:px-3">Our Mission</h1>
                <p className="mt-2 text-base sm:text-base md:text-[17px] px-0 sm:px-3">
                  Our mission is to harness the power of nature to develop
                  effective hair care solutions that promote healthy growth,
                  restore confidence, and enhance natural beauty.
                </p>
                <p className="mt-1 text-base sm:text-base md:text-[17px] px-0 sm:px-3">
                  To create safe, high-quality hair care products that nourish,
                  strengthen, and protect every hair type, helping our customers
                  achieve healthier, more beautiful hair every day.
                </p>
              </div>
              <div className="flex-1 h-90 sm:h-80 md:h-96 lg:h-120 w-full">
                <Image
                  className="h-full w-full object-cover rounded-md"
                  src={ceoo}
                  alt="ceoo"
                  width={200}
                  height={200}
                />
              </div>
            </div>
              <VideoSection />
            <Footer />
          </div>
        </section>
      )}
    </>
  );
};

export default About;