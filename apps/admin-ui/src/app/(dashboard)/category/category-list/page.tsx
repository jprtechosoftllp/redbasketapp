"use client"
import CategoryTable from '@meato/packages/frontend/ui/components/category/CategoryTable';
import { setCategory } from 'apps/admin-ui/src/utils/redux/slice/categorySlice';
import { useAppSelector } from 'apps/admin-ui/src/utils/redux/store/hook';
import axios from 'axios';
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { useInfiniteQuery } from '@tanstack/react-query';

export default function page() {
    const categories = useAppSelector((state) => state.category.list);
    const dispatch = useDispatch();
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
    } = useInfiniteQuery({
        queryKey: ['category'],
        queryFn: async ({ pageParam = 1 }) => {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/category/get-categories`, {
                params: { page: pageParam, limit: 20 },
            });
            return res.data;
        },
        getNextPageParam: (lastPage) => {
            return lastPage.data.hasMore ? lastPage.data.nextPage : undefined;
        },
        initialPageParam: 1,
        staleTime: 1000 * 60 * 5,
    });

    useEffect(() => {
        if (data?.pages) {
            const categories = data.pages.flatMap((page: any) => page.categories);
            if (categories.length > 0) {
                dispatch(setCategory(categories));
            }
        }
    }, [data, dispatch]);

    return (
        <CategoryTable
            categories={categories}
            hasNextPage={hasNextPage}
            isLoading={isLoading}
            data={data}
            isError={isError}
            isFetchingNextPage={isFetchingNextPage}
            fetchNextPage={fetchNextPage} />
    )
}