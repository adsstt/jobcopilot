"use client";

import { useState } from "react";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function SignOutButton() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  const handleSignOut = async () => {
    setIsPending(true);
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      router.replace("/login");
      router.refresh();
    } finally {
      setIsPending(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleSignOut}
      disabled={isPending}
      className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-slate-500 transition hover:text-slate-900 disabled:opacity-60"
    >
      <LogOut size={14} />
      {isPending ? "退出中..." : "退出登录"}
    </button>
  );
}
