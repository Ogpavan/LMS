// app/assignments/page.tsx
"use client";
import React, { useState, useRef } from "react";
import { FileText, CalendarDays, Search, Timer } from "lucide-react";

const assignments = [
  {
    id: 1,
    title: "Physics Assignment - Laws of Motion",
    subject: "Physics",
    dueDate: "2025-07-20",
    status: "Not Submitted",
    description:
      "Explain Newton's laws with examples and submit your worksheet.",
    duration: "2 days left",
    file: "physics_laws.pdf",
  },
  {
    id: 2,
    title: "Math Worksheet - Integration Techniques",
    subject: "Mathematics",
    dueDate: "2025-07-22",
    status: "Submitted",
    description: "Solve all integration problems and upload your solutions.",
    duration: "4 days left",
    file: "integration.pdf",
  },
  {
    id: 3,
    title: "Chemistry Assignment - Organic Compounds",
    subject: "Chemistry",
    dueDate: "2025-07-18",
    status: "Graded",
    description: "Draw structures for the given organic compounds.",
    duration: "Due Today",
    file: "organic.pdf",
  },
];

const getStatusColor = (status) => {
  switch (status) {
    case "Not Submitted":
      return "bg-red-100 text-red-700";
    case "Submitted":
      return "bg-yellow-100 text-yellow-700";
    case "Graded":
      return "bg-green-100 text-green-700";
    default:
      return "";
  }
};

export default function AssignmentsPage() {
  const [search, setSearch] = useState("");
  const scrollRef = useRef(null);

  const filteredAssignments = assignments.filter(
    (a) =>
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.subject.toLowerCase().includes(search.toLowerCase()) ||
      a.description.toLowerCase().includes(search.toLowerCase())
  );

  // Scroll functions for horizontal scroll
  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -200, behavior: "smooth" });
    }
  };
  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 200, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen dark:bg-gray-900 bg-gray-50 ">
      {/* Header */}
      <div className="border-b border-gray-200/50 z-10 w-full">
        <div className="py-6 flex items-center justify-between px-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 tracking-tight mb-1 dark:text-white">
              Assignments
            </h1>
            <p className="text-gray-600 text-base font-light dark:text-white">
              Track, submit, and review your assignments.
            </p>
          </div>
          {/* Search Filter */}
          <div className="relative w-80">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search assignments..."
              className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 text-gray-900 placeholder-gray-400 shadow focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
            />
            <Search
              className="absolute left-4 top-3.5 text-gray-400"
              size={18}
            />
          </div>
        </div>

        {/* Horizontal Scrollable Filter */}
        <div className="flex items-center justify-between px-6 pb-3 backdrop-blur-xl border-b border-gray-200/50 text-xs relative max-w-full">
          <button
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-200 rounded-full p-1 shadow hover:bg-gray-100 transition"
            aria-label="Scroll left"
            style={{ left: "8px" }}
          >
            <svg
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div
            ref={scrollRef}
            className="flex items-center gap-3 overflow-auto overflow-x-hidden px-8 pt-2"
            style={{ scrollBehavior: "smooth" }}
          >
            <button className="px-4 py-2 rounded-full border border-gray-200 text-gray-700 font-medium hover:border-pink-500 transition dark:text-white">
              All
            </button>
            <button className="px-4 py-2 rounded-full border border-gray-200 text-gray-700 font-medium hover:border-pink-500 transition dark:text-white">
              Not Submitted
            </button>
            <button className="px-4 py-2 rounded-full border border-gray-200 text-gray-700 font-medium hover:border-pink-500 transition dark:text-white">
              Submitted
            </button>
            <button className="px-4 py-2 rounded-full border border-gray-200 text-gray-700 font-medium hover:border-pink-500 transition dark:text-white">
              Graded
            </button>
          </div>
          <button
            onClick={scrollRight}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-200 rounded-full p-1 shadow hover:bg-gray-100 transition"
            aria-label="Scroll right"
            style={{ right: "8px" }}
          >
            <svg
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="px-6 py-12">
        <div className="flex  flex-wrap gap-6 ">
          {/* Left: Assignment List */}
          <div className="w-full  space-y-6 grid grid-cols-2 gap-x-6 ">
            {filteredAssignments.map((a) => (
              <div
                key={a.id}
                className="bg-white rounded-xl shadow-[0_10px_50px_rgba(236,72,153,0.08)] p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4  dark:bg-gray-900 border dark:border-gray-800"
              >
                <div className="flex items-center gap-4 w-full">
                  <FileText className="w-10 h-10 text-pink-400 flex-shrink-0" />
                  <div className="flex flex-col">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {a.title}
                    </h2>
                    <span className="text-sm text-gray-500 dark:text-gray-300">
                      {a.subject}
                    </span>
                    <span className="text-xs text-gray-400 dark:text-gray-400 mt-1">
                      {a.description}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col md:items-end gap-2 min-w-[160px]">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                      a.status
                    )}`}
                  >
                    {a.status}
                  </span>
                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-300 text-nowrap">
                    <CalendarDays size={14} />
                    <span>{a.dueDate}</span>
                    <Timer size={14} className="ml-2" />
                    <span>{a.duration}</span>
                  </div>
                  <span className="text-xs text-gray-400 dark:text-gray-400">
                    {a.file}
                  </span>
                </div>
              </div>
            ))}

            {/* Load More Button */}
            {/* <div className="flex justify-center mt-8">
              <button className="bg-pink-500 text-white px-8 py-3 rounded-full font-medium hover:bg-pink-600 transition-colors duration-200 shadow-lg hover:shadow-xl">
                Load More Assignments
              </button>
            </div> */}
          </div>

          {/* Right: Quote Section */}
          {/* <div className="hidden md:block md:w-1/3">
            <div className="bg-gradient-to-br from-pink-100 to-pink-200 dark:from-gray-800 dark:to-gray-700 p-6 rounded-xl shadow-lg border border-pink-300 dark:border-pink-700">
              <p className="text-sm italic text-pink-800 dark:text-pink-200 leading-relaxed">
                “Success is the sum of small efforts, repeated day in and day
                out.”
              </p>
              <p className="mt-2 text-right text-xs text-pink-600 dark:text-pink-300">
                — Robert Collier
              </p>
            </div>
          </div> */}
        </div>
      </main>
    </div>
  );
}
