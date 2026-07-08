"use client";
import { useOils } from "@/app/context/page";
import { LoaderIcon, Minus, Plus, Send } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { IoCartOutline } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import Footer from "@/app/components/layouts/footer/page";
import { useSession } from "next-auth/react";

const ProductsDetails = () => {
  const { oil, refetchOils, addToCart, updateQuantity, removeFromCart } =
    useOils();
  const params = useParams();
  const [openId, setOpenId] = useState<string | null>(null);
  const [comment, setComment] = useState("");
  const [reviewer, setReviewer] = useState("");
  const [rating, setRating] = useState<number>(0);
  const [hover, setHover] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingId, setLoadingId] = useState(false);
  const [selected, setSelected] = useState("Description");
  const { data: session } = useSession();
  const [quantity, setQuantity] = useState(1);
  const router = useRouter();

  const stars = [1, 2, 3, 4, 5];

  const toggle = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  const handleCart = async (oilId: string) => {
    setLoadingId(true);
    try {
      if (!session) {
        toast.error("You need to login to add product to cart");
        router.push("/Login");
        return;
      }
      await addToCart(oilId, quantity);
      toast.success("Item added to cart");
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingId(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!reviewer || !comment || rating === 0) {
      toast.error("fill out the fields and select rating to proceed");
      return;
    }

    setLoading(true);

    const payload = {
      reviewer,
      comment,
      rating,
    };

    try {
      const response = await fetch(`/api/oils/${params.ProductsId}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.status === 201) {
        toast.success("Review sent");
        refetchOils();
      } else {
        toast.error("Error sending review");
      }
      const data = await response.json();
      console.log("response data:", data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }

    setRating(0);
    setComment("");
    setReviewer("");
  };

  const getAverageRating = (reviews: { rating: number }[]) => {
    if (!reviews || reviews.length === 0) return 0;
    const total = reviews.reduce((sum, rv) => sum + rv.rating, 0);
    return Math.round(total / reviews.length); // rounds to nearest whole star
  };

  const StarDisplay = ({ reviews }: { reviews: { rating: number }[] }) => {
    const average = getAverageRating(reviews ?? []);

    return (
      <div className="flex items-center justify-center sm:justify-start gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={
              star <= average
                ? "text-[#FBBF24] text-xl"
                : "text-[#D1D5DB] text-xl"
            }
          >
            ★
          </span>
        ))}
        <span className="text-sm text-gray-500">({reviews.length})</span>{" "}
        {/* review count */}
      </div>
    );
  };

  const fo = oil.find((ol) => String(ol._id) === params.ProductsId);

  useEffect(() => {}, [fo]);

  return (
    <section className="max-w-275 mx-auto px-4 sm:px-6 lg:px-0">
      <div className="mt-20 sm:mt-24 lg:mt-30 flex flex-col lg:flex-row gap-8 lg:gap-12">
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row justify-center items-center sm:items-start gap-4">
            <div className="h-90 sm:h-72 lg:h-full w-full sm:w-56 lg:w-60">
              <Image
                src={
                  fo?.itemImage?.startsWith("/9j/")
                    ? `data:image/jpeg;base64,${fo?.itemImage}`
                    : fo?.itemImage || "/placeholder.jpg"
                }
                alt={fo?.name ?? ""}
                width={300}
                height={260}
                className="object-cover h-full w-full rounded-md"
              />
            </div>
            <div className="w-full sm:w-auto text-center sm:text-left">
              <h1 className="text-lg sm:text-xl font-medium">{fo?.name}</h1>
              <span className="block mt-4 font-bold text-lg sm:text-xl">
                ₦
                {fo?.price.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
              <StarDisplay reviews={fo?.reviews ?? []} />
              <div className="border h-8 mt-3 w-24 sm:w-30 mx-auto sm:mx-0 px-2 flex justify-center items-center gap-4 sm:gap-6">
                <button
                  onClick={() => setQuantity(quantity - 1)}
                  className="text-[#FFC0CB] text-xl font-bold cursor-pointer"
                >
                  -
                </button>
                <span>{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="text-[#FFC0CB] text-xl font-bold cursor-pointer"
                >
                  +
                </button>
              </div>
              <button
                onClick={() => handleCart(fo?._id ?? "")}
                className="flex hover:text-white cursor-pointer mt-5 sm:mt-7 rounded-md justify-center items-center gap-3 border h-12 w-full sm:w-64 lg:w-full bg-[#FFC0CB] text-base sm:text-xl"
              >
                {loadingId ? (
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
          <div className="mt-10 bg-[#F2F2F2] rounded-3xl flex justify-center items-center border h-12 sm:h-13 w-full sm:w-85">
            <button
              className={` ${selected === "Description" ? "bg-[#FFC0CB]  text-white text-bold text-[14px] sm:text-[16px] h-9 sm:h-10 w-1/2 sm:w-40 rounded-2xl transition-all duration-400" : " h-9 sm:h-10 w-1/2 sm:w-40 text-[14px] sm:text-[16px] rounded-xl transition-all duration-400 cursor-pointer"}`}
              onClick={() => setSelected("Description")}
            >
              Description
            </button>
            <button
              onClick={() => setSelected("Reviews")}
              className={`${selected === "Reviews" ? "bg-[#FFC0CB] text-white text-bold text-[14px] sm:text-[16px] rounded-2xl h-9 sm:h-10 w-1/2 sm:w-40 transition-all duration-400" : "h-9 sm:h-10 w-1/2 sm:w-40 text-[14px] sm:text-[16px] transition-all duration-400 cursor-pointer"}`}
            >
              Reviews
            </button>
          </div>
          <div className="mt-5">
            {selected === "Description" && (
              <motion.p
                initial={{ opacity: 0, y: -40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, ease: "easeOut" }}
                className="text-sm sm:text-base"
              >
                {fo?.description}
              </motion.p>
            )}

            {selected === "Reviews" && (
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, ease: "easeOut" }}
              >
                {(fo?.reviews.length ?? 0) > 0 ? (
                  <div>
                    {fo?.reviews.map((rv) => (
                      <div
                        key={rv._id}
                        className="mb-4 sm:mb-6 text-sm sm:text-base"
                      >
                        <p>{rv.reviewer}</p>
                        <p>{rv.comment}</p>
                        <div>
                          {stars.map((star) => (
                            <span
                              key={star}
                              className={
                                star <= rv.rating
                                  ? "text-[#FBBF24] text-xl"
                                  : "text-[#D1D5DB] text-xl"
                              }
                            >
                              ★
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div>
                    <p>no reviews yet, be the first to comment</p>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </div>
        <div className="flex-1">
          <div className="w-full">
            <h1 className="text-[18px] sm:text-[20px] font-bold py-3 text-center text-[#FFC0CB]">Benefits</h1>
            {fo?.benefits.map((be) => {
              const isOpen = openId === be._id;

              return (
                <div key={be._id} className="border-b-2 border-[#FFC0CB]">
                  <button
                    type="button"
                    onClick={() => toggle(be._id)}
                    className="flex w-full justify-between items-center py-2 text-left cursor-pointer"
                    aria-expanded={isOpen}
                  >
                    <h3 className="text-[14px] sm:text-[16px] font-bold text-center capitalize">
                      {be.label}
                    </h3>
                    {isOpen ? (
                      <Minus className="size-4" />
                    ) : (
                      <Plus className="size-4" />
                    )}
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="overflow-hidden"
                      >
                        <motion.p
                          initial={{ opacity: 0, x: -40 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -40 }}
                          transition={{ duration: 0.3, ease: "easeOut" }}
                          className="text-sm sm:text-[15px] pb-2"
                        >
                          {be.benefit}
                        </motion.p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
          <div className="w-full mt-9">
            <h1 className="text-[18px] sm:text-[20px] text-[#FFC0CB] font-bold py-3 text-center">
              How to use
            </h1>
            {fo?.use.map((be) => {
              const isOpen = openId === be._id;

              return (
                <div key={be._id} className="border-b-2 border-[#FFC0CB]">
                  <button
                    type="button"
                    onClick={() => toggle(be._id)}
                    className="flex w-full justify-between items-center py-2 text-left cursor-pointer"
                    aria-expanded={isOpen}
                  >
                    <h3 className="text-[14px] sm:text-[16px] font-bold capitalize">
                      {be.label}
                    </h3>
                    {isOpen ? (
                      <Minus className="size-4" />
                    ) : (
                      <Plus className="size-4" />
                    )}
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="overflow-hidden"
                      >
                        <motion.p
                          initial={{ opacity: 0, x: -40 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -40 }}
                          transition={{ duration: 0.3, ease: "easeOut" }}
                          className="text-sm sm:text-[15px] pb-2"
                        >
                          {be.usage}
                        </motion.p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
          <div>
            <h1 className=" mt-8 text-center text-sm sm:text-[16px]">
              Kindly leave a review, so others can know how you feel about this
              product.
            </h1>
            <div>
              <form
                onSubmit={handleSubmit}
                className="grid gap-1.5 mt-3 w-full lg:w-150"
              >
                <div className="flex flex-col gap-1">
                  <label>Your name</label>
                  <input
                    value={reviewer}
                    onChange={(e) => setReviewer(e.target.value)}
                    className="border
                  focus:border-[#FFC0CB]
                  focus:border-2
                  rounded-md
                   px-3
                   sm:px-5
                   h-11
                   sm:h-12
                   w-full
                   outline-0"
                    type="text"
                  />
                </div>
                <div>
                  {stars.map((star) => (
                    <span
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHover(star)}
                      onMouseLeave={() => setHover(null)}
                      key={star}
                      className={
                        star <= (hover ?? rating)
                          ? "text-[#FBBF24] cursor-pointer text-2xl"
                          : "text-[#D1D5DB] cursor-pointer text-2xl"
                      }
                    >
                      ★
                    </span>
                  ))}
                </div>
                <div className="flex flex-col gap-1">
                  <label>Comment</label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className=" resize-none border
                     h-20
                     outline-0
                     focus:border-2
                     focus:border-[#FFC0CB]
                     rounded-md
                     py-3
                     sm:py-5
                     px-3
                     sm:px-5
                     w-full"
                    placeholder="leave a comment"
                    maxLength={150}
                  />
                </div>
                <div className="flex justify-center items-center mt-6">
                  <button
                    type="submit"
                    className="h-11
                     sm:h-12
                     w-full
                     border
                     hover:text-white
                     rounded-md
                     bg-[#FFC0CB]
                     flex
                     justify-center
                     items-center
                     cursor-pointer"
                  >
                    {loading ? (
                      <div className="flex justify-center items-center">
                        <LoaderIcon
                          role="status"
                          aria-label="Loading"
                          className="size-4 animate-spin"
                        />
                      </div>
                    ) : (
                      <Send />
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </section>
  );
};

export default ProductsDetails;