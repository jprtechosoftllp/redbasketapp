"use client";

import React from 'react'
import { useInfiniteQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setActiveVendor } from 'apps/admin-ui/src/utils/redux/slice/activeVendorSlice';
import { useAppSelector } from 'apps/admin-ui/src/utils/redux/store/hook';
import VendorTable from '@meato/packages/frontend/ui/components/VendorTable';
import { getActiveVendors } from 'apps/admin-ui/src/Actions';

export default function page() {
  const dispatch = useDispatch();
  const vendors = useAppSelector((state) => state.activeVendor.list);
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: ['vendor-active'],
    queryFn: ({ pageParam = 1 }) => getActiveVendors({pageParam}),
    getNextPageParam: (lastPage) => {
      return lastPage.hasMore ? lastPage.nextPage : undefined;
    },
    initialPageParam: 1,
    staleTime: 1000 * 60 * 5,
  });

  // Update Redux store when data is fetched
  useEffect(() => {
    if (data?.pages) {
      const allVendors = data.pages.flatMap((page: any) => page.vendors);
      if (allVendors.length > 0) {
        dispatch(setActiveVendor(allVendors));
      }
    }
  }, [data, dispatch]);

  return (
    <>
      <VendorTable
        vendors={vendors}
        vendorType='Active Vendors'
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
export const dynamic = "force-dynamic";