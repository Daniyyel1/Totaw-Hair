"use client";

import { doLogout } from "@/app/lib/action";
import Order from "@/app/order/page";
import { ImagePlus, LoaderIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { GoPerson } from "react-icons/go";
import { IoSettingsOutline } from "react-icons/io5";
import { MdOutlineHistory } from "react-icons/md";
import { MdLogout } from "react-icons/md";
import { toast } from "sonner";

type Props = {
  userName?: string | null;
  email?: string | null;
  userPicture?: string | null;
  phoneNo?: string | null;
  userBio?: string | null;
};

const ProfileContext = ({
  userName,
  email,
  userPicture,
  phoneNo,
  userBio,
}: Props) => {
  const [selected, setSelected] = useState<string>("Profile");
  const [profilePicture, setProfilePicture] = useState<string>("");
  const [preview, setPreview] = useState<string>("");
  const [telephone, setTelephone] = useState<string>("");
  const [bio, setBio] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState<string>("");
  const [loadingScreen, setLoadingScreen] = useState(true);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be under 2MB");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const base64String = reader.result as string;
      setProfilePicture(base64String);
      setPreview(base64String);
    };

    reader.onerror = () => {
      toast.error("Failed to read image");
    };

    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!telephone || !bio || !name) {
      toast.error("Fields cannot be empty");
      return;
    }

    setLoading(true);

    const payload = {
      profilePicture: profilePicture,
      bio,
      telephone,
      name,
    };

    try {
      const response = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.status === 201) {
        toast.success("User info updated");
      } else {
        toast.error(data?.message || "Failed to update user info");
      }
    } catch (e) {
      console.error(e);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(()=>{
    const timer = setTimeout(()=>{
      setLoadingScreen(false);
    }, 2000)

    return ()=> clearTimeout(timer);
  }, [])

  return (
    <>
      {loadingScreen ? (
        <div className="flex justify-center items-center ">
          <LoaderIcon
            role="status"
            aria-label="Loading"
            className="size-14 sm:size-20 text-[#FFC0CB] mt-20 sm:mt-30 animate-spin"
          />
        </div>
      ) : (
        <section className=" font-comorantInfant bg-[#FFC0CB] min-h-screen h-auto">
          <div className="max-w-275 mx-auto py-6 sm:py-10 px-4 sm:px-6 lg:px-0">
            <div className=" grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-4 lg:gap-0">
              <div className="border relative flex flex-row flex-wrap lg:flex-col items-center justify-center gap-4 sm:gap-6 py-4 sm:py-6 lg:py-14 rounded-md h-auto lg:h-120 bg-white">
                <div
                  className={`flex gap-2 sm:gap-3 justify-center items-center ${selected === "Profile" ? "text-[#FFC0CB] font-bold" : ""}`}
                >
                  <GoPerson className="size-5 sm:size-7" />

                  <button
                    onClick={() => setSelected("Profile")}
                    className="text-sm sm:text-lg lg:text-xl font-black cursor-pointer"
                  >
                    Profile
                  </button>
                </div>
                <div
                  className={`flex gap-2 sm:gap-3 justify-center items-center ${selected === "Settings" ? "text-[#FFC0CB] font-bold" : ""}`}
                >
                  <IoSettingsOutline className="size-5 sm:size-7" />

                  <button
                    onClick={() => setSelected("Settings")}
                    className="text-sm sm:text-lg lg:text-xl font-black cursor-pointer"
                  >
                    Settings
                  </button>
                </div>
                <div
                  className={`flex gap-2 sm:gap-3 justify-center items-center ${selected === "Orders" ? "text-[#FFC0CB] font-bold" : ""}`}
                >
                  <MdOutlineHistory className="size-5 sm:size-7" />

                  <button
                    onClick={() => setSelected("Orders")}
                    className="text-sm sm:text-lg lg:text-xl font-black cursor-pointer"
                  >
                    Orders
                  </button>
                </div>
                <div className="flex gap-2 sm:gap-3 justify-center items-center">
                  <MdLogout className="size-5 sm:size-7" />

                  <button
                    onClick={doLogout}
                    className="text-sm sm:text-lg lg:text-xl font-black cursor-pointer"
                  >
                    Logout
                  </button>
                </div>

                <div className="w-full text-center lg:w-auto lg:absolute lg:bottom-6 font-bold text-sm sm:text-lg lg:text-xl">
                  <Link href="/">Home</Link>
                </div>
              </div>
              <div className=" rounded-md h-auto lg:h-120">
                <div className="px-2 sm:px-6 lg:px-8 py-3">
                  {selected === "Profile" && (
                    <div>
                      <div className="border-b-2 py-2 flex justify-center sm:justify-start">
                        {userPicture ? (
                          <Image
                            src={userPicture}
                            className="h-16 w-16 sm:h-20 sm:w-20 rounded-full object-cover"
                            width={50}
                            height={50}
                            alt={userPicture}
                          />
                        ) : (
                          <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-gray-200 flex items-center justify-center">
                            <GoPerson className="size-8 text-gray-500" />
                          </div>
                        )}
                      </div>
                      <div className="border-b-2 pb-1.5 px-2 sm:px-4 mt-6 sm:mt-8 flex flex-col sm:flex-row gap-1 sm:gap-0 justify-between items-center text-center sm:text-left">
                        <h1 className="text-[15px] sm:text-[17px] font-bold">
                          Name:
                        </h1>

                        <h1 className="text-base sm:text-xl font-bold">
                          {userName}
                        </h1>
                      </div>
                      <div className="border-b-2 pb-1.5 px-2 sm:px-4 mt-6 sm:mt-8 flex flex-col sm:flex-row gap-1 sm:gap-0 justify-between items-center text-center sm:text-left">
                        <h1 className="text-[15px] sm:text-[17px] font-bold">
                          Bio:
                        </h1>

                        <h1 className="text-base sm:text-xl font-bold">
                          {userBio}
                        </h1>
                      </div>
                      <div className="border-b-2 pb-1.5 mt-6 sm:mt-8 px-2 sm:px-4  flex flex-col sm:flex-row gap-1 sm:gap-0 justify-between items-center text-center sm:text-left">
                        <h1 className="text-[15px] sm:text-[17px] font-bold">
                          Email:
                        </h1>

                        <h1 className="text-base sm:text-xl font-bold">
                          {email}
                        </h1>
                      </div>
                      <div className="border-b-2 pb-1.5 mt-6 sm:mt-8 px-2 sm:px-4  flex flex-col sm:flex-row gap-1 sm:gap-0 justify-between items-center text-center sm:text-left">
                        <h1 className="text-[15px] sm:text-[17px] font-bold">
                          Telephone:
                        </h1>

                        <h1 className="text-base sm:text-xl font-bold">
                          {phoneNo}
                        </h1>
                      </div>
                    </div>
                  )}
                </div>
                <div className="px-2 sm:px-6 lg:px-8 py-3">
                  {selected === "Settings" && (
                    <div className="">
                      <form
                        onSubmit={handleSubmit}
                        className="flex flex-col gap-3"
                      >
                        <div className="border px-4 sm:px-6 py-3 h-12 sm:h-13 w-full rounded-md">
                          <input
                            className="outline-0 w-full"
                            type="text"
                            value={name}
                            placeholder="Name"
                            onChange={(e) => setName(e.target.value)}
                          />
                        </div>
                        <div className="border px-4 sm:px-6 py-3 h-12 sm:h-13 w-full rounded-md">
                          <input
                            className="outline-0 w-full"
                            type="tel"
                            value={telephone}
                            placeholder="Add a phone number"
                            onChange={(e) => setTelephone(e.target.value)}
                          />
                        </div>
                        <div className="border px-4 sm:px-6 py-4  h-20 w-full rounded-md">
                          <textarea
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            className=" w-full rounded-md resize-none outline-0"
                            placeholder="Add a bio"
                            rows={4}
                            maxLength={200}
                          />
                        </div>
                        <div className="border h-16 w-16 rounded-md overflow-hidden relative flex items-center justify-center">
                          {preview ? (
                            <>
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={preview}
                                alt="Profile preview"
                                className="h-full w-full object-cover"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  setPreview("");
                                  setProfilePicture("");
                                }}
                                className="absolute top-0 right-0 bg-black/60 text-white text-xs w-4 h-4 flex items-center justify-center rounded-bl cursor-pointer"
                              >
                                ×
                              </button>
                            </>
                          ) : (
                            <label
                              htmlFor="profile-picture-upload"
                              className="h-full w-full flex items-center justify-center cursor-pointer text-gray-400 hover:text-gray-600 transition-colors"
                            >
                              <ImagePlus className="size-6" />
                              <input
                                id="profile-picture-upload"
                                accept="image/*"
                                type="file"
                                onChange={handleImageChange}
                                className="hidden"
                              />
                            </label>
                          )}
                        </div>
                        <div className="flex justify-center items-center">
                          <button
                            type="submit"
                            disabled={loading}
                            className=" bg-black text-white cursor-pointer hover:border-2 hover:bg-transparent hover:border-black hover:text-black h-11 sm:h-12 w-full sm:w-50 rounded-md disabled:opacity-60 disabled:cursor-not-allowed"
                          >
                            {loading ? (
                              <div className=" flex justify-center items-center">
                                <LoaderIcon className="size-6 animate-spin" />
                              </div>
                            ) : (
                              "Update profile"
                            )}
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
                </div>
                 <div className="px-2 sm:px-6 lg:px-8 py-3">
                    {
                      selected === 'Orders' && (
                        <Order />
                      )
                    }
                 </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default ProfileContext;
