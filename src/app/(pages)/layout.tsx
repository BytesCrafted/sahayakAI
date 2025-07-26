import { Logotype } from "@/components/icons";
import { Navigation } from "@/components/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
  SidebarFooter,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { UserNav } from "@/components/user-nav";
import { Button } from "@/components/ui/button";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  // TODO: Replace with actual authentication check
  const isAuthenticated = true;

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarContent>
          <SidebarHeader>
            <Link href="/home" className="flex items-center gap-2">
              <Logotype className="h-6 w-auto" />
            </Link>
          </SidebarHeader>
          <Navigation />
          <SidebarFooter>
            {isAuthenticated ? (
              <UserNav />
            ) : (
              <div className="flex flex-col gap-2">
                <Button asChild>
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild variant="secondary">
                  <Link href="/signup">Sign Up</Link>
                </Button>
              </div>
            )}
          </SidebarFooter>
        </SidebarContent>
      </Sidebar>
      <SidebarInset className="bg-background">
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
          <SidebarTrigger className="md:hidden" />
          <div className="flex-1">
             {/* Header content can go here if needed */}
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
