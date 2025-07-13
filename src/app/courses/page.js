"use client";
import React, { useState, useRef } from "react";
import { Star, Timer, Play, Search } from "lucide-react";

const courses = [
  {
    title: "Strength & Tone",
    instructor: "Mike Anderson",
    duration: "35 mins",
    rating: 4.8,
    description:
      "Build muscle and tone your body with no equipment needed. Get the course now!",
    level: "Intermediate",
    image: "/course1.webp",
  },
  {
    title: "Power Yoga Stretch",
    instructor: "Emma Lee",
    duration: "32 mins",
    rating: 4.7,
    description: "A dynamic yoga session using mat and dumbbells.",
    level: "Intermediate",
    image: "/course2.webp",
  },
  {
    title: "Cycling Endurance",
    instructor: "Jason White",
    duration: "40 mins",
    rating: 4.5,
    description: "Boost your stamina with this cycling endurance workout.",
    level: "Intermediate",
    image: "/course3.webp",
  },
  {
    title: "Strength Circuit",
    instructor: "Sarah Johnson",
    duration: "30 mins",
    rating: 5.0,
    description: "A circuit routine focused on strength using a yoga mat.",
    level: "Intermediate",
    image: "/course4.webp",
  },
  {
    title: "Kickboxing",
    instructor: "David Clark",
    duration: "45 mins",
    rating: 4.9,
    description: "High-energy kickboxing with dumbbells for extra burn.",
    level: "Intermediate",
    image: "/course5.webp",
  },
  {
    title: "Flow Yoga Power",
    instructor: "Lisa Brown",
    duration: "35 mins",
    rating: 4.8,
    description: "Powerful yoga flow for flexibility and strength.",
    level: "Intermediate",
    image: "/course6.webp",
  },
];

export default function Courses() {
  const [search, setSearch] = useState("");
  const scrollRef = useRef(null);

  // Filter courses by title, instructor, or description
  const filteredCourses = courses.filter(
    (course) =>
      course.title.toLowerCase().includes(search.toLowerCase()) ||
      course.instructor.toLowerCase().includes(search.toLowerCase()) ||
      course.description.toLowerCase().includes(search.toLowerCase())
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
    <div className="min-h-screen dark:bg-gray-900 bg-gray-50">
      {/* Header */}
      <div className="  border-b border-gray-200/50   z-10 w-full">
        <div className="py-6 flex items-center justify-between px-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 tracking-tight mb-1 dark:text-white">
              Browse Courses
            </h1>
            <p className="text-gray-600 text-base font-light dark:text-white">
              Discover workouts designed for every fitness level
            </p>
          </div>
          {/* Search Filter */}
          <div className="relative w-80">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search courses..."
              className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 text-gray-900 placeholder-gray-400 shadow focus:outline-none focus:ring-2 focus:ring-[#007aff] transition"
            />
            <Search
              className="absolute left-4 top-3.5 text-gray-400"
              size={18}
            />
          </div>
        </div>

        {/* Horizontal Scrollable Filter */}
        <div className="flex items-center justify-between px-6 pb-3   backdrop-blur-xl border-b border-gray-200/50 text-xs relative max-w-full">
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
            className="flex items-center gap-3 overflow-auto overflow-x-hidden px-8 pt-2 "
            style={{ scrollBehavior: "smooth" }}
          >
            <button className="px-4 py-2 rounded-full border border-gray-200 text-gray-700 font-medium hover:border-blue-500 transition dark:text-white">
              All
            </button>
            <button className="px-4 py-2 rounded-full border border-gray-200 text-gray-700 font-medium hover:border-blue-500 transition dark:text-white">
              Yoga
            </button>
            <button className="px-4 py-2 rounded-full border border-gray-200 text-gray-700 font-medium hover:border-blue-500 transition dark:text-white">
              Strength
            </button>
            <button className="px-4 py-2 rounded-full border border-gray-200 text-gray-700 font-medium hover:border-blue-500 transition dark:text-white">
              Cardio
            </button>
            <button className="px-4 py-2 rounded-full border border-gray-200 text-gray-700 font-medium hover:border-blue-500 transition dark:text-white">
              Pilates
            </button>
            <button className="px-4 py-2 rounded-full border border-gray-200 text-gray-700 font-medium hover:border-blue-500 transition dark:text-white">
              HIIT
            </button>
            <button className="px-4 py-2 rounded-full border border-gray-200 text-gray-700 font-medium hover:border-blue-500 transition dark:text-white">
              Mobility
            </button>
            {/* Add more filter buttons as needed */}
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredCourses.map((course, idx) => (
            <div
              key={idx}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm   transition-all duration-300 hover:scale-[1.02] cursor-pointer dark:bg-gray-900 border dark:border-gray-800 "
            >
              {/* Image Container */}
              <div className="relative h-44 overflow-hidden">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Level Badge */}
                <div className="absolute top-4 left-4">
                  <span className="bg-white/90 backdrop-blur-sm text-gray-700 px-3 py-1 rounded-full text-xs font-semibold shadow">
                    {course.level}
                  </span>
                </div>

                {/* Duration Bottom Left */}
                <div className="absolute bottom-4 right-4 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium shadow">
                  <Timer size={14} className="text-gray-700" />
                  <span className="text-gray-700">{course.duration}</span>
                </div>

                {/* Play Button */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-white/90 backdrop-blur-sm rounded-full p-4 shadow-lg">
                    <Play
                      size={24}
                      className="text-gray-900 ml-1"
                      fill="currentColor"
                    />
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-5 ">
                <div className="flex items-center justify-between mb-1 ">
                  <h2 className="text-lg font-semibold tracking-tight text-gray-900 line-clamp-2 dark:text-white ">
                    {course.title}
                  </h2>
                  <div className="flex items-center gap-1">
                    <Star
                      size={16}
                      className="text-yellow-500 fill-yellow-500"
                    />
                    <span className="text-gray-900 dark:text-white font-semibold text-sm">
                      {course.rating}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-gray-600 font-light text-sm tracking-tight dark:text-white">
                    {course.instructor}
                  </span>
                </div>
                <div className="mt-2">
                  <span className="text-gray-700 text-xs font-light tracking-tight line-clamp-2 dark:text-white">
                    {course.description}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        <div className="flex justify-center mt-16">
          <button className="bg-gray-900 text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors duration-200 shadow-lg hover:shadow-xl">
            Load More Courses
          </button>
        </div>
      </main>
    </div>
  );
}
