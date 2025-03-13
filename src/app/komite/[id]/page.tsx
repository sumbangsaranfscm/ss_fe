/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import useSSModule from "@/app/lib";
import { ArrowLeft, Download, Loader2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
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
import toast from "react-hot-toast";

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
const sasaranSaranList = ["Cost Down", "Kualitas", "Safety", "Lain-lain"];
const pelaksanaanList = ["Belum", "Sudah"];
const lokasiList = ["Plant", "Markt. & Purch.", "Fin. & Acct.", "HRD"];
const columns = ["5R", "S", "M", "E", "Q", "C", "D", "P"];

export default function DetailKomite() {
  const params = useParams<{ id: string }>();
  const { useGetDetail } = useSSModule();
  const { data, isFetching, isPending } = useGetDetail(params?.id ?? "");
  console.log(data);
  const router = useRouter();
  const { useUpdateKomite } = useSSModule();
  const { isPending: isPendingUpdate, mutate } = useUpdateKomite();
  const [benefit, setBenefit] = useState("");
  const [komiteStatus, setKomiteStatus] = useState("");
  const [catatanKhusus, setCatatanKhusus] = useState("null");

  const [penilaian, setPenilaian] = useState({
    penilaian: [
      { faktor: "Reduksi biaya", nilai: 2, reward: 0 },
      { faktor: "Efisiensi MP.", nilai: 0, reward: 0 },
      { faktor: "Produktifitas", nilai: 0, reward: 0 },
      { faktor: "Reduksi MH.", nilai: 0, reward: 0 },
      { faktor: "Safety", nilai: 0, reward: 0 },
      { faktor: "Kualitas", nilai: 0, reward: 0 },
      { faktor: "Lingkungan", nilai: 0, reward: 0 },
      { faktor: "Manfaat", nilai: 0, reward: 0 },
      { faktor: "Usaha", nilai: 0, reward: 0 },
      { faktor: "Kepedulian", nilai: 0, reward: 0 },
      { faktor: "Keaslian", nilai: 0, reward: 0 },
    ],
    totalReward: 0,
  });

  penilaian.penilaian.map((item) => {
    return (item.reward = item.nilai * 1000);
  });
  let total = 0;
  penilaian.penilaian.map((item) => {
    total = total + Number(item.reward);
  });
  penilaian.totalReward = total;

  const generatePDF = () => {
    const doc = new jsPDF("p", "mm", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();
    const headerX = 8;
    const headerY = 10;
    const headerWidth = 194;
    const headerHeight = 20;
    const spacing = 9;
    const logoWidth = 30;
    const logoHeight = 12;
    const logoX = headerX + 4;
    const logoY = headerY + (headerHeight - logoHeight) / 2;
    const imgData =
      "https://i.ibb.co.com/dszdvGv1/FSCM-Manufacturing-Indonesia-1-1024x368-1.png";
    doc.addImage(imgData, "PNG", logoX, logoY, logoWidth, logoHeight);

    doc.setLineWidth(0.7);
    doc.rect(headerX, headerY, headerWidth, headerHeight);

    const separatorX = logoX + logoWidth + 4;
    doc.line(separatorX, headerY, separatorX, headerY + headerHeight);

    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    const textX = separatorX + (headerWidth - separatorX - 70) / 2;
    const textY = headerY + headerHeight / 2 + 3;
    doc.text("SUGGESTION SYSTEM", textX, textY);

    autoTable(doc, {
      startY: headerY + headerHeight + spacing,
      tableWidth: 90,
      margin: { left: headerX + headerWidth - 90 },
      body: [
        ["No. Form", "F-21.0-15-01"],
        ["Revisi", "1"],
        ["Tanggal", "1 September 2004"],
      ],
      theme: "grid",
      styles: { fontSize: 10, cellPadding: 2 },
      columnStyles: { 0: { cellWidth: 40 }, 1: { cellWidth: 50 } },
    });

    const textStartY = (doc as any).lastAutoTable.finalY + spacing;
    doc.setFont("helvetica", "italic", "bold");
    doc.setFontSize(10);
    doc.text(
      "Ungkapkanlah ide, gagasan serta kreasi anda yang bermanfaat bagi diri sendiri, kelompok, maupun lingkungan kerja. Percayalah bahwa ide yang baik pasti akan menghasilkan kinerja yang lebih baik.",
      pageWidth / 2,
      textStartY,
      { align: "center", maxWidth: 180 },
    );

    const pagePadding = 7;
    const gap = 3;
    const leftTableWidth = 90;
    const rightTableWidth = pageWidth - leftTableWidth - 2 * pagePadding - gap;

    const leftTableX = pagePadding;
    const rightTableX = pageWidth - pagePadding - rightTableWidth;

    const tableStartY = textStartY + spacing;

    autoTable(doc, {
      startY: tableStartY,
      margin: { left: leftTableX },
      body: [
        ["No", `${data?.id}`],
        ["Nama Saran", `${data?.nama_saran}`],
        ["Penulis", `${data?.penulis}`],
        ["NRP.", `${data?.nrp}`],
        ["Departement/Seksi", `${data?.departemen_seksi}`],
      ],
      theme: "grid",
      styles: { fontSize: 10, cellPadding: 2 },
      columnStyles: {
        0: { cellWidth: leftTableWidth * 0.4 },
        1: { cellWidth: leftTableWidth * 0.6 },
      },
    });

    autoTable(doc, {
      startY: tableStartY,
      margin: { left: rightTableX },
      body: [
        ["Sasaran Diterima", `Nama: ${data?.nama_penerima}`],
        [
          "",
          `Tgl: ${format(parseISO(data?.tanggal_diterima ?? "2025-02-26T17:00:00.000Z"), "d MMMM yyyy", { locale: id })}`,
        ],
        ["Sasaran Saran", `${data?.sasaran_saran}`],
        ["Pelaksanaan", `${data?.pelaksanaan}`],
        ["Lokasi Perkerjaan", `${data?.lokasi_perkerjaan}`],
      ],
      theme: "grid",
      styles: { fontSize: 10, cellPadding: 2 },
      columnStyles: {
        0: { cellWidth: rightTableWidth * 0.4 },
        1: { cellWidth: rightTableWidth * 0.6 },
      },
    });

    const tableStartsY = (doc as any).lastAutoTable.finalY + spacing;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text(
      "KETERANGAN SEKITAR SARAN",
      doc.internal.pageSize.width / 2,
      tableStartsY,
      {
        align: "center",
      },
    );

    autoTable(doc, {
      startY: tableStartsY + spacing,
      margin: { left: 10, right: 10 },
      body: [
        [
          {
            content: "Keadaan sebelumnya",
            styles: { halign: "center", fontStyle: "bold" },
          },
          {
            content: "Saran yang diajukan",
            styles: { halign: "center", fontStyle: "bold" },
          },
        ],
        [`${data?.keadaan_sebelumnya}`, `${data?.saran_yang_diajukan}`],
      ],
      theme: "grid",
      styles: { fontSize: 10, cellPadding: 5 },
      columnStyles: {
        0: { cellWidth: "auto" },
        1: { cellWidth: "auto" },
      },
    });

    const tableStartsxY = (doc as any).lastAutoTable.finalY + spacing;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text(
      "HASIL / MANFAAT YANG DIHARAPKAN",
      doc.internal.pageSize.width / 2,
      tableStartsxY,
      {
        align: "center",
      },
    );

    autoTable(doc, {
      startY: tableStartsxY + spacing,
      margin: { left: 10, right: 10 },
      body: [[`${data?.hasil_atau_manfaat_yang_diharapkan}`]],
      theme: "grid",
      styles: { fontSize: 10, cellPadding: 5 },
      columnStyles: {
        0: { cellWidth: "auto", minCellHeight: 40 },
      },
    });

    doc.save("suggestion_system.pdf");
  };

  const handleSubmit = () => {
    if (komiteStatus == "") {
      toast.error("Kolom untuk atasan belum di isi");
    } else {
      mutate({
        id: params?.id ?? "",
        komite_status: komiteStatus,
        catatan_khusus: catatanKhusus,
        benefit: benefit,
      });
    }
  };

  console.log(data);
  console.log(data?.status_a.trim().length !== 0);

  return (
    <div className="mycontainer mx-auto px-2 pb-10 pt-4">
      <Button className="mb-4" onClick={() => router.push("/komite")}>
        <ArrowLeft />
        Kembali
      </Button>
      <Button
        onClick={generatePDF}
        className="fixed bottom-5 right-5 z-50"
        size={"icon"}
      >
        <Download />
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
                      defaultValue={
                        data?.status_komite.trim().length === 0
                          ? ""
                          : data?.status_komite
                      }
                      onValueChange={(e) => {
                        setKomiteStatus(e);
                      }}
                    >
                      <>
                        {statusKomiteList.map((_, i) => (
                          <div key={i} className="flex items-center space-x-2">
                            <RadioGroupItem
                              disabled={data?.status_komite.trim().length !== 0}
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
                {penilaian.penilaian.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="border-r align-middle">
                      {index + 1}
                    </TableCell>
                    <TableCell className="border-r align-middle">
                      {item.faktor}
                    </TableCell>
                    <TableCell className="w-1/3 border-r align-middle">
                      <Input
                        type="number"
                        value={item.nilai}
                        onChange={(e) => {
                          if (Number(e.target.value) >= 0) {
                            setPenilaian((prev) => {
                              let total = 0;

                              prev.penilaian[index].nilai = Number(
                                e.target.value,
                              );
                              prev.penilaian[index].reward =
                                Number(e.target.value) * 1000;
                              prev.penilaian.map((item) => {
                                total = total + Number(item.reward);
                              });
                              prev.totalReward = total;

                              console.log(prev);

                              return {
                                ...prev,
                              };
                            });
                          }
                        }}
                        className="w-full text-center"
                      />
                    </TableCell>
                    <TableCell className="text-center">{item.reward}</TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={3} className="text-right font-bold">
                    Total
                  </TableCell>
                  <TableCell className="text-center font-bold">
                    Rp. {penilaian.totalReward}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          <div className="mb-4 rounded-lg border p-4">
            <h2 className="text-center font-semibold">
              Catatan Khusus oleh Kepala Divisi/Kepala Bagian{" "}
              <span className="text-red-500">*</span>
            </h2>
            <p className="text-center text-sm text-gray-600">
              Berilah tanda Centang pada tulisan di dalam kolom sesuai SS tsb.
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
                      <Checkbox
                        onChange={(e) => {
                          const target = e.target as HTMLInputElement;
                          setCatatanKhusus(
                            target.checked ? index.toString() : "",
                          );
                        }}
                      />
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
                      value={
                        data?.status_b.trim().length !== 0
                          ? data?.benefit
                          : benefit
                      }
                      onChange={(e) => setBenefit(e.target.value)}
                      placeholder="Masukkan Benefit"
                      className="text-center"
                    />
                  </TableCell>
                </TableRow>

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

          <Button onClick={handleSubmit} type="button" className="w-full">
            {false ? <Loader2 className="animate-spin" /> : "SUBMIT"}
          </Button>
        </>
      )}
    </div>
  );
}
