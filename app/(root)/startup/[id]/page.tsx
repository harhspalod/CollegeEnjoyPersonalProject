import { Suspense } from "react";
import { client } from "@/sanity/lib/client";
import {
  PLAYLIST_BY_SLUG_QUERY,
  STARTUP_BY_ID_QUERY,
} from "@/sanity/lib/queries";
import { notFound } from "next/navigation";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import markdownit from "markdown-it";
import { Skeleton } from "@/components/ui/skeleton";
import View from "@/components/View";
import StartupCard, { StartupTypeCard } from "@/components/StartupCard";
import CommentSection from "@/components/CommentSection";

const md = markdownit();

export const experimental_ppr = true;

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const id = (await params).id;

  const [post, playlist] = await Promise.all([
    client.fetch(STARTUP_BY_ID_QUERY, { id }),
    client.fetch(PLAYLIST_BY_SLUG_QUERY, { slug: "editor-picks-new" }),
  ]);

  const editorPosts = playlist?.select || [];

  if (!post) return notFound();

  const parsedContent = md.render(post?.pitch || "");

  return (
    <>
      <section className="pink_container !min-h-[230px]">
        <p className="tag">{formatDate(post?._createdAt)}</p>

        <h1 className="heading">{post.title}</h1>
        <p className="sub-heading !max-w-5xl">{post.description}</p>
      </section>

      <section className="section_container">
        <img
          src={post.image}
          alt="thumbnail"
          className="w-full h-auto rounded-xl"
        />

        <div className="space-y-5 mt-10 max-w-4xl mx-auto">
          <div className="flex-between gap-5">
            <Link
              href={`/user/${post.author?._id}`}
              className="flex gap-2 items-center mb-3"
            >
              <Image
                src={post.author.image}
                alt="avatar"
                width={64}
                height={64}
                className="rounded-full drop-shadow-lg"
              />

              <div>
                <p className="text-20-medium">{post.author.name}</p>
                <p className="text-16-medium !text-black-300">
                  @{post.author.username}
                </p>
              </div>
            </Link>

            <div className="flex items-center gap-4">
              <p className="category-tag">{post.category}</p>
              <form
                action={`/api/startup/${post._id}/like`}
                method="POST"
                className="inline"
              >
                <button
                  type="submit"
                  className="text-sm px-3 py-1 rounded-full bg-pink-100 text-pink-600 hover:bg-pink-200"
                >
                  ❤️ {post.likes?.length || 0}
                </button>
              </form>
            </div>
          </div>

          <h3 className="text-30-bold">Project Details</h3>
          {parsedContent ? (
            <article
              className="prose max-w-4xl font-work-sans break-all"
              dangerouslySetInnerHTML={{ __html: parsedContent }}
            />
          ) : (
            <p className="no-result">No details provided</p>
          )}

          {post.helpNeeded && (
            <div>
              <h3 className="text-24-semibold mt-8">Team Help Needed</h3>
              <p className="text-16-regular mt-2 whitespace-pre-line">
                {post.helpNeeded}
              </p>
            </div>
          )}

          {post.projectLink && (
            <div>
              <h3 className="text-24-semibold mt-8">Project Resource Link</h3>
              <a
                href={post.projectLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline text-sm mt-1 block"
              >
                {post.projectLink}
              </a>
            </div>
          )}
        </div>

        <hr className="divider" />

        <CommentSection startupId={post._id} initialComments={post.comments || []} />

        {editorPosts?.length > 0 && (
          <div className="max-w-4xl mx-auto">
            <p className="text-30-semibold">Editor's Featured Projects</p>
            <ul className="mt-7 card_grid-sm">
              {editorPosts.map((post: StartupTypeCard, i: number) => (
                <StartupCard key={i} post={post} />
              ))}
            </ul>
          </div>
        )}

        <Suspense fallback={<Skeleton className="view_skeleton" />}>
          <View id={id} />
        </Suspense>
      </section>
    </>
  );
};

export default Page;
