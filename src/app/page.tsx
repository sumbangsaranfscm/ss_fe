"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="flex items-center">
        <Button onClick={() => router.push("/approval")} variant={"link"}>
          Approval
        </Button>
        |
        <Button onClick={() => router.push("/approval")} variant={"link"}>
          Komite
        </Button>
      </div>
    </div>
  );
}
