"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Mail, Facebook, Instagram } from "lucide-react";

export default function Footer() {
  const { locale } = useParams();

  return (
    <footer className="w-full bg-cbg px-6 md:px-20 lg:px-40 py-6 text-cgreen">
      <div className="flex flex-col md:flex-row justify-between items-center gap-2">
        <Link
          href={`/${locale}/privacy`}
          className="text-sm hover:underline transition"
        >
          Privacy Policy
        </Link>

        <Link
          href={`/${locale}/terms`}
          className="text-sm hover:underline transition"
        >
          Terms of Service
        </Link>
      </div>
      <div className="mt-4 flex justify-center text-center px-4">
        <p className="text-sm md:text-base leading-relaxed">
          FMH – For My Health · Deliver. Restore. Daily. · Serving Little Rock and
          surrounding communities.
        </p>
      </div>
      <div className="mt-4 flex justify-center gap-6">
        <Mail size={20} />
        <Facebook size={20} />
        <Instagram size={20} />
      </div>
      <div className="mt-4 flex justify-center">
        <p className="text-xs md:text-sm opacity-80">
          © 2025 Community Connect. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
