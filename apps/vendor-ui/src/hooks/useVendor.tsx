import { useQuery } from "@tanstack/react-query"
import axiosInstace from "../utils/axiosInstace";

const fetchAdmin = async()=> {
    const resp = await axiosInstace.get('/auth/manager/logged-in')
    return resp.data.admin
}

const useVendor = ()=> {
    const {data:vendor, isLoading, isError, refetch} = useQuery({
        queryKey: ["vendor"],
        queryFn: fetchAdmin,
        staleTime: 1000 * 60 , // 24 hours in milliseconds
        retry: 1
    })
    return { vendor, isError, isLoading, refetch}
}

export default useVendor;