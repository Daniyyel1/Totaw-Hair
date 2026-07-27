import React from "react";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";

const VerificationSuccessPage = () => {
  return (
    <section className="font-comorantInfant">
      <div className="max-w-275 mx-auto ">
        <div className="flex justify-center items-center gap-3 border rounded-md h-30 w-100 max-w-200 m-auto mt-20 bg-[#FFC0CB]">
          <IoMdCheckmarkCircleOutline className="text-[green]" size={30} />
          <h1 className="text-2xl">Password reset link sent!</h1>
        </div>
        <p className="text-center text-xl mt-4">
          {
            "We've sent a password reset link to your email address. Please check your inbox and spam folder."
          }
        </p>
       
      </div>
    </section>
  );
};

export default VerificationSuccessPage;
