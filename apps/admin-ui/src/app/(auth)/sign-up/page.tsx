"use client"
import RegistrationForm from '@meato/packages/frontend/ui/components/Registerform';
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { UserCheck, UserX } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react'
import { toast } from 'sonner';

export default function page() {
    const router = useRouter()
    const submitMutation = useMutation({
        mutationFn: async (values: any) => {
            try {
                const resp = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/auth/admin/sign-up`, values);
                return resp.data
            } catch (error: any) {
                // Optional: Extract error info before rethrowing
                const message = error?.response?.message || "Something went wrong. Please try again.";

                throw new Error(message);
            }
        },
        onSuccess: (data) => {
            router.push('/sign-in')
            toast.success(data.message, {
                icon: <UserCheck className="w-6 h-6 mr-3"/>,
                action: {
                    label: "Undo",
                    onClick: () => console.log("Undo"),
                },
                // style: {
                //     background: "green",
                // },
            });
        },
        onError: (error) => {
            // Handle and display the error
            toast.error(error.message, {
                icon: <UserX className="w-6 h-6 mr-3" />,
                action: {
                    label: "Undo",
                    onClick: () => console.log("Undo"),
                },
                style: {
                    background: "red",
                },
            });
        },
    });
    return (
        <div>
            <RegistrationForm submitMutation={submitMutation} userType='admin' />
        </div>
    )
}
export const dynamic = "force-dynamic";