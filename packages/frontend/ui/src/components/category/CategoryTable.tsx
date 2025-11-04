"use client"
import React, { useEffect, useRef, useState } from 'react'
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronDown, ChevronUp, User, Mail, Phone, Calendar } from 'lucide-react';
import { FetchNextPageOptions, InfiniteData } from '@tanstack/react-query';
import { Card } from '../../card';
import { Input } from '../../input';
import Image from 'next/image';
interface CategoryPage {
  categories?: CategoryType[];
  nextPage?: number;
  hasMore?: boolean;
  totalPages?: any;
};
interface Props {
  hasNextPage: boolean | undefined;
  isLoading: boolean;
  data: InfiniteData<CategoryPage> | undefined;
  isError: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: (options?: FetchNextPageOptions) => Promise<any>;
  categories: CategoryType[]
};

const CategoryTable: React.FC<Props> = ({ isLoading, data, categories, isFetchingNextPage, hasNextPage, fetchNextPage, isError }) => {
  const [filteredData, setFilteredData] = useState<CategoryType[] | any>([]);

  const [sortField, setSortField] = useState<keyof CategoryType | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const [search, setSearch] = useState('');

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.5 }
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  // Search filter with proper null/undefined handling
  useEffect(() => {
    if (search.trim()) {
      const filtered = categories.filter((item) =>
        Object.values(item).some((val) => {
          if (val === null || val === undefined) return false;
          return val.toString().toLowerCase().includes(search.toLowerCase());
        })
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(categories);
    }
  }, [search, categories]);

  // Sort handler
  const handleSort = (field: keyof CategoryType) => {
    const direction = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortDirection(direction);

    const sorted = [...filteredData].sort((a, b) => {
      const aVal = a[field];
      const bVal = b[field];

      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return 1;
      if (bVal == null) return -1;

      if (aVal < bVal) return direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return direction === 'asc' ? 1 : -1;
      return 0;
    });
    setFilteredData(sorted);
  };

  // Floating particles animation
  const particles = Array.from({ length: 20 }, (_, i) => i);
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden relative">
      {/* Animated background particles */}
      {particles.map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-blue-500/10"
          style={{
            width: Math.random() * 100 + 50,
            height: Math.random() * 100 + 50,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            x: [0, Math.random() * 200 - 100],
            y: [0, Math.random() * 200 - 100],
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
      ))}

      {/* Gradient orbs */}
      <motion.div
        className="absolute top-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 50, 0],
          y: [0, 30, 0],
        }}
        transition={{ duration: 8, repeat: Infinity, repeatType: "reverse" }}
      />
      <motion.div
        className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          x: [0, -50, 0],
          y: [0, -30, 0],
        }}
        transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
      />

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
             Dashboard
          </h1>
          <p className="text-slate-400 text-lg">Explore and search through manager data</p>
        </motion.div>

        {
          !data ?
            <h2>Managers are not listed!</h2>
            :
            <>
              {/* Search Bar */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mb-6"
              >
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="Search by name, email, phone, or role..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-12 pr-4 py-6 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 rounded-xl backdrop-blur-sm focus:ring-2 focus:ring-blue-500 transition-all text-lg"
                  />
                </div>
              </motion.div>

              {/* Error State */}
              {isError && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl"
                >
                  <p className="text-red-300">Failed to load managers. Please try again.</p>
                </motion.div>
              )}

              {/* Table Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Card className="bg-slate-800/30 border-slate-700/50 backdrop-blur-md shadow-2xl rounded-2xl overflow-hidden">
                  {/* Desktop Table */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-slate-700/50">
                          {[
                            { key: 'name' as keyof CategoryType, label: 'Name', icon: User },
                            { key: 'image.url' as keyof CategoryType, label: 'Image', icon: Mail },
                            { key: 'subCategories' as keyof CategoryType, label: 'Sub Categories', icon: Phone },
                            { key: 'isActive' as keyof CategoryType, label: 'Status', icon: Phone },
                            { key: 'createAt' as keyof CategoryType, label: 'Join Date', icon: Calendar },

                          ]?.map(({ key, label, icon: Icon }) => (
                            <th
                              key={key}
                              onClick={() => handleSort(key)}
                              className="px-6 py-4 text-left text-sm font-semibold text-slate-300 cursor-pointer hover:text-white transition-colors group"
                            >
                              <div className="flex items-center gap-2">
                                <Icon className="w-4 h-4 text-slate-500 group-hover:text-blue-400 transition-colors" />
                                {label}
                                {sortField === key && (
                                  <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", stiffness: 500 }}
                                  >
                                    {sortDirection === 'asc' ? (
                                      <ChevronUp className="w-4 h-4 text-blue-400" />
                                    ) : (
                                      <ChevronDown className="w-4 h-4 text-blue-400" />
                                    )}
                                  </motion.div>
                                )}
                              </div>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {isLoading && filteredData.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"
                              />
                              Loading managers...
                            </td>
                          </tr>
                        ) : filteredData.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                              No managers found. Try adjusting your search.
                            </td>
                          </tr>
                        ) : (
                          <AnimatePresence mode="popLayout">
                            {filteredData?.map((item: CategoryType, index: number) => (
                              <motion.tr
                                key={item?.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.3, delay: Math.min((index ?? 0) * 0.02, 0.3) }}
                                className="border-b border-slate-700/30 hover:bg-slate-700/20 transition-colors"
                              >
                                <td className="px-6 py-4 text-sm font-medium text-white">{item?.name}</td>
                                <td className="px-6 py-4 text-sm text-slate-300">
                                  <Image
                                    src={item.image.url}
                                    alt={`product-image-missing`}
                                    width={200}
                                    height={200}
                                    className="w-12 h-12 object-cover rounded-md"
                                  />
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-300">{item.subCategories?.length}</td>
                                <td className="px-6 py-4">
                                  <span className="px-3 py-1 text-xs font-medium bg-blue-500/20 text-blue-300 rounded-full">
                                    {item?.isActive === true ? 'Active' : 'Inactive'}
                                  </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-300">
                                  {format(new Date(item.createdAt), "PPP") || 'N/A'}
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-300">
                                  {/* <ActionCell rowData={item} /> */}
                                </td>

                              </motion.tr>
                            ))}
                          </AnimatePresence>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Cards */}
                  {/* <div className="md:hidden space-y-4 p-4">
                    {isLoading && filteredData.length === 0 ? (
                      <div className="py-12 text-center text-slate-400">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"
                        />
                        Loading managers...
                      </div>
                    ) : filteredData.length === 0 ? (
                      <div className="py-12 text-center text-slate-400">
                        No managers found. Try adjusting your search.
                      </div>
                    ) : (
                      <AnimatePresence mode="popLayout">
                        {filteredData?.map((item: CategoryType, index: number) => (
                          <motion.div
                            key={item?.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.3) }}
                            className="bg-slate-700/30 rounded-xl p-4 space-y-3 backdrop-blur-sm border border-slate-600/30"
                          >
                            <div className="flex items-center justify-between">
                              <h3 className="font-semibold text-white text-lg">{item?.username}</h3>
                              <span className="px-3 py-1 text-xs font-medium bg-blue-500/20 text-blue-300 rounded-full">
                                {item?.status}
                              </span>
                            </div>
                            <div className="space-y-2 text-sm">
                              <div className="flex items-center gap-2 text-slate-300">
                                <Mail className="w-4 h-4 text-slate-500" />
                                {item?.email}
                              </div>
                              <div className="flex items-center gap-2 text-slate-300">
                                <Phone className="w-4 h-4 text-slate-500" />
                                {item?.phone}
                              </div>
                              <div className="flex items-center gap-2 text-slate-300">
                                <Store className="w-4 h-4 text-slate-500" />
                                {item?.shop_name}
                              </div>
                              <div className="flex items-center gap-2 text-slate-300">
                                <MapPinHouse className="w-4 h-4 text-slate-500" />
                                {item?.shop_city}
                              </div>
                              <div className="flex items-center gap-2 text-slate-300">
                                <ArchiveRestore className="w-4 h-4 text-slate-500" />
                                {item?.oreders || 0}
                              </div>
                              <div className="flex items-center gap-2 text-slate-300">
                                <ArchiveX className="w-4 h-4 text-slate-500" />
                                {item?.rejected_orderds || 0}
                              </div>
                              <div className="flex items-center gap-2 text-slate-300">
                                <Calendar className="w-4 h-4 text-slate-500" />
                                {format(new Date(item.createdAt), "PPP") || 'N/A'}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    )}
                  </div> */}

                  {/* Loading indicator for infinite scroll */}
                  {!search && (
                    <div ref={loadMoreRef} className="py-8 flex justify-center">
                      {isFetchingNextPage && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex items-center gap-2 text-slate-400"
                        >
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full"
                          />
                          <span>Loading more...</span>
                        </motion.div>
                      )}
                      {!hasNextPage && filteredData.length > 0 && (
                        <p className="text-slate-500 text-sm">No more data to load</p>
                      )}
                    </div>
                  )}
                </Card>
              </motion.div>

              {/* Stats Footer */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="mt-6 text-center text-slate-400"
              >
                <p>
                  Showing {filteredData.length} of {data?.pages?.[0]?.totalPages} records
                  {search && ' (filtered)'}
                </p>
              </motion.div>
            </>
        }
      </div>
    </div>
  )
}

export default CategoryTable;