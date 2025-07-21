"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash, Plus, Timer, Play, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

// Lazy image loader with fade-in (copied from Courses page)
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

// Skeleton card (copied from Courses page)
const SkeletonCard = () => (
  <div className="min-h-[340px] h-full w-full bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-sm flex flex-col">
    {/* Image skeleton with badge and timer */}
    <div className="relative w-full aspect-video bg-gray-200 dark:bg-gray-800 animate-pulse">
      {/* Level badge */}

      {/* Play button overlay */}
    </div>
    {/* Card content */}
    <div className="p-5 flex-1 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-1">
          <div className="bg-gray-300 h-5 w-3/4 rounded" />
          <div className="flex items-center gap-1">
            <div className="bg-yellow-200 h-4 w-4 rounded-full" />
            <div className="bg-gray-300 h-4 w-6 rounded" />
          </div>
        </div>
        <div className="flex items-center gap-2 mb-2">
          <div className="bg-gray-300 h-4 w-1/3 rounded" />
        </div>
      </div>
      <div className="mt-2">
        <div className="bg-gray-300 h-3 w-full rounded mb-1" />
        <div className="bg-gray-300 h-3 w-5/6 rounded" />
      </div>
    </div>
  </div>
);

function ManageCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/course", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fetchAll: true }),
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

  const handleEdit = (id) => {
    router.push(`/managecourses/upload?id=${id}`);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    try {
      const res = await fetch(`/api/course/${id}`, { method: "DELETE" });
      if (res.ok) {
        setCourses((prev) => prev.filter((c) => c.id !== id));
      }
    } catch {}
  };

  const handleUpload = () => {
    router.push("/managecourses/upload");
  };

  return (
    <div
      className="min-h-screen dark:bg-gray-900 bg-gray-50 page-transition"
      style={{ width: "90vw" }}
    >
      <div className="flex items-center justify-between px-6 py-6 border-b border-gray-200/50 mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 tracking-tight dark:text-white">
            Manage Courses
          </h1>
          <span className="text-sm tracking-tight font-light text-gray-600 dark:text-gray-400">
            Manage your courses effectively
          </span>
        </div>
        <Button
          onClick={handleUpload}
          className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-full  shadow hover:bg-blue-700 transition"
        >
          <Plus size={18} /> Upload Course
        </Button>
      </div>
      <main className="px-6  flex-1 w-full">
        <div className="max-w-screen-xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))
              : courses.map((course, idx) => (
                  <div
                    key={course.id || idx}
                    className="group bg-white rounded-2xl overflow-hidden shadow-sm transition-all duration-300 hover:scale-[1.02] dark:bg-gray-900 border dark:border-gray-800 flex flex-col h-full min-h-[340px] relative cursor-pointer"
                  >
                    <div className="relative w-full aspect-video overflow-hidden">
                      <LazyImage
                        src={course.image_url || course.image}
                        alt={course.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="bg-white/90 backdrop-blur-sm text-gray-700 px-3 py-1 rounded-full text-xs font-semibold shadow">
                          {course.level}
                        </span>
                      </div>
                      <div className="absolute bottom-4 right-4 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium shadow">
                        <Timer size={14} className="text-gray-700" />
                        <span className="text-gray-700">{course.duration}</span>
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="bg-white/90 backdrop-blur-sm rounded-full p-4 shadow-lg">
                          <Play
                            size={24}
                            className="text-gray-900 ml-1"
                            fill="currentColor"
                          />
                        </div>
                      </div>
                      {/* Edit/Delete buttons */}
                      <div className="absolute top-4 right-4 flex gap-2 z-10">
                        <button
                          onClick={() => handleEdit(course.id)}
                          className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800"
                          title="Edit"
                        >
                          <Pencil size={16} className="text-blue-600" />
                        </button>
                        <button
                          onClick={() => handleDelete(course.id)}
                          className="p-2 rounded-full bg-red-100 hover:bg-red-200 dark:bg-red-900 dark:hover:bg-red-800"
                          title="Delete"
                        >
                          <Trash size={16} className="text-red-600" />
                        </button>
                      </div>
                    </div>
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <h2 className="text-lg font-semibold tracking-tight text-gray-900 line-clamp-2 dark:text-white">
                            {course.title}
                          </h2>
                          <div className="flex items-center gap-1">
                            <Star
                              size={16}
                              className="text-yellow-500 fill-yellow-500"
                            />
                            <span className="text-gray-900 dark:text-white font-semibold text-sm">
                              {course.rating || "--"}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-gray-600 font-light text-sm tracking-tight dark:text-white">
                            {course.instructor}
                          </span>
                        </div>
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
          {!loading && courses.length === 0 && (
            <div className="text-center text-gray-500 mt-16 dark:text-gray-400">
              No courses found.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default ManageCourses;
