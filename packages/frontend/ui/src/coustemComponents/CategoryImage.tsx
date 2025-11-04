"use client"
import { ImageUp, Trash2 } from "lucide-react";
import { Card } from "../card";
import React, { useState } from "react";
import { toast } from "sonner";
import Image from "next/image";
import { Button } from "../button";

interface Porps {
    value: { url: string, public_Id: string },
    onChange: (value: ImageDataType) => void,
    axiosInstace: any
}

const CategoryImage: React.FC<Porps> = ({ axiosInstace, onChange, value }) => {

    const [loading, setLoading] = useState(false);

    const convertFileToBase64 = (file: File) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result)
            reader.onerror = () => reject(reader.error)
        })
    }

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {

        const file = event.target.files?.[0];
        if (!file) return;

        try {
            setLoading(true)
            const fileName = await convertFileToBase64(file);
            const res = await axiosInstace.post('/upload-image', { fileName });
            if (res.status === 201) {
                setLoading(false)
                const image = await res.data;
                onChange({ url: image.url, public_Id: image.publicId })
            }

        } catch (error) {
            setLoading(false)
            toast.error("Internal Server Error!, Please ry agian later")
            console.error(error);
        }
    };

    const onRemove = async (public_Id: string) => {

        try {
            setLoading(true)

            const res = await axiosInstace.delete(`/delete-image`, {
                data: {
                    public_Id
                }
            })
            if (res.status === 201) {
                setLoading(false)
                onChange({url: '', public_Id: ''})
            }
        } catch (error) {
            setLoading(false)
            toast.error("Internal Server Error!, Please ry agian later")
            console.error(error);
        }
    }

    const handelKeyPress = (
        e: | React.KeyboardEvent<HTMLInputElement> | React.KeyboardEvent<HTMLTextAreaElement>
    ) => {
        if (e.key === "Enter") {
            e.preventDefault()
        }
    }

    return (
        <Card
            style={{ position: 'relative', width: '100%', height: '240px' }}
            className="h-56 border-dashed flex items-center justify-center">

            {
                value.url ?
                    <>
                        <Button disabled={loading} type="button" variant={'destructive'} className="absolute top-2 right-2 z-10" onClick={() => onRemove(value.public_Id)}><Trash2 /></Button>
                        <Image
                            fill
                            style={{ objectFit: 'cover' }}
                            loading="lazy" src={value.url}
                            alt="Category Image"
                            className=" rounded-lg object-scale-down"
                        />
                    </>
                    :
                    <>
                        <label hidden={loading} htmlFor="image-upload" className="w-full h-full cursor-pointer">
                            <ImageUp strokeWidth={0.5} className="w-full h-full" />
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onKeyDown={handelKeyPress}
                            className="hidden"
                            id={`image-upload`}
                            onChange={handleFileChange}
                        />
                    </>
            }
        </Card>
    )
}

export default CategoryImage;