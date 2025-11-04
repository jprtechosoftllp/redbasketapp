import { AnimatePresence, motion } from 'framer-motion'
import React from 'react'

interface Props {
    open: boolean;
    children: React.ReactNode
}

const  MotionAnimatePresence:React.FC<Props> = ({children, open})=> {
  return (
    <AnimatePresence>
                {
                    open && (
                        <>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 0.5 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="fixed inset-0 bg-background backdrop-blur-md"
                            />
                            <motion.div
                                initial={{ opacity: 0, y: 50, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 50, scale: 0.95 }}
                                transition={{ duration: 0.4, ease: "easeInOut" }}
                                className={`fixed inset-0 z-50 bg-background flex w-full h-full items-center justify-center `}
                            >
                                {children}
                            </motion.div>
                        </>

                    )
                }
            </AnimatePresence>
  )
}
export default MotionAnimatePresence;