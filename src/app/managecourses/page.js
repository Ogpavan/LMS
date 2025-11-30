"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash, Plus, Timer, Play, Star, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
// import { useUser } from "@clerk/nextjs";

// Lazy image loader with fade-in (copied from Courses page)
function LazyImage({ src, alt, className }) {
  const [loaded, setLoaded] = useState(false);
  const fallback =
    "https://dummyimage.com/400x200/cccccc/ffffff.png&text=No+Image"; // Dummy image

  if (!src) {
    return (
      <div className="absolute inset-0 bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
        <img
          src={fallback}
          alt="No Image"
          className={`w-full h-full object-cover rounded`}
        />
      </div>
    );
  }
  return (
    <div className="relative w-full h-full">
      {!loaded && (
        <div className="absolute inset-0 bg-gray-200 dark:bg-gray-800 animate-pulse" />
      )}
      <img
        src={src || fallback}
        alt={alt}
        className={`${className} transition-opacity duration-700 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
        onLoad={() => setLoaded(true)}
        loading="lazy"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = fallback;
        }}
      />
    </div>
  );
}

// Skeleton card (copied from Courses page)
const SkeletonCard = () => (
  <div className="min-h-[180px] h-full w-full bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-sm flex flex-col">
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

function ManageCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Example: get user from cookie
    const userCookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("user="));

    if (userCookie) {
      try {
        setUser(JSON.parse(decodeURIComponent(userCookie.split("=")[1])));
      } catch (e) {
        setUser(null);
      }
    }
  }, []);

  // Replace with your own user logic
  useEffect(() => {
    // if (!user?.id) return;
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/course/usercourses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.id }),
        });
        const data = await res.json();
        console.log(data);
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
  }, [user]);

  const handleEdit = (id) => {
    router.push(`/managecourses/upload?id=${id}`);
  };

  // Soft delete: set isActive to false
  const confirmDelete = async () => {
    if (!deleteId) return;
    setDeleting(true); // <-- start loading
    try {
      const res = await fetch(`/api/course/${deleteId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: false }),
      });
      if (res.ok) {
        setCourses((prev) => prev.filter((c) => c.id !== deleteId));
      }
    } catch {}
    setDeleting(false); // <-- stop loading
    setDeleteId(null);
  };

  const handleUpload = () => {
    router.push("/managecourses/upload");
  };

  // Split courses into published and drafts for this user
  const publishedCourses = courses.filter((c) => c.status === "published");
  const draftCourses = courses.filter((c) => c.status === "draft");
  const userDraftCourses = draftCourses.filter(
    (course) => course.userId === user?.id
  );
  console.log(userDraftCourses);

  return (
    <div
      className="min-h-screen dark:bg-gray-900 bg-gray-50 page-transition"
      style={{ width: "90vw" }}
    >
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200/50 mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900 tracking-tight dark:text-white">
            Manage Courses
          </h1>
          <span className="text-xs tracking-tight font-light text-gray-600 dark:text-gray-400">
            Manage your courses effectively
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={() => router.push("/excelupload")}
            className="flex items-center gap-2 bg-green-600 text-white px-3 py-1.5 rounded-full shadow hover:bg-green-700 transition text-sm"
          >
            <span className="bg-white rounded-full p-1 ">
              <Upload size={15} color="green" />
            </span>{" "}
            Upload Excel
          </Button>
          {/* Upload button */}
          <Button
            onClick={handleUpload}
            className="flex items-center gap-2 bg-blue-600 text-white px-3 py-1.5 rounded-full shadow hover:bg-blue-700 transition text-sm"
          >
            <span className="bg-white rounded-full p-1 ">
              <Plus size={15} color="blue" />
            </span>{" "}
            Upload Course
          </Button>
        </div>
      </div>
      <main className="px-6 flex-1 w-full">
        <div className="max-w-screen-xl mx-auto">
          {/* Draft Courses FIRST */}
          <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-2 mt-4">
            Drafts
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))
              : draftCourses.map((course, idx) => (
                  <div
                    key={course.id || idx}
                    className="group bg-white rounded-xl overflow-hidden shadow-sm transition-all duration-300 dark:bg-gray-900 border dark:border-gray-800 flex flex-col h-full min-h-[180px] relative cursor-pointer"
                  >
                    <div className="relative w-full overflow-hidden">
                      <div className="relative w-full overflow-hidden">
                        {/* Show thumbnail if available, otherwise fallback */}
                        <LazyImage
                          src={course.thumbnail}
                          alt={course.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale"
                        />
                        {/* Gray image for drafts */}
                        {/* <div className="w-full h-full aspect-[16/7] bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                          <span className="text-gray-400 text-xs">Draft</span>
                        </div> */}
                        <div className="absolute top-2 left-2">
                          <span className="bg-gray-200 text-gray-500 px-2 py-0.5 rounded-full text-[10px] font-semibold shadow">
                            {course.level}
                          </span>
                        </div>
                        <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-gray-200 px-2 py-0.5 rounded-full text-[10px] font-medium shadow">
                          <Timer size={11} className="text-gray-500" />
                          <span className="text-gray-500">
                            {course.duration}
                          </span>
                        </div>
                        {/* Edit/Delete buttons */}
                        <div className="absolute top-2 right-2 flex gap-2 z-10">
                          <button
                            onClick={() => handleEdit(course.id)}
                            className="p-1.5 rounded-full bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800"
                            title="Edit"
                          >
                            <Pencil size={13} className="text-blue-600" />
                          </button>
                          <Dialog
                            open={deleteId === course.id}
                            onOpenChange={(open) => {
                              if (!open) setDeleteId(null);
                            }}
                          >
                            <DialogTrigger asChild>
                              <button
                                onClick={() => setDeleteId(course.id)}
                                className="p-1.5 rounded-full bg-red-100 hover:bg-red-200 dark:bg-red-900 dark:hover:bg-red-800"
                                title="Delete"
                              >
                                <Trash size={13} className="text-red-600" />
                              </button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Delete Course</DialogTitle>
                                <DialogDescription>
                                  Are you sure you want to delete this course?
                                  This will hide the course for all users.
                                </DialogDescription>
                              </DialogHeader>
                              <DialogFooter>
                                <Button
                                  variant="outline"
                                  type="button"
                                  onClick={() => setDeleteId(null)}
                                  disabled={deleting}
                                >
                                  Cancel
                                </Button>
                                <Button
                                  type="button"
                                  onClick={confirmDelete}
                                  className="bg-red-600 hover:bg-red-700 text-white"
                                  disabled={deleting}
                                >
                                  {deleting ? "Deleting..." : "Delete"}
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                      <div className="p-3 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <h2 className="text-base font-semibold tracking-tight text-gray-900 line-clamp-2 dark:text-white">
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
                  </div>
                ))}
          </div>

          {/* Published Courses BELOW */}
          <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-2 mt-8">
            Published
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))
              : publishedCourses.map((course, idx) => (
                  <div
                    key={course.id || idx}
                    className="group bg-white rounded-xl overflow-hidden shadow-sm transition-all duration-300 dark:bg-gray-900 border dark:border-gray-800 flex flex-col h-full min-h-[180px] relative cursor-pointer"
                  >
                    <div className="relative w-full overflow-hidden">
                      {/* Show thumbnail if available, otherwise fallback */}
                      <LazyImage
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
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
                      {/* Edit/Delete buttons */}
                      <div className="absolute top-2 right-2 flex gap-2 z-10">
                        <button
                          onClick={() => handleEdit(course.id)}
                          className="p-1.5 rounded-full bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800"
                          title="Edit"
                        >
                          <Pencil size={13} className="text-blue-600" />
                        </button>
                        <Dialog
                          open={deleteId === course.id}
                          onOpenChange={(open) => {
                            if (!open) setDeleteId(null);
                          }}
                        >
                          <DialogTrigger asChild>
                            <button
                              onClick={() => setDeleteId(course.id)}
                              className="p-1.5 rounded-full bg-red-100 hover:bg-red-200 dark:bg-red-900 dark:hover:bg-red-800"
                              title="Delete"
                            >
                              <Trash size={13} className="text-red-600" />
                            </button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Delete Course</DialogTitle>
                              <DialogDescription>
                                Are you sure you want to delete this course?
                                This will hide the course for all users.
                              </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                              <Button
                                variant="outline"
                                type="button"
                                onClick={() => setDeleteId(null)}
                                disabled={deleting}
                              >
                                Cancel
                              </Button>
                              <Button
                                type="button"
                                onClick={confirmDelete}
                                className="bg-red-600 hover:bg-red-700 text-white"
                                disabled={deleting}
                              >
                                {deleting ? "Deleting..." : "Delete"}
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                    <div className="p-3 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <h2 className="text-base font-semibold tracking-tight text-gray-900 line-clamp-2 dark:text-white">
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
          {!loading && courses.length === 0 && (
            <div className="text-center text-gray-500 mt-16 dark:text-gray-400 text-sm">
              No courses found.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default ManageCourses;
