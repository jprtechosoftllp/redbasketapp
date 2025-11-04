"use client"
import React from 'react'
import { useInfiniteQuery } from '@tanstack/react-query';
import ManagerTable from '../components/ManagerTable';
import { getArchivedManager } from 'apps/admin-ui/src/Actions';

export default function page() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: ['archived-managers'],
    queryFn: ({ pageParam = 1 }) => getArchivedManager({pageParam}),
    getNextPageParam: (lastPage) => {
      return lastPage.hasMore ? lastPage.nextPage : undefined;
    },
    initialPageParam: 1,
    staleTime: 1000 * 60 * 5,
  });

  return (
    <>
      <ManagerTable
        managerType='active'
        hasNextPage={hasNextPage}
        isLoading={isLoading}
        data={data}
        isError={isError}
        isFetchingNextPage={isFetchingNextPage}
        fetchNextPage={fetchNextPage}
      />
    </>
  )
}