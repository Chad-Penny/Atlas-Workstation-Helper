import { useEffect } from 'react';
import { Link, useRouterState } from '@tanstack/react-router';
import { LayoutDashboard, Mail, NotebookPen, ListChecks, Search, MessagesSquare, Compass, ArrowUpRight } from 'lucide-react';
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar';
import { WorkspaceSurvey } from './WorkspaceSurvey';
import { Button } from '@/components/ui/button';

export const NAV = [
  { title: 'Overview', url: '/', icon: LayoutDashboard },
  { title: 'Email Studio', url: '/email', icon: Mail },
  { title: 'Meeting Notes', url: '/meetings', icon: NotebookPen },
  { title: 'Task Planner', url: '/tasks', icon: ListChecks },
  { title: 'Research Desk', url: '/research', icon: Search },
  { title: 'Ask Atlas', url: '/chat', icon: MessagesSquare },
] as const;

export function AppSidebar() {
  const path = useRouterState({ select: r => r.location.pathname });
  const active = (url: string) => url === '/' ? path === '/' : path.startsWith(url);
  const { setOpenMobile, isMobile } = useSidebar();
  useEffect(() => { if (isMobile) setOpenMobile(false); }, [path, isMobile, setOpenMobile]);
  return <Sidebar collapsible="icon" className="shadow-sidebar">
    <SidebarHeader className="border-b border-sidebar-border pb-5 pt-6">
      <Link to="/" className="flex items-center gap-3 px-2">
        <div className="grid size-8 shrink-0 place-items-center rounded-md border border-sidebar-primary/40 text-sidebar-primary"><Compass className="size-5" /></div>
        <div className="group-data-[collapsible=icon]:hidden"><p className="font-display text-xl font-semibold text-sidebar-accent-foreground">Atlas<span className="text-sidebar-primary">.</span></p><p className="text-[10px] uppercase text-sidebar-foreground">Workspace</p></div>
      </Link>
    </SidebarHeader>
    <SidebarContent>
      <SidebarGroup className="pt-6">
        <SidebarGroupLabel className="mb-2 text-[10px] uppercase text-sidebar-foreground/60">Your command center</SidebarGroupLabel>
        <SidebarGroupContent><SidebarMenu className="gap-1.5">
          {NAV.map((item, index) => <SidebarMenuItem key={item.url}><SidebarMenuButton asChild isActive={active(item.url)} tooltip={item.title} className="h-11 rounded-md data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-primary">
            <Link to={item.url} onClick={() => { if (isMobile) setOpenMobile(false); }}><item.icon className="size-4" /><span className="flex-1">{item.title}</span><span className="tool-number text-[10px] text-sidebar-foreground/40 group-data-[collapsible=icon]:hidden">0{index + 1}</span></Link>
          </SidebarMenuButton></SidebarMenuItem>)}
        </SidebarMenu></SidebarGroupContent>
      </SidebarGroup>
      <div className="mx-4 mt-auto border-t border-sidebar-border py-6 group-data-[collapsible=icon]:hidden"><Compass className="mb-3 size-6 text-sidebar-primary" /><p className="font-display text-sm text-sidebar-accent-foreground">A little less busywork.<br />A little more headspace.</p><Button asChild variant="link" size="sm" className="mt-2 h-auto px-0 text-sidebar-primary"><Link to="/chat" onClick={() => setOpenMobile(false)}>Atlas is here to help <ArrowUpRight /></Link></Button></div>
    </SidebarContent>
    <SidebarFooter className="border-t border-sidebar-border px-3 py-4 group-data-[collapsible=icon]:hidden"><WorkspaceSurvey compact /><p className="mt-3 px-2 text-[10px] text-sidebar-foreground/50">AI-assisted. Human-reviewed.</p></SidebarFooter>
  </Sidebar>;
}
