"use client";
import CardSaran from "@/components/CardSaran";
import useSSModule from "../lib";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import AksesDtiolak from "@/components/AksesDtiolak";
import { useState } from "react";
import Logout from "@/components/Logout";

export default function Komite() {
  const { useGetListKomite } = useSSModule();
  const router = useRouter();
  const { data: listsaran = [], isFetching, isPending } = useGetListKomite();
  const [open, setOpen] = useState<boolean>(false);

  const { data: session } = useSession();

  if (session?.user.role !== "komite") {
    return <AksesDtiolak />;
  }

  return (
    <div className="mycontainer mx-auto h-screen px-2 pt-4">
      <Logout open={open} setOpen={setOpen} handleClick={() => setOpen(true)} />

      <h1 className="mb-5 text-2xl font-semibold">
        Daftar kolom untuk komite TQC
      </h1>

      {(isFetching || isPending) && <Loader2 className="animate-spin" />}

      {!isFetching && !isPending && (
        <div className="grid w-full grid-cols-1 gap-2 md:grid-cols-2">
          {listsaran.map((_, i) => (
            <CardSaran
              handleClick={() => {
                router.push(`/komite/${_.id}`);
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
