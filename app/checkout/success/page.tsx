// app/checkout/success/page.tsx
"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import axios from "axios";
import Link from "next/link";

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const reference = searchParams.get("reference") || searchParams.get("trxref");
  const [status, setStatus] = useState<"verifying" | "success" | "failed">("verifying");

  useEffect(() => {
    if (!reference) return;

    const verify = async () => {
      try {
        const response = await axios.get(`/api/verify-payment?reference=${reference}`, {
          withCredentials: true,
        });

        setStatus(response.data.success ? "success" : "failed");
      } catch (e) {
        console.error(e);
        setStatus("failed");
      }
    };

    verify();
  }, [reference]);

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      {status === "verifying" && <p>Verifying your payment...</p>}
      {status === "success" && (
        <>
          <h1 className="text-2xl font-bold">Payment Successful!</h1>
          <p className="text-gray-500">Thank you for your order.</p>
          <Link href="/components/subpages/Order" className="underline">
            View your orders
          </Link>
        </>
      )}
      {status === "failed" && <h1 className="text-2xl font-bold">Payment verification failed</h1>}
    </div>
  );
}

export default function CheckoutSuccess() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
      <CheckoutSuccessContent />
    </Suspense>
  );
}