import React from "react";
import SearchPageCard from "../SearchPageCard";
import Tabcomponent from "../Tab";
import { Cardtype } from "@/lib/type";

const Searchpage = ({ searchData }: { searchData: Cardtype[] }) => {
  const propsData = searchData.map((data) => ({
    id: Number(data.id),
    title: data.title,
    watchers: data.watchers,
    channel: data.channel,
    thumbnail: data.thumbnail,
  }));
  return (
    <div>
      <SearchPageCard data={propsData} />
    </div>
  );
};

export default Searchpage;
