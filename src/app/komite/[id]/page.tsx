/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import useSSModule from "@/app/lib";
import { ArrowLeft, Download, Loader2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
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
import {
  lokasiList,
  pelaksanaanList,
  sasaranSaranList,
  statusList,
  statusList2,
} from "@/app/approval/[id]/page";

const statusKomiteList = [
  "Sudah dilaksanakan",
  "Masih perlu pertimbangan",
  "Belum dapat nilai/pending",
  "Tidak dapat dipakai",
];

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
  const { useUpdateKomite } = useSSModule();
  const { isPending: isPendingUpdate, mutate } = useUpdateKomite();
  const [values, setValues] = useState(Array(initialData.length).fill(""));
  const [rewards, setRewards] = useState(Array(initialData.length).fill(0));
  const [benefit, setBenefit] = useState("");
  const [komiteStatus, setKomiteStatus] = useState("");
  const [catatanKhusus, setCatatanKhusus] = useState("null");

  const generatePDF = () => {
    const doc = new jsPDF({
      orientation: "p", // Portrait (tegak)
      unit: "mm",
      format: "a4", // [lebar, tinggi] -> Panjangnya jadi 500mm
    });
    const pageWidth = doc.internal.pageSize.getWidth();
    const headerX = 8;
    const headerY = 10;
    const headerWidth = 194;
    const headerHeight = 20;
    const spacing = 12;
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
        ["", `Tgl: ${data?.tanggal_diterima}`],
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

    const tableStarxxY = (doc as any).lastAutoTable.finalY + spacing;
    const colWidth = tableStarxxY / 4; // Misalnya ada 4 kolom dalam tabel

    doc.text(
      "KOLOM UNTUK ATASAN",
      doc.internal.pageSize.width / 2 - colWidth,
      tableStarxxY,
      {
        align: "center",
      },
    );

    doc.text(
      "SEKSI LAIN YANG BERHUBUNGAN",
      doc.internal.pageSize.width / 2.5 + colWidth,
      tableStarxxY,
      {
        align: "center",
      },
    );

    const tableData = [["", "Paraf & Tgl.", "", "Paraf & Tgl."]];
    const bodyData = [[`${data?.status_a}`, "", `${data?.status_b}`, ""]];

    autoTable(doc, {
      startY: tableStarxxY + spacing,
      margin: { left: 10, right: 10 },
      head: tableData,
      body: bodyData,
      theme: "grid",
      showHead: "firstPage",
      rowPageBreak: "avoid",
      styles: {
        fontSize: 10,
        halign: "center",
        valign: "middle",
        cellPadding: 3,
      },
      headStyles: {
        fillColor: false,
        textColor: "black",
        lineWidth: 0.1,
        halign: "center",
        valign: "middle",
      },
      columnStyles: {
        0: { cellWidth: "auto" },
        1: { cellWidth: 30, fontStyle: "bold" },
        2: { cellWidth: "auto" },
        3: { cellWidth: 30, fontStyle: "bold" },
      },
      willDrawCell: function (data) {
        console.log(
          `(willDrawCell) Row: ${data.row.index}, Column: ${data.column.index}, Content: ${data.cell.text}`,
        );
        console.log("Data Body:", bodyData);
        console.log("Total Baris di Body:", bodyData.length);

        if (data.row.section === "head" && data.row.index === 0) {
          console.log("Menghapus border bawah header di index 0");
          data.cell.styles.lineWidth = {
            top: 0.1,
            bottom: 0,
            left: 0.1,
            right: 0.1,
          };
        }

        if (data.row.section === "head" && data.column.index === 1) {
          data.cell.styles.lineWidth = { bottom: 0.5, top: 0.1 };
        }

        if (data.row.section === "head" && data.column.index === 3) {
          data.cell.styles.lineWidth = { bottom: 0.5, right: 0.1, top: 0.1 };
        }

        if (
          data.row.section === "body" &&
          (data.column.index === 1 || data.column.index === 3)
        ) {
          const textX = data.cell.x + data.cell.width / 2;
          const textY = data.cell.y + data.cell.height / 2 - 2;

          data.doc.setFontSize(10);
          data.doc.text(data.cell.text, textX, textY, {
            align: "center",
            baseline: "middle",
          });
        }

        if (data.row.section === "body" && data.row.index === 0) {
          console.log("Menghapus border atas body di index 0");
          data.cell.styles.lineWidth = {
            top: 0,
            bottom: 0.1,
            left: 0.1,
            right: 0.1,
          };
        }
      },
    });

    const tableStartsxxY = (doc as any).lastAutoTable.finalY + spacing;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text(
      "KOLOM UNTUK KOMITE TQC",
      doc.internal.pageSize.width / 2,
      tableStartsxxY,
      {
        align: "center",
      },
    );

    autoTable(doc, {
      startY: tableStartsxxY + spacing,
      margin: { left: 10, right: 10 },
      body: [
        [
          {
            content: "Sudah dilaksanakan",
            styles: {
              fontStyle: "bold",
              lineWidth: { top: 0.1, bottom: 0.1, left: 0.1, right: 0 },
            },
          },
          {
            content: "",
            styles: {
              lineWidth: { top: 0.1, bottom: 0.1, left: 0, right: 0.1 },
            },
          },
          {
            content: "Paraf & Tgl",
            styles: {
              fontStyle: "bold",
            },
          },
        ],
        [
          { content: `${data?.komite_status}`, styles: { minCellHeight: 15 } },
          { content: "", styles: { minCellHeight: 15 } },
          { content: "", styles: { minCellHeight: 15 } },
        ],
      ],
      theme: "grid",
      styles: { fontSize: 10, cellPadding: 2 },
      columnStyles: {
        1: { cellWidth: 60 },
      },
    });

    const tableStartsxxsY = (doc as any).lastAutoTable.finalY + spacing;

    // Judul di tengah halaman
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text(
      "PENILAIAN OLEH TEAM PENILAI",
      doc.internal.pageSize.width / 2,
      tableStartsxxsY,
      {
        align: "center",
      },
    );

    autoTable(doc, {
      startY: tableStartsxxsY + 5,
      margin: { left: 10, right: 10 },
      head: [["No", "Faktor Penilaian", "Nilai", "Reward"]],
      body: [
        ["1", "Reduksi Biaya", "", ""],
        ["2", "Efisiensi MP", "", ""],
        ["3", "Produktivitas", "", ""],
        ["4", "Reduksi MTTR", "", ""],
        ["5", "Safety", "", ""],
        ["6", "Kualitas", "", ""],
        ["7", "Lingkungan", "", ""],
        ["8", "Manfaat", "", ""],
        ["9", "Kepedulian", "", ""],
        ["10", "Keaslian", "", ""],
      ],
      theme: "grid",
      styles: { fontSize: 10 },
      headStyles: {
        fillColor: false,
        textColor: "black",
        lineWidth: 0.1,
        halign: "center",
        valign: "middle",
      },
    });

    const tableStartssY = (doc as any).lastAutoTable.finalY + spacing;

    autoTable(doc, {
      startY: tableStartssY + spacing,
      margin: { left: 10, right: 10 },
      body: [
        [
          {
            content: "Catatan khusus oleh Kepala Divisi/Kepala Bagian",
            colSpan: 8,
            styles: { halign: "center", fontStyle: "bold" },
          },
        ],
        [
          {
            content:
              "Berilah tanda X pada tulisan didalam kolom sesuai SS tsb.",
            colSpan: 8,
            styles: { halign: "center", fontSize: 8 },
          },
        ],
        ["5R", "S", "M", "E", "Q", "C", "D", "P"],
        ["Paraf :", "", "", "", "", "", "", "Benefit (Rp. / MH.) Perbulan ="],
        ["", "", "", "", "", "", "", ""],
        ["Section/Dept./Div. Head", "", "", "", "", "", "", ""],
      ],
      theme: "grid",
      styles: {
        fontSize: 9,
        cellPadding: 2,
        valign: "middle",
        halign: "center",
      },
      columnStyles: {
        0: { halign: "left", cellWidth: 30 }, // "Paraf :" lebih lebar
        7: { halign: "left", cellWidth: 50 }, // "Benefit..." lebih lebar
      },
    });

    doc.save("suggestion_system.pdf");
  };

  const handleInputChange = (index: number, value: any) => {
    const newValues = [...values];
    newValues[index] = value;
    setValues(newValues);

    const newRewards = [...rewards];
    newRewards[index] = value * 1000;
    setRewards(newRewards);
  };

  const totalReward = rewards.reduce((acc, curr) => acc + curr, 0);

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
      <Button className="mb-4" onClick={() => router.push("/approval")}>
        <ArrowLeft />
        Kembali
      </Button>
      <Button
        onClick={generatePDF}
        className="fixed bottom-5 right-5"
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
                      defaultValue={komiteStatus}
                      onValueChange={(e) => {
                        setKomiteStatus(e);
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
                          handleInputChange(index, e.target.value)
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
