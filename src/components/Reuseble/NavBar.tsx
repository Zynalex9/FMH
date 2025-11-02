"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { getUser } from "@/store/AuthSlice";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);
  const { locale } = useParams();
  const { user } = useSelector((state: RootState) => state.user);
  console.log("Navbar user:", user);
  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = `/${locale}/signin`;
  };

  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    (async () => {
      await dispatch(getUser());
    })();
  }, [dispatch]);

  return (
    <nav className="bg-cbg fixed top-0 left-0 w-full z-50 border-b border-b-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href={`/${locale}`} className="flex items-center gap-2">
            <span className="font-semibold text-lg text-gray-900">FMH</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8 items-center">
            <Link
              href={`/${locale}/about`}
              className="text-gray-800 hover:text-cgreen/80"
            >
              About
            </Link>
            <Link
              href={`/${locale}/services`}
              className="text-gray-800 hover:text-cgreen/80"
            >
              Services
            </Link>

            <div className="flex items-center gap-3">
              {/* ✅ Conditional Buttons */}
              {!user ? (
                <>
                  <Button asChild className="bg-cgreen hover:bg-cgreen/90">
                    <Link href={`/${locale}/volunteer-signup`}>Sign Up</Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="border-green-100 bg-sgreen hover:bg-green-100 text-gray-800"
                  >
                    <Link href={`/${locale}/signin`}>Log In</Link>
                  </Button>
                </>
              ) : (
                <>
                  {user.role === "admin" && (
                    <Button asChild className="bg-cgreen hover:bg-cgreen/90">
                      <Link href={`/${locale}/request`}>Admin Dashboard</Link>
                    </Button>
                  )}
                  {user.role === "volunteer" && (
                    <Button asChild className="bg-cgreen hover:bg-cgreen/90">
                      <Link href={`/${locale}/volunteer/dashboard`}>
                        Volunteer Dashboard
                      </Link>
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    className="border-green-100 bg-sgreen hover:bg-green-100 text-gray-800"
                    onClick={handleLogout}
                  >
                    Log Out
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden">
            <button onClick={toggleMenu}>
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Fullscreen Mobile Menu */}
      {isOpen && (
        <div className="fixed inset-0 bg-cbg flex flex-col items-center justify-center z-40 transition-all duration-300">
          <button
            onClick={toggleMenu}
            className="absolute top-5 right-5 text-gray-700 hover:text-gray-900"
          >
            <X size={28} />
          </button>

          <div className="flex flex-col space-y-6 text-center text-lg font-medium">
            <Link
              href={`/${locale}/about`}
              className="text-gray-800 hover:text-cgreen/80"
              onClick={toggleMenu}
            >
              About
            </Link>
            <Link
              href={`/${locale}/services`}
              className="text-gray-800 hover:text-cgreen/80"
              onClick={toggleMenu}
            >
              Services
            </Link>

            <div className="flex flex-col gap-3 mt-6 w-48">
              {!user ? (
                <>
                  <Button
                    asChild
                    className="bg-cgreen hover:bg-cgreen/90 w-full text-white"
                  >
                    <Link
                      href={`/${locale}/volunteer-signup`}
                      onClick={toggleMenu}
                    >
                      Sign Up
                    </Link>
                  </Button>

                  <Button
                    asChild
                    variant="outline"
                    className="border-green-100 bg-sgreen hover:bg-sgreen/90 text-gray-800 w-full"
                  >
                    <Link href={`/${locale}/signin`} onClick={toggleMenu}>
                      Sign In
                    </Link>
                  </Button>
                </>
              ) : (
                <>
                  {user.role === "admin" && (
                    <Button
                      asChild
                      className="bg-cgreen hover:bg-cgreen/90 w-full"
                    >
                      <Link
                        href={`/${locale}/admin/dashboard`}
                        onClick={toggleMenu}
                      >
                        Admin Dashboard
                      </Link>
                    </Button>
                  )}
                  {user.role === "volunteer" && (
                    <Button
                      asChild
                      className="bg-cgreen hover:bg-cgreen/90 w-full"
                    >
                      <Link
                        href={`/${locale}/volunteer/dashboard`}
                        onClick={toggleMenu}
                      >
                        Volunteer Dashboard
                      </Link>
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    className="border-green-100 bg-sgreen hover:bg-sgreen/90 text-gray-800 w-full"
                    onClick={handleLogout}
                  >
                    Log Out
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
