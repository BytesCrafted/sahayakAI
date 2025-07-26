"use client";

import {
  BookText,
  FileImage,
  FileText,
  LayoutDashboard,
  MessageSquare,
  PenSquare,
} from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

const navItems = [
  { href: "/ask-sahayak", icon: MessageSquare, label: "Ask Sahayak" },
  { href: "/worksheet-generator", icon: FileImage, label: "Worksheet Generator" },
  { href: "/lesson-plan-generator", icon: BookText, label: "Lesson Plan Generator" },
  { href: "/generate-study-material", icon: FileText, label: "Study Material Generator" },
  { href: "/generate-quiz", icon: PenSquare, label: "Quiz Generator" },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {navItems.map((item) => (
        <SidebarMenuItem key={item.href}>
          <SidebarMenuButton
            asChild
            isActive={pathname === item.href}
            tooltip={item.label}
          >
            <Link href={item.href}>
              <item.icon />
              <span>{item.label}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
