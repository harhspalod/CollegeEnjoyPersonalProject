"use client";

import { useState, useEffect } from "react";
import { client } from "@/sanity/lib/client";
import { formatDate } from "@/lib/utils";
import Link from "next/link";

const CONFESSIONS_QUERY = `
  *[_type == "confession"] | order(timestamp desc){
    _id, to, from, message, timestamp
  }
`;

const ConfessionListPage = () => {
  const [confessions, setConfessions] = useState([]);

  useEffect(() => {
    const fetchConfessions = async () => {
      const data = await client.fetch(CONFESSIONS_QUERY);
      setConfessions(data);
    };

    fetchConfessions();
  }, []);

  return (
    <main className="max-w-6xl mx-auto py-12 px-6">
      <h1 className="text-4xl font-bold text-center mb-10">💌 All Confessions</h1>
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {confessions.map((c: any) => (
          <li
            key={c._id}
            className="bg-white border rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300"
          >
            <Link href={`/confession/${c._id}`} className="block space-y-2">
              <p className="text-xs text-gray-400">{formatDate(c.timestamp)}</p>
              <h2 className="text-lg font-semibold text-pink-600 line-clamp-1">To: {c.to}</h2>
              <h2 className="text-md font-medium text-gray-700 line-clamp-1">From: {c.from}</h2>
              <p className="text-gray-800 mt-2 line-clamp-4">{c.message}</p>
              <p className="text-right mt-3 text-sm italic text-gray-500">
                — {c.from || "Anonymous"}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
};

export default ConfessionListPage;
