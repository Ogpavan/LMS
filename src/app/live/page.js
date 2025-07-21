"use client";
import React, { useState } from "react";
import {
  Video,
  CalendarDays,
  Clock,
  Users,
  Search,
  Play,
  PlusCircle,
} from "lucide-react";

// Demo data for live classes
const liveClasses = [
  {
    title: "Live: Full Body HIIT",
    instructor: "Mike Anderson",
    date: "2025-07-18",
    time: "18:00",
    duration: "45 mins",
    attendees: 32,
    description:
      "Join our high-intensity interval training session live and get real-time feedback from the coach.",
    image: "/course1.webp",
    status: "Upcoming",
    joinLink: "#",
  },
  {
    title: "Yoga Flow Morning",
    instructor: "Emma Lee",
    date: "2025-07-17",
    time: "07:00",
    duration: "40 mins",
    attendees: 21,
    description:
      "Start your day with a calming yoga flow. Suitable for all levels.",
    image: "/course2.webp",
    status: "Live Now",
    joinLink: "#",
  },
  {
    title: "Strength Circuit Q&A",
    instructor: "Sarah Johnson",
    date: "2025-07-16",
    time: "20:00",
    duration: "30 mins",
    attendees: 15,
    description:
      "Ask your questions and get answers live from our strength coach.",
    image: "/course3.webp",
    status: "Completed",
    joinLink: "#",
  },
];

export default function LiveClasses() {
  const [search, setSearch] = useState("");

  // Filter classes by title, instructor, or description
  const filteredClasses = liveClasses.filter(
    (cls) =>
      cls.title.toLowerCase().includes(search.toLowerCase()) ||
      cls.instructor.toLowerCase().includes(search.toLowerCase()) ||
      cls.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen dark:bg-gray-900 bg-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/50 z-10 w-full">
        <div className="py-6 flex flex-col md:flex-row items-start md:items-center justify-between px-6 gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 tracking-tight mb-1 dark:text-white">
              Live Classes
            </h1>
            <p className="text-gray-600 text-base font-light dark:text-white">
              Join interactive sessions, ask questions, and learn in real time.
            </p>
          </div>
          {/* Search Filter */}
          <div className="relative w-full md:w-80">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search live classes..."
              className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 text-gray-900 placeholder-gray-400 shadow focus:outline-none focus:ring-2 focus:ring-[#007aff] transition"
            />
            <Search
              className="absolute left-4 top-3.5 text-gray-400"
              size={18}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="px-6 py-5">
        {/* Schedule New Class Button */}
        <div className="flex justify-end mb-8">
          <button className="flex items-center gap-2 bg-[#007aff] text-white px-6 py-2 rounded-full font-medium hover:bg-blue-700 transition-colors duration-200 shadow-lg">
            <PlusCircle size={20} />
            Schedule New Class
          </button>
        </div>

        {/* Live Classes List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredClasses.map((cls, idx) => (
            <div
              key={idx}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm transition-all duration-300 hover:scale-[1.02] cursor-pointer dark:bg-gray-900 border dark:border-gray-800"
            >
              {/* Image Container */}
              <div className="relative h-44 overflow-hidden">
                <img
                  src={cls.image}
                  alt={cls.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {/* Status Badge */}
                <div className="absolute top-4 left-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold shadow
                    ${
                      cls.status === "Live Now"
                        ? "bg-red-500 text-white"
                        : cls.status === "Upcoming"
                        ? "bg-yellow-400 text-gray-900"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {cls.status}
                  </span>
                </div>
                {/* Join/Replay Button */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {cls.status === "Live Now" ? (
                    <a
                      href={cls.joinLink}
                      className="bg-red-500 text-white rounded-full px-6 py-3 flex items-center gap-2 font-semibold shadow-lg hover:bg-red-600 transition"
                    >
                      <Video size={22} />
                      Join Live
                    </a>
                  ) : cls.status === "Upcoming" ? (
                    <a
                      href={cls.joinLink}
                      className="bg-[#007aff] text-white rounded-full px-6 py-3 flex items-center gap-2 font-semibold shadow-lg hover:bg-blue-700 transition"
                    >
                      <CalendarDays size={22} />
                      Set Reminder
                    </a>
                  ) : (
                    <a
                      href={cls.joinLink}
                      className="bg-gray-700 text-white rounded-full px-6 py-3 flex items-center gap-2 font-semibold shadow-lg hover:bg-gray-800 transition"
                    >
                      <Play size={22} />
                      Watch Replay
                    </a>
                  )}
                </div>
              </div>
              {/* Content */}
              <div className="p-5">
                <div className="flex items-center justify-between mb-1">
                  <h2 className="text-lg font-semibold tracking-tight text-gray-900 line-clamp-2 dark:text-white">
                    {cls.title}
                  </h2>
                  <div className="flex items-center gap-1">
                    <Users size={16} className="text-gray-400" />
                    <span className="text-gray-900 dark:text-white font-semibold text-sm">
                      {cls.attendees}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-gray-600 font-light text-sm tracking-tight dark:text-white">
                    {cls.instructor}
                  </span>
                </div>
                <div className="flex items-center gap-4 mb-2 text-xs text-gray-500 dark:text-gray-300">
                  <div className="flex items-center gap-1">
                    <CalendarDays size={14} />
                    <span>{cls.date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={14} />
                    <span>{cls.time}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>{cls.duration}</span>
                  </div>
                </div>
                <div className="mt-2">
                  <span className="text-gray-700 text-xs font-light tracking-tight line-clamp-2 dark:text-white">
                    {cls.description}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No classes found */}
        {filteredClasses.length === 0 && (
          <div className="text-center text-gray-500 mt-24 text-lg">
            No live classes found.
          </div>
        )}
      </main>
    </div>
  );
}
