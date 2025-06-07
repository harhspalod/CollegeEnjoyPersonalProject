import { defineField, defineType } from "sanity";

export default defineType({
  name: "group",
  title: "Group",
  type: "document",
  fields: [
    defineField({
      name: "name",
      type: "string",
      title: "Group Name",
    }),
    defineField({
      name: "description",
      type: "text",
      title: "Description",
    }),
    defineField({
      name: "owner",
      type: "reference",
      to: [{ type: "author" }],
      title: "Group Owner",
    }),
    defineField({
      name: "members",
      type: "array",
      title: "Approved Members",
      of: [{ type: "reference", to: [{ type: "author" }] }],
    }),
    defineField({
      name: "pendingRequests",
      type: "array",
      title: "Pending Join Requests",
      of: [{ type: "reference", to: [{ type: "author" }] }],
    }),
  ],
});
