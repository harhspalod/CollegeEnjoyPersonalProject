"use client";

import React from "react";

interface JoinGroupButtonProps {
  startupId: string;
  userId: string;
  teamMembers: string[];
  joinRequests: string[];
  isOwner: boolean;
}

const JoinGroupButton: React.FC<JoinGroupButtonProps> = ({
  startupId,
  userId,
  teamMembers,
  joinRequests,
  isOwner,
}) => {
  const isMember = teamMembers.includes(userId);
  const hasRequested = joinRequests.includes(userId);

  // ✅ If owner, show approval requests UI
  if (isOwner) {
    if (joinRequests.length === 0) return null;

    return (
      <div className="space-y-3">
        <h3 className="text-xl font-semibold">Join Requests</h3>
        {joinRequests.map((requestUserId) => (
          <div key={requestUserId} className="flex items-center gap-4">
            <p className="text-sm">{requestUserId}</p>
            <button
              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
              onClick={async () => {
                const res = await fetch(`/api/startup/${startupId}/approve`, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ userId: requestUserId }),
                });

                if (res.ok) {
                  window.location.reload();
                } else {
                  const err = await res.json();
                  alert("Approval failed: " + (err?.message || "Unknown error"));
                }
              }}
            >
              Approve
            </button>
          </div>
        ))}
      </div>
    );
  }

  // ✅ If user is not a member and hasn't requested
  if (!isMember && !hasRequested) {
    return (
      <form
        onSubmit={async (e) => {
          e.preventDefault();

          const res = await fetch(`/api/startup/${startupId}/join`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId }),
          });

          if (res.ok) {
            window.location.reload(); // refresh UI
          } else {
            const data = await res.json();
            alert("Error: " + (data?.error || "Join failed"));
          }
        }}
      >
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
        >
          Request to Join Team
        </button>
      </form>
    );
  }

  if (hasRequested) {
    return <p className="text-yellow-600 text-sm">Request Sent. Awaiting Approval.</p>;
  }

  if (isMember) {
    return <p className="text-green-600 text-sm">✅ You are a team member.</p>;
  }

  return null;
};

export default JoinGroupButton;
