"use client";
import React, { useState } from "react";
import { Play, ChevronLeft, ChevronRight } from "lucide-react";

import { BookOpen, ClipboardList, FileText } from "lucide-react";
// Calendar utility
function getMonthDays(year, month) {
  const days = [];
  const firstDay = new Date(year, month, 1).getDay(); // 0=Sun
  const lastDate = new Date(year, month + 1, 0).getDate();
  let week = [];
  let dayOfWeek = (firstDay + 6) % 7; // convert to Mon=0
  for (let i = 0; i < dayOfWeek; i++) week.push(null);
  for (let d = 1; d <= lastDate; d++) {
    week.push(d);
    if (week.length === 7) {
      days.push(week);
      week = [];
    }
  }
  if (week.length) {
    while (week.length < 7) week.push(null);
    days.push(week);
  }
  return days;
}

function CalendarBox({
  month,
  year,
  monthNames,
  handlePrev,
  handleNext,
  daysMatrix,
  today,
}) {
  return (
    <div className="">
      <h1 className="  font-medium tracking-tight text-gray-800 mb-4">
        Calendar
      </h1>
      <div className="bg-white rounded-xl shadow-sm p-4 w-full ">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-medium tracking-tight text-gray-800">
            Month
          </h2>
          <div className="flex items-center space-x-2">
            <button onClick={handlePrev}>
              <ChevronLeft className="w-5 h-5 text-gray-400" />
            </button>
            <span className="text-sm font-medium tracking-tight text-gray-700">
              {monthNames[month]} {year}
            </span>
            <button onClick={handleNext}>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>
        {/* Real Calendar */}
        <div>
          <div className="grid grid-cols-7 gap-2 text-center text-sm text-gray-500 mb-2">
            <div>Mo</div>
            <div>Tu</div>
            <div>We</div>
            <div>Th</div>
            <div>Fr</div>
            <div>Sa</div>
            <div>Su</div>
          </div>
          <div className="space-y-1">
            {daysMatrix.map((week, i) => (
              <div
                key={i}
                className="grid grid-cols-7 gap-2 text-center text-sm"
              >
                {week.map((d, j) => {
                  const isToday =
                    d === today.getDate() &&
                    month === today.getMonth() &&
                    year === today.getFullYear();
                  return (
                    <div
                      key={j}
                      className={`p-2 rounded-full ${
                        isToday
                          ? "bg-purple-600 text-white font-bold tracking-tight"
                          : "hover:bg-purple-50"
                      }`}
                    >
                      {d ? d : ""}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusCards() {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-medium tracking-tight text-gray-800 mb-6">
        Status Overview
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Lessons Card */}
        <div className="bg-[#fff7ed] rounded-xl p-6 shadow-[0_10px_50px_rgba(254,215,170,0.28)] flex flex-col relative overflow-hidden">
          <div className="absolute top-4 right-4">
            <svg className="w-12 h-12 transform -rotate-90">
              <circle
                cx="24"
                cy="24"
                r="18"
                fill="none"
                stroke="#fed7aa"
                strokeWidth="4"
              />
              <circle
                cx="24"
                cy="24"
                r="18"
                fill="none"
                stroke="#f97316"
                strokeWidth="4"
                strokeDasharray="113"
                strokeDashoffset="28"
                className="transition-all duration-300"
              />
            </svg>
          </div>
          <BookOpen className="w-8 h-8 text-orange-400 mb-2" />
          <div className="text-3xl font-semibold text-gray-800 mb-1">42</div>
          <div className="text-sm text-gray-600 mb-1 font-normal tracking-tight">
            Lessons
          </div>
          <div className="text-xs font-normal tracking-tight text-gray-500">
            of 73 completed
          </div>
        </div>
        {/* Assignments Card */}
        <div className="bg-[#fdf2fa] rounded-xl p-6  shadow-[0_10px_50px_rgba(236,72,153,0.15)] flex flex-col   relative overflow-hidden">
          <div className="absolute top-4 right-4">
            <svg className="w-12 h-12 transform -rotate-90">
              <circle
                cx="24"
                cy="24"
                r="18"
                fill="none"
                stroke="#fce7f3"
                strokeWidth="4"
              />
              <circle
                cx="24"
                cy="24"
                r="18"
                fill="none"
                stroke="#ec4899"
                strokeWidth="4"
                strokeDasharray="113"
                strokeDashoffset="67"
                className="transition-all duration-300"
              />
            </svg>
          </div>
          <ClipboardList className="w-8 h-8 text-pink-400 mb-2" />
          <div className="text-3xl font-semibold text-gray-800 mb-1">08</div>
          <div className="text-sm text-gray-600 mb-1 font-normal tracking-tight">
            Assignments
          </div>
          <div className="text-xs text-gray-500 font-normal tracking-tight">
            of 26 completed
          </div>
        </div>
        {/* Tests Card */}
        <div className="bg-[#f0fdf4] rounded-xl p-6 shadow-[0_10px_50px_rgba(34,197,94,0.15)] flex flex-col  relative overflow-hidden">
          <div className="absolute top-4 right-4">
            <svg className="w-12 h-12 transform -rotate-90">
              <circle
                cx="24"
                cy="24"
                r="18"
                fill="none"
                stroke="#dcfce7"
                strokeWidth="4"
              />
              <circle
                cx="24"
                cy="24"
                r="18"
                fill="none"
                stroke="#22c55e"
                strokeWidth="4"
                strokeDasharray="113"
                strokeDashoffset="67"
                className="transition-all duration-300"
              />
            </svg>
          </div>
          <FileText className="w-8 h-8 text-green-400 mb-2" />
          <div className="text-3xl font-semibold text-gray-800 mb-1">03</div>
          <div className="text-sm text-gray-600 mb-1 font-normal tracking-tight">
            Tests
          </div>
          <div className="text-xs text-gray-500 font-normal tracking-tight">
            of 26 completed
          </div>
        </div>
      </div>
    </div>
  );
}

function MyCourses({ courses }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium tracking-tight text-gray-800">
          My Courses
        </h2>
        <div className="flex space-x-4">
          <button className="text-purple-600 text-sm font-medium border-b-2 border-purple-600 pb-1">
            Active
          </button>
          <button className="text-gray-500 text-sm">Completed</button>
        </div>
      </div>
      <div className="space-y-4">
        {courses.map((course, idx) => (
          <div
            key={idx}
            className="bg-white rounded-xl p-6 shadow-sm flex items-center justify-between"
          >
            <div className="flex items-center space-x-4">
              <div
                className={`w-10 h-10 ${course.color} rounded-lg flex items-center justify-center`}
              >
                <div className="w-5 h-5 bg-white rounded-sm"></div>
              </div>
              <div>
                <h3 className="font-normal tracking-tight text-gray-800">
                  {course.name}
                </h3>
                <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden mt-2">
                  <div
                    className="h-full bg-purple-600"
                    style={{
                      width: `${(course.completed / course.total) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">{course.status}</span>
              <span className="text-sm text-gray-500">
                {Math.round((course.completed / course.total) * 100)}%
              </span>
              <div className="flex items-center space-x-2 text-gray-400 border border-purple-200 rounded-full px-2 py-2">
                <Play className="w-4 h-4" />
                <span className="text-xs font-semibold">Resume</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Upcoming({ upcoming }) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Upcoming</h3>
      <div className="space-y-3">
        {upcoming.map((item, idx) => (
          <div
            key={idx}
            className="bg-white rounded-xl p-4 shadow-sm flex items-center justify-between"
          >
            <div className="flex items-center space-x-2">
              <div className="flex flex-col items-center">
                <span className="text-xs font-bold text-gray-700">
                  {item.date.split(" ")[0]}
                </span>
                <span className="text-xs text-gray-400">
                  {item.date.split(" ")[1]}
                </span>
              </div>
              <div>
                <div className="text-sm font-normal tracking-tight text-gray-800">
                  {item.title}
                </div>
              </div>
            </div>
            <div className={`text-xs font-semibold ${item.color}`}>
              • {item.type}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Page() {
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const daysMatrix = getMonthDays(year, month);

  const handlePrev = () => {
    if (month === 0) {
      setMonth(11);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  };
  const handleNext = () => {
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  };

  // Demo data for courses and upcoming
  const courses = [
    {
      name: "Web Design : Form Figma to we...",
      completed: 73,
      total: 73,
      color: "bg-gradient-to-r from-pink-500 to-purple-600",
      status: "Completed",
      stats: [15, 6, 3],
    },
    {
      name: "Html Basics",
      completed: 15,
      total: 26,
      color: "bg-orange-500",
      status: "Completed",
      stats: [15, 6, 3],
    },
    {
      name: "Data with python",
      completed: 13,
      total: 26,
      color: "bg-gradient-to-r from-orange-400 to-red-500",
      status: "Completed",
      stats: [15, 6, 3],
    },
  ];

  const upcoming = [
    {
      title: "Practical theory",
      date: "29 Sept",
      type: "Assignments",
      color: "text-pink-500",
    },
    {
      title: "Practical theory 1",
      date: "29 Sept",
      type: "Test",
      color: "text-green-500",
    },
    {
      title: "Practical theory 2",
      date: "29 Sept",
      type: "Lessons",
      color: "text-orange-500",
    },
    {
      title: "Practical theory 3",
      date: "29 Sept",
      type: "Assignments",
      color: "text-pink-500",
    },
  ];

  return (
    <div className="bg-[#f8f9fd] p-8 min-h-screen min-w-[90vw]">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Section */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          <StatusCards />
          <MyCourses courses={courses} />
        </div>
        {/* Right Section */}
        <div className="flex flex-col gap-8 max-w-sm mx-auto lg:mx-0">
          <CalendarBox
            month={month}
            year={year}
            monthNames={monthNames}
            handlePrev={handlePrev}
            handleNext={handleNext}
            daysMatrix={daysMatrix}
            today={today}
          />
          <Upcoming upcoming={upcoming} />
        </div>
      </div>
    </div>
  );
}
