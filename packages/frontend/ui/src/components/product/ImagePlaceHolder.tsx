import { Pencil, Trash2, WandSparkles } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '../../button';

interface Props {
  values: ImageDataType[];
  onChange: (value: ImageDataType[]) => void;
  size: string
  axiosInstace: any
}

const ImagePlaceHolder: React.FC<Props> = ({
  onChange,
  values,
  axiosInstace,
  size
}) => {
  const [mainImage, setMainImage] = useState(values[0]);
  const [aiOpen, setAiOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<ImageDataType | null>(null);
  const [likeImage, setLikeImage] = useState<ImageDataType | null>(null)

  console.log(selectedImage);
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
    // if (file) {
    //   const imageUrl = URL.createObjectURL(file);
    //   onChange(imageUrl);
    // }

    try {
      setLoading(true)
      const fileName = await convertFileToBase64(file);
      const res = await axiosInstace.post('/upload-image', { fileName });
      if (res.status === 201) {
        setLoading(false)
        const image = await res.data;
        onChange([...values, image])
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
        const filterData = values?.filter((image) => image.public_Id !== public_Id)
        onChange(filterData)
        setLikeImage(null)
      }
    } catch (error) {
      setLoading(false)
      toast.error("Internal Server Error!, Please ry agian later")
      console.error(error);
    }
  }

  // useEffect(() => {

  //   if (selectedImage) {
  //     const updatedValues = values.map((image) =>
  //       image.imageId === selectedImage.imageId
  //         ? { ...image, imageUrl: selectedImage.imageUrl } // 🔄 update the URL
  //         : image
  //     );
  //     onChange(updatedValues)

  //     const imageUrl = selectedImage.imageUrl

  //     if (imageUrl) {
  //       setMainImage((prev) =>
  //         prev ? { ...prev, imageUrl: imageUrl } : undefined
  //       );
  //     }

  //   }
  // }, [selectedImage, setSelectedImage])

  // console.log("mainImage",mainImage);

  useEffect(() => {
    if (likeImage) {
      return setMainImage(likeImage)
    }
    setMainImage(values[0])
  }, [onRemove, values, setLikeImage])

  const handelKeyPress = (
    e: | React.KeyboardEvent<HTMLInputElement> | React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (e.key === "Enter") {
      e.preventDefault()
    }
  }
  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onKeyDown={handelKeyPress}
        className="hidden"
        id={`image-upload`}
        onChange={handleFileChange}
      />
      <div
        className={`relative h-[450px] w-full cursor-default !bg-[rgba(95,102,182,0.1)] border-blue-700 shadow-md rounded-lg flex items-center flex-col justify-center`}
      >

        {
          mainImage && mainImage.url.trim() !== "" ? (
            <div className='cursor-pointer'>
              <Image
                width={400}
                height={300}
                src={mainImage.url}
                alt='uploaded'
                className="absolute inset-0 w-full h-full object-cover rounded-lg"
              />
              <>
                <Button variant={"ghost"} type='button' disabled={loading}
                  className='bg-red-600 hover:bg-red-500 text-white absolute top-3 right-3' size={"icon"}
                  onClick={() => onRemove(mainImage.public_Id)} >
                  <Trash2 size={16} />
                </Button>
                <Button
                  variant={"ghost"}
                  onClick={() => { setAiOpen(!aiOpen), setSelectedImage(mainImage) }}
                  type='button'
                  size={"icon"}
                  disabled={loading}
                  className=' absolute top-3 hover:bg-blue-400 right-[70px] bg-blue-500 text-white'>
                  <WandSparkles size={16} />
                </Button>
              </>
            </div>
          ) : (
            <div className='flex items-center justify-center flex-col'>
              <label
                hidden={loading}
                htmlFor={`image-upload`}
                className='absolute top-3 right-3 p-2 !rounded bg-slate-700  shadow-lg cursor-pointer' >
                <Pencil size={16} />
              </label>
              <>
                <p className={`text-gray-400 text-4xl font-semibold`}>
                  {size}
                </p>
                <p className={`text-muted-foreground text-lg text-center`}>
                  Please choose an image
                  <br />
                  according to the expected ratio
                </p>
              </>
            </div>
          )
        }
      </div>
      <div>
        {
          values.length > 0 && (
            <div className="grid grid-cols-3 mt-4 gap-3 w-full">
              {
                values.filter((image) => image.public_Id !== mainImage?.public_Id).map((image) => (
                  <div
                    key={image.public_Id}
                    className={`relative h-[180px] flex-wrap w-full cursor-default !bg-[rgba(95,102,182,0.1)] border-blue-700 shadow-md  rounded-lg flex items-center justify-center p-1`}
                  >
                    <Image
                      width={400}
                      height={300}
                      src={image?.url}
                      alt='uploaded'
                      onClick={() => setLikeImage(image)}
                      className='w-full h-full object-cover rounded-lg'
                    />
                  </div>
                ))
              }

              {
                values.length > 0 && (
                  <div
                    className={`relative h-[180px] w-full cursor-default !bg-[rgba(95,102,182,0.1)] border-blue-700 shadow-md  rounded-lg flex items-center flex-col justify-center ${values[6] && "hidden"}`}
                  >
                    <div className='flex items-center justify-center flex-col'>
                      <label
                        hidden={loading}
                        htmlFor={`image-upload`}
                        className='absolute top-3 right-3 p-2 !rounded bg-slate-700  shadow-lg cursor-pointer' >
                        <Pencil size={16} />
                      </label>
                      <>
                        <p className={`text-gray-400 text-xl font-semibold`}>
                          {size}
                        </p>
                        <p className={`text-muted-foreground text-sm text-center`}>
                          Please choose an image
                          <br />
                          according to the expected ratio
                        </p>
                      </>
                    </div>
                  </div>
                )
              }
            </div>

          )
        }
      </div>
    </div>
  );
};

export default ImagePlaceHolder;