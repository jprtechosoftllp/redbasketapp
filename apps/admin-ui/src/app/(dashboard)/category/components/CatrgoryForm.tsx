"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from '@meato/packages/frontend/ui/button';
import React from 'react'
import { Card } from "@meato/packages/frontend/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@meato/packages/frontend/ui/form"
import { Input } from "@meato/packages/frontend/ui/input"
import { Textarea } from "@meato/packages/frontend/ui/textarea";
import CategoryImage from "@meato/packages/frontend/ui/coustemComponents/CategoryImage";
import axiosInstace from "apps/admin-ui/src/utils/axiosInstace";
import { useMutation } from "@tanstack/react-query";
import useAdmin from "apps/admin-ui/src/hooks/useAdmin";
import { useRouter } from "next/navigation";
import LoadingPage from "@meato/packages/frontend/ui/components/LoadingPage";
import { useDispatch } from "react-redux";
import { addCategory } from "apps/admin-ui/src/utils/redux/slice/categorySlice";
import { toast } from "sonner";
import { UserCheck, UserX } from "lucide-react";

interface Props {
    showCreateCategory?: boolean;
    setShowCreateCategory?: (Value: boolean) => void;
    initialData?: CategoryType;
}

const formSchema = z.object({
    name: z.string().min(2, {
        message: "Category must be at least 2 characters.",
    }),
    description: z.string().max(500, {
        message: 'Description must be 1000 characters or fewer',
    }).min(100, {
        message: 'Description must be at least 100 characters long',
    }),
    image:
        z.object({
            url: z.string().trim().url({ message: '🖼️ Image URL must be valid' }),
            public_Id: z.string().min(1, { message: '🖼️ Image ID is required' }),
        }, {
            message: "🖼️ Image object is required"
        })
})

const CategoryForm: React.FC<Props> = ({ initialData, showCreateCategory, setShowCreateCategory }) => {

    const router = useRouter()
    const { admin, isLoading: adminLoading } = useAdmin();
    const dispatch = useDispatch()

    adminLoading ? <div className="w-full"><LoadingPage /></div> : (
        !admin ? router.push('/sign-in') : admin.role === "user" ? router.push('/') : null
    )

    const submiitMutation = useMutation({
        mutationFn: async (values: z.infer<typeof formSchema>) => {
            try {
                const { data } = await axiosInstace.post('/product/category/create-category', values);
                return data;
            } catch (error: any) {
                const message =
                    error?.response?.data?.message ||
                    "Something went wrong. Please try again.";
                throw new Error(message);
            }
        },
        onSuccess: (data) => {
            dispatch(addCategory(data.subCategory))
            setShowCreateCategory ? setShowCreateCategory(!showCreateCategory) : router.push('/category/category-list');
            toast.success(data.message, {
                icon: <UserCheck className="w-6 h-6 mr-3 text-white" />,
                style: { background: "green" },
            });
        },
        onError: (error: any) => {
            toast.error(error.message, {
                icon: <UserX className="w-6 h-6 mr-3 text-white" />,
                style: { background: "red" },
            });
        },
    })

    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            description: "",
            image: { url: '', public_Id: '' }
        },
    })

    // 2. Define a submit handler.
    function onSubmit(values: z.infer<typeof formSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        submiitMutation.mutate(values)
    }
    return (
        <Card className="p-6 border-2 w-[500px] shadow-lg animate-rainbow-border rounded-lg bg-background">

            {/* <div className="flex items-center justify-end">
                <Button variant={'outline'} onClick={() => setShowCreateCategory(!showCreateCategory)}>X</Button>
            </div> */}

            <h1 className="text-3xl font-extrabold text-center">Create Category</h1>
            <Card className="h-28 border-green-600 shadow-sm my-5">
                <span>Totale Category</span>
            </Card>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-6">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Category</FormLabel>
                                <FormControl>
                                    <Input placeholder="Write a your category name hre...." {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="Write your category description here..." rows={5} {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="image"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Image</FormLabel>
                                <FormControl>
                                    <CategoryImage axiosInstace={axiosInstace} onChange={field.onChange} value={field.value} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="flex items-center justify-between px-5">
                        <Button type="reset" onClick={() => { if (initialData && setShowCreateCategory) setShowCreateCategory(!showCreateCategory) }} variant={'destructive'}>Cancle</Button>
                        <Button type="submit">Submit</Button>
                    </div>
                </form>
            </Form>
        </Card>
    )
}

export default CategoryForm;