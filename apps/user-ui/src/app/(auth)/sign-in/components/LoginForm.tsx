"use client"
import { Alert, AlertDescription } from '@meato/packages/frontend/ui/alert';
import countryCodes from 'apps/user-ui/src/config/CountryCode';
import { AlertCircle, CheckCircle, Loader2, MessageSquare, Phone, Shield } from 'lucide-react'
import React, { useState } from 'react'

interface LoginFormProps {
    formData: LoginFormDataTypes
    setFormData: (value: LoginFormDataTypes | ((prev: LoginFormDataTypes) => LoginFormDataTypes)) => void;
    alert: AlertType;
    setAlert: (value: AlertType) => void;
    sendOTPMutation:any
    handleSendOTP: () => Promise<void>
}

const LoginForm: React.FC<LoginFormProps> = ({
    setFormData, formData, alert, sendOTPMutation, handleSendOTP
}) => {

    // const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState<{ phoneNumber?: string }>({});


    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        let { name, value, type } = e.target as HTMLInputElement | HTMLSelectElement;

        let checked: boolean | undefined;
        if (type === 'checkbox' && 'checked' in e.target) {
            checked = (e.target as HTMLInputElement).checked;
        }

        if (name === 'phoneNumber') {
            // Format phone number as user types
            const formatted = formatPhoneNumber(value).replaceAll(" ", '');
            setFormData(prev => ({ ...prev, [name]: formatted }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            }));
        }

        // Clear error when user starts typing
        if (
            name === 'phoneNumber'
        ) {
            if (errors[name as 'phoneNumber']) {
                setErrors(prev => ({ ...prev, [name]: '' }));
            }
        }
    };

    const formatPhoneNumber = (phone: string) => {
        // Remove all non-digits
        const cleanPhone = phone.replace(/\D/g, '');

        // Format based on US number pattern if using +1
        if (formData.countryCode === '+1' && cleanPhone.length === 10) {
            return `(${cleanPhone.slice(0, 3)}) ${cleanPhone.slice(3, 6)}-${cleanPhone.slice(6)}`;
        }

        // For other countries, just add spaces every 3-4 digits
        if (cleanPhone.length > 6) {
            return cleanPhone.replace(/(\d{3})(\d{3})(\d+)/, '$1 $2 $3');
        } else if (cleanPhone.length > 3) {
            return cleanPhone.replace(/(\d{3})(\d+)/, '$1 $2');
        }

        return cleanPhone;
    };

    return (
        <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-12">
            <div className="mx-auto w-full max-w-md">
                {/* Mobile Logo */}
                <div className="flex items-center justify-center mb-8 lg:hidden">
                    <MessageSquare className="w-8 h-8 mr-2 text-green-600" />
                    <h1 className="text-2xl font-bold text-gray-900">MobileApp</h1>
                </div>

                {/* Alert */}
                {alert && (
                    <div className="mb-6">
                        <Alert className={`border ${alert.type === 'success'
                            ? 'border-green-200 bg-green-50'
                            : alert.type === 'error'
                                ? 'border-red-200 bg-red-50'
                                : 'border-blue-200 bg-blue-50'
                            }`}>
                            <div className="flex items-center">
                                {alert.type === 'success' ? (
                                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                                ) : alert.type === 'error' ? (
                                    <AlertCircle className="w-4 h-4 text-red-600 mr-2" />
                                ) : (
                                    <AlertCircle className="w-4 h-4 text-blue-600 mr-2" />
                                )}
                                <AlertDescription className={
                                    alert.type === 'success'
                                        ? 'text-green-800'
                                        : alert.type === 'error'
                                            ? 'text-red-800'
                                            : 'text-blue-800'
                                }>
                                    {alert.message}
                                </AlertDescription>
                            </div>
                        </Alert>
                    </div>
                )}

                {/* Header */}
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h2>
                    <p className="text-gray-600">Enter your phone number to sign in</p>
                </div>

                {/* Divider */}
                <div className="relative mb-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="bg-white px-4 text-gray-500 font-medium">Or continue with phone</span>
                    </div>
                </div>

                <div className="space-y-5">
                    {/* Phone Number Field */}
                    <div>
                        <label htmlFor="phoneNumber" className="block text-sm font-semibold text-gray-700 mb-2">
                            Phone number
                        </label>
                        <div className="flex space-x-2">
                            {/* Country Code Selector */}
                            <div className="relative">
                                <select
                                    value={formData.countryCode}
                                    onChange={(e) => setFormData((prev: any) => ({ ...prev, countryCode: e.target.value }))}
                                    className="appearance-none bg-white border border-gray-300 rounded-xl px-3 py-3 pr-8 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent hover:border-gray-400 transition-all duration-200"
                                >
                                    {countryCodes.map((country) => (
                                        <option key={country.code} value={country.code}>
                                            {country.flag} {country.code}
                                        </option>
                                    ))}
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>

                            {/* Phone Number Input */}
                            <div className="flex-1 relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Phone className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="phoneNumber"
                                    name="phoneNumber"
                                    type="tel"
                                    pattern="[6-9]{1}[0-9]{9}"
                                    maxLength={12}
                                    value={formData.phoneNumber}
                                    onChange={handleInputChange}
                                    className={`block w-full pl-10 pr-4 py-3 border rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 ${errors.phoneNumber
                                        ? 'border-red-300 bg-red-50'
                                        : 'border-gray-300 hover:border-gray-400'
                                        }`}
                                    placeholder="Enter your phone number"
                                />
                            </div>
                        </div>
                        {errors.phoneNumber && (
                            <p className="mt-2 text-sm text-red-600 flex items-center">
                                <AlertCircle className="w-4 h-4 mr-1" />
                                {errors.phoneNumber}
                            </p>
                        )}

                        <button
                        disabled={sendOTPMutation.isPending}
                        onClick={handleSendOTP}
                        className="w-full flex items-center mt-5 justify-center px-4 py-3 border border-transparent rounded-xl text-base font-semibold text-white bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                        {sendOTPMutation.isPending ? (
                            <>
                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                Signing in...
                            </>
                        ) : (
                            'Sign in'
                        )}
                    </button> 
                    </div>

                </div>

                {/* Security Notice */}
                <div className="mt-8 p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-start">
                        <Shield className="w-5 h-5 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                        <div>
                            <p className="text-xs text-gray-600">
                                <span className="font-semibold">Privacy Notice:</span> Your phone number is encrypted and secure.
                                We use SMS verification for enhanced security and never share your personal information.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default LoginForm;