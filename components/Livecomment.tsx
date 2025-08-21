"use client";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { Home } from "lucide-react";
import Link from "next/link";
import { Elements } from "@stripe/react-stripe-js";
import { PaymentForm } from "./PaymentForm";
import { loadStripe } from "@stripe/stripe-js";
import { useAtom } from "jotai";
import {
  clientSecretAtom,
  inputAmountAtom,
  inputSuperChatMessageAtom,
  isOpenSuperChatUIAtom,
  isViewChatAreaAtom,
} from "@/lib/atoms";

export type Livecomment = {
  type: string;
  message: string;
  amount?: string;
};

const Livecomment = ({
  isLive,
  roomId,
}: {
  isLive: boolean;
  roomId: string;
}) => {
  const [messages, setMessages] = useState<Livecomment[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isOpenSupachaMenu, setIsopenSupachaMenu] = useState(false);
  const [isOpenSuperChatUI, setIsOpenSuperChatUI] = useAtom(
    isOpenSuperChatUIAtom
  );
  const [isViewChatArea, setIsViewChatArea] = useAtom(isViewChatAreaAtom);
  const [inputSuperChatMessage, setInputSuperChatMessage] = useAtom(
    inputSuperChatMessageAtom
  );
  const [inputAmount, setInputAmount] = useAtom<string>(inputAmountAtom);
  const [isDisabled, setIsDisabled] = useState(false);
  const [clientSecret, setClientSecret] = useAtom<string | null>(
    clientSecretAtom
  );

  const [isAtBottom, setIsAtBottom] = useState<boolean>(true);

  const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
  );
  const router = useRouter();

  const ws = useRef<WebSocket | null>(null);

  // websocketに接続、ライブコメントを受信する処理
  useEffect(() => {
    if (!isLive) return;

    ws.current = new WebSocket(`ws://localhost:8000/${roomId}`);

    ws.current.onopen = () => {
      console.log("websocket connected");
    };

    ws.current.onmessage = (event) => {
      const parseMessage = JSON.parse(event.data);
      setMessages((prev) => [...prev, parseMessage]);
    };

    ws.current.onerror = (error) => {
      console.error("websocket error:", error);
    };

    ws.current.onclose = () => {
      console.log("websocket closed");
    };

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [roomId, isLive]);

  // ライブコメントをサーバーに送信
  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      inputMessage.trim() !== "" &&
      ws.current !== null &&
      ws.current.readyState === WebSocket.OPEN
    ) {
      const messageContent = {
        type: "normal",
        message: inputMessage,
      };
      ws.current.send(JSON.stringify(messageContent));
      setInputMessage("");
    } else {
      console.warn("WebSocketが接続されていません");
    }
  };

  // スパチャメニューの開閉
  useEffect(() => {
    const target = document.querySelector("#supacha-menu");
    if (isOpenSupachaMenu) {
      target?.classList.remove("invisible");
    } else {
      target?.classList.add("invisible");
    }
  }, [isOpenSupachaMenu]);

  // スーパーチャットUIの処理
  useEffect(() => {
    const target = document.querySelector("#super-chat-ui");
    if (isOpenSuperChatUI == true) {
      target?.classList.remove("invisible");
    } else {
      target?.classList.add("invisible");
    }
  }, [isOpenSuperChatUI]);

  // チャットエリアUIの処理
  useEffect(() => {
    const chatArea = document.querySelector("#chatarea");

    if (isViewChatArea == false) {
      chatArea?.classList.add("invisible");
    } else {
      chatArea?.classList.remove("invisible");
    }
  }, [isViewChatArea]);

  //スーパーチャットUIを表示する処理
  const toggleSuperChatUI = () => {
    setIsOpenSuperChatUI((prev) => !prev);
    setIsopenSupachaMenu((prev) => !prev);
    setIsViewChatArea((prev) => !prev);
  };

  // スーパーチャット送信後の決済処理
  const handleSuperChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 2回目以降の支払いのユーザーは状態を空にする
    // setInputAmount("");
    // setInputSuperChatMessage("");
    // setIsDisabled(true);

    // setTimeout(() => {
    //   setIsDisabled(false);
    // }, 10000);

    // Stripe決済にAPIリクエストを送信
    try {
      const res = await fetch("http://localhost:3000/api/checkout", {
        method: "post",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          message: inputSuperChatMessage,
          amount: parseInt(inputAmount),
        }),
      });

      // clientSecretをサーバーから受け取る
      const data = await res.json();
      setClientSecret(data.clientSecret);
    } catch (error) {
      console.error(error);
    }
  };

  // コメント欄を監視する
  const commentsContainerRef = useRef<HTMLDivElement>(null);

  // スクロールイベントを監視
  const handleScroll = () => {
    if (commentsContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } =
        commentsContainerRef.current;
      // スクロール位置が一番下の場合
      setIsAtBottom(scrollTop + clientHeight >= scrollHeight - 1);
    }
  };

  useEffect(() => {
    const container = commentsContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  useEffect(() => {
    if (isAtBottom && commentsContainerRef.current) {
      // スクロールバーが一番下の場合のみ自動スクロール
      commentsContainerRef.current.scrollTop =
        commentsContainerRef.current.scrollHeight;
    }
  }, [messages, isAtBottom]); // `messages` または `isAtBottom` が変わったときに実行

  // ページ遷移を監視する
  useEffect(() => {
    // クリーンアップ関数
    const cleanup = () => {
      setIsopenSupachaMenu(false);
      setIsOpenSuperChatUI(false);
      setIsViewChatArea(true);
    };

    // コンポーネントのアンマウント時に実行
    return cleanup;
  }, []);

  return (
    <div>
      {isLive == true && (
        <div>
          <div className="relative hidden xl:block xl:mb-[4rem] w-full h-[85vh] overflow-y-scroll overflow-x-hidden border-slate-400 border-4">
            <h1 className="text-[1.5rem] sticky top-0">LiveComment</h1>
            <div
              id="comments"
              ref={commentsContainerRef}
              className="h-[80%] overflow-y-scroll"
            >
              {messages.map((data, index) => (
                <div key={index}>
                  {data.type == "normal" && (
                    <div>
                      <div key={index} className="flex gap-2">
                        <div className="flex w-auto max-w-[40%] whitespace-nowrap">
                          <img
                            src=""
                            alt="ユーザー"
                            className="w-[20px] h-[20px]"
                          />
                          <p className="text-green-600 text-[1rem] font-bold">
                            ユーザー名
                          </p>
                        </div>

                        <p className="text-[1rem] w-[60%] break-words">
                          {data.message}
                        </p>
                      </div>
                    </div>
                  )}

                  {data.type == "random" && (
                    <div>
                      <div key={index} className="flex gap-2">
                        <div className="flex w-auto max-w-[40%] whitespace-nowrap">
                          <img
                            src=""
                            alt="ユーザー"
                            className="w-[20px] h-[20px]"
                          />
                          <p className="text-green-600 text-[1rem] font-bold">
                            ユーザー名
                          </p>
                        </div>

                        <p className="text-[1rem] w-[60%] break-words">
                          {data.message}
                        </p>
                      </div>
                    </div>
                  )}

                  {data.type == "superchat" && (
                    <>
                      <div
                        className={`${
                          Number(data.amount) >= 0 &&
                          Number(data.amount) <= 1000 &&
                          "bg-[#0197ee]"
                        } ${
                          Number(data.amount) >= 1001 &&
                          Number(data.amount) <= 4999 &&
                          "bg-[#54d54d]"
                        } ${
                          Number(data.amount) >= 5000 &&
                          Number(data.amount) <= 9999 &&
                          "bg-[#fcfc26]"
                        } ${
                          Number(data.amount) >= 10000 &&
                          Number(data.amount) <= 29999 &&
                          "bg-[rgb(255,11,11)]"
                        } ${
                          Number(data.amount) >= 30000 &&
                          "bg-gradient-to-r from-red-400 via-sky-500 to-yellow-400"
                        } ${
                          !Number(data.amount) && "bg-[#b9b2b2]"
                        } mb-[0.5rem] mx-[1rem] px-[1rem] py-[0.8rem] rounded-[1rem]`}
                      >
                        <div className="flex">
                          <div>
                            <img src="" alt="画像" />
                          </div>

                          <div>
                            <p className="text-white">ユーザー名</p>
                            <p className="text-white">¥{data.amount}</p>
                          </div>
                        </div>

                        <div className="">
                          <p className="text-[1.5rem] text-white">
                            {data.message}
                          </p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>

            {/* スパチャメニュー */}
            <div
              id="supacha-menu"
              className="invisible absolute bottom-0 w-full h-auto bg-white z-20"
            >
              <div className="relative">
                <div className="flex justify-between  items-center px-4 border-y-2 border-slate-200">
                  <h2 className="text-[1.5rem] overflow-hidden whitespace-nowrap text-ellipsis">
                    「配信者名」さんを応援しましょう
                  </h2>

                  {/* スパチャメニューを閉じるボタン */}
                  <div className="">
                    <button
                      onClick={() => setIsopenSupachaMenu(!isOpenSupachaMenu)}
                      className="text-[2rem]"
                    >
                      ×
                    </button>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  className="w-full flex gap-2 justify-start p-8"
                  onClick={toggleSuperChatUI}
                >
                  <img src="" className="w-[2rem]" alt="画像" />
                  <div className="text-left">
                    <p>Super Chat</p>
                    <p>メッセージで配信活動を応援しよう！</p>
                  </div>
                </Button>
                <Button
                  variant="ghost"
                  className="w-full flex gap-2 justify-start p-8"
                >
                  <img src="" className="w-[2rem]" alt="画像" />
                  <div className="text-left">
                    <p>実装中</p>
                    <p>テキストテキストテキスト</p>
                  </div>
                </Button>{" "}
                <Button
                  variant="ghost"
                  className="w-full flex gap-2 justify-start p-8"
                >
                  <img src="" className="w-[2rem]" alt="画像" />
                  <div className="text-left">
                    <p>実装中</p>
                    <p>テキストテキストテキスト</p>
                  </div>
                </Button>{" "}
                <Button
                  variant="ghost"
                  className="w-full flex gap-2 justify-start p-8"
                >
                  <img src="" className="w-[2rem]" alt="画像" />
                  <div className="text-left">
                    <p>実装中</p>
                    <p>テキストテキストテキスト</p>
                  </div>
                </Button>
              </div>
            </div>

            {/* スーパーチャットUI */}
            <div
              id="super-chat-ui"
              className="invisible absolute bottom-0 w-full h-auto z-30 bg-white border-t-2 border-slate-200"
            >
              <div className="flex gap-4 pl-[1rem] mb-[1rem]">
                <button
                  className="text-[2rem]"
                  onClick={() => {
                    setIsOpenSuperChatUI((prev) => !prev);
                    setIsViewChatArea((prev) => !prev);
                  }}
                >
                  ×
                </button>
                <p className="text-[2rem]">Super Chatを送信</p>
              </div>

              <div className="bg-blue-500 mb-[2rem] p-2 text-white">
                これはあなたの初めてのSuperChatです。この特別な機会をコミュニティに知らせます。
              </div>

              <form onSubmit={handleSuperChatSubmit}>
                <div
                  className={`${
                    Number(inputAmount) >= 0 &&
                    Number(inputAmount) <= 1000 &&
                    "bg-[#0197ee]"
                  } ${
                    Number(inputAmount) >= 1001 &&
                    Number(inputAmount) <= 4999 &&
                    "bg-[#54d54d]"
                  } ${
                    Number(inputAmount) >= 5000 &&
                    Number(inputAmount) <= 9999 &&
                    "bg-[#fcfc26]"
                  } ${
                    Number(inputAmount) >= 10000 &&
                    Number(inputAmount) <= 29999 &&
                    "bg-[rgb(255,11,11)]"
                  } ${
                    Number(inputAmount) >= 30000 &&
                    "bg-gradient-to-r from-red-400 via-sky-500 to-yellow-400"
                  } ${
                    !Number(inputAmount) && "bg-[#b9b2b2]"
                  } mb-[2.5rem] mx-[1rem] px-[1rem] py-[0.8rem] rounded-[1rem]`}
                >
                  <div className="flex gap-4">
                    <img src="" alt="ユーザー" />
                    <p>ユーザー名</p>
                    <p>¥{inputAmount}</p>
                  </div>

                  <div>
                    <input
                      type="text"
                      name="message"
                      placeholder="金額とメッセージは公開されます。"
                      value={inputSuperChatMessage}
                      onChange={(e) => setInputSuperChatMessage(e.target.value)}
                      className="pl-[0.5rem] w-full bg-yellow-300 text-black"
                      required
                    />
                  </div>
                </div>

                <div className="text-center text-[2rem] mb-8">
                  <span>¥</span>
                  <input
                    type="number"
                    name="amount"
                    value={inputAmount}
                    className="max-w-[100px] bg-inherit border-b-2 border-black"
                    required
                    min={0}
                    max={50000}
                    onChange={(e) => {
                      const value = e.target.value;
                      // 空文字は許容（未入力時）
                      if (value === "") {
                        setInputAmount("");
                        return;
                      }
                      // 先頭が「-」または「0」で始まる場合は"1"に矯正
                      if (/^[-0]/.test(value)) {
                        setInputAmount("1");
                        return;
                      }
                      const num = Number(value);
                      if (num < 1) {
                        setInputAmount("1");
                      } else if (num > 50000) {
                        setInputAmount("50000");
                      } else {
                        setInputAmount(value);
                      }
                    }}
                  />
                  <span>JPY</span>
                </div>
                <div className="text-center mb-4">
                  <Button
                    type="submit"
                    disabled={isDisabled}
                    className="w-[80%] bg-blue-600 hover:bg-blue-500 rounded-[1rem]"
                  >
                    購入して送信
                  </Button>
                </div>
              </form>

              {clientSecret !== null && (
                <Elements stripe={stripePromise}>
                  <PaymentForm clientSecret={clientSecret} wsRef={ws} />
                </Elements>
              )}
            </div>

            {/* 通常チャットエリア */}
            <div
              id="chatarea"
              className="absolute bottom-0 p-4 w-full flex justify-between items-center border-t-2 border-slate-200"
            >
              <form onSubmit={(e) => sendMessage(e)}>
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="チャット"
                  className="bg-slate-100 rounded-[1rem] pl-4 py-2"
                />
              </form>

              <div>
                <button
                  onClick={() => setIsopenSupachaMenu(!isOpenSupachaMenu)}
                >
                  <img src="" alt="supacha" />
                </button>
              </div>
              <div>
                <button>
                  <img src="" alt="like" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Livecomment;
