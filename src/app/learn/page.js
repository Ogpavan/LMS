"use client";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  BookOpen,
  CheckCircle,
  Play,
  ChevronLeft,
  ChevronRight,
  Lock,
  Clock,
  Award,
  AlertCircle,
} from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Loader from "@/components/Loader";

export default function LearnPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const courseId = searchParams.get("courseId");
  const [chapters, setChapters] = useState([]);
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);
  const [courseTitle, setCourseTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const videoRef = useRef(null);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowRight" && current < chapters.length - 1) {
        setCurrent(current + 1);
      } else if (e.key === "ArrowLeft" && current > 0) {
        setCurrent(current - 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [current, chapters.length]);

  // Fetch chapters for the course
  useEffect(() => {
    if (!courseId) return;

    setLoading(true);
    setError(null);

    fetch("/api/course", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ getById: courseId }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch course data");
        return res.json();
      })
      .then((data) => {
        if (
          data.success &&
          data.course &&
          Array.isArray(data.course.chapters)
        ) {
          setCourseTitle(data.course.title || "Course");
          const chaptersWithCompleted = data.course.chapters.map((ch) => ({
            ...ch,
            completed: ch.completed || false,
          }));
          setChapters(chaptersWithCompleted);
          setProgress(
            Math.round(
              (chaptersWithCompleted.filter((c) => c.completed).length /
                chaptersWithCompleted.length) *
                100
            )
          );
        } else {
          setChapters([]);
          setCourseTitle("");
          setError("No chapters found for this course");
        }
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [courseId]);

  // Mark chapter as completed and update progress
  const handleComplete = useCallback(
    (idx) => {
      setChapters((prev) => {
        const updated = prev.map((ch, i) =>
          i === idx ? { ...ch, completed: true } : ch
        );
        setProgress(
          Math.round(
            (updated.filter((c) => c.completed).length / updated.length) * 100
          )
        );
        return updated;
      });

      // Save progress to API/localStorage here
    },
    [setChapters, setProgress]
  );

  // Navigation between chapters
  const goToNextChapter = useCallback(() => {
    if (current < chapters.length - 1) {
      setCurrent(current + 1);
    }
  }, [current, chapters.length]);

  const goToPrevChapter = useCallback(() => {
    if (current > 0) {
      setCurrent(current - 1);
    }
  }, [current]);

  if (!courseId) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-gray-500 bg-gray-50">
        <AlertCircle size={48} className="mb-4 text-gray-400" />
        <h2 className="text-xl font-medium mb-2">No Course Selected</h2>
        <p className="mb-6 text-gray-400">
          Please select a course to start learning
        </p>
        <button
          onClick={() => router.push("/courses")}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Browse Courses
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div
        className="min-h-screen bg-white flex items-center justify-center "
        style={{ width: "90vw" }}
      >
        <Loader />
        <div className="text-center ">
          <h1 className="  font-normal text-gray-900 tracking-tight">
            Loading course...
          </h1>
        </div>
      </div>
    );
  }

  if (error || !chapters.length) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-gray-500 bg-gray-50">
        <AlertCircle size={48} className="mb-4 text-red-500" />
        <h2 className="text-xl font-medium mb-2">Course Content Unavailable</h2>
        <p className="mb-6 text-gray-500">
          {error || "No chapters found for this course"}
        </p>
        <button
          onClick={() => router.push("/courses")}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Back to Courses
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Breadcrumb */}
      <div className="px-4 sm:px-8 pt-6 sm:pt-8 max-w-7xl mx-auto">
        <Breadcrumb className="text-sm">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink
                href="/"
                className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              >
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="text-gray-400" />
            <BreadcrumbItem>
              <BreadcrumbLink
                href="/courses"
                className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              >
                Courses
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="text-gray-400" />
            <BreadcrumbItem>
              <BreadcrumbLink
                href={`/courses/${courseId}`}
                className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              >
                {courseTitle || "Course"}
              </BreadcrumbLink>
            </BreadcrumbItem>
            {chapters.length > 0 && (
              <>
                <BreadcrumbSeparator className="text-gray-400" />
                <BreadcrumbItem>
                  <BreadcrumbLink
                    aria-current="page"
                    className="text-blue-600 dark:text-blue-400 font-medium"
                  >
                    {chapters[current]?.title}
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </>
            )}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Header */}
      <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white tracking-tight line-clamp-1">
                {courseTitle}
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
                Chapter {current + 1} of {chapters.length} -{" "}
                {chapters[current]?.title}
              </p>
            </div>
            <div className="flex items-center gap-4 sm:gap-6">
              <div className="text-right flex items-center gap-x-3">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Progress
                </div>
                <div className="text-lg font-semibold text-gray-900 dark:text-white tracking-tight">
                  {progress}%
                </div>
              </div>
              <div className="w-24 sm:w-44 h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-700 ease-out ${
                    progress >= 100 ? "bg-green-500" : "bg-blue-500"
                  }`}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8    ">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Video Section */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-black rounded-2xl overflow-hidden shadow-2xl relative group">
              {/* Video player */}
              <div className="aspect-video">
                <iframe
                  ref={videoRef}
                  src={chapters[current].video_url || chapters[current].video}
                  title={chapters[current].title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>

              {/* Navigation buttons */}
              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity">
                {current > 0 && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={goToPrevChapter}
                          className="p-3 bg-black/30 backdrop-blur-sm hover:bg-black/50 text-white rounded-full transition-colors"
                          aria-label="Previous chapter"
                        >
                          <ChevronLeft size={24} />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="bottom">
                        <p>Previous: {chapters[current - 1]?.title}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
                {current < chapters.length - 1 && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={goToNextChapter}
                          className="p-3 bg-black/30 backdrop-blur-sm hover:bg-black/50 text-white rounded-full transition-colors"
                          aria-label="Next chapter"
                        >
                          <ChevronRight size={24} />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="bottom">
                        <p>Next: {chapters[current + 1]?.title}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
            </div>

            {/* Video Info */}
            <div className="bg-gray-50 dark:bg-gray-800/40 rounded-2xl p-6 sm:p-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white tracking-tight mb-4">
                {chapters[current].title}
              </h2>

              <div className="flex flex-wrap items-center gap-4 mb-6">
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                  <Clock size={18} />
                  <span>{chapters[current].duration} min</span>
                </div>
                <div className="text-gray-300 dark:text-gray-600">•</div>
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                  <BookOpen size={18} />
                  <span>
                    Chapter {current + 1} of {chapters.length}
                  </span>
                </div>
                {chapters[current].completed && (
                  <>
                    <div className="text-gray-300 dark:text-gray-600">•</div>
                    <div className="flex items-center gap-2 text-green-600 dark:text-green-500">
                      <CheckCircle size={18} />
                      <span>Completed</span>
                    </div>
                  </>
                )}
              </div>

              <div className="prose dark:prose-invert max-w-none prose-p:text-gray-700 dark:prose-p:text-gray-300">
                {chapters[current].summary}
              </div>

              {!chapters[current].completed && (
                <div className="mt-8 flex justify-end">
                  <button
                    onClick={() => handleComplete(current)}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md hover:shadow-lg transition-all font-medium flex items-center gap-2"
                  >
                    <CheckCircle size={18} />
                    Mark as Completed
                  </button>
                </div>
              )}
            </div>

            {/* Navigation buttons */}
            <div className="flex justify-between pt-4">
              {current > 0 ? (
                <button
                  onClick={goToPrevChapter}
                  className="flex items-center gap-2 px-5 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl transition-colors text-gray-700 dark:text-gray-300"
                >
                  <ChevronLeft size={18} />
                  <span>Previous</span>
                </button>
              ) : (
                <div></div>
              )}

              {current < chapters.length - 1 ? (
                <button
                  onClick={goToNextChapter}
                  className="flex items-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md hover:shadow-lg transition-all"
                >
                  <span>Next Chapter</span>
                  <ChevronRight size={18} />
                </button>
              ) : (
                <button
                  onClick={() => router.push(`/courses/${courseId}`)}
                  className="flex items-center gap-2 px-5 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl shadow-md hover:shadow-lg transition-all"
                >
                  <Award size={18} />
                  <span>Complete Course</span>
                </button>
              )}
            </div>
          </div>

          {/* Chapters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 dark:bg-gray-800/40 rounded-2xl p-6 sm:p-8 sticky top-24">
              <div className="flex items-center gap-4 mb-6">
                <BookOpen
                  size={24}
                  className="text-blue-600 dark:text-blue-400"
                />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white tracking-tight">
                  Course Contents
                </h3>
              </div>

              <div className="space-y-3">
                {chapters.map((chapter, idx) => (
                  <div
                    key={idx}
                    className={`group relative rounded-xl p-4 cursor-pointer transition-all duration-200 border-2 ${
                      current === idx
                        ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
                        : chapter.completed
                        ? "bg-white dark:bg-gray-800 border-green-100 dark:border-green-900/30 hover:border-green-200 dark:hover:border-green-800"
                        : "bg-white dark:bg-gray-800 border-transparent hover:border-gray-200 dark:hover:border-gray-700"
                    }`}
                    onClick={() => setCurrent(idx)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        {chapter.completed ? (
                          <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                            <CheckCircle
                              size={18}
                              className="text-green-600 dark:text-green-500"
                            />
                          </div>
                        ) : current === idx ? (
                          <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                            <Play
                              size={16}
                              className="text-blue-600 dark:text-blue-400 ml-0.5"
                            />
                          </div>
                        ) : (
                          <div className="w-6 h-6 rounded-full border-2 border-gray-300 dark:border-gray-600" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4
                            className={`text-sm font-medium tracking-tight leading-5 ${
                              current === idx
                                ? "text-blue-600 dark:text-blue-400"
                                : chapter.completed
                                ? "text-green-700 dark:text-green-500"
                                : "text-gray-900 dark:text-white"
                            }`}
                          >
                            {idx + 1}. {chapter.title}
                          </h4>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                            <Clock size={12} />
                            {chapter.duration} min
                          </span>
                          {!chapter.completed && (
                            <button
                              className="opacity-0 group-hover:opacity-100 transition-opacity px-3 py-1 bg-blue-600 text-white rounded-full text-xs font-medium hover:bg-blue-700 transition-colors"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleComplete(idx);
                              }}
                            >
                              Complete
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Overall Progress */}
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Course Progress
                  </span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {chapters.filter((c) => c.completed).length} of{" "}
                    {chapters.length}
                  </span>
                </div>
                <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-700 ease-out ${
                      progress >= 100 ? "bg-green-500" : "bg-blue-500"
                    }`}
                    style={{ width: `${progress}%` }}
                  />
                </div>

                {progress === 100 && (
                  <div className="mt-6 text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-100 dark:border-green-800">
                    <Award
                      size={24}
                      className="mx-auto mb-2 text-green-600 dark:text-green-500"
                    />
                    <p className="text-green-800 dark:text-green-400 font-medium">
                      Congratulations! You've completed this course.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
