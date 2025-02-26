"use client";
import useSSModule from "@/app/lib";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export default function Detail() {
  const params = useParams<{ id: string }>();
  const { useGetDetail } = useSSModule();
  const { data, isFetching, isPending } = useGetDetail(params.id);
  const router = useRouter();

  return (
    <div className="mycontainer mx-auto px-2 pb-10 pt-4">
      <Button className="mb-4" onClick={() => router.push('/approval')}>
        <ArrowLeft />
        Kembali
      </Button>

      {(isFetching || isPending) && <Loader2 className="animate-spin" />}

      {!isFetching && !isPending && (
        <>
          <div className="mb-4 overflow-hidden rounded-md border">
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="border-r font-medium">No.</TableCell>
                  <TableCell>{data?.id}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="border-r font-medium">
                    Nama Saran
                  </TableCell>
                  <TableCell>{data?.nama_saran}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="border-r font-medium">
                    Penulis
                  </TableCell>
                  <TableCell>Rizky</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="border-r font-medium">NRP.</TableCell>
                  <TableCell>{data?.nrp}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="border-r font-medium">
                    Departement/Seksi
                  </TableCell>
                  <TableCell>{data?.departemen_seksi}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          <div className="mb-4 overflow-hidden rounded-md border">
            <Table>
              <TableBody>
                <TableRow className="col-span-2">
                  <TableCell
                    colSpan={2}
                    className="border-r text-center font-semibold"
                  >
                    Sasaran diterima
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="border-r font-medium">Nama</TableCell>
                  <TableCell>{data?.nama_sasaran}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="border-r font-medium">
                    Sasaran Saran
                  </TableCell>
                  <TableCell>{data?.sasaran_saran}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="border-r font-medium">
                    Pelaksanaan
                  </TableCell>
                  <TableCell>{data?.pelaksanaan}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="border-r font-medium">
                    Lokasi Pekerjaan
                  </TableCell>
                  <TableCell>{data?.lokasi_perkerjaan}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          <div className="mb-4 overflow-hidden rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableCell colSpan={2} className="text-center font-semibold">
                    KETERANGAN SEKITAR SARAN
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="border-r font-medium">
                    Keadaan Sebelumnya
                  </TableCell>
                  <TableCell className="border-r font-medium">
                    Saran yang diajukan
                  </TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="border-r align-top">
                    {data?.keadaan_sebelumnya}
                  </TableCell>
                  <TableCell className="align-top">
                    {data?.saran_yang_diajukan}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          <div className="mb-4 overflow-hidden rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableCell colSpan={2} className="text-center font-semibold">
                    HASIL / MANFAAT YANG DIHARAPKAN
                  </TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell colSpan={2} className="align-top">
                    {data?.hasil_atau_manfaat_yang_diharapkan}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </>
      )}
    </div>
  );
}
