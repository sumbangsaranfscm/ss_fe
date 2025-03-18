import { axiosClient } from "@/lib/axiosClient";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Saran } from "./interface";
import toast from "react-hot-toast";

const useSSModule = () => {
  const queryClient = useQueryClient();

  const apiGetList = async (): Promise<Saran[]> => {
    return axiosClient
      .get(
        `${process.env.NEXT_PUBLIC_URL}`,
        { params: { action: "read" } },
      )
      .then((res) => res.data.data);
  };
  const useGetList = () => {
    const { data, isFetching, isPending } = useQuery({
      queryKey: ["listsaran"],
      queryFn: () => apiGetList(),
      refetchOnWindowFocus: true,
    });

    return { data, isFetching, isPending };
  };

  const apiGetListKomite = async (): Promise<Saran[]> => {
    return axiosClient
      .get(
        `${process.env.NEXT_PUBLIC_URL}?action=readDataKomite`,
        { params: { action: "read" } },
      )
      .then((res) => res.data.data);
  };
  const useGetListKomite = () => {
    const { data, isFetching, isPending } = useQuery({
      queryKey: ["listsaran"],
      queryFn: () => apiGetListKomite(),
      refetchOnWindowFocus: true,
    });

    return { data, isFetching, isPending };
  };


  const apiGetDetail = async (id: string): Promise<Saran> => {
    return axiosClient
      .get(
        `${process.env.NEXT_PUBLIC_URL}`,
        { params: { action: "readById", id: id } },
      )
      .then((res) => res.data.data);
  };
  const useGetDetail = (id: string) => {
    const { data, isPending, isFetching } = useQuery({
      queryKey: ["sarandetail"],
      queryFn: () => apiGetDetail(id),
      enabled: id !== undefined || id !== "",
    });

    return { data, isPending, isFetching };
  };

  const apiUpdatePersetujuan = async (
    id: string,
    status_a: string,
    status_b: string,
    nama_p: string,
    tgl_d: string,
    sasaran_s: string,
    pelaksanaan: string,
    lokasi_p: string,
  ) => {
    return axiosClient
    .post(
      `${process.env.NEXT_PUBLIC_URL}?action=update` +
        `&id=${encodeURIComponent(id)}` +
        `&status_a=${encodeURIComponent(status_a)}` +
        `&status_b=${encodeURIComponent(status_b)}` +
        `&nama_p=${encodeURIComponent(nama_p)}` +
        `&tgl_d=${encodeURIComponent(tgl_d)}` +
        `&sasaran_s=${encodeURIComponent(sasaran_s)}` +
        `&pelaksanaan=${encodeURIComponent(pelaksanaan)}` +
        `&lokasi_p=${encodeURIComponent(lokasi_p)}`
    )
      .then((res) => res.data);
  };
  const useUpdatePersetujuan = () => {
    const { mutate, isPending } = useMutation({
      mutationKey: ["updatePersetujuan"],
      mutationFn: (payload: {
        id: string;
        status_a: string;
        status_b: string;
        nama_p: string;
        tgl_d: string;
        sasaran_s: string;
        pelaksanaan: string;
        lokasi_p: string;
      }) =>
        apiUpdatePersetujuan(
          payload.id,
          payload.status_a,
          payload.status_b,
          payload.nama_p,
          payload.tgl_d,
          payload.sasaran_s,
          payload.pelaksanaan,
          payload.lokasi_p,
        ),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["sarandetail"] });
        toast.success("Berhasil submit!");
      },
    });

    return { mutate, isPending };
  };

  const apiUpdateKomite = async (
    id: string,
    komite_status: string,
    catatan_khusus: string,
    benefit: string,
    penilaian: string,
  ) => {
    return axiosClient
    .post(
      `https://script.google.com/macros/s/AKfycbwxEQnyQ1iivfr8gnx1meY3OvSEtX9C3njK2y4OSzzWd2jPPxCbSCFtwzDjeNdo2aUU/exec?action=updateKomite` +
        `&id=${encodeURIComponent(id)}` +
        `&komite_status=${encodeURIComponent(komite_status)}` +
        `&catatan_khusus=${encodeURIComponent(catatan_khusus)}` +
        `&benefit=${encodeURIComponent(benefit)}` + 
        `&penilaian=${encodeURIComponent(penilaian)}`
    )
      .then((res) => res.data);
  };
  const useUpdateKomite = () => {
    const { mutate, isPending } = useMutation({
      mutationKey: ["updateKomite"],
      mutationFn: (payload: {
        id: string;
        komite_status: string,
        catatan_khusus: string,
        benefit: string,
        penilaian: string,
      }) =>
        apiUpdateKomite(
          payload.id,
          payload.komite_status,
          payload.catatan_khusus,
          payload.benefit,
          payload.penilaian
        ),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["sarandetail"] });
        toast.success("Berhasil submit!");
      },
    });

    return { mutate, isPending };
  };

  return { useGetList, useGetDetail, useUpdatePersetujuan, useGetListKomite, useUpdateKomite };
};

export default useSSModule;
