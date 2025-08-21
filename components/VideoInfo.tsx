import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown, Share2, User } from "lucide-react";

export default function VideoInfo({ islive }: { islive: boolean }) {
  return (
    <div className="mt-4 space-y-4">
      <h1 className="text-2xl font-bold">ビッグ・バック・バニー：驚きの冒険</h1>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src="" alt="チャンネル名" />
            <AvatarFallback>
              <User className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>
          <div>
            <button className="font-semibold hover:opacity-70 max-w-[250px] truncate overflow-hidden">
              アニメーションスタジオ
            </button>
            <p className="text-sm text-muted-foreground">100万 登録者</p>
          </div>
          <Button>登録</Button>

          {/* タブレットpc表示用ボタン */}
          <div className="hidden sm:block ">
            <div className="flex items-center space-x-2">
              <Button variant="outline">
                <ThumbsUp className="mr-2 h-4 w-4" />
                10万
              </Button>
              <Button variant="outline">
                <ThumbsDown className="mr-2 h-4 w-4" />
              </Button>
              <Button variant="outline">
                <Share2 className="mr-2 h-4 w-4" />
                共有
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* スマホ表示用ボタン */}
      <div className="flex sm:hidden">
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <ThumbsUp className="mr-2 h-4 w-4" />
            10万
          </Button>
          <Button variant="outline">
            <ThumbsDown className="mr-2 h-4 w-4" />
          </Button>
          <Button variant="outline">
            <Share2 className="mr-2 h-4 w-4" />
            共有
          </Button>
        </div>
      </div>
      {islive == false && (
        <>
          <p className="text-sm text-muted-foreground">100万 回視聴 • 1年前</p>
        </>
      )}

      {islive == true && (
        <>
          <span className="text-[1.5rem] text-muted-foreground text-red-500 font-bold">
            100
          </span>
          <span>人視聴中</span>
        </>
      )}

      <p>
        ビッグ・バック・バニーの冒険を楽しんでください。この短編アニメーションは、勇敢なウサギの物語を描いています。
      </p>
    </div>
  );
}
