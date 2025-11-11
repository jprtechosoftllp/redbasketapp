"use client";
import React from 'react'
import { useState } from 'react';
import {
    CheckCircle,
    MessageSquare,
    UserCheck,
    UserX
} from 'lucide-react';
import axios from 'axios';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import LoginForm from './components/LoginForm';
import VerifyForm from './components/VerifyForm';
import { useRouter } from 'next/navigation';

export default function page() {
    const [formData, setFormData] = useState({
        countryCode: '+91',
        phoneNumber: '',
        rememberMe: false
    });

    const [timer, setTimer] = useState(0);
    const [canResend, setCanResend] = useState(true);
    const [isVerifyForm, setIsVerifyForm] = useState(false);
    const [formType, setFormType] = useState('')
    const [alert, setAlert] = useState<AlertType>(null);

    const router = useRouter()

    const startResentTimer = () => {
        const interval = setInterval(() => {
            setTimer((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    setCanResend(false);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };


    const submitMutation = useMutation({
        mutationFn: async ({ countryCode, phone, otp }: { countryCode?: string; phone: string, otp?: string }) => {
            const url = formType === 'verify' ? 'login' : 'send-otp'
            try {
                const { data } = await axios.post(
                    `${process.env.NEXT_PUBLIC_SERVER_URL!}/auth/user/${url}`, { countryCode, phone, otp }
                );
                console.log(data);
                
                return data
            } catch (error: any) {
                // Optional: Extract error info before rethrowing
                const message =
                    error.response?.data?.message ||
                    "Something went wrong. Please try again.";
                throw new Error(message);
            }
        },
        onSuccess: (data) => {
            formType === 'verify' ? router.push('/') :
            setIsVerifyForm(true)
            setTimer(60);
            startResentTimer();

            toast.success(data.message, {
                icon: <UserCheck className="w-6 h-6 mr-3 text-white" />,
                action: {
                    label: "Undo",
                    onClick: () => console.log("Undo"),
                },
                style: {
                    background: "green",
                },
            });
        },
        onError: (error) => {
            // Handle and display the error
            toast.error(error.message, {
                icon: <UserX className="w-6 h-6 mr-3 text-white" />,
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

    const validatePhoneNumber = (phone: string) => {
        // Remove all non-digits
        const cleanPhone = phone.replace(/\D/g, '');
        // Check if it's between 7-15 digits (international standard)
        return cleanPhone.length >= 7 && cleanPhone.length <= 15;
    };

    const handleSendOTP = async () => {
        if (!formData.phoneNumber || !validatePhoneNumber(formData.phoneNumber)) {
            setAlert({
                type: 'error',
                message: 'Please enter a valid phone number first'
            });
            return;
        }
        // Implement actual OTP sending logic here
        // e.g., open OTP modal or navigate to OTP page
        submitMutation.mutate({ countryCode: formData.countryCode, phone: formData.phoneNumber })
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex">
            {/* Left Panel - Branding */}
            <div className="hidden lg:flex lg:flex-1 lg:flex-col lg:justify-center lg:px-12 lg:py-24 bg-gradient-to-br
          from-green-600 via-blue-600 to-indigo-700 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="relative z-10 max-w-md">
                    <div className="flex items-center mb-8">
                        <MessageSquare className="w-10 h-10 mr-3" />
                        <h1 className="text-3xl font-bold">MobileApp</h1>
                    </div>handleInputChange
                    <h2 className="text-4xl font-bold leading-tight mb-6">
                        Sign in with your phone number
                    </h2>
                    <p className="text-lg opacity-90 mb-8">
                        Access your account quickly and securely using your mobile number with SMS verification.
                    </p>
                    <div className="space-y-4">
                        <div className="flex items-center">
                            <CheckCircle className="w-5 h-5 mr-3 text-green-300" />
                            <span>SMS-based authentication</span>
                        </div>
                        <div className="flex items-center">
                            <CheckCircle className="w-5 h-5 mr-3 text-green-300" />
                            <span>Global phone number support</span>
                        </div>
                        <div className="flex items-center">
                            <CheckCircle className="w-5 h-5 mr-3 text-green-300" />
                            <span>Instant account access</span>
                        </div>
                        <div className="flex items-center">
                            <CheckCircle className="w-5 h-5 mr-3 text-green-300" />
                            <span>Secure & encrypted</span>
                        </div>
                    </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
            </div>

            {/* Right Panel - Login Form */}

            {
                isVerifyForm ?
                    <VerifyForm
                        handleSendOTP={handleSendOTP}
                        submitMutation={submitMutation}
                        setFormType={setFormType}
                        timer={timer}
                        setIsVerifyForm={setIsVerifyForm}
                        formData={formData}
                        canResend={canResend}
                    />
                    :
                    <LoginForm
                        handleSendOTP={handleSendOTP}
                        sendOTPMutation={submitMutation}
                        alert={alert}
                        setAlert={setAlert}
                        formData={formData}
                        setFormData={setFormData}
                    />
            }

        </div>
    );
};