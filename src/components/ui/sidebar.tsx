'use client'

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  BarChart3, 
  BookOpen, 
  Calendar, 
  CreditCard, 
  Package, 
  Percent, 
  ShoppingCart, 
  Users, 
  Utensils,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import * as React from "react"
import { cn } from "@/lib/utils"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
}

export function Sidebar({ className, ...props }: SidebarProps) {
  const pathname = usePathname();
  
  const routes = [
    {
      icon: <BarChart3 className="h-5 w-5" />,
      label: 'Dashboard',
      href: '/dashboard',
    },
    {
      icon: <Utensils className="h-5 w-5" />,
      label: 'Resep',
      href: '/dashboard/recipes',
      submenu: [
        {
          label: 'Daftar Resep',
          href: '/dashboard/recipes',
        },
        {
          label: 'Bahan-bahan',
          href: '/dashboard/recipes/ingredients',
        },
      ]
    },
    {
      icon: <Package className="h-5 w-5" />,
      label: 'Inventaris',
      href: '/dashboard/inventory',
    },
    {
      icon: <ShoppingCart className="h-5 w-5" />,
      label: 'Pembelian',
      href: '/dashboard/purchases',
    },
    {
      icon: <BookOpen className="h-5 w-5" />,
      label: 'Menu',
      href: '/dashboard/menu',
    },
    {
      icon: <CreditCard className="h-5 w-5" />,
      label: 'Penjualan',
      href: '/dashboard/sales',
    },
    {
      icon: <Percent className="h-5 w-5" />,
      label: 'Promosi',
      href: '/dashboard/promotions',
    },
    {
      icon: <Calendar className="h-5 w-5" />,
      label: 'Perencanaan',
      href: '/dashboard/planning',
    },
    {
      icon: <BarChart3 className="h-5 w-5" />,
      label: 'Laporan',
      href: '/dashboard/reports',
    },
    {
      icon: <Users className="h-5 w-5" />,
      label: 'Pelanggan',
      href: '/dashboard/customers',
    },
  ];

  return (
    <div className={cn("h-screen border-r bg-white w-64 flex flex-col", className)} {...props}>
      <div className="p-6">
        <h1 className="text-2xl font-bold text-blue-600">Kaluner</h1>
        <p className="text-xs text-gray-500 mt-1">Manajemen Bisnis Kuliner</p>
      </div>
      <div className="flex flex-col gap-y-1 px-3 overflow-auto">
        {routes.map((route) => (
          route.submenu ? (
            <SidebarSubmenu
              key={route.href}
              icon={route.icon}
              label={route.label}
              items={route.submenu}
              pathname={pathname}
            />
          ) : (
            <SidebarItem
              key={route.href}
              icon={route.icon}
              label={route.label}
              href={route.href}
              active={pathname === route.href}
            />
          )
        ))}
      </div>
    </div>
  );
}

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  active?: boolean;
}

function SidebarItem({ 
  icon, 
  label, 
  href, 
  active 
}: SidebarItemProps) {
  return (
    <Link 
      href={href}
      className={cn(
        "flex items-center gap-x-2 px-4 py-3 text-sm font-medium rounded-lg transition-colors",
        active 
          ? "bg-blue-100 text-blue-700" 
          : "text-gray-700 hover:bg-gray-100"
      )}
    >
      <div className="shrink-0">
        {icon}
      </div>
      <span>{label}</span>
    </Link>
  );
}

interface SidebarSubmenuProps {
  icon: React.ReactNode;
  label: string;
  items: { label: string; href: string }[];
  pathname: string;
}

function SidebarSubmenu({ 
  icon, 
  label, 
  items, 
  pathname 
}: SidebarSubmenuProps) {
  const isActive = items.some(item => item.href === pathname);
  const [isOpen, setIsOpen] = React.useState(isActive);

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="w-full"
    >
      <CollapsibleTrigger asChild>
        <button
          className={cn(
            "flex items-center justify-between w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors",
            isActive 
              ? "bg-blue-100 text-blue-700" 
              : "text-gray-700 hover:bg-gray-100"
          )}
        >
          <div className="flex items-center gap-x-2">
            <div className="shrink-0">
              {icon}
            </div>
            <span>{label}</span>
          </div>
          {isOpen ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent className="pl-10 pr-2">
        <div className="flex flex-col gap-y-1 mt-1">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center px-4 py-2 text-sm rounded-lg transition-colors",
                pathname === item.href
                  ? "bg-blue-100 text-blue-700 font-medium"
                  : "text-gray-700 hover:bg-gray-100"
              )}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
