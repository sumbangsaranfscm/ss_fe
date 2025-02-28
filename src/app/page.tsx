"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export default function Home() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState("");
  const [targetPage, setTargetPage] = useState("");
  const [error, setError] = useState(""); 

  const handleNavigate = () => {
    if (
      (targetPage === "/approval" && code === process.env.NEXT_PUBLIC_PWAPPROVAL) ||
      (targetPage === "/komite" && code === process.env.NEXT_PUBLIC_PWKOMITE)
    ) {
      setOpen(false);
      setCode("");
      setError("");
      router.push(targetPage);
    } else {
      setError("Kode yang dimasukkan salah. Silakan coba lagi.");
    }
  };

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="flex items-center space-x-4">
        <Button
          onClick={() => {
            setTargetPage("/approval");
            setOpen(true);
            setError("");
          }}
          variant="link"
        >
          Approval
        </Button>
        |
        <Button
          onClick={() => {
            setTargetPage("/komite");
            setOpen(true);
            setError("");
          }}
          variant="link"
        >
          Komite
        </Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Masukkan Kode Akses</DialogTitle>
            <DialogDescription>
              Silakan masukkan kode akses untuk melanjutkan.
            </DialogDescription>
          </DialogHeader>
          <Input
            type="text"
            className={`w-full rounded-md border p-2 ${
              error ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Masukkan kode"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
          <DialogFooter>
            <Button onClick={handleNavigate}>Submit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}