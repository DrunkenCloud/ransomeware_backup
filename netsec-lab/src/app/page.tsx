"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Rocket, Wand2 } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const [roomCode, setRoomCode] = useState('');

  const handleJoinGame = (e: React.FormEvent) => {
    e.preventDefault();
    if (roomCode.trim()) {
      router.push(`/game/${roomCode.trim()}`);
    }
  };

  const handleCreateGame = () => {
    const newRoomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    router.push(`/game/${newRoomCode}`);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gray-100 dark:bg-gray-900">
      <div className="absolute top-0 left-0 w-full h-full bg-grid-gray-200/[0.4] dark:bg-grid-gray-800/[0.4] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      <Card className="w-full max-w-md z-10 shadow-2xl">
        <CardHeader className="text-center">
          <div className="flex justify-center items-center gap-4 mb-4">
            <Rocket className="w-10 h-10 text-primary" />
            <h1 className="text-4xl font-bold font-headline">NetSec Duel</h1>
          </div>
          <CardDescription className="text-lg">
            Join the digital battlefield. Outsmart your opponent. Secure the network.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleJoinGame} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="room-code" className="text-base">Join an Existing Game</Label>
              <Input
                id="room-code"
                placeholder="Enter Room Code"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                className="text-center text-lg tracking-widest h-12"
              />
            </div>
            <Button type="submit" className="w-full h-12 text-lg" disabled={!roomCode.trim()}>
              Join Game
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <div className="relative w-full flex items-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="flex-shrink mx-4 text-muted-foreground">OR</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>
          <Button onClick={handleCreateGame} variant="secondary" className="w-full h-12 text-lg">
            <Wand2 className="mr-2 h-5 w-5" />
            Create New Game
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
}
