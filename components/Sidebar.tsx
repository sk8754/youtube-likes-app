"use client";
import { Button } from "@/components/ui/button";
import { isActiveSidebarAtom } from "@/lib/atoms";
import dummy from "@/public/imgs/dummy100x100.png";
import { useAtom } from "jotai";
import {
  Home,
  Compass,
  Clock,
  ThumbsUp,
  PlaySquare,
  Flame,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Sidebar() {
  const [isRendering, setIsRendering] = useState(true);
  const [isActiveSidebar, setIsActiveSidebar] = useAtom(isActiveSidebarAtom);

  const router = useRouter();
  const path = usePathname();

  // /watchページ配下ではサイドバーを非表示にする。
  useEffect(() => {
    if (path.includes("/watch")) {
      setIsRendering(false);
    } else {
      setIsRendering(true);
    }
  }, [path]);

  // 登録チャンネルのダミーデータ（本番環境ではユーザーごとにデータを取得する）
  const subscribeChannel = [
    { name: "テスト" },
    { name: "テスト" },
    { name: "テスト" },
    { name: "テスト" },
    { name: "テスト" },
    { name: "テスト" },
    { name: "テスト" },
    { name: "テスト" },
    { name: "テスト" },
    { name: "テスト" },
    { name: "テスト" },
    { name: "テスト" },
    { name: "テスト" },
  ];
  return (
    // isRenderingがtrueなら表示、falseなら非表示
    <div id="pc-sidebar" className={isRendering ? "" : "hidden"}>
      {/* PC、タブレット用のサイドバー */}
      <aside className="overflow-y-scroll lg:w-64 bg-background border-r h-[calc(100vh-3.5rem)] sticky top-14 z-50 sm:opacity-100 hidden sm:block">
        <nav className="space-y-2 p-4">
          <div className="border-b-2 border-slate-200 pb-2">
            <Button variant="ghost" className="w-full justify-start">
              <Home className="mr-2 h-4 w-4" />
              <Link href="/"> ホーム</Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Compass className="mr-2 h-4 w-4" />
              探索
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Clock className="mr-2 h-4 w-4" />
              履歴
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <ThumbsUp className="mr-2 h-4 w-4" />
              高く評価した動画
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <PlaySquare className="mr-2 h-4 w-4" />
              自分の動画
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Flame className="mr-2 h-4 w-4" />
              急上昇
            </Button>
          </div>

          {/* 登録チャンネル */}
          <div>
            <h2 className="pl-[1rem] text-[1rem] font-[500] mb-[0.5rem]">
              登録チャンネル
            </h2>
            {subscribeChannel.map((data, index) => (
              <div key={index} className="flex mb-[0.5rem]">
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => router.push("/")}
                >
                  <Image src={dummy} alt="画像" className="h-4 w-4" />
                  <p>{data.name}</p>
                </Button>
              </div>
            ))}
          </div>
        </nav>
      </aside>

      {/* 以下モバイル用コンポーネント */}

      {/* モバイル用のサイドバー */}
      <div
        id="side-target"
        className="sm:hidden overflow-y-scroll flex fixed top-0 z-50 translate-x-[-100%] transition duration-200 "
      >
        <div className="w-[70vw] bg-white  h-[100vh] "></div>

        {/* 右側の背景色 */}
        <button
          onClick={() => setIsActiveSidebar(!isActiveSidebar)}
          className="w-[30vw] bg-black opacity-75 h-[100vh] relative"
        ></button>
      </div>
    </div>
  );
}
