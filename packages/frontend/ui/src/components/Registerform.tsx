"use client"
import './style.css';
import { useState, useRef } from 'react';
import { Mail, CheckCircle2, ArrowLeft, UserCheck, UserX, Camera, Phone, EyeOff, Eye, User } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import axios from 'axios'
import Link from 'next/link';

export default function RegistrationForm({ submitMutation, userType}: { submitMutation: any, userType?:string }) {
    const [step, setStep] = useState('register'); // 'register' or 'otp'
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        photo: null
    });


    const [photoPreview, setPhotoPreview] = useState<any>();
    const [otp, setOtp] = useState(['', '', '', '']);
    const otpRefs: any = [useRef(null), useRef(null), useRef(null), useRef(null)];
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [timer, setTimer] = useState(0);
    const [canResend, setCanResend] = useState(false)


    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handlePhotoChange = (e: any) => {
        const file = e.target.files[0];
        if (file) {
            setFormData((prev) => ({ ...prev, photo: file }));
            const reader = new (window as any).FileReader();
            reader.onloadend = () => {
                setPhotoPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };
    const url = userType === 'manager' ? 'manager/send-otp' : 'admin/send-otp'
    const sendOTPMutation = useMutation({
        mutationFn: async (value: { username: string, email: string, formType:string }) => {
            try {
                const res = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/auth/${url}`, value)
                return res.data
            } catch (error: any) {
                // Optional: Extract error info before rethrowing
                const message =
                    error.response?.data?.message ||
                    "Something went wrong. Please try again.";
                throw new Error(message);
            }
        },
        onSuccess: (data: any) => {
            setStep('otp')
            startResentTimer()
            setTimer(60)
            setCanResend(false)
            toast.error(data.message, {
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
                // style: {
                //     background: "red",
                // },
            });
        },
    })

    const handleSubmit = (e: any) => {
        e.preventDefault();
        sendOTPMutation.mutate({ username: formData.username, email: formData.email, formType: 'register' })
    };



    const handleOtpChange = (index: number, value: string) => {
        if (value.length > 1) value = value.slice(0, 1); setStep
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp)

        if (value && index < 3) {
            otpRefs[index + 1].current?.focus();
        }
    };

    const handleOtpKeyDown = (index: number, e: any) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            otpRefs[index - 1].current?.focus();
        }
    };

    const handleOtpPaste = (e: any) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').slice(0, 4);
        if (!/^\d+$/.test(pastedData)) return;

        const newOtp = [...otp];
        for (let i = 0; i < pastedData.length && i < 4; i++) {
            newOtp[i] = pastedData[i];
        }
        setOtp(newOtp);
        const nextIndex = Math.min(pastedData.length, 3);
        otpRefs[nextIndex].current?.focus();
    };


    const verifyOtp = () => {
        const otpValue = otp.join('');
        if (otpValue.length === 4) {
            submitMutation.mutate({
                username: formData.username,
                email: formData.email,
                password: formData.password,
                confirmPassword: formData.confirmPassword,
                phone: formData.phone,
                photo: photoPreview,
                otp: otpValue
            })
        }

    };

    const startResentTimer = () => {
        const interval = setInterval(() => {
            setTimer((prev: number) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    setCanResend(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute w-96 h-96 bg-blue-500 rounded-full filter blur-3xl opacity-20 animate-blob top-0 -left-48"></div>
                <div className="absolute w-96 h-96 bg-purple-500 rounded-full filter blur-3xl opacity-20 animate-blob animation-delay-2000 top-0 -right-48"></div>
                <div className="absolute w-96 h-96 bg-pink-500 rounded-full filter blur-3xl opacity-20 animate-blob animation-delay-4000 bottom-0 left-1/2 transform -translate-x-1/2"></div>
            </div>

            {/* Form Container */}
            <div className="w-full max-w-md relative z-10">
                {step === 'register' ? (
                    <div className="bg-gray-800 bg-opacity-80 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-gray-700 animate-fade-in">
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
                            <p className="text-gray-400">Join us today</p>
                        </div>

                        <div className="space-y-6">
                            {/* Photo Upload */}
                            <div className="flex flex-col items-center mb-6">
                                <div className="relative group">
                                    <div className="w-24 h-24 rounded-full bg-gray-700 border-2 border-gray-600 flex items-center justify-center overflow-hidden transition-all duration-300 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/50">
                                        {photoPreview ? (
                                            <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                                        ) : (
                                            <Camera className="w-8 h-8 text-gray-400" />
                                        )}
                                    </div>
                                    <label className="absolute inset-0 cursor-pointer rounded-full flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handlePhotoChange}
                                            className="hidden"
                                        />
                                        <Camera className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    </label>
                                </div>
                                <p className="text-sm text-gray-400 mt-2">Photo (Optional)</p>
                            </div>

                            {/* Username */}
                            <div className="relative group">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 transition-colors duration-300 group-focus-within:text-blue-400" />
                                <input
                                    type="text"
                                    name="username"
                                    value={formData?.username}
                                    onChange={handleChange}
                                    placeholder="Username"
                                    required
                                    className="w-full bg-gray-700 text-white pl-10 pr-4 py-3 rounded-lg border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 outline-none transition-all duration-300"
                                />
                            </div>

                            {/* Email */}
                            <div className="relative group">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 transition-colors duration-300 group-focus-within:text-blue-400" />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData?.email}
                                    onChange={handleChange}
                                    placeholder="Email"
                                    required
                                    className="w-full bg-gray-700 text-white pl-10 pr-4 py-3 rounded-lg border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 outline-none transition-all duration-300"
                                />
                            </div>

                            {/* Phone */}
                            <div className="relative group">
                                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 transition-colors duration-300 group-focus-within:text-blue-400" />
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData?.phone}
                                    onChange={handleChange}
                                    placeholder="Phone Number"
                                    required
                                    className="w-full bg-gray-700 text-white pl-10 pr-4 py-3 rounded-lg border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 outline-none transition-all duration-300"
                                />
                            </div>

                            {/* Password */}
                            <div className="relative group">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData?.password}
                                    onChange={handleChange}
                                    placeholder="Password"
                                    required
                                    className="w-full bg-gray-700 text-white pl-4 pr-10 py-3 rounded-lg border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 outline-none transition-all duration-300"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-400 transition-colors duration-300"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>

                            {/* Confirm Password */}
                            <div className="relative group">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    name="confirmPassword"
                                    value={formData?.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Confirm Password"
                                    required
                                    className="w-full bg-gray-700 text-white pl-4 pr-10 py-3 rounded-lg border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 outline-none transition-all duration-300"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-400 transition-colors duration-300"
                                >
                                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>

                            {/* Submit Button */}
                            <button
                                onClick={handleSubmit}
                                disabled={sendOTPMutation.isPending}
                                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-blue-500/50"
                            >
                                {submitMutation.isPending ? 'Continue.....' : 'Continue'}
                            </button>
                        </div>

                        <div className="mt-6 text-center">
                            <p className="text-gray-400 text-sm">
                                Already have an account?{' '}
                                <Link href="/sign-in" className="text-blue-400 hover:text-blue-300 transition-colors duration-300">
                                    Sign in
                                </Link>
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="bg-gray-800 bg-opacity-80 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-gray-700 animate-slide-in">
                        <button
                            onClick={() => setStep('register')}
                            className="flex items-center text-gray-400 hover:text-white transition-colors duration-300 mb-6"
                        >
                            <ArrowLeft className="w-5 h-5 mr-2" />
                            Back
                        </button>

                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Mail className="w-8 h-8 text-white" />
                            </div>
                            <h1 className="text-3xl font-bold text-white mb-2">Verify OTP</h1>
                            <p className="text-gray-400">Enter the 4-digit code sent to</p>
                            <p className="text-blue-400 font-medium mt-1">{formData?.email}</p>
                        </div>

                        {
                            step === 'otp' ? (
                                <>
                                    <div className="flex justify-center gap-3 mb-8">
                                        {otp.map((digit, index) => (
                                            <input
                                                key={index}
                                                ref={otpRefs[index]}
                                                type="text"
                                                inputMode="numeric"
                                                maxLength={1}
                                                value={digit}
                                                onChange={(e: any) => handleOtpChange(index, e.target.value)}
                                                onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                                onPaste={index === 0 ? handleOtpPaste : undefined}
                                                className="w-16 h-16 text-center text-2xl font-bold bg-gray-700 text-white rounded-lg border-2 border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 outline-none transition-all duration-300"
                                            />
                                        ))}
                                    </div>

                                    <button
                                        onClick={verifyOtp}
                                        disabled={otp.join('').length !== 4 || submitMutation.isPending}
                                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:transform-none shadow-lg hover:shadow-blue-500/50"
                                    >
                                        Verify OTP
                                    </button>

                                    <div className="mt-6 text-center">
                                        <p className="text-gray-400 text-sm">
                                            Didn't receive the code?{' '}
                                            {
                                                canResend ? <button onClick={handleSubmit} disabled={sendOTPMutation.isPending} className="text-blue-400 hover:text-blue-300 transition-colors duration-300">
                                                    {sendOTPMutation.isPending ? "Sending...." : "Resend OTP"}
                                                </button>
                                                    :
                                                    <span className="text-blue-400 hover:text-blue-300 transition-colors duration-300">Resend otp in ${timer}s</span>
                                            }

                                        </p>
                                    </div>
                                </>
                            ) : (
                                <div className="text-center animate-fade-in">
                                    <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-scale-in">
                                        <CheckCircle2 className="w-12 h-12 text-white" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-white mb-2">Verified!</h2>
                                    <p className="text-gray-400">Your account has been created successfully</p>
                                </div>
                            )}
                    </div>
                )}
            </div>
        </div>
    );
}