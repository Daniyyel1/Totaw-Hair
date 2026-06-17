"use client";
import React, { useRef } from "react";
import { motion } from "framer-motion";

const SectionWrapper = () => {
  const containerRef = useRef(null);

  return (
    <section className="font-comorantInfant">
      <div className="mt-20">
        <h1 className="font-bold text-5xl text-center">FEATURED PRODUCTS</h1>
        <div>
          <div
            ref={containerRef}
            className="relative"
            style={{ height: "100vh" }}
          >
            <div className="sticky top-0 h-[100vh] overflow-hidden bg-[#FFC0CB] mt-10">
              <motion.div
                drag="x"
                dragConstraints={{ left: -1600, right: 0 }}
                dragElastic={0.1}
                dragTransition={{ bounceStiffness: 300, bounceDamping: 30 }}
                whileTap={{ cursor: "grabbing" }}
                className="flex h-full items-center gap-8 px-8 cursor-grab "
              >
                {/* Your horizontal content */}
                <div className="w-[300px] h-80 bg-blue-500 rounded-lg flex items-center justify-center text-white text-2xl shrink-0">
                  Section 1
                </div>
                <div className="w-[300px] h-80 bg-purple-500 rounded-lg flex items-center justify-center text-white text-2xl shrink-0">
                  Section 2
                </div>
                <div className="w-[300px] h-80 bg-pink-500 rounded-lg flex items-center justify-center text-white text-2xl shrink-0">
                  Section 3
                </div>
                <div className="w-[300px] h-80 bg-orange-500 rounded-lg flex items-center justify-center text-white text-2xl shrink-0">
                  Section 4
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SectionWrapper;
