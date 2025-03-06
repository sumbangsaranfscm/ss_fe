/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { format, parseISO } from "date-fns";
import { id } from "date-fns/locale";

const statusList = [
  "Saran dapat dipakai/dilaksanakan",
  "Masih perlu pertimbangan",
  "Pengulangan saran/ide lama",
  "Tidak dapat dipakai",
];

const statusList2 = [
  "Tidak Ada",
  "Saran dapat dipakai/dilaksanakan",
  "Masih perlu pertimbangan",
  "Pengulangan saran/ide lama",
  "Tidak dapat dipakai",
];

const sasaranSaranList = [
  "Cost Down",
  "Kualitas",
  "Safety",
  "Lain-lain",
];

const pelaksanaanList = ["Belum", "Sudah"];

const lokasiList = ["Plant", "Markt. & Purch.", "Fin. & Acct.", "HRD"];

export default function Detail() {
  const params = useParams<{ id: string }>();
  const { useGetDetail } = useSSModule();
  const { data, isFetching, isPending } = useGetDetail(params?.id ?? "");
  const router = useRouter();
  const { useUpdatePersetujuan } = useSSModule();
  const { isPending: isPendingUpdate, mutate } = useUpdatePersetujuan();

  const [statusA, setStatusA] = useState("");
  const [statusB, setStatusB] = useState("Tidak Ada");
  const [nama, setNama] = useState("");
  const [tanggal, setTanggal] = useState("");
  const [sasaran, setSasaran] = useState("");
  const [pelaksanaan, setPelaksanaan] = useState("");
  const [lokasi, setLokasi] = useState("");
 

  useEffect(() => {
    const iso = new Date().toISOString();
    const parseDate = format(parseISO(iso), "d MMMM yyyy", { locale: id });
    setTanggal(parseDate);
  }, []);

  const handleSubmit = () => {
    if (statusA == "") {
      toast.error("Kolom untuk atasan belum di isi");
    } else {
      mutate({
        status_a: statusA,
        status_b: statusB,
        id: params?.id ?? "",
        nama_p: nama,
        tgl_d: tanggal,
        sasaran_s: sasaran,
        pelaksanaan: pelaksanaan,
        lokasi_p: lokasi,
      });
    }
  };

  console.log(data);
  console.log(data?.status_a.trim().length !== 0);

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
                  <TableCell>{data?.penulis}</TableCell>
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
                    {data?.keadaan_sebelumnya} Lorem ipsum dolor sit amet
                    consectetur adipisicing elit. Similique iusto quisquam
                    libero maxime voluptatibus, enim voluptatum neque iste.
                    Recusandae, ex.
                  </TableCell>
                  <TableCell className="align-top">
                    {data?.saran_yang_diajukan} Lorem ipsum dolor sit amet
                    consectetur adipisicing elit. Error aut iure in sint
                    perspiciatis dolore enim earum suscipit inventore delectus!
                  </TableCell>
                </TableRow>

                <TableRow className="md:hidden">
                  <TableCell colSpan={2} className="font-semibold">
                    KEADAAN SEBELUMNYA
                  </TableCell>
                </TableRow>
                <TableRow className="md:hidden">
                  <TableCell colSpan={2}>
                    {data?.keadaan_sebelumnya} Lorem ipsum dolor sit amet
                    consectetur adipisicing elit. Similique iusto quisquam
                    libero maxime voluptatibus, enim voluptatum neque iste.
                    Recusandae, ex.
                  </TableCell>
                </TableRow>
                <TableRow className="md:hidden">
                  <TableCell colSpan={2} className="font-semibold">
                    SARAN YANG DIAJUKAN
                  </TableCell>
                </TableRow>
                <TableRow className="md:hidden">
                  <TableCell colSpan={2}>
                    {data?.saran_yang_diajukan} Lorem ipsum dolor sit amet
                    consectetur adipisicing elit. Error aut iure in sint
                    perspiciatis dolore enim earum suscipit inventore delectus!
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
                    {data?.hasil_atau_manfaat_yang_diharapkan} Lorem ipsum dolor
                    sit, amet consectetur adipisicing elit. Doloremque enim quis
                    exercitationem! Repudiandae pariatur quod neque? Optio
                    voluptatibus deleniti quibusdam!
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
                        <Input
                          value={
                            data?.status_a.trim().length !== 0
                              ? data?.nama_penerima
                              : nama
                          }
                          onChange={(e) => setNama(e.target.value)}
                          readOnly={data?.status_a.trim().length !== 0}
                          type="nama"
                          id="nama"
                          placeholder="Nama"
                        />
                      </div>
                      <div className="col-span-12 grid items-center gap-1.5 md:col-span-6">
                        <Label htmlFor="tanggal">Tanggal</Label>
                        <Input
                          type="text"
                          id="tanggal"
                          value={
                            data?.status_a.trim().length !== 0 &&
                            data?.tanggal_diterima
                              ? format(
                                  parseISO(data?.tanggal_diterima),
                                  "d MMMM yyyy",
                                  { locale: id },
                                )
                              : tanggal
                          }
                          readOnly
                        />
                      </div>
                    </div>
                    <div className="mt-4 grid items-center gap-2">
                      <Label htmlFor="tanggal">
                        Sasaran Saran<span className="text-red-700">*</span>
                      </Label>
                      <RadioGroup
                        onValueChange={(e) => setSasaran(e)}
                        defaultValue={
                          data?.status_a.trim().length !== 0
                            ? data?.sasaran_saran
                            : ""
                        }
                      >
                        {sasaranSaranList.map((_, i) => (
                          <div key={i} className="flex items-center space-x-2">
                            <RadioGroupItem
                              disabled={data?.status_a.trim().length !== 0}
                              value={_}
                              id={`r_${_}`}
                            />
                            <Label htmlFor={`r_${_}`}>{_}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                    <div className="mt-4 grid items-center gap-2">
                      <Label htmlFor="tanggal">
                        Pelaksanaan<span className="text-red-700">*</span>
                      </Label>
                      <RadioGroup
                        onValueChange={(e) => setPelaksanaan(e)}
                        defaultValue={
                          data?.status_a.trim().length !== 0
                            ? data?.pelaksanaan
                            : ""
                        }
                      >
                        {pelaksanaanList.map((_, i) => (
                          <div key={i} className="flex items-center space-x-2">
                            <RadioGroupItem
                              disabled={data?.status_a.trim().length !== 0}
                              value={_}
                              id={`r_${_}`}
                            />
                            <Label htmlFor={`r_${_}`}>{_}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                    <div className="mt-4 grid items-center gap-2">
                      <Label htmlFor="tanggal">
                        Lokasi Pekerjaan<span className="text-red-700">*</span>
                      </Label>
                      <RadioGroup
                        onValueChange={(e) => setLokasi(e)}
                        defaultValue={
                          data?.status_a.trim().length !== 0
                            ? data?.lokasi_perkerjaan
                            : ""
                        }
                      >
                        {lokasiList.map((_, i) => (
                          <div key={i} className="flex items-center space-x-2">
                            <RadioGroupItem
                              disabled={data?.status_a.trim().length !== 0}
                              value={_}
                              id={`r_${_}`}
                            />
                            <Label htmlFor={`r_${_}`}>{_}</Label>
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
                      defaultValue={
                        data?.status_a.trim().length !== 0 ? data?.status_a : ""
                      }
                    >
                      {statusList.map((_, i) => (
                        <div key={i} className="flex items-center space-x-2">
                          <RadioGroupItem
                            disabled={data?.status_a.trim().length !== 0}
                            value={_}
                            id={`r_${_}`}
                          />
                          <Label htmlFor={`r_${_}`}>{_}</Label>
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
                      defaultValue={
                        data?.status_b.trim().length !== 0
                          ? data?.status_b
                          : "Tidak Ada"
                      }
                    >
                      <>
                        {statusList2.map((_, i) => (
                          <div key={i} className="flex items-center space-x-2">
                            <RadioGroupItem
                              disabled={data?.status_a.trim().length !== 0}
                              value={_}
                              id={`r_${_ + i + 5}`}
                            />
                            <Label htmlFor={`r_${_ + i + 5}`}>{_}</Label>
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
            <Button type="button" disabled className="w-full">
              DATA SUDAH DI APPROVAL
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={
                statusA === "" ||
                isPendingUpdate ||
                nama === "" ||
                sasaran === "" ||
                pelaksanaan === "" ||
                lokasi === ""
              }
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
