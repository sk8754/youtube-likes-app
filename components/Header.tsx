"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, Menu, Search, Upload, User } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Header() {
  const [searchText, setSearchtext] = useState("");
  const [isSearchFormOpen, setIsSearchFormOpen] = useState(false);

  useEffect(() => {
    const searchBox = document.querySelector("#search-target");

    const logo = document.querySelector("#logo-target");

    const closeButton = document.querySelector("#search-close");

    if (isSearchFormOpen == true) {
      searchBox?.classList.remove("invisible");
      logo?.classList.add("invisible");
      closeButton?.classList.remove("invisible");
    } else {
      searchBox?.classList.add("invisible");
      logo?.classList.remove("invisible");
      closeButton?.classList.add("invisible");
    }
  }, [isSearchFormOpen]);
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="relative z-10">
          <Link href="/" className="flex items-center space-x-2">
            <span
              id="logo-target"
              className="sm:visible pl-[1rem] text-2xl font-bold"
            >
              VideoTube
            </span>
          </Link>
        </div>

        <div className="flex flex-1 items-center space-x-2 md:justify-center">
          {/* 検索機能 */}
          <form action="/search" className="w-full max-w-lg">
            <div className="relative invisible sm:visible">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="検索"
                name="keyword"
                className="w-full bg-muted pl-8 md:w-[300px] lg:w-[600px]"
                value={searchText}
                onChange={(e) => {
                  setSearchtext(e.target.value);
                }}
              />
            </div>
          </form>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="invisible sm:visible">
            <Upload className="hidden sm:block h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="invisible sm:visible">
            <Bell className="hidden sm:block h-5 w-5" />
          </Button>
          <Avatar className="hidden sm:block" onClick={() => {}}>
            <AvatarImage src="" alt="@user" />
            <AvatarFallback className="invisible sm:visible">
              <User className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* モバイル用検索フォームエリア */}
      <div className="sm:hidden absolute top-[0.5rem] w-[80%] pl-[4rem]">
        <form action="/search">
          <Input
            id="search-target"
            type="search"
            name="keyword"
            className="invisible bg-slate-100"
          />
        </form>
      </div>

      {/* モバイル用検索フォーム横の閉じるボタン */}
      <div
        id="search-close"
        className="invisible sm:hidden absolute top-[0.5rem] left-[0.8rem] z-10"
      >
        <Button onClick={() => setIsSearchFormOpen(!isSearchFormOpen)}>
          →
        </Button>
      </div>

      {/* モバイル用検索ボタン */}
      <div className="sm:hidden absolute top-[1rem] right-[2rem]">
        <button onClick={() => setIsSearchFormOpen(!isSearchFormOpen)}>
          <Search />
        </button>
      </div>
    </header>
  );
}
