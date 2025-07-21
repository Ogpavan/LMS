"use client";

import React from "react";
import { Progress } from "@/components/ui/progress";
import { CalendarDays, Trophy, BookOpen, Clock } from "lucide-react";

const subjects = [
  { name: "Math", grade: 85 },
  { name: "Science", grade: 92 },
  { name: "English", grade: 78 },
  { name: "History", grade: 88 },
  { name: "Computer", grade: 95 },
];

const recentTests = [
  {
    subject: "Math",
    score: 88,
    date: "2025-07-15",
    status: "Passed",
  },
  {
    subject: "English",
    score: 65,
    date: "2025-07-10",
    status: "Passed",
  },
  {
    subject: "Science",
    score: 45,
    date: "2025-07-08",
    status: "Failed",
  },
];

const upcomingTests = [
  { subject: "History", date: "2025-07-20", time: "10:00 AM" },
  { subject: "Computer", date: "2025-07-22", time: "11:30 AM" },
];

export default function page() {
  return (
    <main className="p-6 md:p-10  dark:bg-gray-900 min-h-screen space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          Student Performance Dashboard
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Track your academic progress in real-time.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Grades and Progress */}
        <div className="col-span-2 space-y-6">
          {/* Subject Grades */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow border dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
              Subject-wise Grades
            </h2>
            <div className="space-y-4">
              {subjects.map((sub) => (
                <div key={sub.name}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-700 dark:text-gray-200">
                      {sub.name}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {sub.grade}%
                    </span>
                  </div>
                  <Progress value={sub.grade} className="h-2" />
                </div>
              ))}
            </div>
          </div>

          {/* Recent Tests */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow border dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
              Recent Test Results
            </h2>
            <ul className="space-y-3">
              {recentTests.map((test, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {test.subject}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-300">
                      {test.date}
                    </p>
                  </div>
                  <div className="text-right">
                    <p
                      className={`text-sm font-semibold ${
                        test.status === "Passed"
                          ? "text-green-600"
                          : "text-red-500"
                      }`}
                    >
                      {test.score}%
                    </p>
                    <p className="text-xs text-gray-400">{test.status}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right: Sidebar */}
        <div className="space-y-6">
          {/* Performance Summary */}
          <div className="bg-gradient-to-br from-pink-200 to-purple-200 dark:from-gray-700 dark:to-gray-800 text-gray-900 dark:text-white p-6 rounded-xl shadow border dark:border-gray-600">
            <div className="flex items-center gap-4 mb-4">
              <Trophy className="w-10 h-10 text-yellow-500" />
              <div>
                <h3 className="text-lg font-bold">Overall Score</h3>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  80% Average
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <BookOpen className="w-5 h-5 text-indigo-600" />
              <p className="text-sm">Total Subjects: {subjects.length}</p>
            </div>
          </div>

          {/* Upcoming Tests */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow border dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Upcoming Tests
            </h3>
            <ul className="space-y-3">
              {upcomingTests.map((test, index) => (
                <li
                  key={index}
                  className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-200"
                >
                  <CalendarDays className="w-5 h-5 text-pink-500" />
                  <span>
                    {test.subject} — {test.date} at {test.time}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Motivation Box */}
          <div className="bg-gradient-to-br from-yellow-100 to-yellow-300 dark:from-gray-800 dark:to-gray-700 p-5 rounded-xl shadow border dark:border-gray-700">
            <blockquote className="italic text-sm text-gray-800 dark:text-gray-100">
              “The expert in anything was once a beginner.”
            </blockquote>
            <p className="text-right text-xs mt-2 text-gray-600 dark:text-gray-300">
              — Helen Hayes
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
