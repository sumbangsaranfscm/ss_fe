import { axiosClient } from "@/lib/axiosClient";
import { useQuery } from "@tanstack/react-query";
import { Saran } from "./interface";

const useSSModule = () => {
  const apiGetList = async ():Promise<Saran[]> => {
    return axiosClient
      .get(
        "https://script.google.com/macros/s/AKfycbwlKBEwzSion57740EYVWMnvZXVIN6bMJFUaX2afPF-U_SdfV-ReALXYpY433RnrCy9/exec",
        { params: { action: "read" } },
      )
      .then((res) => res.data.data);
  };
  const useGetList = () => {
    const { data, isFetching, isPending } = useQuery({
      queryKey: ['listsaran'],
      queryFn: () => apiGetList(),
      refetchOnWindowFocus: true
    });

    return { data, isFetching, isPending }
  };

  return { useGetList };
};

export default useSSModule;
