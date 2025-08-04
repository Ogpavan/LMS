import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// POST: Create and publish a new course
export async function POST(req) {
  try {
    const body = await req.json();
    const {
      title,
      description,
      instructor,
      level,
      thumbnail,
      chapters = [],
      status,
      userId, // <-- make sure you get this from the request
    } = body;

    if (!title || !description || !instructor || !level || !userId) {
      return NextResponse.json(
        { success: false, error: "Missing required course fields." },
        { status: 400 }
      );
    }

    const courseData = {
      title,
      description,
      instructor,
      level,
      thumbnail,
      status,
      userId, // <-- add this line
      chapters: {
        create: chapters.map((ch, idx) => ({
          title: ch.title,
          summary: ch.summary,
          videoUrl: ch.videoUrl,
          duration: ch.duration,
          position: idx + 1,
        })),
      },
    };

    const course = await prisma.course.create({
      data: courseData,
      include: { chapters: true },
    });

    return NextResponse.json({ success: true, course });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

// GET: Get all courses with chapters
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (id) {
    // Get single course by id
    const course = await prisma.course.findUnique({
      where: { id: Number(id) },
      include: { chapters: true },
    });
    if (!course) {
      return NextResponse.json(
        { success: false, error: "Course not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, course });
  }
  try {
    const courses = await prisma.course.findMany({
      where: {
        isActive: true,
        status: "published", // Only show published courses
      },
      include: {
        chapters: { orderBy: { position: "asc" } },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, courses });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

// POST: Get all courses for a specific userId

// PUT: Update an existing course
export async function PUT(req) {
  try {
    const body = await req.json();
    const {
      id,
      title,
      description,
      instructor,
      level,
      thumbnail,
      chapters = [],
      status,
    } = body;

    if (!id || !title || !description || !instructor || !level) {
      return NextResponse.json(
        { success: false, error: "Missing required fields." },
        { status: 400 }
      );
    }

    // Update the course
    const updatedCourse = await prisma.course.update({
      where: { id: Number(id) },
      data: {
        title,
        description,
        instructor,
        level,
        thumbnail,
        status,
      },
    });

    // Delete existing chapters and recreate (simple approach)
    await prisma.chapter.deleteMany({ where: { courseId: Number(id) } });
    await prisma.chapter.createMany({
      data: chapters.map((ch, idx) => ({
        courseId: Number(id),
        title: ch.title,
        summary: ch.summary,
        videoUrl: ch.videoUrl,
        duration: ch.duration,
        position: idx + 1,
      })),
    });

    // Return updated course with chapters
    const courseWithChapters = await prisma.course.findUnique({
      where: { id: Number(id) },
      include: { chapters: true },
    });

    return NextResponse.json({ success: true, course: courseWithChapters });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
