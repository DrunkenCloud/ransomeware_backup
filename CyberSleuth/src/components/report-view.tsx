
'use client';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface ReportViewProps {
  score: number;
}

export function ReportView({ score }: ReportViewProps) {
    const { toast } = useToast();

    const handleSubmit = () => {
        toast({
            title: "Report Submitted!",
            description: `Great work, Agent! Your final score is ${score}. The case is now closed.`,
        });
    };

    const finalReport = `Incident Report: Case 001 - The Midnight Intrusion

Summary of Findings:
The incident was a multi-stage attack that began on October 25th, 2023. The attacker initiated a brute-force attack from IP 203.0.113.55 against user 'e.vance' (user_id 45), gaining initial access at 23:21:02 UTC.

Lateral Movement and Escalation:
1.  **Initial Access:** The attacker performed reconnaissance on the web server (10.1.1.45), staged customer data into a zip file, and exfiltrated it to an external IP (45.55.138.122).
2.  **Persistence:** Two persistence mechanisms were established: a new admin user ('backup_admin') and a cron job creating a reverse shell.
3.  **Lateral Movement:** The attacker pivoted to the master database server (DB-MASTER-01, IP 10.1.1.50) via SSH.
4.  **Final Objective:** On the database server, the attacker's ultimate goal was realized: they encrypted the database tables, effectively launching a ransomware attack.

Conclusion & Impact:
The primary impact of this sophisticated attack was the encryption of the master database, causing a critical service outage. While data exfiltration and persistence were achieved, they were precursors to the final ransomware payload. Immediate actions should include isolating the affected systems, activating the incident response plan, removing the backdoor user and cron job, and evaluating the viability of restoring from the snapshot the attacker ironically created.
`;

  return (
    <div className="p-4 lg:p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-headline">Final Incident Report</CardTitle>
          <CardDescription>
            Congratulations on closing the case! Below is a summary of your findings. Submit the report to finalize the investigation.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea 
            readOnly
            className="h-96 font-code text-sm"
            defaultValue={finalReport}
          />
        </CardContent>
        <CardFooter>
          <Button onClick={handleSubmit}>Submit Final Report</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
