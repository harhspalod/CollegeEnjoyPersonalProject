"use client";

import { useState, useEffect } from "react";

const FollowSection = ({
  targetUserId,
  currentUserId,
}: {
  targetUserId: string;
  currentUserId: string;
}) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFollowData = async () => {
      try {
        const res = await fetch(`/api/user/${targetUserId}/is-following?userId=${currentUserId}`);
        const data = await res.json();

        // ✅ Always show follower count
        setFollowerCount(data.followerCount || 0);

        // ✅ Only update follow state if viewing another user
        if (currentUserId && currentUserId !== targetUserId) {
          setIsFollowing(data.following || false);
        }
      } catch (err) {
        console.error("Failed to fetch follow state", err);
      }
    };

    fetchFollowData();
  }, [currentUserId, targetUserId]);

  const handleToggleFollow = async () => {
    setLoading(true);
    const endpoint = isFollowing ? "unfollow" : "follow";

    const res = await fetch(`/api/user/${targetUserId}/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: currentUserId }),
    });

    const data = await res.json();

    if (data.success) {
      if (endpoint === "follow") {
        setIsFollowing(true);
        setFollowerCount((prev) => prev + 1);
      } else {
        setIsFollowing(false);
        setFollowerCount((prev) => Math.max(prev - 1, 0));
      }
    } else {
      alert(data.message || "Something went wrong");
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center gap-2">
      {/* ✅ Always show follower count */}
      <span className="text-sm text-gray-600">
        {followerCount} follower{followerCount !== 1 ? "s" : ""}
      </span>

      {/* ✅ Only show follow button if viewing someone else */}
      {currentUserId && currentUserId !== targetUserId && (
        <button
          onClick={handleToggleFollow}
          disabled={loading}
          className={`px-4 py-2 rounded text-white text-sm ${
            isFollowing ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading
            ? isFollowing
              ? "Unfollowing..."
              : "Following..."
            : isFollowing
            ? "Following"
            : "Follow"}
        </button>
      )}
    </div>
  );
};

export default FollowSection;
