import { cn, formatDate } from "@/lib/utils";
import { EyeIcon, ExternalLink, GitBranch } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Author, Startup } from "@/sanity/types";
import { Skeleton } from "@/components/ui/skeleton";

export type StartupTypeCard = Omit<Startup, "author"> & {
  author?: Author;
};

const StartupCard = ({ post }: { post: StartupTypeCard }) => {
  const {
    _createdAt,
    views,
    author,
    title,
    category,
    _id,
    image,
    description,
    helpNeeded,       // 👈 add this
    projectLink,      // 👈 add this
    pitch             // optional
  } = post;
  

  return (
    <li className="startup-card group">
      {/* Top metadata */}
      <div className="flex-between">
        <p className="startup_card_date">{formatDate(_createdAt)}</p>
        <div className="flex gap-1.5 items-center">
          <EyeIcon className="size-5 text-primary" />
          <span className="text-14-medium">{views}</span>
        </div>
      </div>

      {/* Author + Title */}
      <div className="flex-between mt-4 gap-5">
        <div className="flex-1">
          {author && (
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

      {/* Description */}
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

      {/* Pitch Preview */}
      {pitch && (
        <p className="mt-3 text-14-regular text-muted-foreground line-clamp-2">
          💡 <span className="font-medium">Pitch:</span> {pitch}
        </p>
      )}

      {/* Help Needed */}
      {helpNeeded && (
        <p className="mt-2 text-14-medium text-pink-600">
          🤝 <span className="font-medium">Help Needed:</span> {helpNeeded}
        </p>
      )}

      {/* Project Link */}
      {projectLink && (
        <div className="mt-2">
          <a
            href={projectLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-14-medium text-blue-600 underline"
          >
            <GitBranch className="size-4" />
            View Project
            <ExternalLink className="size-4 ml-1" />
          </a>
        </div>
      )}

      {/* Footer */}
      <div className="flex-between gap-3 mt-5">
        <Link href={`/?query=${category?.toLowerCase()}`}>
          <p className="text-14-medium text-muted-foreground capitalize">
            {category}
          </p>
        </Link>
        <Button className="startup-card_btn" asChild>
          <Link href={`/startup/${_id}`}>Details</Link>
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
