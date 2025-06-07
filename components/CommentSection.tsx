"use client";

import { useState } from "react";
import { useSession } from "next-auth/react"; // ✅


const CommentSection = ({
  startupId,
  initialComments = [],
}: {
  startupId: string;
  initialComments?: any[];
}) => {
  const { data: session } = useSession(); // ✅

  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState(initialComments);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setSubmitting(true);

    const res = await fetch(`/api/startup/${startupId}/comment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: "guest", 
          username: session?.user?.name ?? "Guest", // ✅ Add this
          // Replace with session ID if available
          text: commentText,
        }),
      });
      
      // ✅ Check content before parsing JSON
      let data = null;
      try {
        data = await res.json();
      } catch (err) {
        console.error("Empty or invalid JSON response:", err);
        alert("Something went wrong while posting your comment.");
        setSubmitting(false);
        return;
      }
      
      if (data.success) {
        setComments(data.comments);
        setCommentText("");
      } else {
        alert("Failed to post comment");
      }
      
      setSubmitting(false);
    }
      

  return (
    <div className="mt-10 bg-white p-6 rounded-xl shadow-sm border max-w-2xl mx-auto">
      <h3 className="text-2xl font-semibold flex items-center gap-2 text-gray-800">
        💬 Leave a Comment
      </h3>

      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <textarea
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          rows={4}
          placeholder="Type your thoughts here..."
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none text-sm"
          required
        />

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition"
        >
          {submitting ? "Posting..." : "💬 Post Comment"}
        </button>
      </form>

      {comments.length > 0 && (
        <ul className="mt-6 space-y-2 text-sm text-gray-700">
          {comments.map((c: any) => (
            <li key={c._key} className="border-t pt-2">
              <b className="text-gray-900">{c.username || c.userId}:</b> {c.text}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CommentSection;
