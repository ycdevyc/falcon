"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Home,
  Car,
  ClipboardList,
  User,
} from "lucide-react";

export default function DriverLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navItems = [
    {
      href: "/driver",
      label: "Home",
      icon: Home,
    },
    {
      href: "/driver/rides",
      label: "Rides",
      icon: Car,
    },
    {
      href: "/driver/offers",
      label: "Offers",
      icon: ClipboardList,
    },
    {
      href: "/driver/profile",
      label: "Profile",
      icon: User,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">

      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">

          <div>
            <h1 className="text-xl font-bold">
              Falcon Driver
            </h1>

            <p className="text-sm text-muted-foreground">
              Premium Airport Transfers
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-green-500"></span>
            <span className="text-sm font-medium">
              Online
            </span>
          </div>

        </div>
      </header>

      {/* Content */}
      <main className="flex-1 max-w-md w-full mx-auto p-4 pb-24">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t">
        <div className="max-w-md mx-auto flex justify-around py-2">

          {navItems.map((item) => {
            const Icon = item.icon;

            const active =
              pathname === item.href ||
              pathname.startsWith(item.href + "/");

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center text-xs ${
                  active
                    ? "text-blue-600"
                    : "text-gray-500"
                }`}
              >
                <Icon size={22} />

                <span className="mt-1">
                  {item.label}
                </span>
              </Link>
            );
          })}

        </div>
      </nav>

    </div>
  );
}