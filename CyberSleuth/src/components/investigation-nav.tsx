import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Shield, LayoutDashboard, FileText, Terminal, PenSquare, User, Star } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

interface InvestigationNavProps {
  activeStep: string;
  setActiveStep: (step: string) => void;
  score: number;
}

export function InvestigationNav({ activeStep, setActiveStep, score }: InvestigationNavProps) {
  const menuItems = [
    { id: 'briefing', label: 'Case Briefing', icon: FileText },
    { id: 'investigation', label: 'Investigation', icon: Terminal },
    { id: 'report', label: 'Final Report', icon: PenSquare },
  ];

  return (
    <>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <Shield className="h-8 w-8 text-accent" />
          <h1 className="text-2xl font-headline font-semibold text-sidebar-foreground">CyberSleuth</h1>
        </div>
      </SidebarHeader>
      <div className="flex-1 overflow-y-auto">
        <SidebarMenu className="px-4">
          <SidebarMenuItem>
            <SidebarMenuButton
              isActive={activeStep === 'dashboard'}
              onClick={() => setActiveStep('briefing')}
              tooltip="Dashboard"
            >
              <LayoutDashboard />
              Dashboard
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <Separator className="my-4" />
        <p className="px-4 pb-2 text-xs font-medium text-sidebar-foreground/50">Investigation</p>
        <SidebarMenu className="px-4">
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.id}>
              <SidebarMenuButton
                isActive={activeStep === item.id}
                onClick={() => setActiveStep(item.id)}
                tooltip={item.label}
              >
                <item.icon />
                {item.label}
              </SidebarMenuButton>
            </SidebarMenuItem>2
          ))}
        </SidebarMenu>
      </div>
      <SidebarFooter className="p-4 space-y-4">
        <Card className="bg-sidebar-accent/20 border-sidebar-border">
          <CardContent className="p-3 text-white">
            <div className="text-sm font-medium">Performance Score</div>
            <div className="flex items-center gap-2 mt-1">
              <Star className="h-5 w-5 text-yellow-400" />
              <span className="text-2xl font-bold">{score}</span>
            </div>
          </CardContent>
        </Card>
        <Separator />
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarImage src="https://placehold.co/100x100.png" alt="@agent" data-ai-hint="user avatar" />
            <AvatarFallback>A</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium text-sidebar-foreground">Agent</p>
            <p className="text-xs text-sidebar-foreground/70">Lead Investigator</p>
          </div>
        </div>
      </SidebarFooter>
    </>
  );
}
