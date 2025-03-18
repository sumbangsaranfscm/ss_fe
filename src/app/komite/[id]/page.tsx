/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import useSSModule from "@/app/lib";
import { ArrowLeft, Download, Loader2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import jsPDF from "jspdf";
import autoTable, { RowInput } from "jspdf-autotable";
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
import { da, id } from "date-fns/locale";
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

const formatRupiah = (value: number) => {
  return new Intl.NumberFormat("id-ID").format(value);
};

export default function DetailKomite() {
  const params = useParams<{ id: string }>();
  const { useGetDetail } = useSSModule();
  const { data, isFetching, isPending } = useGetDetail(params?.id ?? "");
  console.log(data);
  const router = useRouter();
  const { useUpdateKomite } = useSSModule();
  const { isPending: isPendingUpdate, mutate } = useUpdateKomite();
  const [benefit, setBenefit] = useState("");
  const formatRupiahNEW = (angka: string) => {
    return angka.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };
  const [komiteStatus, setKomiteStatus] = useState("");
  const [catatanKhusus, setCatatanKhusus] = useState("null");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const handleCheckedChange = (checked: boolean | string, item: string) => {
    setSelectedItems((prev) =>
      checked ? [...prev, item] : prev.filter((i) => i !== item),
    );
  };

  useEffect(() => {
    console.log(benefit);
  }, [benefit]);

  const [penilaian, setPenilaian] = useState({
    penilaian: [
      { faktor: "Reduksi biaya", nilai: "", reward: 0 },
      { faktor: "Efisiensi MP.", nilai: "", reward: 0 },
      { faktor: "Produktifitas", nilai: "", reward: 0 },
      { faktor: "Reduksi MH.", nilai: "", reward: 0 },
      { faktor: "Safety", nilai: "", reward: 0 },
      { faktor: "Kualitas", nilai: "", reward: 0 },
      { faktor: "Lingkungan", nilai: "", reward: 0 },
      { faktor: "Manfaat", nilai: "", reward: 0 },
      { faktor: "Usaha", nilai: "", reward: 0 },
      { faktor: "Kepedulian", nilai: "", reward: 0 },
      { faktor: "Keaslian", nilai: "", reward: 0 },
    ],
    totalReward: "",
  });

  penilaian.penilaian.map((item) => {
    return (item.reward = Number(item.nilai) * 1000);
  });
  let total = 0;
  penilaian.penilaian.map((item) => {
    total = total + Number(item.reward);
  });
  penilaian.totalReward = total.toString();

  const generatePDF = () => {
    const doc = new jsPDF({
      orientation: "p",
      unit: "mm",
      format: "a4",
    });
    const headerX = 8;
    const headerY = 7;
    const headerWidth = 194;
    const headerHeight = 10;
    const spacing = 1.2;
    const logoWidth = 15;
    const logoHeight = 5;
    const logoX = headerX + 4;
    const logoY = headerY + (headerHeight - logoHeight) / 2;
    const imgData =
      "https://i.ibb.co.com/dszdvGv1/FSCM-Manufacturing-Indonesia-1-1024x368-1.png";
    doc.addImage(imgData, "PNG", logoX, logoY, logoWidth, logoHeight);

    doc.setLineWidth(0.4);
    doc.rect(headerX, headerY, headerWidth, headerHeight);

    const separatorX = logoX + logoWidth + 4;
    doc.line(separatorX, headerY, separatorX, headerY + headerHeight);

    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    const textX = separatorX + (headerWidth - separatorX - 70) / 2;
    const textY = headerY + headerHeight / 2 + 2;
    doc.text("SUGGESTION SYSTEM", textX, textY);

    const fontBaseSize = 8.5;
    const cellPadding = 0.5;

    autoTable(doc, {
      startY: headerY + headerHeight + spacing,
      tableWidth: 90,
      margin: { left: headerX + headerWidth - 55 },
      body: [
        ["No. Form", "F-21.0-15-01"],
        ["Revisi", "1"],
        ["Tanggal", "1 September 2004"],
      ],
      theme: "grid",
      styles: {
        textColor: "black",
        fontSize: fontBaseSize,
        cellPadding: cellPadding,
        lineColor: "black",
        lineWidth: 0.2,
      },
      headStyles: {
        textColor: "black",
        lineWidth: 0.2,
        lineColor: "black",
      },
      columnStyles: { 0: { cellWidth: 20 }, 1: { cellWidth: 35 } },
    });

    let tableStartY = (doc as any).lastAutoTable.finalY + spacing;

    tableStartY = (doc as any).lastAutoTable.finalY + 0.3;

    autoTable(doc, {
      startY: tableStartY,
      margin: { left: headerX },
      tableWidth: 194,
      head: [
        [
          {
            content:
              "Ungkapkan lah ide, gagasan serta kreasi anda yang kiranya bermanfaat, baik bagi diri anda, kelompok maupun lingkungan\ntempat anda bekerja. Percayalah bahwa dengan ide yang baik pasti akan mendapatkan hasil kerja yang lebih baik.",
            styles: { halign: "center" },
          },
        ],
      ],
      columnStyles: {
        0: { cellWidth: "auto" },
      },
      headStyles: {
        textColor: "black",
        fillColor: false,
        lineWidth: 0.1,
        halign: "center",
        valign: "middle",
      },
      theme: "grid",
      styles: {
        fontSize: 7,
        cellPadding: 2,
        textColor: "black",
      },
      willDrawCell: function (data) {
        if (data.row.index === 0 && data.column.index === 0) {
          data.cell.styles.lineWidth = 0;
        }
      },
    });

    tableStartY = (doc as any).lastAutoTable.finalY + 0.3;

    const leftTableWidth = 96;
    const rightTableWidth = 96;

    const rightTableX = headerX + leftTableWidth + 2;

    autoTable(doc, {
      startY: tableStartY,
      margin: { left: headerX },
      body: [
        ["No", `${data?.id}`],
        ["Nama Saran", `${data?.nama_saran}`],
        ["Penulis", `${data?.penulis}`],
        ["NRP.", `${data?.nrp}`],
        ["Departement/Seksi", `${data?.departemen_seksi}`],
      ],
      theme: "grid",
      styles: {
        textColor: "black",
        fontSize: fontBaseSize,
        cellPadding: cellPadding,
        lineColor: "black",
        lineWidth: 0.2,
      },
      headStyles: {
        textColor: "black",
        lineWidth: 0.2,
        lineColor: "black",
      },
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
      styles: {
        textColor: "black",
        fontSize: fontBaseSize,
        cellPadding: cellPadding,
        lineColor: "black",
        lineWidth: 0.2,
      },
      headStyles: {
        textColor: "black",
        lineWidth: 0.2,
        lineColor: "black",
      },
      columnStyles: {
        0: { cellWidth: rightTableWidth * 0.4 },
        1: { cellWidth: rightTableWidth * 0.6 },
      },
    });

    tableStartY = (doc as any).lastAutoTable.finalY + 0.3;

    autoTable(doc, {
      startY: tableStartY,
      margin: { left: headerX },
      tableWidth: 194,
      head: [
        [{ content: "KETERANGAN SEKITAR SARAN", styles: { halign: "center" } }],
      ],
      columnStyles: {
        0: { cellWidth: "auto" },
      },
      headStyles: {
        textColor: "black",
        fillColor: false,
        lineWidth: 0.1,
        halign: "center",
        valign: "middle",
      },
      theme: "grid",
      styles: {
        fontSize: 8,
        cellPadding: 2,
        fontStyle: "bold",

        textColor: "black",
      },
      willDrawCell: function (data) {
        if (data.row.index === 0 && data.column.index === 0) {
          data.cell.styles.lineWidth = 0;
        }
      },
    });

    tableStartY = (doc as any).lastAutoTable.finalY + 0.3;

    autoTable(doc, {
      startY: tableStartY,
      margin: { left: headerX },
      tableWidth: 194,
      head: [
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
      ],
      headStyles: {
        textColor: "black",
        fillColor: false,
        halign: "center",
        valign: "middle",
        lineWidth: 0.2,
        lineColor: "black",
      },
      body: [[`${data?.keadaan_sebelumnya}`, `${data?.saran_yang_diajukan}`]],
      theme: "grid",
      styles: {
        textColor: "black",
        fontSize: fontBaseSize,
        cellPadding: cellPadding,
        lineColor: "black",
        lineWidth: 0.2,
      },
      columnStyles: {
        0: { cellWidth: "auto" },
        1: { cellWidth: "auto", minCellHeight: 45 },
      },
    });

    tableStartY = (doc as any).lastAutoTable.finalY + 0.3;

    autoTable(doc, {
      startY: tableStartY,
      margin: { left: headerX },
      tableWidth: 194,
      head: [
        [
          {
            content: "HASIL / MANFAAT YANG DIHARAPKAN",
            styles: { halign: "center" },
          },
        ],
      ],
      columnStyles: {
        0: { cellWidth: "auto" },
      },
      headStyles: {
        fillColor: false,
        textColor: "black",
        lineWidth: 0.1,
        halign: "center",
        valign: "middle",
      },
      theme: "grid",
      styles: {
        fontSize: 8,
        textColor: "black",
        cellPadding: 2,
        fontStyle: "bold",
      },
      willDrawCell: function (data) {
        if (data.row.index === 0 && data.column.index === 0) {
          data.cell.styles.lineWidth = 0;
        }
      },
    });

    tableStartY = (doc as any).lastAutoTable.finalY + 0.3;

    autoTable(doc, {
      startY: tableStartY,
      margin: { left: headerX },
      tableWidth: 194,
      body: [[`${data?.hasil_atau_manfaat_yang_diharapkan}`]],
      theme: "grid",
      styles: {
        fontSize: fontBaseSize,
        cellPadding: cellPadding,
        lineColor: "black",
        lineWidth: 0.2,
        textColor: "black",
      },
      headStyles: {
        lineWidth: 0.2,
        lineColor: "black",
      },
      columnStyles: {
        0: { cellWidth: "auto", minCellHeight: 25 },
      },
    });

    tableStartY = (doc as any).lastAutoTable.finalY + 0.3;

    autoTable(doc, {
      startY: tableStartY,
      margin: { left: headerX },
      tableWidth: 97,
      head: [
        [
          {
            content: "KOLOM UNTUK ATASAN",
            styles: { halign: "center" },
          },
        ],
      ],
      columnStyles: {
        0: { cellWidth: "auto" },
      },
      headStyles: {
        fillColor: false,
        textColor: "black",
        lineWidth: 0.1,
        halign: "center",
        valign: "middle",
      },
      theme: "grid",
      styles: {
        fontSize: 8,
        textColor: "black",

        cellPadding: 2,
        fontStyle: "bold",
      },
      willDrawCell: function (data) {
        if (data.row.index === 0 && data.column.index === 0) {
          data.cell.styles.lineWidth = 0;
        }
      },
    });
    autoTable(doc, {
      startY: tableStartY,
      margin: { left: headerX + 97 },
      tableWidth: 97,
      head: [
        [
          {
            content: "SEKSI LAIN YANG BERHUBUNGAN",
            styles: { halign: "center" },
          },
        ],
      ],
      columnStyles: {
        0: { cellWidth: "auto" },
      },
      headStyles: {
        fillColor: false,
        textColor: "black",
        lineWidth: 0.1,
        halign: "center",
        valign: "middle",
      },
      theme: "grid",
      styles: {
        fontSize: 8,
        textColor: "black",
        cellPadding: 2,
        fontStyle: "bold",
      },
      willDrawCell: function (data) {
        if (data.row.index === 0 && data.column.index === 0) {
          data.cell.styles.lineWidth = 0;
        }
      },
    });

    tableStartY = (doc as any).lastAutoTable.finalY + 0.3;

    const bodyData: RowInput[] | undefined = [
      [
        {
          content: `${data?.status_a}`,
          rowSpan: 2,
        },
        {
          content: "Paraf & Tgl.",
          styles: { fontStyle: "bold", textColor: "black" },
        },
        {
          content: `${data?.status_b}`,
          rowSpan: 2,
        },
        {
          content: "Paraf & Tgl.",
          styles: { fontStyle: "bold", textColor: "black" },
        },
      ],
      [
        {
          content: "",
        },
        {
          content: "",
        },
      ],
    ];

    autoTable(doc, {
      startY: tableStartY,
      margin: { left: headerX },
      tableWidth: 194,
      body: bodyData,
      theme: "grid",
      styles: {
        fontSize: fontBaseSize,
        halign: "center",
        valign: "middle",
        cellPadding: cellPadding,
        lineColor: "black",
        lineWidth: 0.2,
        textColor: "black",
      },
      headStyles: {
        lineWidth: 0.2,
        lineColor: "black",
        fillColor: false,
        textColor: "black",
        halign: "center",
        valign: "middle",
      },
      columnStyles: {
        0: { cellWidth: 194 * 0.3, minCellHeight: 22 },
        1: { cellWidth: 194 * 0.2 },
        2: { cellWidth: 194 * 0.3, minCellHeight: 22 },
        3: { cellWidth: 194 * 0.2 },
        4: { cellWidth: "auto" },
        5: { cellWidth: "auto" },
      },
    });

    tableStartY = (doc as any).lastAutoTable.finalY + 1;

    autoTable(doc, {
      startY: tableStartY,
      margin: { left: headerX },
      tableWidth: 194,
      head: [
        [
          {
            content: "KOLOM UNTUK KOMITE TQC",
            styles: { halign: "center" },
          },
        ],
      ],
      columnStyles: {
        0: { cellWidth: "auto" },
      },
      headStyles: {
        fillColor: false,
        textColor: "black",
        lineWidth: 0.1,
        halign: "center",
        valign: "middle",
      },
      theme: "grid",
      styles: {
        fontSize: 8,
        textColor: "black",

        cellPadding: 2,
        fontStyle: "bold",
      },
      willDrawCell: function (data) {
        if (data.row.index === 0 && data.column.index === 0) {
          data.cell.styles.lineWidth = 0;
        }
      },
    });

    tableStartY = (doc as any).lastAutoTable.finalY + 1;

    autoTable(doc, {
      startY: tableStartY,
      margin: { left: headerX },
      tableWidth: 194,
      body: [
        [
          {
            content: `${data?.status_komite}`,
            styles: {
              lineWidth: { top: 0.1, bottom: 0.1, left: 0.1, right: 0.1 },
            },
            rowSpan: 2,
          },
          {
            content: "",
            styles: {
              lineWidth: { top: 0.1, bottom: 0.1, left: 0, right: 0.1 },
            },
            rowSpan: 2,
          },
          {
            content: "Paraf & Tgl",
            styles: {
              fontStyle: "bold",
              textColor: "black",
            },
          },
        ],
        [""],
      ],
      theme: "grid",
      styles: {
        fontSize: fontBaseSize,
        cellPadding: cellPadding,
        lineColor: "black",
        lineWidth: 0.2,
        halign: "center",
        valign: "middle",
        textColor: "black",
      },
      headStyles: {
        textColor: "black",
        lineWidth: 0.2,
      },
      columnStyles: {
        0: { cellWidth: 194 * 0.5, minCellHeight: 15 },
        1: { cellWidth: 194 * 0.3 },
        2: { cellWidth: 194 * 0.2 },
      },
    });

    tableStartY = (doc as any).lastAutoTable.finalY + 1;

    autoTable(doc, {
      startY: tableStartY,
      margin: { left: headerX },
      tableWidth: 194,
      head: [
        [
          {
            content: "PENILAIAN OLEH TIM PENILAI",
            styles: { halign: "left" },
          },
        ],
      ],
      columnStyles: {
        0: { cellWidth: "auto" },
      },
      headStyles: {
        fillColor: false,
        textColor: "black",
        lineWidth: 0.1,
        halign: "center",
        valign: "middle",
      },
      theme: "grid",
      styles: {
        fontSize: 8,
        textColor: "black",
        cellPadding: 2,
        fontStyle: "bold",
      },
      willDrawCell: function (data) {
        if (data.row.index === 0 && data.column.index === 0) {
          data.cell.styles.lineWidth = 0;
        }
      },
    });

    tableStartY = (doc as any).lastAutoTable.finalY + 0.3;

    autoTable(doc, {
      startY: tableStartY,
      margin: { left: headerX },
      tableWidth: 96,
      head: [
        [
          "No",
          "Faktor Penilaian",
          "Nilai",
          { content: "Reward", styles: { cellWidth: 40 } },
        ],
      ],
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
        [{ content: "Total", styles: { halign: "center" } }, "", "", "Rp"],
      ],
      theme: "grid",
      styles: {
        fontSize: fontBaseSize,
        cellPadding: cellPadding,
        lineColor: "black",
        lineWidth: 0.2,
        textColor: "black",
      },
      headStyles: {
        fillColor: false,
        textColor: "black",
        lineWidth: 0.1,
        halign: "center",
        valign: "middle",
        lineColor: "black",
      },
    });

    autoTable(doc, {
      startY: tableStartY,
      tableWidth: 96,
      margin: { left: headerX + 96 + 2 },
      body: [
        [
          {
            content: "Catatan khusus oleh Kepala Divisi/Kepala Bagian",
            colSpan: 8,
          },
        ],
        [
          {
            content:
              "Berilah tanda X pada tulisan didalam kolom sesuai SS tsb.",
            colSpan: 8,
          },
        ],
        [
          { content: "5R" },
          { content: "S" },
          { content: "M" },
          { content: "E" },
          { content: "Q" },
          { content: "C" },
          { content: "D" },
          { content: "P" },
        ],
        [
          {
            content: "Paraf:",
            colSpan: 4,
            styles: { minCellHeight: 40, halign: "left", valign: "top" },
          },
          {
            content: "Benefit (RP. / MH.) Perbulan =",
            colSpan: 4,
            rowSpan: 2,
            styles: { halign: "left", valign: "top" },
          },
        ],
        [{ content: "Section/Dept./Div. Head", colSpan: 4 }],
      ],
      theme: "grid",
      styles: {
        fontSize: fontBaseSize,
        cellPadding: cellPadding,
        lineColor: "black",
        lineWidth: 0.2,
        valign: "middle",
        halign: "center",
        textColor: "black",
      },
      headStyles: {
        textColor: "black",
        lineWidth: 0.2,
      },
      columnStyles: {},
    });

    doc.save(`${data?.penulis}.pdf`);
  };

  const handleSubmit = () => {
    if (komiteStatus == "") {
      toast.error("Kolom untuk atasan belum di isi");
    } else {
      console.log(JSON.stringify(penilaian));
      console.log(komiteStatus);
      console.log(selectedItems);
      console.log(benefit);
      mutate({
        id: params?.id ?? "",
        komite_status: komiteStatus,
        catatan_khusus: JSON.stringify(selectedItems),
        benefit: benefit,
        penilaian: JSON.stringify(penilaian),
      });
    }
  };

  console.log(data);
  console.log(data?.status_a.trim().length !== 0);

  if (isFetching || isPending || !data) {
    return (
      <div className="flex h-svh w-full items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

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

      {/* {(isFetching || isPending) && <Loader2 className="animate-spin" />} */}

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
                    {data?.keadaan_sebelumnya}
                  </TableCell>
                  <TableCell className="align-top">
                    {data?.saran_yang_diajukan}
                  </TableCell>
                </TableRow>

                <TableRow className="md:hidden">
                  <TableCell colSpan={2} className="font-semibold">
                    KEADAAN SEBELUMNYA
                  </TableCell>
                </TableRow>
                <TableRow className="md:hidden">
                  <TableCell colSpan={2}>{data?.keadaan_sebelumnya}</TableCell>
                </TableRow>
                <TableRow className="md:hidden">
                  <TableCell colSpan={2} className="font-semibold">
                    SARAN YANG DIAJUKAN
                  </TableCell>
                </TableRow>
                <TableRow className="md:hidden">
                  <TableCell colSpan={2}>{data?.saran_yang_diajukan}</TableCell>
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
                {data?.status_komite.trim().length !== 0
                  ? JSON.parse(data.penilaian).penilaian.map(
                      (item: any, index: any) => (
                        <TableRow key={index}>
                          <TableCell className="border-r align-middle">
                            {index + 1}
                          </TableCell>
                          <TableCell className="border-r align-middle">
                            {item.faktor}
                          </TableCell>
                          <TableCell className="w-1/3 border-r align-middle">
                            <Input
                              readOnly
                              type="text"
                              value={item.nilai}
                              className="w-full text-center"
                            />
                          </TableCell>
                          <TableCell className="text-center">
                            {formatRupiah(item.reward)}
                          </TableCell>
                        </TableRow>
                      ),
                    )
                  : penilaian.penilaian.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="border-r align-middle">
                          {index + 1}
                        </TableCell>
                        <TableCell className="border-r align-middle">
                          {item.faktor}
                        </TableCell>
                        <TableCell className="w-1/3 border-r align-middle">
                          <Input
                            type="text"
                            pattern="\d*"
                            inputMode="numeric"
                            value={item.nilai}
                            onChange={(e) => {
                              if (Number(e.target.value) >= 0) {
                                setPenilaian((prev) => {
                                  let total = 0;

                                  prev.penilaian[index].nilai = e.target.value;

                                  prev.penilaian[index].reward =
                                    Number(e.target.value) * 1000;
                                  prev.penilaian.map((item) => {
                                    total = total + Number(item.reward);
                                  });
                                  prev.totalReward = total.toString();

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
                        <TableCell className="text-center">
                          {formatRupiah(item.reward)}
                        </TableCell>
                      </TableRow>
                    ))}
                <TableRow>
                  <TableCell colSpan={3} className="text-right font-bold">
                    Total
                  </TableCell>
                  <TableCell className="text-center font-bold">
                    Rp.{" "}
                    {data.status_komite.trim().length === 0
                      ? formatRupiah(Number(penilaian.totalReward))
                      : formatRupiah(JSON.parse(data.penilaian).totalReward)}
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
                        checked={
                          data.catatan_khusus.trim().length === 0
                            ? selectedItems.includes(_)
                            : JSON.parse(data.catatan_khusus).includes(_)
                        }
                        onCheckedChange={(checked) => {
                          if (data.catatan_khusus.trim().length === 0) {
                            handleCheckedChange(checked, columns[index]);
                          }
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
                    {data?.status_komite.trim().length !== 0 ? (
                      <Input
                        type="text"
                        pattern="\d*"
                        inputMode="numeric"
                        value={formatRupiah(Number(data?.benefit))}
                        readOnly
                        placeholder="Masukkan Benefit"
                        className="text-center"
                      />
                    ) : (
                      <Input
                        type="text"
                        inputMode="numeric"
                        value={benefit ? `${formatRupiahNEW(benefit)}` : ""}
                        onChange={(e) => {
                          setBenefit(e.target.value.replace(/\D/g, "")); // Hanya angka
                        }}
                        placeholder="Masukkan Benefit"
                        className="text-center"
                      />
                    )}
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

          {data.status_komite.trim().length !== 0 ? (
            <Button type="button" disabled className="w-full">
              DATA SUDAH DI APPROVAL
            </Button>
          ) : (
            <Button
              disabled={komiteStatus === ""}
              onClick={handleSubmit}
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
