import { auth } from "@/auth";
import ConfessionForm from "@/components/confessionForm";
import { redirect } from "next/navigation";

const Page = async () => {
  const session = await auth();

  if (!session) redirect("/");

  return (
    <>
      <section className="pink_container !min-h-[230px]">
        <h1 className="heading">Submit Your Confession</h1>
      </section>

      <ConfessionForm />
    </>
  );
};

export default Page;
