import { SearchCard } from "@/lib/type";
import Link from "next/link";
import React from "react";

const SearchPageCard = ({ data }: { data: SearchCard[] }) => {
  return (
    <div>
      {data.map((data) => (
        <div key={data.id} className="sm:flex sm:gap-4 sm:mb-4">
          <div className="sm:w-[60%]">
            <Link href={`/watch/${data.id}`}>
              <img
                src={`${data.thumbnail}`}
                className="aspect-video w-full"
                alt="サムネイル"
              />
            </Link>
          </div>
          <div className="w-full">
            <div>
              <h2>{data.title}</h2>

              <div className="flex">
                <div>
                  <img src="" alt="画像" />
                </div>
                <p>チャンネル名</p>
              </div>
              {data.watchers !== null && (
                <p className="text-red-500 font-bold">
                  {data.watchers}人視聴中
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SearchPageCard;
