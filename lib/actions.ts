"use server";

import { auth } from "@/auth";
import { writeClient } from "@/sanity/lib/write-client";
import slugify from "slugify";

export const createPitch = async (_: any, form: FormData) => {
  const session = await auth();
  if (!session?.user?.id) {
    return { status: "ERROR", error: "Not signed in" };
  }
  

  const {
    title,
    description,
    category,
    image,
    helpNeeded,
    projectLink,
    pitch,
  } = Object.fromEntries(form.entries());

  const slug = slugify(title as string, { lower: true, strict: true });

  const doc = {
    _type: "startup",
    title,
    description,
    category,
    image,
    helpNeeded,
    projectLink,
    pitch,
    slug: { _type: "slug", current: slug },
    author: {
      _type: "reference",
      _ref: session.user.id, // ✅ CORRECT
    }
    
  };

  const result = await writeClient.create(doc);

  return {
    status: "SUCCESS",
    _id: result._id,
  };
};
