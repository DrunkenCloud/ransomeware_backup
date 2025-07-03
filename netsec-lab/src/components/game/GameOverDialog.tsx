import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Bug, ShieldCheck, Trophy } from "lucide-react"
import type { PlayerRole } from "@/lib/types"

interface GameOverDialogProps {
  winner: PlayerRole;
  onPlayAgain: () => void;
}

export default function GameOverDialog({ winner, onPlayAgain }: GameOverDialogProps) {
  if (!winner) {
    return null;
  }

  const isAttackerWin = winner === 'attacker';

  return (
    <AlertDialog open={!!winner}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex flex-col items-center text-center gap-4">
            <Trophy className="w-16 h-16 text-yellow-400" />
            <AlertDialogTitle className="text-3xl font-bold">Game Over!</AlertDialogTitle>
            <AlertDialogDescription className="text-lg">
              The <span className={`font-bold ${isAttackerWin ? 'text-destructive' : 'text-primary'}`}>{winner}</span> has won the battle!
            </AlertDialogDescription>
            <div className={`flex items-center gap-2 p-4 rounded-lg ${isAttackerWin ? 'bg-destructive/10' : 'bg-primary/10'}`}>
              {isAttackerWin ? <Bug className="w-10 h-10 text-destructive"/> : <ShieldCheck className="w-10 h-10 text-primary"/>}
              <p className="text-xl font-semibold">{isAttackerWin ? 'Network Breached' : 'Network Secured'}</p>
            </div>
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={onPlayAgain} className="w-full text-lg h-12">
            Play Again
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
