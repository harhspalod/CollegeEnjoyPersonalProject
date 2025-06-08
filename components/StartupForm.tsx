"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import MDEditor from "@uiw/react-md-editor";
import { Button } from "@/components/ui/button";
import { formSchema } from "@/lib/validation";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { createPitch } from "@/lib/actions";
import { useSession } from "next-auth/react";

// Utility types
type ErrorMap = Record<string, string>;

const StartupForm = () => {
  const [errors, setErrors] = useState<ErrorMap>({});
  const [pitch, setPitch] = useState("");
  const { toast } = useToast();
  const router = useRouter();
  const { data: session, status } = useSession();

  if (status === "loading") return <p>Loading...</p>;
  if (!session?.user?.id) return <p className="text-red-500">Please sign in to submit your startup.</p>;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.append("pitch", pitch);

    const formValues = {
      title: formData.get("title")?.toString() || "",
      description: formData.get("description")?.toString() || "",
      category: formData.get("category")?.toString() || "",
      image: formData.get("image")?.toString() || "",
      helpNeeded: formData.get("helpNeeded")?.toString() || "",
      projectLink: formData.get("projectLink")?.toString() || "",
      pitch,
    };

    try {
      await formSchema.parseAsync(formValues);
      const result = await createPitch({}, formData);

      if (result.status === "SUCCESS") {
        toast({ title: "Success", description: "Startup submitted successfully!" });
        router.push(`/startup/${result._id}`);
      } else {
        toast({ title: "Error", description: result.error, variant: "destructive" });
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        const formatted: ErrorMap = {};
        const fieldErrors = err.flatten().fieldErrors;
        Object.entries(fieldErrors).forEach(([key, msgs]) => {
          if (msgs?.[0]) formatted[key] = msgs[0];
        });
        setErrors(formatted);
        toast({ title: "Validation Failed", description: "Please check your inputs.", variant: "destructive" });
      } else {
        toast({ title: "Unexpected Error", description: "Something went wrong.", variant: "destructive" });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="startup-form space-y-5">
      <InputField label="Title" name="title" errors={errors} />
      <TextareaField label="Description" name="description" errors={errors} />
      <InputField label="Category" name="category" errors={errors} />
      <InputField label="Image URL" name="image" errors={errors} />
      <MDEditorField pitch={pitch} setPitch={setPitch} error={errors.pitch} />
      <TextareaField label="Help Needed" name="helpNeeded" errors={errors} />
      <InputField label="Project Link" name="projectLink" errors={errors} />

      <Button type="submit" className="startup-form_btn text-white">
        Submit Your Pitch
      </Button>
    </form>
  );
};

interface FieldProps {
  label: string;
  name: string;
  errors: Record<string, string>;
}

const InputField: React.FC<FieldProps> = ({ label, name, errors }) => (
  <div>
    <label htmlFor={name} className="startup-form_label">{label}</label>
    <Input id={name} name={name} className="startup-form_input" required />
    {errors[name] && <p className="startup-form_error">{errors[name]}</p>}
  </div>
);

const TextareaField: React.FC<FieldProps> = ({ label, name, errors }) => (
  <div>
    <label htmlFor={name} className="startup-form_label">{label}</label>
    <Textarea id={name} name={name} className="startup-form_textarea" required />
    {errors[name] && <p className="startup-form_error">{errors[name]}</p>}
  </div>
);

interface MDEditorProps {
  pitch: string;
  setPitch: (val: string) => void;
  error?: string;
}

const MDEditorField: React.FC<MDEditorProps> = ({ pitch, setPitch, error }) => (
  <div data-color-mode="light">
    <label htmlFor="pitch" className="startup-form_label">Pitch</label>
    <MDEditor
      value={pitch}
      onChange={(val) => setPitch(val || "")}
      preview="edit"
      height={300}
      textareaProps={{ placeholder: "Briefly describe your idea..." }}
      previewOptions={{ disallowedElements: ["style"] }}
    />
    {error && <p className="startup-form_error">{error}</p>}
  </div>
);

export default StartupForm;
