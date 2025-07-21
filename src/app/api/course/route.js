import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(req) {
  try {
    const body = await req.json();

    // Fetch all courses
    if (body.fetchAll) {
      const { data: courses, error } = await supabase
        .from("courses")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        return NextResponse.json(
          { success: false, error: error.message },
          { status: 500 }
        );
      }
      return NextResponse.json({ success: true, courses });
    }

    // Fetch a single course by id with chapters
    if (body.getById) {
      // Fetch course
      const { data: course, error: courseError } = await supabase
        .from("courses")
        .select("*")
        .eq("id", body.getById)
        .single();

      if (courseError || !course) {
        return NextResponse.json(
          { success: false, error: courseError?.message || "Course not found" },
          { status: 404 }
        );
      }

      // Fetch chapters for this course
      const { data: chapters, error: chaptersError } = await supabase
        .from("chapters")
        .select("*")
        .eq("course_id", body.getById)
        .order("position", { ascending: true });

      if (chaptersError) {
        return NextResponse.json(
          { success: false, error: chaptersError.message },
          { status: 500 }
        );
      }

      // Attach chapters to course
      course.chapters = chapters || [];

      return NextResponse.json({ success: true, course });
    }

    // Otherwise, create a new course
    const {
      title,
      description,
      instructor,
      duration,
      level,
      image,
      chapters = [],
      created_by,
      created_by_email,
    } = body;

    // Validate required fields for course creation
    if (!title || !description || !instructor || !duration || !level) {
      return NextResponse.json(
        { success: false, error: "Missing required course fields." },
        { status: 400 }
      );
    }

    // Insert course
    const { data: course, error: courseError } = await supabase
      .from("courses")
      .insert([
        {
          title,
          description,
          instructor,
          duration,
          level,
          image_url: image,
          created_by,
          created_by_email,
        },
      ])
      .select()
      .single();

    if (courseError) {
      return NextResponse.json(
        { success: false, error: courseError.message },
        { status: 400 }
      );
    }

    // Insert chapters (if any)
    if (chapters.length > 0) {
      const chaptersToInsert = chapters.map((ch, idx) => ({
        course_id: course.id,
        title: ch.title,
        summary: ch.summary,
        video_url: ch.videoUrl,
        duration: ch.duration,
        position: idx + 1,
      }));

      const { error: chaptersError } = await supabase
        .from("chapters")
        .insert(chaptersToInsert);

      if (chaptersError) {
        return NextResponse.json(
          { success: false, error: chaptersError.message },
          { status: 400 }
        );
      }
    }

    return NextResponse.json({ success: true, courseId: course.id });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

export async function PATCH(req) {
  try {
    const body = await req.json();
    const { courseId, isPublished } = body;

    // Validate required fields
    if (!courseId || typeof isPublished !== "boolean") {
      return NextResponse.json(
        { success: false, error: "Missing required fields or invalid data." },
        { status: 400 }
      );
    }

    // Update the isPublished column for the specified course
    const { error } = await supabase
      .from("courses")
      .update({ isPublished })
      .eq("id", courseId);

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Course updated successfully.",
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
