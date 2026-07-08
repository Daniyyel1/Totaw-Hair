

"use client";
import { LoaderIcon } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

const NewsLetter = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email)
      return toast.error("Please insert your email address to continue");

    setLoading(true);

    const payload = {
      email,
    };

    try {
      const response = await fetch("/api/feeds", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.status === 201) {
        toast.success("Thank you for subscribing");
      } else {
        toast.error("something went wrong, Try again.");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }

    setEmail("")
  };

  return (
    <section>
      <div className="bg-[#FFC0CB] min-h-72 sm:h-80 mt-6 sm:mt-10 font-comorantInfant py-8 sm:py-0">
        <div className="max-w-275 mx-auto py-4 px-4 sm:px-6 lg:px-0">
          <h1 className="text-center text-3xl sm:text-4xl md:text-5xl font-bold py-3">
            Join our NewsLetter
          </h1>
          <p className="text-center text-[15px] sm:text-[16px] md:text-[18px] max-w-lg mx-auto">
            Stay updated with our latest hair oil collections, expert hair care
            tips, and exclusive offers designed to keep your hair healthy,
            strong, and radiant.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 flex flex-col items-center gap-3">
            <div className="border-1 border-black px-3.5 py-2.5 h-12 w-full max-w-90">
              <input
                className="placeholder:text-[14px] sm:placeholder:text-[16px] md:placeholder:text-[18px] w-full outline-0"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
              />
            </div>
            <button
              type="submit"
              className="text-[16px] sm:text-[18px] h-14 w-full max-w-90 bg-black cursor-pointer rounded-md text-white"
            >
              {loading ? (
                <div className="flex justify-center items-center">
                  <LoaderIcon
                    role="status"
                    aria-label="loading"
                    className="size-5 animate-spin text-[#FFC0CB]"
                  />
                </div>
              ) : (
                "Subscribe"
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default NewsLetter;