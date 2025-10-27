"use client";
import { useParams } from "next/navigation";

export const useGetParams = () => {
  const { locale } = useParams() as { locale?: string }; // safer typing
  return locale;
};
  