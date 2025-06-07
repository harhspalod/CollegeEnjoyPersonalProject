"use client";

import React, { useState, useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

// Define schema just for confession
const confessionSchema = z.object({
  to: z.string().min(1, "Recipient is required"),
  from: z.string().optional(),
  message: z.string().min(5, "Message must be at least 5 characters"),
});

// Simulated server action (replace with actual Sanity call)
async function createConfession(_: any, formData: FormData) {
  const to = formData.get("to") as string;
  const from = formData.get("from") as string;
  const message = formData.get("message") as string;

  // Here you would write to Sanity
  const res = await fetch("/api/confess", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ to, from, message }),
  });

  const data = await res.json();
  if (!data.success) throw new Error("Failed to submit confession");

  return { status: "SUCCESS", _id: data._id };
}

const ConfessionForm = () => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = async (prevState: any, formData: FormData) => {
    try {
      const values = {
        to: formData.get("to") as string,
        from: formData.get("from") as string,
        message: formData.get("message") as string,
      };

      await confessionSchema.parseAsync(values);

      const result = await createConfession(prevState, formData);

      if (result.status === "SUCCESS") {
        toast({
          title: "Success",
          description: "Confession submitted!",
        });

        router.push(`/confession`);
      }

      return result;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = error.flatten().fieldErrors;
        const formattedErrors: Record<string, string> = {};
        for (const key in fieldErrors) {
          const msgs = fieldErrors[key];
          if (msgs?.length) formattedErrors[key] = msgs[0];
        }
        setErrors(formattedErrors);

        toast({
          title: "Validation Error",
          description: "Please check your inputs",
          variant: "destructive",
        });

        return { ...prevState, status: "ERROR" };
      }

      toast({
        title: "Error",
        description: "Something went wrong. Try again later.",
        variant: "destructive",
      });

      return { ...prevState, status: "ERROR" };
    }
  };

  const [state, formAction, isPending] = useActionState(handleSubmit, {
    status: "INITIAL",
  });

  return (
    <form action={formAction} className="startup-form max-w-xl mx-auto space-y-6">
      <div>
        <label htmlFor="to" className="startup-form_label">To (Name or Handle)</label>
        <Input id="to" name="to" placeholder="e.g. @john" required />
        {errors.to && <p className="startup-form_error">{errors.to}</p>}
      </div>

      <div>
        <label htmlFor="from" className="startup-form_label">From (Optional)</label>
        <Input id="from" name="from" placeholder="Leave blank to stay anonymous" />
        {errors.from && <p className="startup-form_error">{errors.from}</p>}
      </div>

      <div>
        <label htmlFor="message" className="startup-form_label">Message</label>
        <Textarea
          id="message"
          name="message"
          placeholder="Write your confession here..."
          required
          rows={6}
        />
        {errors.message && <p className="startup-form_error">{errors.message}</p>}
      </div>

      <Button type="submit" className="startup-form_btn text-white" disabled={isPending}>
        {isPending ? "Submitting..." : "Send Confession"}
        <Send className="size-5 ml-2" />
      </Button>
    </form>
  );
};

export default ConfessionForm;
