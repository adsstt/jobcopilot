"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { Sparkles } from "lucide-react";
import { Card } from "@/components/ui";

interface AuthShellProps {
  title: string;
  subtitle: string;
  footer?: ReactNode;
  children: ReactNode;
}

export function AuthShell({ title, subtitle, footer, children }: AuthShellProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-md">
        <Link href="/" className="mb-8 flex items-center justify-center gap-3 text-slate-900">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-600 text-white">
            <Sparkles size={20} />
          </span>
          <span className="text-2xl font-bold italic tracking-tight">JobCopilot</span>
        </Link>

        <Card className="rounded-[28px] border border-slate-100 p-8 shadow-sm">
          <div className="mb-6 space-y-2 text-center">
            <h1 className="text-3xl font-bold text-slate-900">{title}</h1>
            <p className="text-sm leading-6 text-slate-500">{subtitle}</p>
          </div>
          <div className="space-y-4">{children}</div>
        </Card>

        {footer ? <div className="mt-5 text-center text-sm text-slate-500">{footer}</div> : null}
      </div>
    </main>
  );
}
