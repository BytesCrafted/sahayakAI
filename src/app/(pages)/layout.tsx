import { Logotype } from "@/components/icons";
import { Navigation } from "@/components/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import Link from "next/link";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarContent>
          <SidebarHeader>
            <Link href="/" className="flex items-center gap-2">
              <Logotype className="h-6 w-auto" />
            </Link>
          </SidebarHeader>
          <Navigation />
        </SidebarContent>
      </Sidebar>
      <SidebarInset className="bg-white">
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-white px-4 md:px-6">
          <SidebarTrigger className="md:hidden" />
          <h1 className="text-xl font-semibold font-headline">SahayakAI</h1>
        </header>
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
