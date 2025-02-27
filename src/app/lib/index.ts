import { axiosClient } from "@/lib/axiosClient";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Saran } from "./interface";
import toast from "react-hot-toast";

const useSSModule = () => {
  const queryClient = useQueryClient();

  const apiGetList = async (): Promise<Saran[]> => {
    return axiosClient
      .get(
        "https://script.google.com/macros/s/AKfycbwxEQnyQ1iivfr8gnx1meY3OvSEtX9C3njK2y4OSzzWd2jPPxCbSCFtwzDjeNdo2aUU/exec",
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

  const apiGetDetail = async (id: string): Promise<Saran> => {
    return axiosClient
      .get(
        "https://script.google.com/macros/s/AKfycbwxEQnyQ1iivfr8gnx1meY3OvSEtX9C3njK2y4OSzzWd2jPPxCbSCFtwzDjeNdo2aUU/exec",
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
  ) => {
    return axiosClient
      .post(
        `https://script.google.com/macros/s/AKfycbwxEQnyQ1iivfr8gnx1meY3OvSEtX9C3njK2y4OSzzWd2jPPxCbSCFtwzDjeNdo2aUU/exec?action=update&id=${id}&status_a=${status_a}&status_b=${status_b}`,
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
      }) =>
        apiUpdatePersetujuan(payload.id, payload.status_a, payload.status_b),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["sarandetail"] });
        toast.success("Berhasil submit!");
      },
    });

    return { mutate, isPending };
  };

  return { useGetList, useGetDetail, useUpdatePersetujuan };
};

export default useSSModule;
