"use client";
import { isActiveSidebarAtom, selectedTabButton } from "@/lib/atoms";
import prisma from "@/lib/prisma";
import { useAtom } from "jotai";
import React, { useEffect, useState } from "react";

const buttons = [
  "全て",
  "ライブ",
  "スポーツ",
  "ゲーム",
  "音楽",
  "vtuber",
  "芸能",
  "アイドル",
  "ドキュメンタリー",
  "ペット",
  "恋愛",
  "教育",
];

const Tabcomponent = () => {
  const [selectedIndex, setSelectedIndex] = useAtom(selectedTabButton);
  const [isActiveSidebar, setIsActiveSidebar] = useAtom(isActiveSidebarAtom);
  const [tabList, setTabList] = useState([]);

  // モバイルのサイドメニューの開閉
  const handleSideMenu = () => {
    setIsActiveSidebar((prev) => !prev);
  };

  // タブコンポーネントの最初に選択されているボタンを指定
  useEffect(() => {
    const getTabList = async () => {
      try {
        const res = await fetch("/api/tab");
        const data = await res.json();
        setTabList(data);
      } catch (error) {
        console.error("Error fetching tab list:", error);
      }
    };
    getTabList();
    setSelectedIndex(0); // 0に設定して初期値を(全て)タブにする。
  }, []); // マウント時に実行

  // モバイルサイドバーがアクティブの場合と非表示の時の操作
  useEffect(() => {
    const footer = document.querySelector("#footer");
    const sidebar = document.querySelector("#side-target");
    const body = document.querySelector("body");

    if (isActiveSidebar == true) {
      footer?.classList.add("invisible");
      sidebar?.classList.remove("translate-x-[-100%]");
      body?.classList.add("overflow-hidden");
    } else {
      footer?.classList.remove("invisible");
      sidebar?.classList.add("translate-x-[-100%]");
      body?.classList.remove("overflow-hidden");
    }
  }, [isActiveSidebar]);

  return (
    <div>
      <div className="flex gap-4 overflow-x-auto">
        <button className="sm:hidden flex-shrink-0" onClick={handleSideMenu}>
          ボタン
        </button>
        {buttons.map((btn, index) => (
          <div key={index} className="flex-shrink-0">
            <button
              onClick={() => {
                setSelectedIndex(index);
              }}
              className={`bg-gray-200 px-2  text-black font-[500] flex-shrink-0 rounded-[1rem]  ${
                selectedIndex === index
                  ? "hover:opacity-100 bg-red-400 "
                  : "hover:opacity-70"
              }`}
              disabled={selectedIndex == index ? true : false}
            >
              {btn}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tabcomponent;
