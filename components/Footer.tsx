import Image from "next/image";
import React from "react";
import dummyphoto from "@/public/imgs/dummy100x100.png";
import Link from "next/link";

// モバイル表示のみレンダリングする
const Footer = () => {
  return (
    <div id="footer">
      <div className="sm:hidden fixed z-20 bottom-0 py-2 bg-slate-200 flex justify-center gap-[2rem] w-full">
        <div>
          <Link href="/">
            <div>
              <Image
                src={dummyphoto}
                alt="画像"
                className="aspect-square w-[1.8rem] mx-auto block"
              />
            </div>
            <p className="text-[0.8rem]">ホーム</p>
          </Link>
        </div>
        <div>
          {" "}
          <Link href="">
            <div>
              <Image
                src={dummyphoto}
                alt="画像"
                className="aspect-square w-[1.8rem]  mx-auto block"
              />
            </div>
            <p className="text-[0.8rem]">ショート</p>
          </Link>
        </div>
        <div>
          {" "}
          <Link href="">
            <div>
              <Image
                src={dummyphoto}
                alt="画像"
                className="aspect-square w-[1.8rem]  mx-auto block"
              />
            </div>
            <p className="text-[0.8rem]">登録チャンネル</p>
          </Link>
        </div>
        <div>
          {" "}
          <Link href="">
            <div>
              <Image
                src={dummyphoto}
                alt="画像"
                className="aspect-square w-[1.8rem]  mx-auto block"
              />
            </div>
            <p className="text-[0.8rem]">マイページ</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Footer;
