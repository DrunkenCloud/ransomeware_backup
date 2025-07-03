import GameBoard from '@/components/game/GameBoard';

export default function GamePage({ params }: { params: { roomCode: string } }) {
  return <GameBoard roomCode={params.roomCode} />;
}
