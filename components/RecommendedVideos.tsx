import Image from "next/image";
import dummy from "@/public/imgs/dummy300x200.png";
import Link from "next/link";

export default function RecommendedVideos() {
  const videos = [
    {
      id: 1,
      title: "次のビッグヒット：新しいアニメーション",
      channel: "アニメスタジオ",
      views: "50万回視聴",
      timestamp: "2週間前",
    },
    {
      id: 2,
      title: "プログラミング入門：初心者向けガイド",
      channel: "テックチャンネル",
      views: "30万回視聴",
      timestamp: "1ヶ月前",
    },
    {
      id: 3,
      title: "美味しい和食レシピ：簡単に作れる!",
      channel: "クッキングマスター",
      views: "100万回視聴",
      timestamp: "3日前",
    },
    {
      id: 4,
      title: "宇宙の神秘：最新の発見",
      channel: "サイエンスエクスプローラー",
      views: "80万回視聴",
      timestamp: "1週間前",
    },
  ];

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">おすすめ動画</h2>
      <div className="space-y-4">
        {videos.map((video) => (
          <div key={video.id} className="sm:flex space-x-2">
            <Link href={"/"} className="relative sm:w-40 sm:h-24">
              <Image
                src={dummy}
                alt={video.title}
                className="rounded-lg aspect-video w-full object-cover"
              />
            </Link>
            <div className="sm:flex-1">
              <h3 className="font-semibold line-clamp-2">{video.title}</h3>
              <p className="text-sm text-muted-foreground">{video.channel}</p>
              <p className="text-sm text-muted-foreground">
                {video.views} • {video.timestamp}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
