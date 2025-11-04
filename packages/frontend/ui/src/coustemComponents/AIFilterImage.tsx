import React, { useState } from 'react'
import { Wand, X } from 'lucide-react';
import Image from 'next/image';
import { AIenhacemanet } from '@meato/packages/frontend/utils';
import { Button } from '../button';
import { CardFooter, CardTitle } from '../card';

interface Props {
  aiOpen: boolean;
  setAiOpen: (value: boolean) => void
  setSelectedImage: (value: any) => void;
  selectedImage: any
  mainImage: any

}

const AIFilterImage: React.FC<Props> = ({ aiOpen, setAiOpen, selectedImage, setSelectedImage,mainImage }) => {
  const [activeEffect, setActiveEffect] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);


  const applyTransformaton = async (effect: string) => {
    
    if (!mainImage?.url || processing) return;
  // const removeTransformationParam = (url: string): string => {
  // const urlObj = new URL(url);
  // urlObj.searchParams.delete('tr'); // 🔥 removes the 'tr' parameter
  // return urlObj.toString();
// };

    setProcessing(true);
    setActiveEffect(effect);
    try {
      const setImageUrl = `${mainImage?.url }?tr=${effect}`
      if (setImageUrl) {
        setSelectedImage((prev:ImageDataType) =>
          prev ? { ...prev, url: setImageUrl } : undefined
        );
      }
    } catch (error) {
      console.error(error)
    } finally { setProcessing(false) }
  }
console.log(selectedImage);

  return (
    <div className='p-6 border-4 w-[800px] h-[800px] shadow-lg animate-rainbow-border rounded-lg bg-background overflow-hidden'>

      <p className='flex items-center justify-end'>
        <Button
          size={"sm"}
          onClick={() => setAiOpen(!aiOpen)}
          variant={"ghost"}
          type='button'
        >
          <X size={11} />
        </Button>
      </p>
      <CardTitle className="">Are you absolutely sure?</CardTitle>
      <div className='relative w-full h-[550px] mt-7 rounded overflow-hidden'>
        <Image
          src={selectedImage?.url}
          alt='product-image'
          layout='fill'
        />
      </div>

      <CardFooter className="grid grid-cols-2 mx-h=[250px] gap-3 w-full mt-3">
        {
          AIenhacemanet?.map((item) => (
            <button type='button' key={item.effect} className={`p-2 rounded-md flex items-center gap-2 justify-center ${activeEffect === item.effect ? "bg-blue-600 text-white" : "bg-gray-700 hover:bg-gray-600"
              }`}
              onClick={() => applyTransformaton(item.effect)}
              disabled={processing}
            >
              <Wand size={18} />
              {item.lable}
            </button>
          ))
        }
      </CardFooter>
    </div>
  )
}

export default AIFilterImage