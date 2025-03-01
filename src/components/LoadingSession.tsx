"use client";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import React from "react";

interface Props {
  children: React.ReactNode;
}

export default function LoadingSession({ children }: Props) {
  const { status } = useSession();

  return status === "loading" ? (
    <div className="flex h-screen w-screen items-center justify-center gap-2 bg-white">
      <Loader2 className="animate-spin" />
    </div>
  ) : (
    children
  );
}
