import { axiosClient } from "@/lib/axiosClient";
import { useQuery } from "@tanstack/react-query";
import { Saran } from "./interface";

const useSSModule = () => {
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
      refetchOnWindowFocus: true,
      enabled: id !== undefined || id !== "",
    });

    return { data, isPending, isFetching };
  };

  return { useGetList, useGetDetail };
};

export default useSSModule;
