"use client";
import React, { useEffect, useState } from "react";
import Card from "../Card";
import Tabcomponent from "../Tab";
import { Cardtype } from "@/lib/type";
import Footer from "../Footer";
import { useAtom } from "jotai";
import { selectedTabButton } from "@/lib/atoms";

const Toppage = ({ data }: { data: Cardtype[] }) => {
  const [selectedIndex, setSelectedIndex] = useAtom(selectedTabButton);
  const [liveStreamingData, setLiveStreamingData] = useState<Cardtype[]>([]);

  // ライブ配信のデータを取得
  useEffect(() => {
    if (selectedIndex === 1) {
      const getLiveStreaming = async () => {
        try {
          const res = await fetch("/api/liveStreaming");
          const data = await res.json();
          setLiveStreamingData(data);
        } catch (error) {
          console.error(error);
        }
      };
      getLiveStreaming();
    }
  }, [selectedIndex]);

  return (
    <div className="pb-[4rem] sm:pb-0">
      <div className="p-4 bg-white w-full sticky top-0 z-10">
        <Tabcomponent />
      </div>
      <div className="sm:grid sm:grid-cols-3 sm:gap-8">
        {selectedIndex !== 1 &&
          data.map((data, index) => (
            <div key={index} className="mb-[1rem] sm:mb-0">
              <Card
                id={data.id}
                title={data.title ?? ""}
                channel={data.channel ?? ""}
                watchers={data.watchers ?? null}
                thumbnail={data.thumbnail ?? ""}
                user_photo={data.user_photo ?? ""}
              />
            </div>
          ))}
        {selectedIndex == 1 &&
          liveStreamingData.map((data, index) => (
            <div key={index} className="mb-[1rem] sm:mb-0">
              <Card
                id={data.id}
                title={data.title ?? ""}
                channel={data.channel ?? ""}
                watchers={data.watchers ?? null}
                thumbnail={data.thumbnail ?? ""}
                user_photo={data.user_photo ?? ""}
              />
            </div>
          ))}
      </div>
      <Footer />
    </div>
  );
};

export default Toppage;
