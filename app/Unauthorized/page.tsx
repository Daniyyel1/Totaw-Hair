import Link from "next/link";
import { ShieldAlert } from "lucide-react";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
      <div className="text-center max-w-sm">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
          <ShieldAlert className="h-8 w-8 text-red-500" />
        </div>
        <h1 className="text-2xl font-bold text-neutral-900">Access Denied</h1>
        <p className="mt-2 text-neutral-500">
          You dont have permission to view this page. This area is restricted to admins only.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="rounded-lg bg-[#FFC0CB] text-white px-5 py-2.5 font-medium hover:border-black"
          >
            Go home
          </Link>
          <Link
            href="/Login"
            className="rounded-lg border border-neutral-300 px-5 py-2.5 font-medium hover:bg-neutral-100 transition"
          >
            Sign in as admin
          </Link>
        </div>
      </div>
    </div>
  );
}