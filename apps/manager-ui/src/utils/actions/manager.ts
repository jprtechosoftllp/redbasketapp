'use server';

import axios from 'axios';

export const getVendor = async ({ pageParam }: { pageParam: number }): Promise<any> => {
    try {
        const res = await axios.get(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/manager/api/vendor/get-vendors`,
            {
                params: {
                    page: pageParam,
                    limit: 20, // Adjust based on your API
                },
            }
        );
        // Handle typo in backend response
        return {
            managers: res.data?.vendors || res.data?.vendors || [],
            nextPage: pageParam + 1,
            hasMore: (res.data?.vendors || res.data?.vendors || []).length === 20,
        };
    } catch (error) {
        console.error('Failed to fetch managers:', error);
        return { success: false, data: [], error: 'Failed to fetch managers' };
    }
}