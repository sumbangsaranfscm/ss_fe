
"use client";
import CardSaran from "@/components/CardSaran";
import useSSModule from "../lib";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";


export default function Komite() {
  const { useGetListKomite } = useSSModule();
  const router = useRouter();
  const { data: listsaran = [], isFetching, isPending } = useGetListKomite();

  const { data: session } = useSession();

  if (session?.user.role !== "komite") {
    return <p>Akses ditolak</p>;
  }

    return (
      <div className="mycontainer mx-auto h-screen px-2 pt-4">
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
