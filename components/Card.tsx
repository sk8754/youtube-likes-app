import dummyphoto from "@/public/imgs/dummy100x100.png";
import Image from "next/image";
import Link from "next/link";

const Card = (props: {
  id: number;
  thumbnail: string;
  user_photo: string;
  title: string;
  channel: string;
  watchers: number | null;
}) => {
  return (
    <div>
      <div className="">
        <div>
          <Link href={`watch/${props.id}`}>
            <img
              src={props.thumbnail}
              alt="サムネイル"
              className="aspect-video w-full object-cover"
            />
          </Link>

          <div className="flex gap-2 pl-[3%] sm:pl-0">
            <div>
              <button>
                <Image
                  src={dummyphoto}
                  className="aspect-square w-[3rem] rounded-[1.5rem]"
                  alt="配信者画像"
                />
              </button>
            </div>

            <div className="flex flex-col">
              <button className="text-left hover:opacity-70">
                {props.title}
              </button>
              <button className="text-left hover:opacity-70">
                {props.channel}
              </button>
              {props.watchers !== null && props.watchers !== 0 && (
                <p className="text-left text-red-500">
                  {props.watchers}人視聴中
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
