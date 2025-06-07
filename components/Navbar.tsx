export const dynamic = "force-dynamic";

import Link from "next/link";
import Image from "next/image";
import { auth, signOut, signIn } from "@/auth";
import { BadgePlus, LogOut, Heart } from "lucide-react"; // 💌 import icon
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Navbar = async () => {
  const session = await auth();

  return (
    <header className="px-5 py-3 bg-white shadow-sm font-work-sans">
      <nav className="flex justify-between items-center relative">
        <Link href="/">
          <Image src="/logo.png" alt="logo" width={100} height={10} />
        </Link>
        <div className="absolute left-1/2 transform -translate-x-1/2 font-bold text-lg text-pink-500 hidden sm:block">
  <Link href="/" className="hover:text-pink-500">
    Rnsit Student Place
  </Link>
</div>


        <div className="flex items-center gap-5 text-black">
          {session?.user ? (
            <>
              {/* Start a Startup */}
              <Link href="/startup/create" className="hover:text-pink-500">
  <span className="max-sm:hidden">Create</span>
  <BadgePlus className="size-6 sm:hidden" />
</Link>

<Link href="/confession" className="hover:text-pink-500">
  <span className="max-sm:hidden">Confession</span>
  <Heart className="size-6 sm:hidden text-pink-500" />
</Link>

<Link href="/confession/create" className="hover:text-pink-500">
  <span className="max-sm:hidden">Confess</span>
  <Heart className="size-6 sm:hidden text-pink-500" />
</Link>

<form
  action={async () => {
    "use server";
    await signOut({ redirectTo: "/" });
  }}
>
  <button type="submit" className="hover:text-pink-500">
    <span className="max-sm:hidden">Logout</span>
    <LogOut className="size-6 sm:hidden text-red-500" />
  </button>
</form>

<Link href={`/user/${session.user.id}`} className="hover:text-pink-500">
  <Avatar className="size-10">
    <AvatarImage
      src={session.user.image || ""}
      alt={session.user.name || ""}
    />
    <AvatarFallback>
      {session.user.name?.[0]?.toUpperCase() || "U"}
    </AvatarFallback>
  </Avatar>
</Link>

            </>
          ) : (
            <form
              action={async () => {
                "use server";
                await signIn("github");
              }}
            >
              <button type="submit">Login</button>
            </form>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
