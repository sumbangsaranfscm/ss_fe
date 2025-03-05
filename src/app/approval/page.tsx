  "use client";
  import CardSaran from "@/components/CardSaran";
  import useSSModule from "../lib";
  import { Loader2, RefreshCcw } from "lucide-react";
  import { useRouter } from "next/navigation";
  import { useSession } from "next-auth/react";
  import AksesDtiolak from "@/components/AksesDtiolak";
  import { useMemo, useState } from "react";
  import Logout from "@/components/Logout";
  import { Input } from "@/components/ui/input";
  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";
  import { Button } from "@/components/ui/button";
  import { useQueryClient } from "@tanstack/react-query";

  export default function Approval() {
    const queryClient = useQueryClient();
    const { useGetList } = useSSModule();
    const [open, setOpen] = useState<boolean>(false);
    const router = useRouter();
    const { data: listsaran = [], isFetching, isPending } = useGetList();
    const { data: session } = useSession();
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("Belum di Proses");

    // Menggunakan useMemo agar filtering tidak menyebabkan infinite loop
    const filteredItems = useMemo(() => {
      return listsaran.filter((item) => {
        const matchesSearch =
          search.trim().length === 0 ||
          item.penulis.toLowerCase().includes(search.toLowerCase());

        const matchesStatus =
          status === "Semua" ||
          (status === "Belum di Proses" && (!item.status_a || item.status_a.trim().length === 0)) ||
          (status === "Sudah di Proses" && item.status_a && item.status_a.trim().length > 0);

        return matchesSearch && matchesStatus;
      });
    }, [search, status, listsaran]);

    if (session?.user.role !== "approval") {
      return <AksesDtiolak />;
    }

    console.log(listsaran);

    return (
      <div className="mycontainer relative mx-auto min-h-svh px-2 pt-4">
        <Logout open={open} setOpen={setOpen} handleClick={() => setOpen(true)} />
        <h1 className="mb-5 text-2xl font-semibold">Halaman Atasan</h1>

        <div className="mb-2 grid w-full grid-cols-12 gap-1">
          <Input
            className="col-span-12 sm:col-span-7"
            type="Text"
            placeholder="Cari penulis..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="col-span-6 sm:col-span-4">
            <Select onValueChange={(e) => setStatus(e)} defaultValue="Belum di Proses">
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pilih Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Belum di Proses">Belum di Proses</SelectItem>
                <SelectItem value="Sudah di Proses">Sudah di Proses</SelectItem>
                <SelectItem value="Semua">Semua</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="col-span-6 sm:col-span-1">
            <Button
              onClick={() => {
                console.log("Refetching...");
                queryClient.invalidateQueries({ queryKey: ["listsaran"] });
              }}
              className="w-full"
              size={"icon"}
              type="button"
            >
              <RefreshCcw />
            </Button>
          </div>
        </div>

        {(isFetching || isPending) && <Loader2 className="animate-spin" />}

        {!isFetching && !isPending && (
          <div className="grid w-full grid-cols-1 gap-2 md:grid-cols-2">
            {filteredItems.map((_, i) => (
              <CardSaran
                handleClick={() => {
                  router.push(`/approval/${_.id}`);
                }}
                key={i}
                _={_}
              />
            ))}
          </div>
        )}
      </div>
    );
  }
