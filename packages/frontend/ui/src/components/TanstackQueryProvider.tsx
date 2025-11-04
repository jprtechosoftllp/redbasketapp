"use client"

import React, { useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { ThemeProvider } from 'next-themes';

export default function TanstackQueryProvider({ children }: { children: React.ReactNode }) {
    const [client, setClient] = useState(false);
    const [queryClient] = useState(() => new QueryClient())

    useEffect(() => {
        setClient(true)
    }, [])
    return (
        client && (
            <QueryClientProvider client={queryClient}>
                <ThemeProvider attribute={"class"} defaultTheme="system" enableSystem>
                <Toaster position="top-right" />
                {children}
                </ThemeProvider>
            </QueryClientProvider>
        )
    )
}