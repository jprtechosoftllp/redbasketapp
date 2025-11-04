// import React, { useState } from 'react';
// import { AnimatePresence, motion } from "framer-motion";
// // import UpdateProduct from './UpdateProduct';
// import { useMutation } from '@tanstack/react-query';
// import { toast } from 'sonner';
// import { useDispatch } from 'react-redux';
// import { Button } from '@meato/packages/frontend/ui/button';
// import { Eye, Pencil, Signal, Trash2 } from 'lucide-react';
// import { CardContent, CardFooter, CardTitle } from '@meato/packages/frontend/ui/card';
// import axiosInstace from 'apps/admin-ui/src/utils/axiosInstace';
// import { updateCategory } from 'apps/admin-ui/src/utils/redux/slice/categorySlice';
// // import ProductDetails from './ProductDetails/ProductDetails';

// const ActionCell = ({ rowData }: { rowData?: CategoryType }) => {
//   const [showDetails, setShowDetails] = useState(false);
//   const [showForm, setShowForm] = useState(false);
//   const [showDelete, setShowDelete] = useState(false);
//   const [showRestore, setShowRestore] = useState(false);

//   const dispatch = useDispatch()

//   const deleteItem = useMutation({
//     mutationFn: async (url: string) => {
//       try {
//         const res = await axiosInstace.delete(url, {
//           data: {
//             id: rowData.id
//           }
//         });
//         return res.data
//       } catch (error: any) {
//         // Optional: Extract error info before rethrowing
//         const message =
//           error.response?.data?.message ||
//           "Something went wrong. Please try again.";
//         throw new Error(message);
//       }
//     },
//     onSuccess: (data) => {
//       dispatch(updateCategory(data.category)); // remove from store

//       toast.success('Product is Deleted Successfully');
//       setShowDelete(!showDelete)
//     },
//     onError: (error: any) => {
//       console.error("[Delete_product]", error);
//       toast.error(error.message || "Something went wrong! Please try again.");
//     },
//   })

//   return (
//     <div>
//       <>
//         <Button variant={"ghost"} size={"sm"} onClick={() => setShowDetails(!showDetails)}>
//           <Eye size={18} className='text-blue-900' />
//         </Button>

//         <Button
//           variant={"ghost"}
//           onClick={() => setShowForm(!showForm)} >
//           <Pencil size={18} className='text-blue-700' />
//         </Button>
//         {
//           rowData?.isActive ? (
//             <Button
//               size={"icon"}
//               variant={"ghost"}
//               onClick={() => setShowRestore(!showRestore)}
//             >
//               <Signal size={20} className='text-green-700' />
//             </Button>
//           ) : (
//             <Button
//               variant={"ghost"}
//               size={"icon"}
//               onClick={() => setShowDelete(!showDelete)}
//             >
//               <Trash2 size={20} className='text-red-800' />
//             </Button>

//           )
//         }

//       </>
//       <AnimatePresence>
//         {
//           showDelete && (
//             <>
//               <motion.div
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 0.5 }}
//                 exit={{ opacity: 0 }}
//                 transition={{ duration: 0.3 }}
//                 className="fixed inset-0 bg-background/50 backdrop-blur-md z-40"
//               />
//               <motion.div
//                 initial={{ opacity: 0, y: 50, scale: 0.95 }}
//                 animate={{ opacity: 1, y: 0, scale: 1 }}
//                 exit={{ opacity: 0, y: 50, scale: 0.95 }}
//                 transition={{ duration: 0.4, ease: "easeInOut" }}
//                 className={`fixed inset-0 z-50 flex flex-col items-center justify-center`}
//               >
//                 <div className='p-6 border-4 w-[500px] shadow-lg animate-rainbow-border rounded-lg bg-background'>
//                   <CardTitle className="">Are you absolutely sure?</CardTitle>
//                   <CardContent className="font-bold text-muted-foreground mt-4">
//                     This action cannot be undone. This product will be moved to a Delete State and permanently
//                     delete after 24 hours. You can recover it within this time.
//                   </CardContent>
//                   <CardFooter className="flex items-center justify-end gap-3">
//                     <Button
//                       disabled={deleteItem.isPending}
//                       onClick={() => setShowDelete(!showDelete)}
//                       variant={"destructive"} type="button"
//                     >
//                       Cancel
//                     </Button>
//                     <Button
//                       disabled={deleteItem.isPending}
//                       onClick={() => deleteItem.mutate(`/product/api/delete-product`)}
//                     >
//                       Continue
//                     </Button>
//                   </CardFooter>
//                 </div>
//               </motion.div>
//             </>
//           )
//         }
//         {
//           showRestore && (
//             <>
//               <motion.div
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 0.5 }}
//                 exit={{ opacity: 0 }}
//                 transition={{ duration: 0.3 }}
//                 className="fixed inset-0 bg-background/50 backdrop-blur-md z-40"
//               />
//               <motion.div
//                 initial={{ opacity: 0, y: 50, scale: 0.95 }}
//                 animate={{ opacity: 1, y: 0, scale: 1 }}
//                 exit={{ opacity: 0, y: 50, scale: 0.95 }}
//                 transition={{ duration: 0.4, ease: "easeInOut" }}
//                 className={`fixed inset-0 z-50 flex flex-col items-center justify-center`}
//               >
//                 <div className='p-6 border-4 w-[500px] shadow-lg animate-rainbow-border rounded-lg bg-background'>
//                   <CardTitle className="">Are you absolutely sure?</CardTitle>
//                   <CardContent className="font-bold text-muted-foreground mt-4">
//                     This action cannot be undone. This product will be moved to a Delete State and permanently delete after 24 hours.
//                     You can recover it within this time.
//                   </CardContent>
//                   <CardFooter className="flex items-center justify-end gap-3">
//                     <Button
//                       disabled={deleteItem.isPending}
//                       onClick={() => setShowRestore(!showRestore)}
//                       variant={"destructive"} type="button"
//                     >
//                       Cancel
//                     </Button>
//                     <Button
//                       disabled={deleteItem.isPending}
//                       onClick={() => deleteItem.mutate(`/product/api/restore-product/`)}
//                     >
//                       Continue
//                     </Button>
//                   </CardFooter>
//                 </div>
//               </motion.div>
//             </>
//           )
//         }
//         {
//           showForm && (
//             <>
//               <motion.div
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 0.5 }}
//                 exit={{ opacity: 0 }}
//                 transition={{ duration: 0.3 }}
//                 className="fixed inset-0 bg-background backdrop-blur-md"
//               />
//               <motion.div
//                 initial={{ opacity: 0, y: 50, scale: 0.95 }}
//                 animate={{ opacity: 1, y: 0, scale: 1 }}
//                 exit={{ opacity: 0, y: 50, scale: 0.95 }}
//                 transition={{ duration: 0.4, ease: "easeInOut" }}
//                 className={`fixed inset-0 z-50 flex w-full h-full flex-col items-center justify-center`}
//               >
//                 {/* <UpdateProduct
//                   rowData={rowData}
//                   setShowForm={setShowForm}
//                   showForm={showForm}
//                 /> */}
//               </motion.div>
//             </>
//           )
//         }
//         {
//           showDetails && (
//             <>
//               <motion.div
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 0.5 }}
//                 exit={{ opacity: 0 }}
//                 transition={{ duration: 0.3 }}
//                 className="fixed inset-0 bg-background backdrop-blur-md"
//               />
//               <motion.div
//                 initial={{ opacity: 0, y: 50, scale: 0.95 }}
//                 animate={{ opacity: 1, y: 0, scale: 1 }}
//                 exit={{ opacity: 0, y: 50, scale: 0.95 }}
//                 transition={{ duration: 0.4, ease: "easeInOut" }}
//                 className={`fixed inset-0 z-50 bg-background flex w-full h-full`}
//               >
//                 {/* <ProductDetails rowData={rowData} setShowDetails={setShowDetails} showDetails={showDetails} /> */}
//               </motion.div>
//             </>
//           )
//         }


//       </AnimatePresence>
//     </div>
//   )
// }

// export default ActionCell;
import React from 'react'

export default function ActionCell() {
  return (
    <div>ActionCell</div>
  )
}
