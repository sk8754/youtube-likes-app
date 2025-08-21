import Searchpage from "@/components/view/Searchpage";
import prisma from "@/lib/prisma";
import React from "react";

const Page = async ({
  searchParams,
}: {
  searchParams: { keyword: string };
}) => {
  const normalData = await prisma.videocard.findMany({
    where: {
      title: {
        contains: searchParams.keyword,
        mode: "insensitive",
      },
    },
  });

  const liveStreamingData = await prisma.livestreaming.findMany({
    where: {
      title: {
        contains: searchParams.keyword,
        mode: "insensitive",
      },
    },
  });

  const normalDataWithNumber = normalData.map((item) => ({
    ...item,
    id: Number(item.id),
    watchers: Number(item.watchers) || null,
  }));

  const liveStreamingDataWithDefaults = liveStreamingData.map((item) => ({
    ...item,
    id: Number(item.id),
    watchers: Number(item.watchers) || null,
    thumbnail: null,
    user_photo: null,
    channel: null,
    genre: null,
  }));

  const searchData = [
    ...normalDataWithNumber,
    ...liveStreamingDataWithDefaults,
  ];

  console.log(searchData);

  return (
    <div>
      <Searchpage searchData={searchData} />
    </div>
  );
};

export default Page;
