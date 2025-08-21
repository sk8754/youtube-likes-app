import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ThumbsUp, ThumbsDown, User } from "lucide-react";

export default function Comments({ isLive }: { isLive: boolean }) {
  return (
    <div className="mt-8">
      {isLive == false && (
        <div>
          <h2 className="text-xl font-semibold mb-4">コメント 1,234件</h2>
          <div className="flex space-x-4 mb-6">
            <Avatar>
              <AvatarImage src="/placeholder-user.jpg" alt="@user" />
              <AvatarFallback>
                <User className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Textarea
                placeholder="コメントを追加..."
                className="bg-slate-100"
              />
              <div className="flex justify-end mt-2">
                <Button>コメント</Button>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex space-x-4">
                <Avatar>
                  <AvatarImage
                    src={`/placeholder-user-${i}.jpg`}
                    alt={`@user${i}`}
                  />
                  <AvatarFallback>
                    <User className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">
                    ユーザー{i}{" "}
                    <span className="text-sm text-muted-foreground">
                      1週間前
                    </span>
                  </p>
                  <p>素晴らしい動画です！もっと見たいです。</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <Button variant="ghost" size="sm">
                      <ThumbsUp className="mr-2 h-4 w-4" />
                      1,000
                    </Button>
                    <Button variant="ghost" size="sm">
                      <ThumbsDown className="mr-2 h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      返信
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
