"use client";

import React from "react";
import { CalendarDays, Clock } from "lucide-react";

const exams = [
  {
    id: "exam1",
    title: "Math Final Exam",
    subject: "Mathematics",
    date: "2025-08-01",
    duration: "90 mins",
    status: "Upcoming",
    totalMarks: 100,
  },
  {
    id: "exam2",
    title: "Physics Quiz",
    subject: "Physics",
    date: "2025-07-25",
    duration: "60 mins",
    status: "Upcoming",
    totalMarks: 50,
  },
  {
    id: "exam3",
    title: "English Grammar Test",
    subject: "English",
    date: "2025-07-10",
    duration: "45 mins",
    status: "Completed",
    totalMarks: 40,
  },
];

const getStatusColor = (status) => {
  switch (status) {
    case "Upcoming":
      return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300";
    case "Completed":
      return "bg-gray-200 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    case "Missed":
      return "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300";
    default:
      return "";
  }
};

export default function page() {
  return (
    <main className="px-6 py-12">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
        Online Exams
      </h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {exams.map((exam) => (
          <div
            key={exam.id}
            className="bg-white dark:bg-gray-900 border border-pink-200 shadow rounded-xl p-6 flex flex-col gap-3"
          >
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                  {exam.title}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {exam.subject}
                </p>
              </div>
              <span
                className={`text-xs font-semibold px-3 py-1 rounded-full ${getStatusColor(
                  exam.status
                )}`}
              >
                {exam.status}
              </span>
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300 mt-2">
              <div className="flex items-center gap-1">
                <CalendarDays size={16} />
                <span>{exam.date}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock size={16} />
                <span>{exam.duration}</span>
              </div>
            </div>

            <div className="mt-auto flex justify-between items-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Total Marks:{" "}
                <span className="font-semibold text-gray-800 dark:text-white">
                  {exam.totalMarks}
                </span>
              </p>

              {exam.status === "Upcoming" && (
                <button className=" bg-pink-500 hover:bg-pink-600 transition-colors text-white text-sm px-4 py-2 rounded-full font-medium shadow">
                  Start Exam
                </button>
              )}
              {exam.status === "Completed" && (
                <button className=" text-pink-500 text-sm font-medium hover:underline">
                  View Result
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
