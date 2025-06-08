"use client";

import { cn, formatDate } from "@/lib/utils";
import { EyeIcon, ExternalLink, GitBranch } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Author, Startup } from "@/sanity/types";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export type StartupTypeCard = Omit<Startup, "author"> & {
  author?: Author;
};

const StartupCard = ({ post }: { post: StartupTypeCard }) => {
  const {
    _createdAt,
    author,
    title,
    category,
    _id,
    image,
    description,
    helpNeeded,
    projectLink,
    pitch,
    likes = [],
    views,
  } = post;

  const { data: session } = useSession();
  const userId = session?.user?.id || "guest";

  const [likeCount, setLikeCount] = useState(likes?.length ?? 0);
  const [liking, setLiking] = useState(false);
  const [alreadyLiked, setAlreadyLiked] = useState(false);

  useEffect(() => {
    if (userId && Array.isArray(likes) && likes.includes(userId)) {
      setAlreadyLiked(true);
    }
  }, [userId, likes]);
  

  const handleLike = async () => {
    if (!userId || userId === "guest") return alert("Please log in to like.");
    if (alreadyLiked) return alert("You already liked this post.");

    try {
      setLiking(true);
      const res = await fetch(`/api/startup/${_id}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      const data = await res.json();
      if (data.success) {
        setLikeCount(data.likes);
        setAlreadyLiked(true);
      } else {
        alert(data.message || "Already liked!");
      }
    } catch (err) {
      console.error("Error liking post:", err);
    } finally {
      setLiking(false);
    }
  };

  return (
    <li className="startup-card group">
      <div className="flex-between">
        <p className="startup_card_date">{formatDate(_createdAt)}</p>
        <div className="flex gap-1.5 items-center">
          <EyeIcon className="size-5 text-primary" />
          <span className="text-sm text-muted-foreground">{views ?? 0}</span>
        </div>
      </div>

      <div className="flex-between mt-4 gap-5">
        <div className="flex-1">
          {author?._id && (
            <Link href={`/user/${author._id}`}>
              <p className="text-16-medium line-clamp-1">{author.name}</p>
            </Link>
          )}
          <Link href={`/startup/${_id}`}>
            <h3 className="text-22-semibold line-clamp-1">{title}</h3>
          </Link>
        </div>
        {author?.image && (
          <Link href={`/user/${author._id}`}>
            <Image
              src={author.image}
              alt={author.name || "User"}
              width={42}
              height={42}
              className="rounded-full object-cover"
            />
          </Link>
        )}
      </div>

      <Link href={`/startup/${_id}`}>
        <p className="startup-card_desc line-clamp-3 mt-3">{description}</p>
        {image && (
          <img
            src={image}
            alt={`${title} cover`}
            className="startup-card_img mt-3"
          />
        )}
      </Link>

      {pitch && (
        <p className="mt-3 text-14-regular text-muted-foreground line-clamp-2">
          💡 <span className="font-medium">Project:</span> {pitch}
        </p>
      )}

      {helpNeeded && (
        <p className="mt-2 text-14-medium text-pink-600">
          🤝 <span className="font-medium">Team Needed:</span> {helpNeeded}
        </p>
      )}

      {projectLink && (
        <div className="mt-2">
          <a
            href={projectLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-14-medium text-blue-600 underline"
          >
            <GitBranch className="size-4" />
            View Resource
            <ExternalLink className="size-4 ml-1" />
          </a>
        </div>
      )}

      <div className="mt-4 flex items-center gap-3">
        <button
          onClick={handleLike}
          disabled={liking || alreadyLiked}
          className={cn(
            "flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium",
            alreadyLiked
              ? "bg-green-100 text-green-600 cursor-not-allowed"
              : liking
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : "bg-pink-100 text-pink-600 hover:bg-pink-200"
          )}
        >
          ❤️ {alreadyLiked ? "Liked" : liking ? "Liking..." : "Like"}
        </button>
        <span className="text-sm text-muted-foreground">{likeCount} Likes</span>
      </div>

      <div className="flex-between gap-3 mt-5">
        <Link href={`/?query=${category?.toLowerCase()}`}>
          <p className="text-14-medium text-muted-foreground capitalize">
            {category}
          </p>
        </Link>
        <Button className="startup-card_btn" asChild>
          <Link href={`/startup/${_id}`}>View Project</Link>
        </Button>
      </div>
    </li>
  );
};

export const StartupCardSkeleton = () => (
  <>
    {[0, 1, 2, 3].map((index) => (
      <li key={`skeleton-${index}`}>
        <Skeleton className="startup-card_skeleton" />
      </li>
    ))}
  </>
);

export default StartupCard;
