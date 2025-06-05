"use server";

import { auth } from "@/auth";
import { writeClient } from "@/sanity/lib/write-client";
import slugify from "slugify";

export const createPitch = async (
  state: any,
  form: FormData,
  pitch: string
) => {
  const session = await auth();

  if (!session || !session.id) {
    return { status: "ERROR", error: "Not signed in" };
  }

  const {
    title,
    description,
    category,
    image,
    helpNeeded,
    projectLink,
  } = Object.fromEntries(form.entries());

  const slug = slugify(title as string, { lower: true, strict: true });

  try {
    const startup = {
      _type: "startup",
      title,
      description,
      category,
      image,
      helpNeeded,
      projectLink,
      pitch,
      slug: {
        _type: "slug",
        current: slug,
      },
      author: {
        _type: "reference",
        _ref: session.id,
      },
    };

    const result = await writeClient.create(startup);

    return {
      status: "SUCCESS",
      _id: result._id,
    };
  } catch (error) {
    console.log("Sanity error:", error);
    return {
      status: "ERROR",
      error: "Sanity write failed",
    };
  }
};
