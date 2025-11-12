"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { getUser, handleUserLogout } from "@/store/AuthSlice";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

export default function Navbar() {
  const t = useTranslations("Navbar");
  const [isOpen, setIsOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);
  const { locale } = useParams();
  const { user } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await supabase.auth.signOut();
      const res = await fetch("/api/auth/signout", {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to sign out");
      dispatch(handleUserLogout());
      toast.success(t("toast.logoutSuccess"));
      window.location.href = `/${locale}/signin`;
    } catch (err) {
      console.error("Logout error:", err);
      toast.error(t("toast.logoutError"));
      window.location.href = `/${locale}/signin`;
    } finally {
      setLoggingOut(false);
    }
  };

  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

  const navLinks = [
    { href: `/${locale}/about`, label: t("about") },
    { href: `/${locale}/services`, label: t("services") },
    { href: `/${locale}/fmh`, label: "FMH" }, 
  ];

  return (
    <nav className="bg-cbg fixed top-0 left-0 w-full z-50 border-b border-b-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center gap-2">
            <span className="font-semibold text-lg text-gray-900">{t("logo")}</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8 items-center">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-800 hover:text-cgreen/80 transition-colors"
              >
                {link.label}
              </Link>
            ))}

            <div className="flex items-center gap-3">
              {!user ? (
                <>
                  <Button asChild className="bg-cgreen hover:bg-cgreen/90">
                    <Link href={`/${locale}/user-signup`}>{t("signUp")}</Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="border-green-100 bg-sgreen hover:bg-green-100 text-gray-800"
                  >
                    <Link href={`/${locale}/signin`}>{t("logIn")}</Link>
                  </Button>
                </>
              ) : (
                <>
                  {user.role === "admin" && (
                    <Button asChild className="bg-cgreen hover:bg-cgreen/90">
                      <Link href={`/${locale}/request`}>{t("adminDashboard")}</Link>
                    </Button>
                  )}
                  {user.role === "volunteer" && (
                    <Button asChild className="bg-cgreen hover:bg-cgreen/90">
                      <Link href={`/${locale}/volunteer/dashboard`}>
                        {t("volunteerDashboard")}
                      </Link>
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    className="border-green-100 bg-sgreen hover:bg-green-100 text-gray-800"
                    onClick={handleLogout}
                    disabled={loggingOut}
                  >
                    {loggingOut ? t("loggingOut") : t("logOut")}
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden">
            <button onClick={toggleMenu} aria-label="Toggle menu">
              {isOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown */}
      <div
        className={`fixed inset-0 bg-cbg flex flex-col items-center justify-center z-40 transform transition-all duration-300 ease-in-out ${
          isOpen
            ? "opacity-100 translate-y-0 visible"
            : "opacity-0 -translate-y-5 invisible pointer-events-none"
        }`}
      >
        <button
          onClick={toggleMenu}
          className="absolute top-5 right-5 text-gray-700 hover:text-gray-900"
          aria-label="Close menu"
        >
          <X size={28} />
        </button>

        <div className="flex flex-col space-y-6 text-center text-lg font-medium">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-gray-800 hover:text-cgreen/80 transition-colors"
              onClick={toggleMenu}
            >
              {link.label}
            </Link>
          ))}

          <div className="flex flex-col gap-3 mt-6 w-48">
            {!user ? (
              <>
                <Button
                  asChild
                  className="bg-cgreen hover:bg-cgreen/90 w-full text-white"
                >
                  <Link href={`/${locale}/user-signup`} onClick={toggleMenu}>
                    {t("signUp")}
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="border-green-100 bg-sgreen hover:bg-sgreen/90 text-gray-800 w-full"
                >
                  <Link href={`/${locale}/signin`} onClick={toggleMenu}>
                    {t("logIn")}
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
                    <Link href={`/${locale}/request`} onClick={toggleMenu}>
                      {t("adminDashboard")}
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
                      {t("volunteerDashboard")}
                    </Link>
                  </Button>
                )}
                <Button
                  variant="outline"
                  className="border-green-100 bg-sgreen hover:bg-sgreen/90 text-gray-800 w-full"
                  disabled={loggingOut}
                  onClick={handleLogout}
                >
                  {loggingOut ? t("loggingOut") : t("logOut")}
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
