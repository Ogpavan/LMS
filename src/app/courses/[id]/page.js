"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Star,
  Clock,
  Play,
  ChevronRight,
  BookOpen,
  FileText,
} from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Loader from "@/components/Loader"; // Add this at the top with your other imports

// Fetch course by id from API
async function getCourseById(id) {
  const res = await fetch(`/api/course?id=${id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  const data = await res.json();
  if (data.success && data.course) return data.course;
  return null;
}

export default function CourseDetails() {
  const params = useParams();
  const router = useRouter();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showFullDesc, setShowFullDesc] = useState(false);

  useEffect(() => {
    if (!params?.id) return;
    setLoading(true);
    getCourseById(params.id).then((c) => {
      setCourse(c);
      setLoading(false);
    });
  }, [params?.id]);

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

  if (!course) {
    return (
      <div
        className="min-h-screen bg-white page-transition page-transition-enter flex items-center justify-center "
        style={{ width: "90vw" }}
      >
        <div className="text-center">
          <h1 className="text-3xl font-medium text-gray-900 tracking-tight">
            Course not found
          </h1>
          <p className="mt-2 text-gray-600 tracking-tight">
            The course you're looking for doesn't exist.
          </p>
          <button
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            onClick={() => router.push("/courses")}
          >
            Go back to courses
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="px-6 pt-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/courses">Courses</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink aria-current="page">
                {course.title}
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4"></div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="mb-6">
              <div className="inline-flex items-center px-3 py-1 bg-gray-100 rounded-full mb-4">
                <span className="text-xs font-medium text-gray-700 tracking-tight uppercase">
                  {course.level}
                </span>
              </div>
              <h1 className="text-4xl font-semibold text-gray-900 tracking-tight leading-tight mb-4">
                {course.title}
              </h1>
              <div
                className={`relative overflow-hidden transition-all duration-500 ${
                  showFullDesc ? "max-h-[1000px]" : "max-h-[7.5rem]"
                }`}
              >
                <p
                  className={`text-md text-gray-600 font-normal tracking-tight leading-relaxed mb-2 ${
                    showFullDesc ? "" : "line-clamp-3"
                  }`}
                >
                  {course.description}
                </p>
              </div>
              {course.description &&
                course.description.split(" ").length > 20 && (
                  <button
                    className={`mt-1   rounded-full font-medium transition-colors duration-300 ${
                      showFullDesc ? "  text-blue-700  " : "  text-blue-700  "
                    }`}
                    onClick={() => setShowFullDesc((prev) => !prev)}
                  >
                    {showFullDesc ? "Read less" : "Read more"}
                  </button>
                )}
            </div>

            <div className="flex items-center space-x-6 mb-8">
              <div className="flex items-center space-x-2">
                <Clock size={16} className="text-gray-500" />
                <span className="text-sm font-medium text-gray-700 tracking-tight">
                  {course.duration}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Star size={16} className="text-yellow-500 fill-yellow-500" />
                <span className="text-sm font-medium text-gray-700 tracking-tight">
                  {course.rating}
                </span>
              </div>
            </div>

            <button
              className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-medium tracking-tight rounded-xl hover:bg-blue-700 transition-colors duration-200 shadow-lg"
              onClick={() => router.push(`/learn?courseId=${course.id}`)}
            >
              <Play size={20} className="mr-2" />
              Start Course
            </button>
          </div>

          <div className="relative">
            <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={course.thumbnail} // Use the Cloudinary image URL saved in your DB
                alt={course.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-16">
            {/* Instructor */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 tracking-tight mb-6">
                Instructor
              </h2>
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-xl font-medium text-gray-600 tracking-tight">
                    {course.instructor
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-medium text-gray-900 tracking-tight">
                    {course.instructor}
                  </h3>
                  <p className="text-gray-600 tracking-tight">
                    Professor, Computer Science
                  </p>
                </div>
              </div>
            </section>

            {/* Chapters */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 tracking-tight mb-6">
                Chapters
              </h2>
              <div className="space-y-6">
                {course.chapters?.map((chapter, idx) => (
                  <div key={idx} className="border rounded-xl p-6 ">
                    <div className="flex items-center gap-3 mb-2">
                      <BookOpen size={20} className="text-blue-600" />
                      <span className="text-lg font-semibold text-gray-900">
                        {chapter.title}
                      </span>
                    </div>
                    <p className="text-gray-700 mb-3">{chapter.summary}</p>
                    <div className="space-y-2">
                      {chapter.resources?.map((res, rIdx) => (
                        <div key={rIdx} className="flex items-center gap-2">
                          <FileText size={16} className="text-gray-500" />
                          <span className="text-gray-800 text-sm">
                            {res.type}: {res.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Reviews */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 tracking-tight mb-6">
                Reviews
              </h2>
              <div className="space-y-6">
                {course.reviews && course.reviews.length > 0 ? (
                  course.reviews.map((review, idx) => (
                    <div
                      key={idx}
                      className="border-l-4 border-gray-200 pl-6 py-4"
                    >
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-medium text-gray-900 tracking-tight">
                          {review.user}
                        </h4>
                        <div className="flex items-center space-x-1">
                          <Star
                            size={14}
                            className="text-yellow-500 fill-yellow-500"
                          />
                          <span className="text-sm text-gray-600 tracking-tight">
                            {review.rating}
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-700 tracking-tight leading-relaxed">
                        {review.comment}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 tracking-tight">
                    No reviews yet.
                  </p>
                )}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-gray-50 rounded-2xl p-8">
                <h3 className="text-lg font-medium text-gray-900 tracking-tight mb-6">
                  Requirements
                </h3>
                <div className="space-y-4">
                  {course.requirements?.map((item, idx) => (
                    <div key={idx} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      <span className="text-gray-700 tracking-tight">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
