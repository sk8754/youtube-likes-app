import Toppage from "@/components/view/Toppage";
import prisma from "@/lib/prisma";

export default async function Home() {
  const data = await prisma.videocard.findMany();
  const newData = data.map((data) => ({
    id: Number(data.id),
    thumbnail: data.thumbnail,
    user_photo: data.user_photo,
    title: data.title,
    channel: data.channel,
    genre: data.genre,
    watchers: Number(data.watchers),
  }));
  return (
    <div id="target2" className="min-h-screen bg-background sm:opacity-100">
      <div>
        <Toppage data={newData} />
      </div>
    </div>
  );
}

export const metadata = {
  title: "videoTube",
  description: "サイトのトップページです",
};
