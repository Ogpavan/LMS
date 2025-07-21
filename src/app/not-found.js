"use client";
import React from "react";
import Lottie from "lottie-react";
import { Button } from "@/components/ui/button";

function NotFound() {
  return (
    <div className="inset-0 flex flex-col items-center justify-center text-2xl fixed bg-white dark:bg-gray-900">
      <div className="w-72 h-72">
        <Lottie animationData={require("../../public/404.json")} loop={true} />
      </div>
      <div className=" tracking-tight font-normal "> Page Not Found</div>
      <div className="text-sm tracking-tight font-light text-gray-600 dark:text-gray-400">
        The page you are looking for does not exist.
      </div>
      <div className="mt-4">
        <Button
          onClick={() => (window.location.href = "/")}
          className="bg-blue-600 text-white px-4 py-2 rounded-full font-medium shadow hover:bg-blue-700 transition"
        >
          Go to Home
        </Button>
      </div>
    </div>
  );
}

export default NotFound;
