import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Helper to get user from cookies
function getUserIdFromCookies(req) {
  const cookie = req.headers.get("cookie") || "";
  const userCookie = cookie.split("; ").find((row) => row.startsWith("user="));
  if (!userCookie) return null;
  try {
    const user = JSON.parse(decodeURIComponent(userCookie.split("=")[1]));
    return user.id;
  } catch {
    return null;
  }
}

// POST: Bulk upload courses via Excel
export async function POST(req) {
  try {
    const body = await req.json();
    const { courses } = body; // Array of course objects

    if (!Array.isArray(courses) || courses.length === 0) {
      return NextResponse.json(
        { success: false, error: "No courses provided." },
        { status: 400 }
      );
    }

    const userId = getUserIdFromCookies(req);
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "User not authenticated." },
        { status: 401 }
      );
    }

    // Convert userId to string for Prisma
    const userIdStr = String(userId);

    const createdCourses = [];
    for (const course of courses) {
      const {
        title,
        description,
        instructor,
        level,
        thumbnail,
        status = "draft",
        ...chapterFields
      } = course;

      // Collect chapters from flat fields
      const chapters = [];
      let idx = 1;
      while (course[`chapter_title_${idx}`]) {
        chapters.push({
          title: course[`chapter_title_${idx}`],
          summary: course[`chapter_summary_${idx}`] || "",
          videoUrl: course[`chapter_videoUrl_${idx}`] || "",
          duration: String(course[`chapter_duration_${idx}`] || ""), // <-- convert to string
          position: idx,
        });
        idx++;
      }

      if (!title || !description || !instructor || !level) continue;

      const courseData = {
        title,
        description,
        instructor,
        level,
        thumbnail,
        status,
        userId: userIdStr, // <-- fix here
        chapters: {
          create: chapters,
        },
      };

      const created = await prisma.course.create({
        data: courseData,
        include: { chapters: true },
      });
      createdCourses.push(created);
    }

    return NextResponse.json({ success: true, courses: createdCourses });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
