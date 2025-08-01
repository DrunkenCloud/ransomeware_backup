import { BookOpen, ExternalLink } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const resources = [
  {
    title: 'CISA: Ransomware Guidance',
    href: 'https://www.cisa.gov/stopransomware/ransomware-guide',
    description: 'Official U.S. government guide for preventing and responding to ransomware.',
  },
  {
    title: 'FBI: Ransomware Guidance',
    href: 'https://www.fbi.gov/how-we-can-help-you/safety-resources/scams-and-safety/common-scams-and-crimes/ransomware',
    description: 'The FBI\'s public guidance on ransomware attacks.',
  },
  {
    title: 'NIST: Ransomware Protection and Response',
    href: 'https://csrc.nist.gov/pubs/sp/1800/26/final',
    description: 'A cybersecurity practice guide from the National Institute of Standards and Technology.',
  },
];

export function ResourcesPanel() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <BookOpen />
          Ethical Resources
        </CardTitle>
        <CardDescription>
          Official guidelines on paying ransoms.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {resources.map((resource) => (
            <li key={resource.title}>
              <a
                href={resource.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start gap-3 p-2 rounded-lg hover:bg-muted"
              >
                <div className="flex-1">
                  <p className="font-semibold text-sm group-hover:text-primary">{resource.title}</p>
                  <p className="text-xs text-muted-foreground">{resource.description}</p>
                </div>
                <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary shrink-0 mt-1" />
              </a>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
