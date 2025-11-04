"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type Resolver } from "react-hook-form";
import { z } from "zod";

import { Button } from '@meato/packages/frontend/ui/button';
import React, { useMemo, useState } from 'react';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@meato/packages/frontend/ui/form";
import { Input } from "@meato/packages/frontend/ui/input";
import { Textarea } from "@meato/packages/frontend/ui/textarea";
import { useMutation, useQuery } from '@tanstack/react-query';
import axiosInstace from 'apps/admin-ui/src/utils/axiosInstace';
import { IndianRupee, UserCheck, UserX } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { toast } from "sonner";
import { addProduct } from "apps/admin-ui/src/utils/redux/slice/productSlice";
import ImagePlaceHolder from "@meato/packages/frontend/ui/components/product/ImagePlaceHolder";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@meato/packages/frontend/ui/select";
import { formSchema, productValidationType } from "./formSchema";
import { useRouter } from "next/navigation";
import useAdmin from "apps/admin-ui/src/hooks/useAdmin";
import LoadingPage from "@meato/packages/frontend/ui/components/LoadingPage";

interface Props {
    initialData?: any,
    showForm?: boolean;
    setShowForm?: (value: boolean) => void;
}

const booleanValuse = [
    { lable: "Yes", value: 'true', id: 1 },
    { lable: "No", value: 'false', id: 2 }
]

const ProductForm: React.FC<Props> = ({ initialData, showForm, setShowForm }) => {

    const [isSubCtegory, setIsSubCategory] = useState<any>()
    const router = useRouter();

    const { admin, isLoading: adminLoading } = useAdmin();

    adminLoading ? <div className="w-full"><LoadingPage /></div> : (
        !admin ? router.push('/sign-in') : admin.role === "user" ? router.push('/') : null
    )

    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema) as Resolver<z.infer<typeof formSchema>>,
        defaultValues: initialData ? { ...initialData } : productValidationType,
    });

    const dispatch = useDispatch();

    const { data: vendors, isError: vendorError, isLoading: vendorLoading } = useQuery({
        queryKey: ['vendor-active'],
        queryFn: async () => {
            try {
                const { data } = await axiosInstace.get('/admin/vendor/get-all-vendors-active')
                return data.vendors;
            } catch (error) {
                throw new Error("Error fetching categories")
            }
        },
        staleTime: 1000 * 60 * 5,
        retry: 2,
    });

    const { data: categories, isLoading: categoryLoading, isError: categoryError } = useQuery({
        queryKey: ["active-categories"],
        queryFn: async () => {
            try {
                const res = await axiosInstace.get(`/product/category/active-category`)
                return res.data.categories
            } catch (error) {
                throw new Error("Error fetching categories")
            }
        },
        staleTime: 1000 * 60 * 5,
        retry: 2,
    });

    const submiitMutation = useMutation({
        mutationFn: async (values: z.infer<typeof formSchema>) => {
            try {
                const { data } = await axiosInstace.post('/product/products/create-product', values);
                return data;
            } catch (error: any) {
                const message =
                    error?.response?.data?.message ||
                    "Something went wrong. Please try again.";
                throw new Error(message);
            }
        },
        onSuccess: (data) => {
            dispatch(addProduct(data.product))
            setShowForm ? setShowForm(!showForm) : router.push('/product/product-list')
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
    });

    // 2. Define a submit handler.
    function onSubmit(values: z.infer<typeof formSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        
        submiitMutation.mutate(values)
    }

    const handelKeyPress = (
        e: | React.KeyboardEvent<HTMLInputElement> | React.KeyboardEvent<HTMLTextAreaElement>
    ) => {
        if (e.key === "Enter") {
            e.preventDefault()
        }
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='py-4 w-full flex gap-6 h-screen overflow-hidden text-white'
            >
                <div className='md:w-[35%]'>
                    <FormField
                        control={form.control}
                        name="images"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Images</FormLabel>
                                <FormControl>
                                    <ImagePlaceHolder
                                        axiosInstace={axiosInstace}
                                        values={field.value ?? []}
                                        onChange={field.onChange}
                                        size='765 x 850'
                                    />
                                </FormControl>
                                <FormMessage className=" text-sm text-orange-500" />
                            </FormItem>
                        )}
                    />
                </div>

                {/* Form content  */}
                <div id='scrollBox' className='space-y-6 w-[60%] mb-5 overflow-x-scroll scroll-smooth scrollbar-hide p-3'>

                    <div className='flex items-center gap-5 max-sm:flex-col'>
                        <FormField
                            control={form.control}
                            name="product_name"
                            render={({ field }) => (
                                <FormItem className='w-full'>
                                    <FormLabel>Product Title</FormLabel>
                                    <FormControl>
                                        <Input onKeyDown={handelKeyPress} placeholder="Pease enter title....." {...field} />
                                    </FormControl>
                                    <FormMessage className=" text-sm text-orange-500" />
                                </FormItem>
                            )}
                        />
                    </div>
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Short Description * (Max 150 words)</FormLabel>
                                <FormControl>
                                    <Textarea onKeyDown={handelKeyPress} rows={5} cols={10} placeholder='Enter product descripton for quick view' {...field} />
                                </FormControl>
                                <FormMessage className=" text-sm text-orange-500" />
                            </FormItem>
                        )}
                    />

                    <div className='py-4 w-full flex gap-6'>
                        {categoryLoading && <p className="text-blue-500">Loading categories...</p>}
                        {categoryError && (
                            <p className="text-red-500">
                                Failed to load categories: {categoryError || "Unknown error"}
                            </p>
                        )}

                        {!categoryLoading && !categoryError && (
                            <>
                                {/* Category Select */}
                                <FormField
                                    control={form.control}
                                    name="category"
                                    render={({ field }) => (
                                        <FormItem className="w-full">
                                            <FormLabel>Category</FormLabel>
                                            <Select
                                                value={field.value}
                                                onValueChange={(value) => {
                                                    field.onChange(value);
                                                    const selected = categories.find((cat: CategoryType) => cat.name === value);
                                                    if (selected) {
                                                        setIsSubCategory(selected.subcategories);
                                                    }
                                                }}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a category" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        {categories?.map((category: CategoryType) => (
                                                            <SelectItem
                                                                value={category.name}
                                                                key={category.id}
                                                                className="cursor-pointer"
                                                            >
                                                                {category.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage className="text-sm text-orange-500" />
                                        </FormItem>
                                    )}
                                />


                                {/* Subcategory Select */}
                                {form.watch("category").length > 1 &&
                                    <FormField
                                        control={form.control}
                                        name="subCategory"
                                        render={({ field }) => {

                                            const selectedCategory = form.watch("category");
                                            const subCategories = useMemo(() => {
                                                return isSubCtegory
                                            }, [selectedCategory, setIsSubCategory])

                                            return (
                                                <FormItem className='w-full'>
                                                    <FormLabel>Subcategory</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select a subcategory" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectGroup>
                                                                {subCategories?.map((subCategory: SubCategoryType) => (
                                                                    <SelectItem
                                                                        value={subCategory.name}
                                                                        key={subCategory.id}
                                                                        className="cursor-pointer"
                                                                    >
                                                                        {subCategory.name}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectGroup>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage className="text-sm text-orange-500" />
                                                </FormItem>
                                            );
                                        }}
                                    />
                                }
                            </>
                        )}
                    </div>

                    <div>
                        {vendorLoading && <p className="text-blue-500">Loading venders...</p>}
                        {vendorError && (
                            <p className="text-red-500">
                                Failed to load vendors: {vendorError || "Unknown error"}
                            </p>
                        )}

                        {!vendorLoading && !vendorError && (
                            <>
                                {/* Category Select */}
                                <FormField
                                    control={form.control}
                                    name="vendor_Id"
                                    render={({ field }) => (
                                        <FormItem className='w-full'>
                                            <FormLabel>Category</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a vendor" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        {vendors?.map((vendor: VendorDataType) => (
                                                            <SelectItem
                                                                value={vendor.shop_name}
                                                                key={vendor.id}
                                                                className="cursor-pointer"
                                                            >
                                                                {vendor.shop_name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage className="text-sm text-orange-500" />
                                        </FormItem>
                                    )}
                                />
                            </>
                        )}
                    </div>

                    {/* <FormField
                        control={form.control}
                        name="sizes"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="flex items-center justify-between">
                                    <span>Sizes</span>
                                    <button
                                        type="button"
                                        onClick={() => form.setValue('sizes', Sizes)}
                                        className="text-xs text-blue-600 underline"
                                    >
                                        Apply Standard Sizes
                                    </button>
                                </FormLabel>
                                <FormControl>
                                    <MultiTexts
                                        values={field.value}
                                        onChange={(text) => field.onChange([...field.value, text])}
                                        onRemove={(text) => field.onChange(field.value.filter((item) => item !== text))}
                                        placeholder="Enter sizes (e.g., S, M, L)..."
                                    />
                                </FormControl>
                                <FormMessage className="text-sm text-orange-500" />
                            </FormItem>
                        )}
                    /> */}

                    <div className='flex items-center gap-5 max-sm:flex-col'>
                        <FormField
                            control={form.control}
                            name="base_price"
                            render={({ field }) => (
                                <FormItem className='w-full'>
                                    <FormLabel className='flex gap-2'>Product Price <IndianRupee size={11} /></FormLabel>
                                    <FormControl>
                                        <Input onKeyDown={handelKeyPress} placeholder="Pease enter base price....." {...field} />
                                    </FormControl>
                                    <FormMessage className=" text-sm text-orange-500" />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="discount_price"
                            render={({ field }) => (
                                <FormItem className='w-full'>
                                    <FormLabel className='flex gap-2'>Sale Price <IndianRupee size={11} /></FormLabel>
                                    <FormControl>
                                        <Input onKeyDown={handelKeyPress} placeholder="Pease enter discount price....." {...field} />
                                    </FormControl>
                                    <FormMessage className=" text-sm text-orange-500" />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className='flex items-center gap-5 max-sm:flex-col'>
                        <FormField
                            control={form.control}
                            name="protein_per_100g"
                            render={({ field }) => (
                                <FormItem className='w-full'>
                                    <FormLabel className='flex gap-2'>Protein (Per_100g)</FormLabel>
                                    <FormControl>
                                        <Input onKeyDown={handelKeyPress} placeholder="Pease enter protein per 100g....." {...field} />
                                    </FormControl>
                                    <FormMessage className=" text-sm text-orange-500" />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="calories_per_100g"
                            render={({ field }) => (
                                <FormItem className='w-full'>
                                    <FormLabel className='flex gap-2'>Calories (Per_100g)</FormLabel>
                                    <FormControl>
                                        <Input onKeyDown={handelKeyPress} placeholder="Pease enter calories per 100g....." {...field} />
                                    </FormControl>
                                    <FormMessage className=" text-sm text-orange-500" />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className='flex items-center gap-5 max-sm:flex-col'>
                        <FormField
                            control={form.control}
                            name="net_weight"
                            render={({ field }) => (
                                <FormItem className='w-full'>
                                    <FormLabel className='flex gap-2'>Net Weight</FormLabel>
                                    <FormControl>
                                        <Input onKeyDown={handelKeyPress} placeholder="Pease enter net weight....." {...field} />
                                    </FormControl>
                                    <FormMessage className=" text-sm text-orange-500" />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="gross_weight"
                            render={({ field }) => (
                                <FormItem className='w-full'>
                                    <FormLabel className='flex gap-2'>Gross weight</FormLabel>
                                    <FormControl>
                                        <Input onKeyDown={handelKeyPress} placeholder="Pease enter gross weight....." {...field} />
                                    </FormControl>
                                    <FormMessage className=" text-sm text-orange-500" />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className='flex items-center gap-5 max-sm:flex-col'>
                        <FormField
                            control={form.control}
                            name="fssai_certified"
                            render={({ field }) => (
                                <FormItem className='w-full'>
                                    <FormLabel>Fssai_certified</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a subcategory" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                {booleanValuse?.map((boolean) => (
                                                    <SelectItem
                                                        value={boolean.value.toString()}
                                                        key={boolean.id}
                                                        className="cursor-pointer"
                                                    >
                                                        {boolean.lable}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage className="text-sm text-orange-500" />
                                </FormItem>
                            )
                            }

                        />
                        <FormField
                            control={form.control}
                            name="is_halal"
                            render={({ field }) => (
                                <FormItem className='w-full'>
                                    <FormLabel>Is_halal</FormLabel>
                                    <Select onValueChange={field.onChange}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a subcategory" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                {booleanValuse?.map((boolean) => (
                                                    <SelectItem
                                                        value={boolean.value}
                                                        key={boolean.id}
                                                        className="cursor-pointer"
                                                    >
                                                        {boolean.lable}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage className="text-sm text-orange-500" />
                                </FormItem>
                            )
                            }
                        />
                    </div>

                    <div className='flex items-center justify-between'>
                        <Button disabled={submiitMutation.isPending}
                            onClick={() => { if (initialData && setShowForm) setShowForm(!showForm); }}
                            type="reset" variant={"secondary"}>
                            {initialData ? "Back" : "Reset"}
                        </Button>
                        <Button type="submit" disabled={submiitMutation.isPending}>{submiitMutation?.isPending ? "Submit...." : "Submit"}</Button>
                    </div>

                </div>
            </form>
        </Form >
    )
}
export default ProductForm;