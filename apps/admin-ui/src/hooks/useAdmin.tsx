import { useQuery } from "@tanstack/react-query"
import axiosInstace from "../utils/axiosInstace"

const fetchAdmin = async()=> {
    const resp = await axiosInstace.get('/auth/admin/logged-in')
    return resp.data.admin
}

const useAdmin = ()=> {
    const {data:admin, isLoading, isError, refetch} = useQuery({
        queryKey: ["admin"],
        queryFn: fetchAdmin,
        staleTime: 1000 * 60 * 60 * 42, // 24 hours in milliseconds
        retry: 1
    })
    return { admin, isError, isLoading, refetch}
}

export default useAdmin;