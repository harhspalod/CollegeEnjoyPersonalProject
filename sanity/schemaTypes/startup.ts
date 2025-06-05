import { defineField, defineType } from "sanity";

export const startup = defineType({
  name: "startup",
  title: "Project Pitch",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Project Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
      },
    }),
    defineField({
      name: "author",
      title: "Submitted By",
      type: "reference",
      to: { type: "author" },
    }),
    defineField({
      name: "description",
      title: "Short Description",
      type: "text",
      validation: (Rule) => Rule.required().min(10),
    }),
    defineField({
      name: "category",
      title: "Category (e.g. Hackathon, College Project)",
      type: "string",
      validation: (Rule) =>
        Rule.required().min(3).max(30).error("Enter a valid category"),
    }),
    defineField({
      name: "helpNeeded",
      title: "Help Needed",
      type: "text",
      description: "Mention what kind of help or collaborators you're looking for",
    }),
    defineField({
      name: "projectLink",
      title: "External Link (GitHub, Figma, etc.)",
      type: "url",
    }),
    defineField({
      name: "image",
      title: "Cover Image URL (Optional)",
      type: "url",
    }),
    defineField({
      name: "pitch",
      title: "Full Pitch / Details",
      type: "markdown",
    }),
  ],
});
