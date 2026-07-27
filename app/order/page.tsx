"use client";
import axios from "axios";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

interface OrderItem {
  oil: {
    _id: string;
    name: string;
    price: number;
    itemImage: string;
  };
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  items: OrderItem[];
  total: number;
  status: "pending" | "paid" | "failed";
  createdAt: string;
}

const Order = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  const fetchOrders = async () => {
    try {
      const response = await axios.get("/api/orders", {
        withCredentials: true,
      });
      if (response.status === 200) {
        setOrders(response.data.data);
        console.log(response);
      } else {
        toast.error("fail to get orders");
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div>
      <div className="bg-white rounded-xl border overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b text-sm text-gray-500">
              <th className="px-6 py-4 font-medium">Order</th>
              <th className="px-6 py-4 font-medium">Date</th>
              <th className="px-6 py-4 font-medium">Payment</th>
              <th className="px-6 py-4 font-medium">Total</th>
              <th className="px-6 py-4 font-medium">Items</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-6 text-center text-gray-500">
                  No orders yet.
                </td>
              </tr>
            ) : (
              orders.map((od, i) => (
                <tr key={od._id ?? i} className="border-b last:border-0">
                  <td className="px-6 py-4 font-medium">
                    #{od._id?.slice(-6).toUpperCase()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(od.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-sm px-3 py-1 rounded-full capitalize ${
                        od.status === "paid"
                          ? "bg-green-100 text-green-700"
                          : od.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                      }`}
                    >
                      {od.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium">
                    ₦{od.total.toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-2">
                      {od.items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <Image
                            width={50}
                            height={50}
                            src={
                              item.oil.itemImage?.startsWith("/9j/")
                                ? `data:image/jpeg;base64,${item.oil.itemImage}`
                                : item.oil.itemImage || "/placeholder.jpg"
                            }
                            alt={item.oil.itemImage}
                            className="h-10 w-8 object-cover rounded-md"
                          />
                          <div>
                            <p className="capitalize text-sm">
                              {item.oil.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              Qty: {item.quantity} · ₦
                              {(item.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Order;
