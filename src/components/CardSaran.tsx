import { Saran } from "@/app/lib/interface";
import { ChevronRight, FileText } from "lucide-react";
import React from "react";

export default function CardSaran({
  _,
  handleClick,
}: {
  _: Saran;
  handleClick: () => void;
}) {
  return (
    <div
      onClick={handleClick}
      className="grid w-full cursor-pointer grid-cols-12 rounded-lg border bg-card text-card-foreground shadow-sm transition-all duration-100 hover:bg-gray-50"
    >
      <div className="col-span-2 p-2">
        <div className={`flex h-full w-full items-center justify-center rounded-lg border ${_.status_a.trim().length === 0 ? 'bg-blue-500' : 'bg-neutral-400'}`}>
          <FileText size={30} className="text-neutral-50" />
        </div>
      </div>
      <div className="col-span-9 py-4 pr-2">
        <h2 className="line-clamp-1 text-lg font-semibold capitalize leading-none tracking-tight md:text-xl">
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
  );
}
