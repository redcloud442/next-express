import GamePlayPage from "@/components/GamePlayPage/GamePlayPage";

const page = async ({ params }: { params: Promise<{ gameid: string }> }) => {
  const { gameid } = await params;

  return <GamePlayPage params={{ gameid }} />;
};

export default page;
