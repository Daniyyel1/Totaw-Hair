"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { ImagePlus, LoaderIcon } from "lucide-react";

interface Users {
  id: string;
  role: string;
}

interface Benefits {
  label: string;
  benefit: string;
}

interface Uses {
  label: string;
  usage: string;
}

const DashboardPage = () => {
  const [selected, setSelected] = useState("Overview");
  const [users, setUsers] = useState<Users[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [preview, setPreview] = useState<string>("");
  const [itemImage, setItemImage] = useState("");
  const [benefits, setBenefits] = useState<Benefits[]>([
    { label: "", benefit: "" },
  ]);
  const [use, setUse] = useState<Uses[]>([{ label: "", usage: "" }]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("/api/users");
      if (response.status === 201) {
        setUsers(response.data.data);
        toast.success("Users found");
        console.log("Users", response.data.data);
        return;
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const addBenefit = () => {
    setBenefits((prev) => [...prev, { label: "", benefit: "" }]);
  };

  const removeBenefit = (index: number) => {
    setBenefits((prev) => prev.filter((_, i) => i !== index));
  };

  const updateBenefit = (
    index: number,
    field: keyof Benefits,
    value: string,
  ) => {
    setBenefits((prev) =>
      prev.map((b, i) => (i === index ? { ...b, [field]: value } : b)),
    );
  };
  const addUse = () => {
    setUse((prev) => [...prev, { label: "", usage: "" }]);
  };

  const removeUse = (index: number) => {
    setUse((prev) => prev.filter((_, i) => i !== index));
  };

  const updateUse = (index: number, field: keyof Uses, value: string) => {
    setUse((prev) =>
      prev.map((b, i) => (i === index ? { ...b, [field]: value } : b)),
    );
  };

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
      setItemImage(base64String);
      setPreview(base64String);
    };

    reader.onerror = () => {
      toast.error("Failed to read image");
    };

    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name || !description || !price || !benefits || !use || !itemImage) {
      return toast.error("Please fill out all fields and upload product image");
    }

    setLoading(true);

    const payload = {
      name,
      description,
      price,
      itemImage,
      benefits,
      use,
    };

    try {
      const response = await fetch(`/api/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.status === 201) {
        toast.success("Product successfully uploaded");
      } else {
        toast.error(data?.message || "Failed to upload item");
      }
    } catch (e) {
      console.error(e);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const userCount = users?.filter((u) => u.role === "user").length ?? 0;

  return (
    <section className=" font-comorantInfant bg-[#FFC0CB] h-full">
      <div className="max-w-275 gap-5 py-8 mx-auto grid grid-cols-[200px_1fr]">
        <div className=" h-full flex flex-col gap-5 items-center py-12 bg-white">
          <button
            onClick={() => setSelected("Overview")}
            className={`font-bold text-xl cursor-pointer hover:w-full hover:text-gray-400 ${selected === "Overview" ? "text-[#FFC0CB] font-bold text-3xl transition-all duration-300 ease-in-out" : ""}`}
          >
            Overview
          </button>
          <button
            onClick={() => setSelected("Product")}
            className={`font-bold text-xl cursor-pointer hover:w-full hover:text-gray-400 ${selected === "Product" ? "text-[#FFC0CB] font-bold text-3xl transition-all duration-300 ease-in-out" : ""}`}
          >
            Add a product
          </button>
        </div>
        <div className=" h-screen">
          {selected === "Overview" && (
            <motion.div
              className="px-6 py-6"
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: "easeOut" }}
            >
              <div className="flex  items-center gap-6">
                <div className=" h-30 w-60 rounded-md bg-white flex flex-col justify-center items-center">
                  <h1 className="text-xl font-bold">Users</h1>
                  <span className="text-xl font-bold ">[{userCount}]</span>
                </div>
                <div className="h-30 w-60 rounded-md bg-white flex flex-col justify-center items-center">
                  <h1 className="text-xl font-bold">Completed Orders</h1>
                  <span className="text-xl font-bold">[0]</span>
                </div>
                <div className=" h-30 w-60 rounded-md bg-white flex flex-col justify-center items-center">
                  <h1 className="text-xl font-bold">Feeds</h1>
                  <span className="text-xl font-bold">[0]</span>
                </div>
              </div>
            </motion.div>
          )}
          {selected === "Product" && (
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: "easeOut" }}
            >
              <div className="bg-white h-full rounded-md">
                <h1 className="text-center py-8 text-2xl font-bold">
                  Add a Product
                </h1>
                <form
                  onSubmit={handleSubmit}
                  className="flex flex-col gap-3 px-5"
                >
                  <div className="flex flex-col gap-1">
                    <label className="text-[16px] font-bold">
                      {"Product's name:"}
                    </label>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="border-b-2 outline-0 border-b-[#FFC0CB]"
                      type="text"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[16px] font-bold">
                      {"Product's Description:"}
                    </label>
                    <input
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="border-b-2 outline-0 border-b-[#FFC0CB]"
                      type="text"
                    />
                  </div>
                  <label className="text-[16px] font-bold">
                    {"Product's Benefits:"}
                  </label>

                  {benefits.map((bt, index) => (
                    <div
                      key={index}
                      className="flex flex-col gap-2 border-b pb-3 mb-3"
                    >
                      <div className="flex flex-col gap-1">
                        <label className="text-[14px] font-bold">
                          {"*Benefits label"}
                        </label>
                        <input
                          value={bt.label}
                          onChange={(e) =>
                            updateBenefit(index, "label", e.target.value)
                          }
                          className="border-b-2 outline-0 border-b-[#FFC0CB]"
                          type="text"
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-[14px] font-bold">
                          {"*Benefits description"}
                        </label>
                        <input
                          value={bt.benefit}
                          onChange={(e) =>
                            updateBenefit(index, "benefit", e.target.value)
                          }
                          className="border-b-2 outline-0 border-b-[#FFC0CB]"
                          type="text"
                        />
                      </div>

                      {benefits.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeBenefit(index)}
                          className="text-red-500 cursor-pointer text-sm self-start"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={addBenefit}
                    className="text-sm cursor-pointer font-bold text-[#FFC0CB] self-start"
                  >
                    + Add another benefit
                  </button>
                  <label className="text-[16px] font-bold">
                    {"Product's Uses:"}
                  </label>

                  {use.map((us, index) => (
                    <div
                      key={index}
                      className="flex flex-col gap-2 border-b pb-3 mb-3"
                    >
                      <div className="flex flex-col gap-1">
                        <label className="text-[14px] font-bold">
                          {"*Uses label"}
                        </label>
                        <input
                          value={us.label}
                          onChange={(e) =>
                            updateUse(index, "label", e.target.value)
                          }
                          className="border-b-2 outline-0 border-b-[#FFC0CB]"
                          type="text"
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-[14px] font-bold">
                          {"*Uses description"}
                        </label>
                        <input
                          value={us.usage}
                          onChange={(e) =>
                            updateUse(index, "usage", e.target.value)
                          }
                          className="border-b-2 outline-0 border-b-[#FFC0CB]"
                          type="text"
                        />
                      </div>

                      {use.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeUse(index)}
                          className="text-red-500 cursor-pointer text-sm self-start"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={addUse}
                    className="text-sm cursor-pointer font-bold text-[#FFC0CB] self-start"
                  >
                    + Add another benefit
                  </button>
                  <div className="flex flex-col gap-1">
                    <label className="text-[16px] font-bold">
                      {"Product's price:"}
                    </label>
                    <input
                      value={price}
                      onChange={(e) => {
                        const val = e.target.value;
                        setPrice(val === "" ? 0 : Number(val));
                      }}
                      className="border-b-2 outline-0 border-b-[#FFC0CB]"
                      type="text"
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
                            setItemImage("");
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
                  <div className="flex justify-center items-center py-2">
                    <button
                      className="border flex justify-center items-center h-10 w-35 bg-[#FFC0CB] hover:text-white hover:bg-[#ffd4db] font-bold cursor-pointer rounded-md text-[17px]"
                      type="submit"
                    >
                      {loading ? (
                        <LoaderIcon className="animate-spin size-6" size={5} />
                      ) : (
                        "Add Product"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};

export default DashboardPage;
