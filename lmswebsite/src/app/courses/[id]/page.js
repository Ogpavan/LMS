import React, { useState } from "react";
import { useRouter } from "next/router";
import {
  Star,
  Clock,
  Play,
  ChevronRight,
  BookOpen,
  FileText,
} from "lucide-react";

async function getCourseById(id) {
  const courses = [
    {
      id: "1",
      title: "Introduction to Computer Science",
      instructor: "Dr. Alice Johnson",
      duration: "12 weeks",
      rating: 4.9,
      description:
        "Learn the fundamentals of computer science, programming, and problem-solving. This course covers algorithms, data structures, and basic software engineering concepts.",
      level: "Beginner",
      image: "/course1.webp",
      chapters: [
        {
          title: "Getting Started with Programming",
          summary: "Introduction to programming concepts and languages.",
          resources: [
            { type: "Lecture", name: "Lecture 1: What is Programming?" },
            { type: "Assignment", name: "Assignment 1: Hello World" },
          ],
        },
        {
          title: "Algorithms & Data Structures",
          summary:
            "Learn about arrays, lists, stacks, queues, and basic algorithms.",
          resources: [
            { type: "Lecture", name: "Lecture 2: Arrays & Lists" },
            { type: "Assignment", name: "Assignment 2: Array Manipulation" },
          ],
        },
        {
          title: "Software Engineering Basics",
          summary:
            "Understand the basics of software development and engineering.",
          resources: [
            {
              type: "Lecture",
              name: "Lecture 3: Software Development Life Cycle",
            },
            { type: "Assignment", name: "Assignment 3: SDLC Case Study" },
          ],
        },
      ],
      requirements: [
        "Laptop or Desktop Computer",
        "Internet Connection",
        "Basic Math Skills",
      ],
      reviews: [
        {
          user: "Jane Doe",
          comment:
            "Excellent introduction to CS. The chapters are well structured.",
          rating: 5,
        },
        {
          user: "John Smith",
          comment: "Great for beginners. Assignments are practical.",
          rating: 4.5,
        },
      ],
    },
  ];
  return courses.find((c) => c.id === id) || null;
}

export default function CourseDetails() {
  const router = useRouter();
  const { id } = router.query;

  const course = getCourseById(id);

  if (!course) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-3xl font-medium text-gray-900 tracking-tight">
            Course not found
          </h1>
          <p className="mt-2 text-gray-600 tracking-tight">
            The course you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  const handleStartCourse = () => {
    router.push(`/courses/${id}/learn`);
  };

  return (
    <div className="min-h-screen bg-white">
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-gray-600">
              <span className="text-sm font-medium tracking-tight">Courses</span>
              <ChevronRight size={14} />
              <span className="text-sm font-medium tracking-tight text-gray-900">
                {course.title}
              </span>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="mb-6">
              <div className="inline-flex items-center px-3 py-1 bg-gray-100 rounded-full mb-4">
                <span className="text-xs font-medium text-gray-700 tracking-tight">
                  {course.level}
                </span>
              </div>
              <h1 className="text-4xl font-semibold text-gray-900 tracking-tight leading-tight mb-4">
                {course.title}
              </h1>
              <p className="text-md text-gray-600 font-normal tracking-tight leading-relaxed mb-6">
                {course.description}
              </p>
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
              onClick={handleStartCourse}
              className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-medium tracking-tight rounded-xl hover:bg-blue-700 transition-colors duration-200 shadow-lg"
            >
              <Play size={20} className="mr-2" />
              Start Course
            </button>
          </div>

          <div className="relative">
            <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={course.image}
                alt={course.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2 space-y-16">
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
                      {chapter.resources.map((res, rIdx) => (
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