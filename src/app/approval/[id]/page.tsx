"use client";
import useSSModule from "@/app/lib";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
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
import { Input } from "@/components/ui/input";

const radioList = [
  "Saran dapat dipakai/dilaksanakan",
  "Masih perlu pertimbangan",
  "Pengulangan saran/ide lama",
  "Tidak dapat dipakai",
];

const sasaranSaranList = ["Cost Down", "Kualitas", "Safety", "Lain-lain"];

const pelaksanaanList = ["Belum", "Sudah"];

const lokasiList = ["Plant", "Markt. & Purch.", "Fin. & Acct.", "HRD"];

export default function Detail() {
  const params = useParams<{ id: string }>();
  const { useGetDetail } = useSSModule();
  const { data, isFetching, isPending } = useGetDetail(params.id);
  const router = useRouter();
  const { useUpdatePersetujuan } = useSSModule();
  const { isPending: isPendingUpdate, mutate } = useUpdatePersetujuan();
  const [tanggal, setTanggal] = useState("");
  const [statusA, setStatusA] = useState("");
  const [statusB, setStatusB] = useState("Tidak Ada");

  useEffect(() => {
    const today = new Date().toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
    setTanggal(today);
  }, []);

  const handleSubmit = () => {
    if (statusA == "") {
      toast.error("Kolom untuk atasan belum di isi");
    } else {
      mutate({ status_a: statusA, status_b: statusB, id: params.id });
    }
  };

  console.log(data?.status_a);

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
              <TableHeader>
                <TableRow>
                  <TableCell
                    colSpan={2}
                    className="bg-neutral-50 text-center font-semibold"
                  >
                    KETERANGAN SEKITAR SARAN
                  </TableCell>
                </TableRow>
                <TableRow className="hidden md:table-row">
                  <TableCell className="border-r font-semibold">
                    KEADAAN SEBELUMNYA
                  </TableCell>
                  <TableCell className="font-semibold">
                    SARAN YANG DIAJUKAN
                  </TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="hidden md:table-row">
                  <TableCell className="border-r align-top">
                    {data?.keadaan_sebelumnya} Lorem ipsum dolor sit amet consectetur adipisicing elit. Similique iusto quisquam libero maxime voluptatibus, enim voluptatum neque iste. Recusandae, ex.
                  </TableCell>
                  <TableCell className="align-top">
                    {data?.saran_yang_diajukan} Lorem ipsum dolor sit amet consectetur adipisicing elit. Error aut iure in sint perspiciatis dolore enim earum suscipit inventore delectus!
                  </TableCell>
                </TableRow>

                <TableRow className="md:hidden">
                  <TableCell colSpan={2} className="font-semibold">
                    KEADAAN SEBELUMNYA
                  </TableCell>
                </TableRow>
                <TableRow className="md:hidden">
                  <TableCell colSpan={2}>{data?.keadaan_sebelumnya} Lorem ipsum dolor sit amet consectetur adipisicing elit. Similique iusto quisquam libero maxime voluptatibus, enim voluptatum neque iste. Recusandae, ex.</TableCell>
                </TableRow>
                <TableRow className="md:hidden">
                  <TableCell colSpan={2} className="font-semibold">
                    SARAN YANG DIAJUKAN
                  </TableCell>
                </TableRow>
                <TableRow className="md:hidden">
                  <TableCell colSpan={2}>{data?.saran_yang_diajukan} Lorem ipsum dolor sit amet consectetur adipisicing elit. Error aut iure in sint perspiciatis dolore enim earum suscipit inventore delectus!</TableCell>
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
                    {data?.hasil_atau_manfaat_yang_diharapkan} Lorem ipsum dolor sit, amet consectetur adipisicing elit. Doloremque enim quis exercitationem! Repudiandae pariatur quod neque? Optio voluptatibus deleniti quibusdam!
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
                    className="bg-blue-700 text-center font-semibold text-white"
                  >
                    SARAN DITERIMA
                  </TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell colSpan={2} className="align-top">
                    <div className="grid w-full grid-cols-12 gap-2">
                      <div className="col-span-12 grid items-center gap-1.5 md:col-span-6">
                        <Label htmlFor="nama">
                          Nama<span className="text-red-700">*</span>
                        </Label>
                        <Input type="nama" id="nama" placeholder="Nama" />
                      </div>
                      <div className="col-span-12 grid items-center gap-1.5 md:col-span-6">
                        <Label htmlFor="tanggal">Tanggal</Label>
                        <Input
                          type="tanggal"
                          id="tanggal"
                          value={tanggal}
                          readOnly
                        />
                      </div>
                    </div>
                    <div className="mt-4 grid items-center gap-2">
                      <Label htmlFor="tanggal">
                        Sasaran Saran<span className="text-red-700">*</span>
                      </Label>
                      <RadioGroup defaultValue="">
                        {sasaranSaranList.map((_, i) => (
                          <div key={i} className="flex items-center space-x-2">
                            <RadioGroupItem value={_} id={`r_${i + 1}`} />
                            <Label htmlFor={`r_${i + 1}`}>{_}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                    <div className="mt-4 grid items-center gap-2">
                      <Label htmlFor="tanggal">
                        Pelaksanaan<span className="text-red-700">*</span>
                      </Label>
                      <RadioGroup defaultValue="">
                        {pelaksanaanList.map((_, i) => (
                          <div key={i} className="flex items-center space-x-2">
                            <RadioGroupItem value={_} id={`r_${i + 1}`} />
                            <Label htmlFor={`r_${i + 1}`}>{_}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                    <div className="mt-4 grid items-center gap-2">
                      <Label htmlFor="tanggal">
                        Lokasi Pekerjaan<span className="text-red-700">*</span>
                      </Label>
                      <RadioGroup defaultValue="">
                        {lokasiList.map((_, i) => (
                          <div key={i} className="flex items-center space-x-2">
                            <RadioGroupItem value={_} id={`r_${i + 1}`} />
                            <Label htmlFor={`r_${i + 1}`}>{_}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
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
                    className="bg-blue-700 text-center font-semibold text-white"
                  >
                    KOLOM UNTUK ATASAN<span className="text-red-500">*</span>
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
                    className="bg-blue-700 text-center font-semibold text-white"
                  >
                    SEKSI LAIN YANG BERHUBUNGAN
                    <span className="text-red-500">*</span>
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

          {data?.status_a.trim().length !== 0 ? (
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
