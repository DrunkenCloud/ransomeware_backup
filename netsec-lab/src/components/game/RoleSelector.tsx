import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bug, Shield } from "lucide-react";
import type { PlayerRole } from "@/lib/types";

interface RoleSelectorProps {
  onSelectRole: (role: PlayerRole) => void;
}

export default function RoleSelector({ onSelectRole }: RoleSelectorProps) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-2xl text-center shadow-2xl">
        <CardHeader>
          <CardTitle className="text-4xl font-headline">Choose Your Role</CardTitle>
          <CardDescription>Will you breach the defenses or protect the core assets?</CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-8 p-8">
          <div className="flex flex-col items-center gap-4 p-6 border rounded-lg hover:bg-muted/50 transition-colors">
            <Bug className="w-20 h-20 text-destructive" />
            <h3 className="text-2xl font-bold">Attacker</h3>
            <p className="text-muted-foreground">Infiltrate the network, spread viruses, and exfiltrate data to score points.</p>
            <Button className="w-full mt-4" variant="destructive" onClick={() => onSelectRole('attacker')}>
              Select Attacker
            </Button>
          </div>
          <div className="flex flex-col items-center gap-4 p-6 border rounded-lg hover:bg-muted/50 transition-colors">
            <Shield className="w-20 h-20 text-primary" />
            <h3 className="text-2xl font-bold">Defender</h3>
            <p className="text-muted-foreground">Scan for threats, cleanse infected systems, and harden defenses to protect the network.</p>
            <Button className="w-full mt-4" onClick={() => onSelectRole('defender')}>
              Select Defender
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
