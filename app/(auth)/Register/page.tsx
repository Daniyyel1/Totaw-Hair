"use client";
import { LoaderIcon } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { toast } from "sonner";
import { FcGoogle } from "react-icons/fc";
import { doSocialLogin } from "@/app/lib/action";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";

const RegistrationForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isShownPassword, setIsShownPassword] = useState(false);
  const [isPasswordShown, setIsPasswordShown] = useState(false);

  const showPassword = () => {
    setIsShownPassword(!isShownPassword);
  };
  const showPasswordd = () => {
    setIsPasswordShown(!isPasswordShown);
  };


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

  

    if (!name || !email || !password) {
      toast.error("fields cannot be empty");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("passwords do not match");
      return;
    }

    setLoading(true);

    const payload = {
      email,
      password,
      name,
      confirmPassword,
    };

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.status === 201) {
        toast.success("Account created! Check your inbox or spam/junk folder to verify your email.");
      } else {
        const data = await response.json().catch(() => null);
        const message = String(data?.message || "");

        if (response.status === 409) {
          toast.error(
            message || "An account with these details already exists.",
          );
        } else {
          toast.error(message || "fail to create user account");
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }

    setEmail("");
    setName("");
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <section className=" font-comorantInfant">
      <div className="flex min-h-screen">
        <div className="flex-1 h-full pt-8 sm:pt-10 px-5 sm:px-8 md:px-13 flex flex-col justify-center">
          <h1 className="text-center text-3xl sm:text-4xl font-bold">Register</h1>
          <p className="text-center py-2.5 text-[16px] sm:text-[18px]">Create an account</p>

          <div className="">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="border py-3 px-3 focus-within:border-[#FFC0CB] focus-within:border-2 border-black h-12 w-full rounded-md">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="outline-0 w-full placeholder:text-sm sm:placeholder:text-xl"
                  type="text"
                  placeholder="Username"
                />
              </div>
              <div className="border py-3 px-3 focus-within:border-[#FFC0CB] focus-within:border-2 border-black h-12 w-full rounded-md">
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="outline-0 w-full placeholder:text-sm sm:placeholder:text-xl"
                  type="email"
                  placeholder="Enter your email address"
                />
              </div>
              <div className="border flex justify-between items-center py-3 px-3 focus-within:border-[#FFC0CB] focus-within:border-2 border-black h-12 w-full rounded-md">
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="outline-0 w-full placeholder:text-sm sm:placeholder:text-xl"
                  type={isShownPassword ? "text" : "password"}
                  placeholder="Choose a strong password"
                />
                {isShownPassword ? (
                  <IoEyeOffOutline
                    onClick={showPassword}
                    className="text-xl cursor-pointer"
                  />
                ) : (
                  <IoEyeOutline
                    className="text-xl cursor-pointer"
                    onClick={showPassword}
                  />
                )}
              </div>
              <div className="border flex justify-between items-center py-3 px-3 focus-within:border-[#FFC0CB] focus-within:border-2 border-black h-12 w-full rounded-md">
                <input
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="outline-0 w-full placeholder:text-sm sm:placeholder:text-xl"
                  type={isPasswordShown ? "text" : "password"}
                  placeholder="Re-enter password"
                />
                {isPasswordShown  ? (
                  <IoEyeOffOutline
                    onClick={showPasswordd}
                    className="text-xl cursor-pointer"
                  />
                ) : (
                  <IoEyeOutline
                    className="text-xl cursor-pointer"
                    onClick={showPasswordd}
                  />
                )}
              </div>
            
              <div className="flex justify-center items-center">
                <button
                  type="submit"
                  className="h-12 sm:h-13 cursor-pointer text-[17px] sm:text-[20px] font-bold rounded-md w-full border bg-[#FFC0CB]"
                >
                  {loading ? (
                    <div className="flex justify-center items-center">
                      <LoaderIcon className="text-2xl animate-spin" />
                    </div>
                  ) : (
                    "Sign up"
                  )}
                </button>
              </div>
            </form>
            <div className="mt-3">
              <div className="flex py-5 gap-3 sm:gap-10 justify-center items-center">
                <div className="border w-16 sm:w-30"></div>
                <p className="text-sm sm:text-base whitespace-nowrap">Or continue using</p>
                <div className="border w-16 sm:w-30"></div>
              </div>
              <form action={doSocialLogin}>
                <button
                  type="submit"
                  name="action"
                  value="google"
                  className="h-12 sm:h-13 rounded-md bg-[#F2F2F2] w-full flex justify-center items-center gap-2.5 text-[15px] sm:text-xl font-medium cursor-pointer"
                >
                  <FcGoogle className="text-2xl" /> Continue with Google
                </button>
              </form>
              <div className="flex mt-2  justify-center items-center gap-3">
                <p className="text-sm sm:text-base">Already have an account?</p>
                <Link href="/Login" className="font-bold text-[17px] sm:text-[19px]">
                  Sign in
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 border h-screen bg-[#FFC0CB] hidden lg:block"></div>
      </div>
    </section>
  );
};

export default RegistrationForm;