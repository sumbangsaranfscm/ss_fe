"use client";
import useSSModule from "../lib";
import { ChevronRight, FileText, Loader2 } from "lucide-react";

export default function Approval() {
  const { useGetList } = useSSModule();
  const { data: listsaran = [], isFetching, isPending } = useGetList();

  return (
    <div className="mycontainer mx-auto h-screen px-2 pt-4">
      <h1 className="mb-10 text-2xl font-semibold">
        Daftar Saran Non Approval
      </h1>

      {(isFetching || isPending) && <Loader2 className="animate-spin" />}

      {!isFetching && !isPending && (
        <div className="grid w-full grid-cols-1 gap-2 md:grid-cols-2">
          {listsaran.map((_, i) => (
            <div
              key={i}
              className="grid w-full cursor-pointer grid-cols-12 rounded-lg border bg-card text-card-foreground shadow-sm transition-all duration-100 hover:bg-gray-50"
            >
              <div className="col-span-2 p-2">
                <div className="flex h-full w-full items-center justify-center rounded-lg border bg-blue-500">
                  <FileText size={30} className="text-neutral-50" />
                </div>
              </div>
              <div className="col-span-9 py-4 pr-2">
                <h2 className="text-lg font-semibold line-clamp-1 capitalize leading-none tracking-tight md:text-xl">
                  {_.nama_saran}
                </h2>
                <p className="text-sm text-muted-foreground md:text-base">
                  Penulis: {_.penulis}
                </p>
              </div>
              <div className="col-span-1 flex items-center justify-center text-neutral-500">
                <ChevronRight />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
