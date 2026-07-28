"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

type AppShellProps = {
  children: ReactNode;
  title: string;
  description: string;
};

const menuItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: "▦",
  },
  {
    name: "Khách hàng tiềm năng",
    href: "/leads",
    icon: "◎",
  },
  {
    name: "Pipeline bán hàng",
    href: "/deals",
    icon: "▤",
  },
  {
    name: "Quản lý người dùng",
    href: "/users",
    icon: "♙",
  },
];

export default function AppShell({
  children,
  title,
  description,
}: AppShellProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-slate-200 bg-white lg:block">
        <div className="flex h-20 items-center border-b border-slate-200 px-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900 font-bold text-white">
            C
          </div>

          <div className="ml-3">
            <p className="font-bold text-slate-900">CRM System</p>
            <p className="text-xs text-slate-500">Quản lý bán hàng</p>
          </div>
        </div>

        <nav className="p-4">
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Chức năng chính
          </p>

          <div className="space-y-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-slate-900 text-white"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <span className="w-6 text-center text-lg">{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 border-t border-slate-200 p-4">
          <div className="flex items-center rounded-lg bg-slate-50 p-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-300 font-semibold">
              AD
            </div>

            <div className="ml-3 min-w-0">
              <p className="truncate text-sm font-semibold">Administrator</p>
              <p className="truncate text-xs text-slate-500">
                admin@crm.com
              </p>
            </div>
          </div>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex min-h-20 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6 lg:px-8">
          <div>
            <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">
              {title}
            </h1>

            <p className="mt-1 hidden text-sm text-slate-500 sm:block">
              {description}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-slate-300 bg-white"
              aria-label="Thông báo"
            >
              ♢
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-slate-900" />
            </button>

            <div className="hidden items-center gap-3 border-l border-slate-200 pl-4 sm:flex">
              <div className="text-right">
                <p className="text-sm font-semibold">Khánh Duy</p>
                <p className="text-xs text-slate-500">Admin</p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
                KD
              </div>
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}