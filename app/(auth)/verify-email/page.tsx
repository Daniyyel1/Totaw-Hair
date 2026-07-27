// app/verify-email/page.tsx
"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Missing verification token");
      return;
    }

    const verify = async () => {
      try {
        const res = await fetch("/api/auth/verify-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        const data = await res.json();

        if (!res.ok) {
          setStatus("error");
          setMessage(data.error || "Verification failed");
          return;
        }

        setStatus("success");
        setMessage(data.message);
      } catch {
        setStatus("error");
        setMessage("Something went wrong");
      }
    };

    verify();
  }, [token]);

  return (
    <div className="w-full max-w-sm text-center">
      {status === "loading" && <p>Verifying your email...</p>}

      {status === "success" && (
        <>
          <h1 className="text-2xl font-semibold text-green-600 mb-4">Email Verified!</h1>
          <p className="text-gray-500 mb-6">{message}</p>
          <Link
            href="/Login"
            className="inline-block bg-[#FFC0CB] text-white rounded-lg px-6 py-2"
          >
            Go to Login
          </Link>
        </>
      )}

      {status === "error" && (
        <>
          <h1 className="text-2xl font-semibold text-red-500 mb-4">Verification Failed</h1>
          <p className="text-gray-500">{message}</p>
        </>
      )}
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Suspense fallback={<p>Loading...</p>}>
        <VerifyEmailContent />
      </Suspense>
    </div>
  );
}