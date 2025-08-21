import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  useStripe,
  useElements,
  CardElement,
} from "@stripe/react-stripe-js";
import { Button } from "./ui/button";
import { useAtom } from "jotai";
import {
  clientSecretAtom,
  inputAmountAtom,
  inputSuperChatMessageAtom,
  isOpenSuperChatUIAtom,
  isViewChatAreaAtom,
} from "@/lib/atoms";
import { useParams } from "next/navigation";

// Stripe公開可能キーを設定
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
);

export const PaymentForm = ({
  clientSecret,
  wsRef,
}: {
  clientSecret: string;
  wsRef: React.RefObject<WebSocket>;
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const params = useParams();
  const roomId = params.videoURL;

  const [secret, setSecret] = useAtom<string | null>(clientSecretAtom);
  const [isOpenSuperChatUI, setIsOpenSuperChatUI] = useAtom(
    isOpenSuperChatUIAtom
  );
  const [isViewChatArea, setIsViewChatArea] = useAtom(isViewChatAreaAtom);
  const [inputSuperChatMessage, setInputSuperChatMessage] = useAtom(
    inputSuperChatMessageAtom
  );
  const [inputAmount, setInputAmount] = useAtom(inputAmountAtom);

  const cardStyle = {
    style: {
      base: {
        fontSize: "16px",
        color: "#32325d",
        letterSpacing: "0.025em",
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        "::placeholder": {
          color: "#a0aec0",
        },
      },
      invalid: {
        color: "#e25950",
        iconColor: "#e25950",
      },
    },
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) return;

    const { paymentIntent, error } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: {
          card: cardElement,
        },
      }
    );

    if (error) {
      console.error("支払いエラー:", error.message);
    } else if (paymentIntent?.status === "succeeded") {
      console.log("支払い成功");

      // UI状態のリセット
      setSecret(null);
      setInputAmount("");
      setInputSuperChatMessage("");
      setIsOpenSuperChatUI(false);
      setIsViewChatArea(true);

      // WebSocketで送信
      // WebSocket 経由でスパチャ送信
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(
          JSON.stringify({
            type: "superchat",
            message: inputSuperChatMessage,
            amount: inputAmount,
          })
        );
      } else {
        console.error("WebSocketが接続されていません");
      }
    }
  };

  return (
    <form onSubmit={handlePayment} className="text-center">
      <CardElement options={cardStyle} />

      <Button type="submit" disabled={!stripe} className="mx-auto my-[0.5rem]">
        支払いを実行
      </Button>
    </form>
  );
};
