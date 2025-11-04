"use client"
import './style.css';
import React, { useState } from 'react';
import { User, Mail, Lock, Shield, FileText, Building2, CreditCard, Sparkles, ArrowRight, ArrowLeft, Check, UserCheck, UserX } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import axiosInstace from 'apps/admin-ui/src/utils/axiosInstace';
import { addActiveVendor } from 'apps/admin-ui/src/utils/redux/slice/activeVendorSlice';

export default function VendorForm() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        otp: ['', '', '', ''],
        gst_number: '',
        phone: '',
        shop_city: '',
        shop_pinCode: '',
        shop_state: '',
        fssai_license: '',
        shop_address: '',
        shop_name: '',
        bank_account: '',
        ifsc_code: ''
    });
    const [errors, setErrors] = useState<any>({});

    const router = useRouter();
    const dispatch = useDispatch()

    const handleInputChange = (e: any) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev: string[]) => ({ ...prev, [name]: '' }));
        }
    };

    const handleOtpChange = (index: number, value: string) => {
        if (value.length <= 1 && /^\d*$/.test(value)) {
            const newOtp = [...formData.otp];
            newOtp[index] = value;
            setFormData(prev => ({ ...prev, otp: newOtp }));

            if (value && index < 3) {
                const nextInput = document.getElementById(`otp-${index + 1}`);
                if (nextInput) nextInput.focus();
            }
        }
    };

    const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !formData.otp[index] && index > 0) {
            const prevInput = document.getElementById(`otp-${index - 1}`);
            if (prevInput) prevInput.focus();
        }
    };

    const validateStep1 = () => {
        const newErrors: any = {};
        if (!formData.username.trim()) newErrors.username = 'Username is required';
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateStep3 = () => {
        const newErrors: any = {};
        const otpComplete = formData.otp.every(digit => digit !== '');
        if (!otpComplete) newErrors.otp = 'Please enter complete 4-digit OTP';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateStep2 = () => {
        const newErrors: any = {};
        if (!formData.gst_number.trim()) newErrors.gst_number = 'GST Number is required';
        if (!formData.fssai_license.trim()) newErrors.fssai_license = 'FSSAI License is required';
        if (!formData.shop_address.trim()) newErrors.shop_address = 'Shop Address is required';
        if (!formData.shop_name.trim()) newErrors.shop_name = 'Shop Name is required';
        if (!formData.shop_city.trim()) newErrors.city = 'Shop City is required';
        if (!formData.shop_state.trim()) newErrors.shop_name = 'Shop State is required';
        if (!formData.shop_pinCode.trim()) newErrors.shop_pinCode = 'Shop Area pin code is required';
        if (!formData.bank_account.trim()) {
            newErrors.bank_account = 'Bank Account is required';
        } else if (!/^\d+$/.test(formData.bank_account)) {
            newErrors.bank_account = 'Invalid account number';
        }
        if (!formData.ifsc_code.trim()) {
            newErrors.ifsc_code = 'IFSC Code is required';
        } else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(formData.ifsc_code.toUpperCase())) {
            newErrors.ifsc_code = 'Invalid IFSC Code format';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;

    };

    const sendOTPMutation = useMutation({
        mutationFn: async (values: { email: string, username: string, phone: string, formType: string }) => {
            try {
                const res = await axiosInstace.post('/auth/vendor/send-otp', values);

                return res.data
            } catch (error: any) {
                // Optional: Extract error info before rethrowing
                const message =
                    error.response?.data?.message ||
                    "Something went wrong. Please try again.";
                throw new Error(message);
            }
        },
        onSuccess: (data) => {
            setStep(3);
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
                style: {
                    background: "red",
                },
            });
        },
    })

    const handleNext = () => {
        if (step === 1 && validateStep1()) {
            setStep(2)
        } else if (step === 2 && validateStep2()) {
            sendOTPMutation.mutate({ email: formData.email, username: formData.username, phone: formData.phone, formType: 'register' })
        }

    };

    const submitMutation = useMutation({
        mutationFn: async (values: {
            username: string,
            email: string,
            password: string,
            otp: string,
            phone: string,
            gst_number: string,
            fssai_license: string,
            shop_pinCode: string,
            shop_address: string,
            shop_name: string,
            shop_state: string,
            shop_city: string,
            bank_account: string,
            ifsc_code: string
        }) => {
            try {
                const res = await axiosInstace.post('/auth/vendor/create-vendor-admin', values);

                return res.data
            } catch (error: any) {
                // Optional: Extract error info before rethrowing
                const message =
                    error.response?.data?.message ||
                    "Something went wrong. Please try again.";
                throw new Error(message);
            }
        },
        onSuccess: (data) => {
            dispatch(addActiveVendor(data.vendor))
            router.push('/vendor/active')
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
    })

    const handleSubmit = () => {
        if (validateStep3()) {
            const joinOtp = formData.otp.join('')

            submitMutation.mutate(
                {
                    username: formData.username,
                    email: formData.email,
                    password: formData.password,
                    otp: joinOtp,
                    phone: formData.phone,
                    gst_number: formData.gst_number,
                    fssai_license: formData.fssai_license,
                    shop_pinCode: formData.shop_pinCode,
                    shop_address: formData.shop_address,
                    shop_name: formData.shop_name,
                    shop_state: formData.shop_state,
                    shop_city: formData.shop_city,
                    bank_account: formData.bank_account,
                    ifsc_code: formData.ifsc_code
                }
            )
        }
    };

    const steps = [
        { num: 1, label: 'Account', icon: User, desc: 'Create account' },
        { num: 2, label: 'Business', icon: Building2, desc: 'Business info' },
        { num: 3, label: 'Verify', icon: Shield, desc: 'Verify email' },

    ];

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 md:p-8 relative overflow-hidden bg-gray-950">
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-950 via-gray-950 to-cyan-950"></div>

                <div className="absolute top-0 left-0 w-96 h-96 bg-violet-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float-delayed"></div>
                <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-fuchsia-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float-slow"></div>

                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

                <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-violet-500 to-transparent opacity-20 animate-glow"></div>
            </div>

            <div className="relative w-full max-w-5xl animate-slideUp">
                <div className="bg-gray-900/40 backdrop-blur-2xl rounded-3xl shadow-2xl border border-gray-800/50 p-6 sm:p-8 md:p-12">

                    <div className="text-center mb-8 md:mb-12">
                        <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-violet-500 to-cyan-500 rounded-2xl mb-4 md:mb-6 shadow-lg shadow-violet-500/50 animate-pulse-slow">
                            <Sparkles className="w-8 h-8 md:w-10 md:h-10 text-white" />
                        </div>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent mb-3">
                            Create Account
                        </h1>
                        <p className="text-gray-400 text-sm md:text-base">Join us and start your journey today</p>
                    </div>

                    <div className="mb-8 md:mb-12">
                        <div className="flex items-center justify-between max-w-2xl mx-auto">
                            {steps.map((s, idx) => {
                                const StepIcon = s.icon;
                                return (
                                    <React.Fragment key={s.num}>
                                        <div className="flex flex-col items-center flex-1">
                                            <div className={`relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center transition-all duration-500 ${step >= s.num
                                                ? 'bg-gradient-to-br from-violet-500 to-cyan-500 shadow-lg shadow-violet-500/50 scale-110'
                                                : 'bg-gray-800/50 border border-gray-700'
                                                }`}>
                                                {step > s.num ? (
                                                    <Check className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white" />
                                                ) : (
                                                    <StepIcon className={`w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 ${step >= s.num ? 'text-white' : 'text-gray-500'}`} />
                                                )}
                                                {step === s.num && (
                                                    <div className="absolute inset-0 rounded-2xl bg-violet-500 animate-ping opacity-20"></div>
                                                )}
                                            </div>
                                            <div className="mt-2 text-center hidden sm:block">
                                                <p className={`text-xs md:text-sm font-semibold transition-colors ${step >= s.num ? 'text-white' : 'text-gray-500'
                                                    }`}>
                                                    {s.label}
                                                </p>
                                            </div>
                                        </div>
                                        {idx < steps.length - 1 && (
                                            <div className={`h-0.5 sm:h-1 flex-1 mx-2 sm:mx-4 rounded-full transition-all duration-500 ${step > s.num
                                                ? 'bg-gradient-to-r from-violet-500 to-cyan-500'
                                                : 'bg-gray-800'
                                                }`} />
                                        )}
                                    </React.Fragment>
                                );
                            })}
                        </div>
                    </div>

                    <div className="max-w-2xl mx-auto p-2">
                        {step === 1 && (
                            <div className="space-y-6 animate-slideUp">
                                <div className="group">
                                    <label className="block text-gray-300 text-sm font-semibold mb-2">Username</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                        <input
                                            type="text"
                                            name="username"
                                            value={formData.username}
                                            onChange={handleInputChange}
                                            className="input-focus w-full pl-12 pr-4 py-4 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                                            placeholder="Choose a username"
                                        />
                                    </div>
                                    {errors.username && (
                                        <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
                                            <span className="w-1 h-1 bg-red-400 rounded-full"></span>
                                            {errors.username}
                                        </p>
                                    )}
                                </div>

                                <div className="group">
                                    <label className="block text-gray-300 text-sm font-semibold mb-2">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="input-focus w-full pl-12 pr-4 py-4 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                                            placeholder="your.email@example.com"
                                        />
                                    </div>
                                    {errors.email && (
                                        <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
                                            <span className="w-1 h-1 bg-red-400 rounded-full"></span>
                                            {errors.email}
                                        </p>
                                    )}
                                </div>

                                <div className="group">
                                    <label className="block text-gray-300 text-sm font-semibold mb-2">Contect Number</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                        <input
                                            // type="email"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            className="input-focus w-full pl-12 pr-4 py-4 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                                            placeholder="your.email@example.com"
                                        />
                                    </div>
                                    {errors.phone && (
                                        <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
                                            <span className="w-1 h-1 bg-red-400 rounded-full"></span>
                                            {errors.phone}
                                        </p>
                                    )}
                                </div>

                                <div className="group">
                                    <label className="block text-gray-300 text-sm font-semibold mb-2">Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                        <input
                                            type="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            className="input-focus w-full pl-12 pr-4 py-4 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                                            placeholder="Minimum 6 characters"
                                        />
                                    </div>
                                    {errors.password && (
                                        <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
                                            <span className="w-1 h-1 bg-red-400 rounded-full"></span>
                                            {errors.password}
                                        </p>
                                    )}
                                </div>

                                <button
                                    type="button"
                                    onClick={handleNext}
                                    className="w-full py-4 mt-4 bg-gradient-to-r from-violet-600 to-cyan-600 text-white font-bold rounded-xl hover:from-violet-500 hover:to-cyan-500 transition-all transform hover:scale-[1.02] active:scale-95 shadow-lg shadow-violet-500/50 flex items-center justify-center gap-2"
                                >
                                    Continue
                                    <ArrowRight className="w-5 h-5" />
                                </button>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-6 animate-slideUp max-h-[500px] overflow-y-auto pr-2 pl-2 custom-scrollbar">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-gray-300 text-sm font-semibold mb-2">GST Number</label>
                                        <div className="relative">
                                            <FileText className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                            <input
                                                type="text"
                                                name="gst_number"
                                                value={formData.gst_number}
                                                onChange={handleInputChange}
                                                className="input-focus w-full pl-12 pr-4 py-4 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                                                placeholder="22AAAAA0000A1Z5"
                                            />
                                        </div>
                                        {errors.gst_number && (
                                            <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
                                                <span className="w-1 h-1 bg-red-400 rounded-full"></span>
                                                {errors.gst_number}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-gray-300 text-sm font-semibold mb-2">FSSAI License</label>
                                        <div className="relative">
                                            <FileText className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                            <input
                                                type="text"
                                                name="fssai_license"
                                                value={formData.fssai_license}
                                                onChange={handleInputChange}
                                                className="input-focus w-full pl-12 pr-4 py-4 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                                                placeholder="10012021001234"
                                            />
                                        </div>
                                        {errors.fssai_license && (
                                            <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
                                                <span className="w-1 h-1 bg-red-400 rounded-full"></span>
                                                {errors.fssai_license}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-gray-300 text-sm font-semibold mb-2">Shop Name</label>
                                        <div className="relative">
                                            <FileText className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                            <input
                                                type="text"
                                                name="shop_name"
                                                value={formData.shop_name}
                                                onChange={handleInputChange}
                                                className="input-focus w-full pl-12 pr-4 py-4 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                                                placeholder="22AAAAA0000A1Z5"
                                            />
                                        </div>
                                        {errors.shop_name && (
                                            <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
                                                <span className="w-1 h-1 bg-red-400 rounded-full"></span>
                                                {errors.shop_name}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-gray-300 text-sm font-semibold mb-2">Shop Area Pin</label>
                                        <div className="relative">
                                            <FileText className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                            <input
                                                type="text"
                                                name="shop_pinCode"
                                                value={formData.shop_pinCode}
                                                onChange={handleInputChange}
                                                className="input-focus w-full pl-12 pr-4 py-4 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                                                placeholder="10012021001234"
                                            />
                                        </div>
                                        {errors.shop_pinCode && (
                                            <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
                                                <span className="w-1 h-1 bg-red-400 rounded-full"></span>
                                                {errors.shop_pinCode}
                                            </p>
                                        )}
                                    </div>
                                </div>



                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-gray-300 text-sm font-semibold mb-2">Shop City</label>
                                        <div className="relative">
                                            <FileText className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                            <input
                                                type="text"
                                                name="shop_city"
                                                value={formData.shop_city}
                                                onChange={handleInputChange}
                                                className="input-focus w-full pl-12 pr-4 py-4 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                                                placeholder="22AAAAA0000A1Z5"
                                            />
                                        </div>
                                        {errors.shop_city && (
                                            <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
                                                <span className="w-1 h-1 bg-red-400 rounded-full"></span>
                                                {errors.shop_city}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-gray-300 text-sm font-semibold mb-2">Shop State</label>
                                        <div className="relative">
                                            <FileText className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                            <input
                                                type="text"
                                                name="shop_state"
                                                value={formData.shop_state}
                                                onChange={handleInputChange}
                                                className="input-focus w-full pl-12 pr-4 py-4 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                                                placeholder="10012021001234"
                                            />
                                        </div>
                                        {errors.shop_state && (
                                            <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
                                                <span className="w-1 h-1 bg-red-400 rounded-full"></span>
                                                {errors.shop_state}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-gray-300 text-sm font-semibold mb-2">Shop Address</label>
                                    <div className="relative">
                                        <Building2 className="absolute left-4 top-4 w-5 h-5 text-gray-500" />
                                        <textarea
                                            name="shop_address"
                                            value={formData.shop_address}
                                            onChange={handleInputChange}
                                            rows={4}
                                            className="w-full pl-12 pr-4 py-4 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all resize-none"
                                            placeholder="Enter your complete shop address"
                                        />
                                    </div>
                                    {errors.shop_address && (
                                        <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
                                            <span className="w-1 h-1 bg-red-400 rounded-full"></span>
                                            {errors.shop_address}
                                        </p>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-gray-300 text-sm font-semibold mb-2">Bank Account</label>
                                        <div className="relative">
                                            <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                            <input
                                                type="text"
                                                name="bank_account"
                                                value={formData.bank_account}
                                                onChange={handleInputChange}
                                                className="input-focus w-full pl-12 pr-4 py-4 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                                                placeholder="1234567890"
                                            />
                                        </div>
                                        {errors.bank_account && (
                                            <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
                                                <span className="w-1 h-1 bg-red-400 rounded-full"></span>
                                                {errors.bank_account}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-gray-300 text-sm font-semibold mb-2">IFSC Code</label>
                                        <div className="relative">
                                            <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                            <input
                                                type="text"
                                                name="ifsc_code"
                                                value={formData.ifsc_code}
                                                onChange={handleInputChange}
                                                className="input-focus w-full pl-12 pr-4 py-4 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all uppercase"
                                                placeholder="SBIN0001234"
                                            />
                                        </div>
                                        {errors.ifsc_code && (
                                            <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
                                                <span className="w-1 h-1 bg-red-400 rounded-full"></span>
                                                {errors.ifsc_code}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="button"
                                        disabled={sendOTPMutation.isPending}
                                        onClick={() => setStep(1)}
                                        className="flex-1 py-4 bg-gray-800/50 text-white font-bold rounded-xl hover:bg-gray-700/50 transition-all border border-gray-700 flex items-center justify-center gap-2"
                                    >
                                        <ArrowLeft className="w-5 h-5" />
                                        Back
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleNext}
                                        disabled={sendOTPMutation.isPending || submitMutation.isPending}
                                        className="flex-1 py-4 bg-gradient-to-r from-violet-600 to-cyan-600 text-white font-bold rounded-xl hover:from-violet-500 hover:to-cyan-500 transition-all transform hover:scale-[1.02] active:scale-95 shadow-lg shadow-violet-500/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {sendOTPMutation.isPending ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                Processing...
                                            </>
                                        ) : (
                                            <>
                                                Complete
                                                <Check className="w-5 h-5" />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="space-y-8 animate-slideUp">
                                <div className="text-center">
                                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-violet-500/20 to-cyan-500/20 rounded-2xl mb-6 border border-violet-500/30">
                                        <Shield className="w-10 h-10 text-violet-400" />
                                    </div>
                                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">Verify Your Email</h3>
                                    <p className="text-gray-400 text-sm md:text-base">
                                        We sent a 4-digit code to
                                        <br />
                                        <span className="text-violet-400 font-semibold">{formData.email}</span>
                                    </p>
                                </div>

                                <div className="flex justify-center gap-3 sm:gap-4">
                                    {formData.otp.map((digit, idx) => (
                                        <input
                                            key={idx}
                                            id={`otp-${idx}`}
                                            type="text"
                                            maxLength={1}
                                            value={digit}
                                            onChange={(e) => handleOtpChange(idx, e.target.value)}
                                            onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                                            className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 text-center text-2xl md:text-3xl font-bold bg-gray-800/50 border-2 border-gray-700 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all"
                                        />
                                    ))}
                                </div>
                                {errors.otp && (
                                    <p className="text-red-400 text-sm text-center flex items-center justify-center gap-2">
                                        <span className="w-1.5 h-1.5 bg-red-400 rounded-full"></span>
                                        {errors.otp}
                                    </p>
                                )}

                                <div className="text-center">
                                    <button type="button" className="text-gray-400 text-sm hover:text-violet-400 transition-colors">
                                        Resend Code
                                    </button>
                                </div>

                                <div className="flex gap-4">
                                    <button
                                        type="button"
                                        disabled={submitMutation.isPending}
                                        onClick={() => setStep(2)}
                                        className="flex-1 py-4 bg-gray-800/50 text-white font-bold rounded-xl hover:bg-gray-700/50 transition-all border border-gray-700 flex items-center justify-center gap-2"
                                    >
                                        <ArrowLeft className="w-5 h-5" />
                                        Back
                                    </button>
                                    <button
                                        type="button"
                                        disabled={submitMutation.isPending || sendOTPMutation.isPending}
                                        onClick={handleSubmit}
                                        className="flex-1 py-4 bg-gradient-to-r from-violet-600 to-cyan-600 text-white font-bold rounded-xl hover:from-violet-500 hover:to-cyan-500 transition-all transform hover:scale-[1.02] active:scale-95 shadow-lg shadow-violet-500/50 flex items-center justify-center gap-2"
                                    >
                                        {
                                            submitMutation.isPending ? 'Verifing........' : <span className='flex'>Verify <Check className="w-5 h-5" /></span>

                                        }
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}