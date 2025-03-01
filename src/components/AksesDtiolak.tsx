"use client"
import { Button } from "./ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AksesDtiolak() {
  const router = useRouter();

  return (
    <div className="h-svh relative w-full flex items-center justify-center">
      <h1 className="text-2xl font-bold text-red-600">Akses Ditolak!</h1>
      <Button className="mb-4 absolute bottom-2" onClick={() => router.push("/")}>
        <ArrowLeft />
        Kembali
      </Button>
    </div>
  );
}
