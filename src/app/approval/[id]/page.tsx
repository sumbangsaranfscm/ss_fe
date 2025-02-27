"use client";
import useSSModule from "@/app/lib";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";

const radioList = [
  "Saran dapat dipakai/dilaksanakan",
  "Masih perlu pertimbangan",
  "Pengulangan saran/ide lama",
  "Tidak dapat dipakai",
];

export default function Detail() {
  const params = useParams<{ id: string }>();
  const { useGetDetail } = useSSModule();
  const { data, isFetching, isPending } = useGetDetail(params.id);
  const router = useRouter();
  const { useUpdatePersetujuan } = useSSModule();
  const { isPending: isPendingUpdate, mutate } = useUpdatePersetujuan();

  const [statusA, setStatusA] = useState("");
  const [statusB, setStatusB] = useState("Tidak Ada");

  const handleSubmit = () => {
    if (statusA == "") {
      toast.error("Kolom untuk atasan belum di isi");
    } else {
      mutate({ status_a: statusA, status_b: statusB, id: params.id });
      toast.success("Berhasil submit!");
    }
  };

  return (
    <div className="mycontainer mx-auto px-2 pb-10 pt-4">
      <Button className="mb-4" onClick={() => router.push("/approval")}>
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
                    className="border-r bg-neutral-50 text-center font-semibold"
                  >
                    SASARAN DITERIMA
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
                  <TableCell
                    colSpan={2}
                    className="bg-neutral-50 text-center font-semibold"
                  >
                    KETERANGAN SEKITAR SARAN
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="border-r font-medium">
                    KEADAAN SEBELUMNYA
                  </TableCell>
                  <TableCell className="border-r font-medium">
                    SARAN YANG DIAJUKAN
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
                  <TableCell
                    colSpan={2}
                    className="bg-neutral-50 text-center font-semibold"
                  >
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

          <div className="mb-4 overflow-hidden rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableCell
                    colSpan={2}
                    className="bg-blue-600 text-center font-semibold text-white"
                  >
                    KOLOM UNTUK ATASAN
                  </TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell colSpan={2} className="align-top">
                    <RadioGroup
                      onValueChange={(e) => setStatusA(e)}
                      defaultValue=""
                    >
                      {radioList.map((_, i) => (
                        <div key={i} className="flex items-center space-x-2">
                          <RadioGroupItem value={_} id={`r_${i + 1}`} />
                          <Label htmlFor={`r_${i + 1}`}>{_}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          <div className="mb-4 overflow-hidden rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableCell
                    colSpan={2}
                    className="bg-blue-600 text-center font-semibold text-white"
                  >
                    SEKSI LAIN YANG BERHUBUNGAN
                  </TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell colSpan={2} className="align-top">
                    <RadioGroup
                      onValueChange={(e) => setStatusB(e)}
                      defaultValue="Tidak Ada"
                    >
                      <>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Tidak Ada" id={`r_6`} />
                          <Label htmlFor={`r_5`}>Tidak Ada</Label>
                        </div>
                        {radioList.map((_, i) => (
                          <div key={i} className="flex items-center space-x-2">
                            <RadioGroupItem value={_} id={`r_${i + 5}`} />
                            <Label htmlFor={`r_${i + 5}`}>{_}</Label>
                          </div>
                        ))}
                      </>
                    </RadioGroup>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          {data?.status_a != "" ? (
            <Button type="button" disabled>
              DATA SUDAH DI APPROVAL
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={statusA == "" || isPendingUpdate}
              type="button"
              className="w-full"
            >
              {isPendingUpdate ? (
                <Loader2 className="animate-spin" />
              ) : (
                "SUBMIT"
              )}
            </Button>
          )}
        </>
      )}
    </div>
  );
}
