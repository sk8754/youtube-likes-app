import Watchpage from "@/components/view/Watchpage";

export default function Page({ params }: { params: { roomId: string } }) {
  const roomId = params.roomId;

  return (
    <div className="sm:mt-4 min-h-screen bg-background">
      <Watchpage roomId={roomId} />
    </div>
  );
}
