


"use client";
import { LoaderIcon } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { toast } from "sonner";
import { FcGoogle } from "react-icons/fc";
import { doCredentialsLogin, doSocialLogin } from "@/app/lib/action";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { useRouter } from "next/navigation";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isShownPassword, setIsShownPassword] = useState(false);

  const router = useRouter();

  const showPassword = () => {
    setIsShownPassword(!isShownPassword);
  };

  // const canSubmit =
  //   username.trim().length > 1 &&
  //   email.includes("@") &&
  //   password.length > 8 &&
  //   password === confirmPassword &&
  //   agreed;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // if (!canSubmit) return;

    if (!email || !password) {
      toast.error("fields cannot be empty");
      return;
    }

    setLoading(true);

    const payload = {
      email,
      password,
    };

    try {
      const response = await doCredentialsLogin(payload);

      if (response) {
        toast.success("sign in successfully");
        router.push('/components/subPages/Profile')
      } else {
        toast.error("Something went wrong");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }

    setEmail("");

    setPassword("");
  };

  return (
    <section className=" font-comorantInfant">
      <div className="flex min-h-screen">
        <div className="flex-1 h-full pt-8 sm:pt-10 px-5 sm:px-8 md:px-13 flex flex-col justify-center">
          <h1 className="text-center text-3xl sm:text-4xl font-bold">Welcome</h1>
          <p className="text-center py-2.5 text-[16px] sm:text-[18px]">Log in to your account</p>

          <div className="">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              
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
                  placeholder="Enter password"
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
             
              <Link className="flex justify-end items-center font-bold text-sm sm:text-base" href="">
                Forgot Password?
              </Link>
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
                    "Sign in"
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
                  className="h-12 sm:h-13 rounded-md bg-[#F2F2F2] w-full flex justify-center items-center gap-2.5 text-[15px] sm:text-[17px] font-medium cursor-pointer"
                >
                  <FcGoogle className="text-2xl" /> Continue with Google
                </button>
              </form>
              <div className="flex mt-2  justify-center items-center gap-3">
                <p className="text-sm sm:text-base">Do not have an account?</p>
                <Link href="/Register" className="font-bold text-[17px] sm:text-[19px]">
                  Sign up
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

export default LoginForm;