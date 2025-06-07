// This tells Next.js not to pre-render — required when using `auth()` or other dynamic data
export const dynamic = "force-dynamic";

import { auth } from "@/auth";
import { client } from "@/sanity/lib/client";
import { AUTHOR_BY_ID_QUERY } from "@/sanity/lib/queries";
import { notFound } from "next/navigation";
import Image from "next/image";
import UserStartups from "@/components/UserStartups";
import { Suspense } from "react";
import { StartupCardSkeleton } from "@/components/StartupCard";
import FollowSection from "@/components/FolloButton";

const Page = async ({ params }: { params: { id: string } }) => {
  const { id } = params;

  // Get current session (user info from NextAuth)
  const session = await auth();

  // Fetch user details from Sanity
  const user = await client.fetch(AUTHOR_BY_ID_QUERY, { id });

  if (!user) return notFound();

  return (
    <section className="profile_container">
      {/* User Profile Section */}
      <div className="profile_card">
        <div className="profile_title">
          <h3 className="text-24-black uppercase text-center line-clamp-1">
            {user.name}
          </h3>
        </div>

        {/* User Image */}
        {user.image && (
          <Image
            src={user.image}
            alt={user.name}
            width={220}
            height={220}
            className="profile_image"
          />
        )}

        <p className="text-30-extrabold mt-7 text-center">@{user.username}</p>
        <p className="mt-1 text-center text-14-normal">{user.bio}</p>
        <FollowSection
  targetUserId={user._id}
  currentUserId={session?.user?.id}
/>



      </div>

      {/* User's Startups Section */}
      <div className="flex-1 flex flex-col gap-5 lg:-mt-5">
        <p className="text-30-bold">
          {session?.user?.id === id ? "Your" : "All"} Projects
        </p>
        <ul className="card_grid-sm">
          <Suspense fallback={<StartupCardSkeleton />}>
            <UserStartups id={id} />
          </Suspense>
        </ul>
      </div>
    </section>
  );
};

export default Page;
