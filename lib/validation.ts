import { z } from "zod";

export const formSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().min(20).max(500),
  category: z.string().min(3).max(20),
  image: z.preprocess(
    (val) => (val === null ? "" : val), // normalize null to empty string
    z
      .string()
      .optional()
      .refine((url) => {
        // If empty string, skip validation
        if (!url || url.trim() === "") return true;
        // Basic image extension check
        return /\.(jpeg|jpg|gif|png|webp|svg)$/.test(url);
      }, {
        message: "Must be a valid image URL or leave blank",
      })
  ),
  


  pitch: z.string().min(10).max(5000),

  helpNeeded: z.string().min(5).max(300), // ✅ new

  projectLink: z
    .string()
    .url()
    .optional(), // ✅ new
});
