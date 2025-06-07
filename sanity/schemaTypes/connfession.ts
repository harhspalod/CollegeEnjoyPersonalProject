import { defineField, defineType } from "sanity";

export const confession = defineType({
  name: "confession",
  title: "Confession",
  type: "document",
  fields: [
    defineField({
      name: "to",
      title: "To (Target Person)",
      type: "string",
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: "from",
      title: "From (Optional)",
      type: "string",
    }),
    defineField({
      name: "message",
      title: "Message",
      type: "text",
      validation: Rule => Rule.required().min(5),
    }),
    defineField({
      name: "timestamp",
      title: "Timestamp",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
      readOnly: true,
    }),
    defineField({
      name: "approved",
      title: "Approved",
      type: "boolean",
      initialValue: false,
    }),
  ],
});
