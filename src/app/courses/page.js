"use client";
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Star, Timer, Play, Search } from "lucide-react";

// Lazy image loader with fade-in
function LazyImage({ src, alt, className }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className="relative w-full h-full">
      {!loaded && (
        <div className="absolute inset-0 bg-gray-200 dark:bg-gray-800 animate-pulse" />
      )}
      <img
        src={src}
        alt={alt}
        className={`${className} transition-opacity duration-700 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
        onLoad={() => setLoaded(true)}
        loading="lazy"
      />
    </div>
  );
}

// Skeleton card component
// ...existing code...

// Skeleton card component
const SkeletonCard = () => (
  <div className="min-h-[220px] h-full w-full bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-sm flex flex-col">
    {/* Image skeleton with badge and timer */}
    <div className="relative w-full aspect-[16/7] bg-gray-200 dark:bg-gray-800 animate-pulse" />
    {/* Card content */}
    <div className="p-3 flex-1 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-1">
          <div className="bg-gray-300 h-4 w-2/3 rounded" />
          <div className="flex items-center gap-1">
            <div className="bg-yellow-200 h-3 w-3 rounded-full" />
            <div className="bg-gray-300 h-3 w-5 rounded" />
          </div>
        </div>
        <div className="flex items-center gap-2 mb-2">
          <div className="bg-gray-300 h-3 w-1/4 rounded" />
        </div>
      </div>
      <div className="mt-2">
        <div className="bg-gray-300 h-2 w-full rounded mb-1" />
        <div className="bg-gray-300 h-2 w-4/5 rounded" />
      </div>
    </div>
  </div>
);

export default function Courses() {
  const [search, setSearch] = useState("");
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/course", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const data = await res.json();
        if (data.success && Array.isArray(data.courses)) {
          setCourses(data.courses);
        } else {
          setCourses([]);
        }
      } catch (err) {
        setCourses([]);
      }
      setLoading(false);
    };
    fetchCourses();
  }, []);

  const filteredCourses = courses.filter(
    (course) =>
      course.title?.toLowerCase().includes(search.toLowerCase()) ||
      course.instructor?.toLowerCase().includes(search.toLowerCase()) ||
      course.description?.toLowerCase().includes(search.toLowerCase())
  );

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

  const handleCourseClick = (id) => {
    router.push(`/courses/${id}`);
  };

  return (
    <div
      className="min-h-screen dark:bg-gray-900 bg-gray-50 page-transition"
      style={{ width: "90vw" }}
    >
      {/* Header */}
      <div className="border-b border-gray-200/50 z-10 w-full">
        <div className="py-6 flex items-center justify-between px-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 tracking-tight mb-1 dark:text-white">
              Browse Courses
            </h1>
            <p className="text-gray-600 text-base font-light dark:text-white">
              Discover workouts designed for every fitness level
            </p>
          </div>
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

        {/* Category scroll */}
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
            {[
              "All",
              "Yoga",
              "Strength",
              "Cardio",
              "Pilates",
              "HIIT",
              "Mobility",
            ].map((cat) => (
              <button
                key={cat}
                className="px-4 py-2 rounded-full border border-gray-200 text-gray-700 font-medium hover:border-blue-500 transition dark:text-white"
              >
                {cat}
              </button>
            ))}
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
      <main className="px-6 py-8 w-full">
        <div className="max-w-screen-xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))
              : filteredCourses.map((course, idx) => (
                  <div
                    key={course.id || idx}
                    className="group bg-white rounded-xl overflow-hidden shadow-sm transition-all duration-300 cursor-pointer dark:bg-gray-900 border dark:border-gray-800 flex flex-col h-full min-h-[220px]"
                    onClick={() => handleCourseClick(course.id)}
                  >
                    <div className="relative w-full  overflow-hidden">
                      <LazyImage
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute top-2 left-2">
                        <span className="bg-white/90 backdrop-blur-sm text-gray-700 px-2 py-0.5 rounded-full text-[10px] font-semibold shadow">
                          {course.level}
                        </span>
                      </div>
                      <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-full text-[10px] font-medium shadow">
                        <Timer size={11} className="text-gray-700" />
                        <span className="text-gray-700">{course.duration}</span>
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg">
                          <Play
                            size={16}
                            className="text-gray-900 ml-1"
                            fill="currentColor"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="p-3 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <h2 className="text-sm font-semibold tracking-tight text-gray-900 leading-snug dark:text-white line-clamp-2">
                            {course.title}
                          </h2>
                          <div className="flex items-center gap-1">
                            <Star
                              size={13}
                              className="text-yellow-500 fill-yellow-500"
                            />
                            <span className="text-gray-900 dark:text-white font-semibold text-xs">
                              {course.rating || "--"}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-gray-600 font-light text-xs tracking-tight dark:text-white">
                            {course.instructor}
                          </span>
                        </div>
                      </div>
                      <div className="mt-1">
                        <span className="text-gray-700 text-[11px] font-light tracking-tight line-clamp-2 dark:text-white">
                          {course.description}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
          </div>

          {!loading && (
            <div className="flex justify-center mt-10">
              <button className="bg-gray-900 text-white px-6 py-2 rounded-full font-medium text-sm hover:bg-gray-800 transition-colors duration-200 shadow-lg hover:shadow-xl">
                Load More Courses
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
