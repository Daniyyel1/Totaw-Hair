"use client";
import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useOils } from "@/app/context/page";
import { MdArrowRightAlt } from "react-icons/md";
import { FaWhatsapp } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import { IoCartOutline } from "react-icons/io5";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { LoaderIcon } from "lucide-react";
import { useRouter } from "next/navigation";

const SectionWrapper = () => {
  const { oil, addToCart } = useOils();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const router = useRouter();

  const { data: session } = useSession();

  const containerRef = useRef(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [dragWidth, setDragWidth] = useState(0);

  useEffect(() => {
    if (trackRef.current) {
      const trackWidth = trackRef.current.scrollWidth;
      const visibleWidth = trackRef.current.parentElement?.offsetWidth ?? 0;
      setDragWidth(Math.max(trackWidth - visibleWidth, 0));
    }
  }, [oil]);

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

  return (
    <section className="font-comorantInfant max-w-275 mx-auto">
      <div className="mt-20">
        <h1 className="font-bold text-5xl text-center">FEATURED PRODUCTS</h1>
        <div>
          <div
            ref={containerRef}
            className="relative"
            style={{ height: "100vh" }}
          >
            <div className="sticky top-0 h-[80vh] overflow-hidden bg-[#Fwhite]">
              <motion.div
                ref={trackRef}
                drag="x"
                dragConstraints={{ left: -dragWidth, right: 0 }}
                dragElastic={0.1}
                dragTransition={{ bounceStiffness: 300, bounceDamping: 30 }}
                whileTap={{ cursor: "grabbing" }}
                className="flex h-full items-center gap-8 px-8 cursor-grab"
              >
                {oil.map((ol) => (
                  <div
                    key={ol._id}
                    className="w-[300px] h-80 shrink-0 rounded-lg text-black text-2xl"
                  >
                    <div className="h-[260px] w-full">
                      <Image
                        src={
                          ol.itemImage?.startsWith("/9j/")
                            ? `data:image/jpeg;base64,${ol.itemImage}`
                            : ol.itemImage || "/placeholder.jpg"
                        }
                        alt={ol.name}
                        width={300}
                        height={260}
                        className="object-cover h-full w-full rounded-md"
                      />
                    </div>
                    <div>
                      <h1 className="text-[16px] truncate py-1.5">{ol.name}</h1>
                      <span className="block text-[20px] font-bold">
                        ₦
                        {ol.price.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                      <button
                        onClick={() => handleCart(ol._id)}
                        className="rounded-md hover:text-white flex justify-center items-center gap-4 mt-4 cursor-pointer h-12 w-full bg-[#FFC0CB] text-[19px]"
                      >
                        {loadingId === ol._id ? (
                          <div>
                            <LoaderIcon className="size-4 animate-spin" />
                          </div>
                        ) : (
                          <div className="flex justify-center items-center gap-4">
                            Start order <IoCartOutline />
                          </div>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
        <div className="mt-10 flex justify-center items-center">
          <button className="flex text-[18px] border h-12 rounded-md cursor-pointer w-70 justify-center items-center gap-5 bg-[#FFC0CB]">
            Learn more about <MdArrowRightAlt className="text-3xl" />
          </button>
        </div>

        <div className="fixed bottom-6 right-6 z-50">
          <Link
            href="https://wa.me/2348100613971"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaWhatsapp className="text-5xl animate-bounce text-[#25D366]" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default SectionWrapper;
