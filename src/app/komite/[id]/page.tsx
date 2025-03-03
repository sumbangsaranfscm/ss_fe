"use client";
import useSSModule from "@/app/lib";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
  TableHead,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
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

const statusKomiteList = [
  "Sudah dilaksanakan",
  "Masih perlu pertimbangan",
  "Belum dapat nilai/pending",
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

const initialData = [
  "Reduksi biaya",
  "Efisiensi MP.",
  "Produktifitas",
  "Reduksi MH.",
  "Safety",
  "Kualitas",
  "Lingkungan",
  "Manfaat",
  "Usaha",
  "Kepedulian",
  "Keaslian",
];
const columns = ["5R", "S", "M", "E", "Q", "C", "D", "P"];

export default function DetailKomite() {
  const params = useParams<{ id: string }>();
  const { useGetDetail } = useSSModule();
  const { data, isFetching, isPending } = useGetDetail(params?.id ?? "");
  const router = useRouter();
  const [values, setValues] = useState(Array(initialData.length).fill(""));
  const [rewards, setRewards] = useState(Array(initialData.length).fill(0));
  const [benefit, setBenefit] = useState("");

  const handleInputChange = (index: number, value: number) => {
    const newValues = [...values];
    newValues[index] = value;
    setValues(newValues);

    const newRewards = [...rewards];
    newRewards[index] = value * 1000;
    setRewards(newRewards);
  };

  const totalReward = rewards.reduce((acc, curr) => acc + curr, 0);

  const [statusKomite, setstatusKomite] = useState("");

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
                    className="bg-neutral-50 text-center font-semibold text-black"
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
                        <Label htmlFor="nama">Nama</Label>
                        <Input
                          value={data?.nama_penerima}
                          readOnly
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
                          value={format(
                            parseISO(
                              data?.tanggal_diterima ??
                                "2025-02-26T17:00:00.000Z",
                            ),
                            "d MMMM yyyy",
                            { locale: id },
                          )}
                          readOnly
                        />
                      </div>
                    </div>
                    <div className="mt-4 grid items-center gap-2">
                      <Label htmlFor="tanggal">Sasaran Saran</Label>
                      <RadioGroup defaultValue={data?.sasaran_saran}>
                        {sasaranSaranList.map((_, i) => (
                          <div key={i} className="flex items-center space-x-2">
                            <RadioGroupItem
                              disabled={true}
                              value={_}
                              id={`r_${_}`}
                            />
                            <Label htmlFor={`r_${_}`}>{_}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                    <div className="mt-4 grid items-center gap-2">
                      <Label htmlFor="tanggal">Pelaksanaan</Label>
                      <RadioGroup defaultValue={data?.pelaksanaan}>
                        {pelaksanaanList.map((_, i) => (
                          <div key={i} className="flex items-center space-x-2">
                            <RadioGroupItem
                              disabled={true}
                              value={_}
                              id={`r_${_}`}
                            />
                            <Label htmlFor={`r_${_}`}>{_}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                    <div className="mt-4 grid items-center gap-2">
                      <Label htmlFor="tanggal">Lokasi Pekerjaan</Label>
                      <RadioGroup defaultValue={data?.lokasi_perkerjaan}>
                        {lokasiList.map((_, i) => (
                          <div key={i} className="flex items-center space-x-2">
                            <RadioGroupItem
                              disabled={true}
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
                    className="bg-neutral-50 text-center font-semibold text-black"
                  >
                    KOLOM UNTUK ATASAN
                  </TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell colSpan={2} className="align-top">
                    <RadioGroup
                      defaultValue={
                        data?.status_a.trim().length !== 0 ? data?.status_a : ""
                      }
                    >
                      {statusList.map((_, i) => (
                        <div key={i} className="flex items-center space-x-2">
                          <RadioGroupItem
                            disabled={true}
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
                    className="bg-neutral-50 text-center font-semibold text-black"
                  >
                    SEKSI LAIN YANG BERHUBUNGAN
                  </TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell colSpan={2} className="align-top">
                    <RadioGroup
                      defaultValue={
                        data?.status_b.trim().length === 0
                          ? "Tidak Ada"
                          : data?.status_b
                      }
                    >
                      <>
                        {statusList2.map((_, i) => (
                          <div key={i} className="flex items-center space-x-2">
                            <RadioGroupItem
                              disabled={true}
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

          <div className="mb-4 overflow-hidden rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableCell
                    colSpan={2}
                    className="bg-blue-500 text-center font-semibold text-white"
                  >
                    KOLOM UNTUK KOMITE TQC{" "}
                    <span className="text-red-500">*</span>
                  </TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell colSpan={2} className="align-top">
                    <RadioGroup
                      defaultValue={statusKomite}
                      onValueChange={(e) => {
                        setstatusKomite(e);
                      }}
                    >
                      <>
                        {statusKomiteList.map((_, i) => (
                          <div key={i} className="flex items-center space-x-2">
                            <RadioGroupItem value={_} id={`r_${_ + i + 5}`} />
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

          <div className="mb-4 overflow-hidden rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="bg-blue-500 text-center font-semibold text-white"
                  >
                    PENILAIAN OLEH TIM PENILAI{" "}
                    <span className="text-red-500">*</span>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableHead className="border-r">No.</TableHead>
                  <TableHead className="">Faktor Penilaian</TableHead>
                  <TableHead className="border-l text-center">Nilai</TableHead>
                  <TableHead className="border-l text-center">Reward</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {initialData.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="border-r align-middle">
                      {index + 1}
                    </TableCell>
                    <TableCell className="border-r align-middle">
                      {item}
                    </TableCell>
                    <TableCell className="w-1/3 border-r align-middle">
                      <Input
                        type="number"
                        value={values[index]}
                        min="0"
                        onChange={(e) =>
                          handleInputChange(index, Number(e.target.value))
                        }
                        className="w-full text-center"
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      {rewards[index]}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={3} className="text-right font-bold">
                    Total
                  </TableCell>
                  <TableCell className="text-center font-bold">
                    Rp. {totalReward}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          <div className="p-4 mb-4 rounded-lg border ">
            <h2 className="text-center font-semibold">
              Catatan Khusus oleh Kepala Divisi/Kepala Bagian <span className="text-red-500">*</span>
            </h2>
            <p className="text-center text-sm text-gray-600">
              Berilah tanda X pada tulisan di dalam kolom sesuai SS tsb.
            </p>

            {/* Table */}
            <Table className="mt-4 border">
              <TableHeader>
                <TableRow>
                  {columns.map((col, index) => (
                    <TableHead key={index} className="border text-center">
                      {col}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* Row for Checkboxes */}
                <TableRow>
                  {columns.map((_, index) => (
                    <TableCell key={index} className="w-12 border text-center">
                      <Checkbox />
                    </TableCell>
                  ))}
                </TableRow>

                {/* Row for Benefit */}
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="border text-center font-medium"
                  >
                    Benefit (Rp. / MH.) Perbulan =
                  </TableCell>
                  <TableCell colSpan={6} className="border text-center">
                    <Input
                      value={benefit}
                      onChange={(e) => setBenefit(e.target.value)}
                      placeholder="Masukkan Benefit"
                      className="text-center"
                    />
                  </TableCell>
                </TableRow>

                {/* Footer Row */}
                <TableRow>
                  <TableCell
                    colSpan={9}
                    className="border text-center font-medium"
                  >
                    Section/Dept./Div. Head
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
              onClick={() => {}}
              disabled={true}
              type="button"
              className="w-full"
            >
              {false ? <Loader2 className="animate-spin" /> : "SUBMIT"}
            </Button>
          )}
        </>
      )}
    </div>
  );
}
