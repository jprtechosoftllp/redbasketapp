import { useQuery } from "@tanstack/react-query"
import axiosInstace from "../utils/axiosInstace"

const fetchAdmin = async()=> {
    const resp = await axiosInstace.get('/auth/manager/logged-in')
    console.log(resp.data.admin);
    
    return resp.data.admin
}

const useManager = ()=> {
    const {data:manager, isLoading, isError, refetch} = useQuery({
        queryKey: ["manager"],
        queryFn: fetchAdmin,
        staleTime: 1000 * 60 * 60 * 24, // 24 hours in milliseconds
        retry: 1
    })
    console.log(manager);
    
    return { manager, isError, isLoading, refetch}
}

export default useManager;