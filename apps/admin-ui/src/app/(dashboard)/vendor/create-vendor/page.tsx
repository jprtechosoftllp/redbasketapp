"use client";
import React from 'react'
import VendorForm from './components/VendorForm'
import useAdmin from 'apps/admin-ui/src/hooks/useAdmin';
import LoadingPage from '@meato/packages/frontend/ui/components/LoadingPage';
import { useRouter } from 'next/navigation';

export default function page() {
    const { admin, isLoading: adminLoading } = useAdmin();
    const router = useRouter();

    adminLoading ? <div className="w-full"><LoadingPage /></div> : (
        !admin ? router.push('/sign-in') : admin.role === "user" ? router.push('/') : null
    )
    return <VendorForm />
}