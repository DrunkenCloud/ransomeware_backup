import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Icons } from '@/components/icons';
import { ChatPanel } from '@/components/chat-panel';
import { DecryptionKeyPanel } from '@/components/decryption-key-panel';
import { ResourcesPanel } from '@/components/resources-panel';

export default function Home() {
  return (
    <main className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <div className="flex items-center gap-3">
            <Icons.logo className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold font-headline text-foreground">
              RansomAware
            </h1>
          </div>
          <p className="text-muted-foreground mt-1">
            An interactive simulation to practice ransomware negotiation.
          </p>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <aside className="xl:col-span-1 flex flex-col gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="font-headline">Lab Objectives</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                  <li>Understand ransomware negotiation tactics.</li>
                  <li>Practice communication under pressure.</li>
                  <li>Analyze and respond to threat actor demands.</li>
                  <li>Evaluate the ethics of paying a ransom.</li>
                  <li>Learn to identify and validate a decryption key.</li>
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="font-headline">Scenario</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground space-y-2">
                  <span>
                    You are a cybersecurity negotiator for 'Financix', a mid-sized financial services company. Your network has been breached and encrypted by the 'DataVortex' ransomware group. Critical files are now inaccessible, including:
                  </span>
                  <ul className="list-disc list-inside pl-4">
                    <li>Customer financial records</li>
                    <li>Proprietary trading algorithms</li>
                    <li>Internal audit documents</li>
                    <li>Employee PII</li>
                    <li>Investor communications</li>
                  </ul>
                  <span>
                    The attackers claim to have exfiltrated 100GB of this sensitive data. A ransom note has been found on all encrypted systems. Your objective is to engage with the threat actor, negotiate terms, and attempt to recover the files while minimizing damage to the company's finances and reputation.
                  </span>
                </div>
              </CardContent>
            </Card>
          </aside>

          <div className="xl:col-span-2 flex flex-col gap-8">
            <ChatPanel />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <DecryptionKeyPanel />
              <ResourcesPanel />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
