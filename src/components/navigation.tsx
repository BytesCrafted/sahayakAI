"use client";

import {
  FileImage,
  Home,
  LayoutDashboard,
  MessageSquare,
  Book,
  FileText,
  FlaskConical,
  User,
  ChevronDown,
  BookOpen,
} from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import * as React from "react";

const navItems = [
  { href: "/home", icon: Home, label: "Home" },
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/ask", icon: MessageSquare, label: "Ask Sahayak" },
  {
    href: "/content",
    icon: Book,
    label: "Content",
    subItems: [
      {
        href: "/content/worksheet",
        icon: FileImage,
        label: "Worksheet Generator",
      },
      { href: "/content/quiz", icon: FlaskConical, label: "Quiz Generator" },
      {
        href: "/content/lesson-plan",
        icon: FileText,
        label: "Lesson Plan Generator",
      },
      {
        href: "/generate-study-material",
        icon: BookOpen,
        label: "Study Material",
      },
    ],
  },
  { href: "/profile", icon: User, label: "Profile" },
];

export function Navigation() {
  const pathname = usePathname();
  const [isContentOpen, setContentOpen] = React.useState(
    pathname.startsWith("/content")
  );

  return (
    <SidebarMenu>
      {navItems.map((item) =>
        item.subItems ? (
          <Collapsible
            key={item.href}
            open={isContentOpen}
            onOpenChange={setContentOpen}
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton
                  variant="ghost"
                  className="w-full justify-between"
                  isActive={pathname.startsWith(item.href)}
                >
                  <div className="flex items-center gap-2">
                    <item.icon />
                    <span>{item.label}</span>
                  </div>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${
                      isContentOpen ? "rotate-180" : ""
                    }`}
                  />
                </SidebarMenuButton>
              </CollapsibleTrigger>
            </SidebarMenuItem>
            <CollapsibleContent>
              <SidebarMenuSub>
                {item.subItems.map((subItem) => (
                  <SidebarMenuSubItem key={subItem.href}>
                    <SidebarMenuSubButton
                      asChild
                      isActive={pathname === subItem.href}
                    >
                      <Link href={subItem.href}>
                        <subItem.icon />
                        <span>{subItem.label}</span>
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                ))}
              </SidebarMenuSub>
            </CollapsibleContent>
          </Collapsible>
        ) : (
          <SidebarMenuItem key={item.href}>
            <SidebarMenuButton
              asChild
              isActive={pathname.startsWith(item.href)}
              tooltip={item.label}
            >
              <Link href={item.href}>
                <item.icon />
                <span>{item.label}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )
      )}
    </SidebarMenu>
  );
}
