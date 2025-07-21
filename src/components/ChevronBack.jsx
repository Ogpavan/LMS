import React from "react";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const ChevronBack = ({ className = "", onClick, ...props }) => {
  const router = useRouter();
  return (
    <ChevronLeft
      className={`w-7 h-7 hover:text-blue-700 transition hover:scale-[1.2] cursor-pointer ${className}`}
      onClick={onClick || (() => router.back())}
      {...props}
    />
  );
};

export default ChevronBack;
