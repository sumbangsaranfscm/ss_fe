"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
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
  const [error, setError] = useState("");
  const [kode, setKode] = useState("");
  const [selectedPage, setSelectedPage] = useState<"approval" | "komite" | "">("");

  const handleSubmit = async () => {
    if (!selectedPage) return;

    const result = await signIn("credentials", {
      kode,
      redirect: false,
    });

    if (result?.error) {
      setError("Kode salah!");
    } else {
      setOpen(false);
      router.push(`/${selectedPage}`);
    }
  };

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="flex items-center space-x-4">
        <Button
          onClick={() => {
            setSelectedPage("approval");
            setOpen(true);
            setError("");
            setKode("");
          }}
          variant="link"
        >
          Approval
        </Button>
        |
        <Button
          onClick={() => {
            setSelectedPage("komite");
            setOpen(true);
            setError("");
            setKode("");
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
              Silakan masukkan kode akses untuk masuk ke halaman {selectedPage}.
            </DialogDescription>
          </DialogHeader>
          <Input
            type="text"
            className={`w-full rounded-md border p-2 ${
              error ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Masukkan kode"
            value={kode}
            onChange={(e) => setKode(e.target.value)}
          />
          {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
          <DialogFooter>
            <Button onClick={handleSubmit}>Submit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
