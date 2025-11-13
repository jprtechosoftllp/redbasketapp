import React, { useState, useRef, KeyboardEvent, ChangeEvent } from 'react';
import { Loader2, CheckCircle, Shield, UserCheck } from 'lucide-react';
import { Button } from '@meato/packages/frontend/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@meato/packages/frontend/ui/card';
import { toast } from 'sonner';

// Type definitions
type DigitArray = [string, string, string, string, string, string];

interface FormState {
  digits: DigitArray;
}

// Custom hook for form logic
const useVerificationForm = () => {
  const [formState, setFormState] = useState<FormState>({
    digits: ['', '', '', '', '', ''],
  });

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const updateDigits = (newDigits: DigitArray): void => {
    setFormState(prev => ({ ...prev, digits: newDigits }));
  };

  return {
    ...formState,
    inputRefs,
    updateDigits,
  };
};

const isValidDigit = (value: string): boolean => {
  return /^[0-9]?$/.test(value);
};

interface Props {
  timer: number;
  setIsVerifyForm: (value: boolean) => void;
  submitMutation: any
  formData: LoginFormDataTypes;
  handleSendOTP: () => Promise<void>
  setFormType: (value: string) => void
  canResend: boolean;
}

const VerifyForm: React.FC<Props> = ({ timer, canResend, submitMutation, setFormType, formData, handleSendOTP }) => {
  const {
    digits,
    inputRefs,
    updateDigits,
  } = useVerificationForm();

  const handleInputChange = (index: number, value: string): void => {
    if (!isValidDigit(value)) return;

    const newDigits: DigitArray = [...digits] as DigitArray;
    newDigits[index] = value;
    updateDigits(newDigits);

    // Auto-focus to next input
    if (value && index < 6) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>): void => {
    // Handle backspace navigation
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
      const newDigits: DigitArray = [...digits] as DigitArray;
      newDigits[index - 1] = '';
      updateDigits(newDigits);
    }

    // Handle paste
    if (e.key === 'v' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handlePaste();
    }
  };

  const handlePaste = async (): Promise<void> => {
    try {
      const text = await navigator.clipboard.readText();
      const pastedDigits = text.replace(/[^0-9]/g, '').slice(0, 4);
      fillDigits(pastedDigits);
    } catch (error) {
      console.warn('Clipboard access failed:', error);
    }
  };

  const fillDigits = (digitString: string): void => {
    const newDigits: DigitArray = ['', '', '', '', '', ''];

    for (let i = 0; i < Math.min(4, digitString.length); i++) {
      if (isValidDigit(digitString[i])) {
        newDigits[i] = digitString[i];
      }
    }

    updateDigits(newDigits);
    animateInputs();
  };

  const animateInputs = (): void => {
    digits.forEach((_, index) => {
      setTimeout(() => {
        const input = inputRefs.current[index];
        if (input) {
          input.classList.add('animate-pulse');
          setTimeout(() => {
            input.classList.remove('animate-pulse');
          }, 300);
        }
      }, index * 100);
    });
  };

  const isFormComplete: boolean = digits.every(digit => digit !== '');

  const handleInputRef = (index: number) => (el: HTMLInputElement | null): void => {
    inputRefs.current[index] = el;
  };

  const handleInputChangeWrapper = (index: number) => (e: ChangeEvent<HTMLInputElement>): void => {
    handleInputChange(index, e.target.value);
  };

  const handleKeyDownWrapper = (index: number) => (e: KeyboardEvent<HTMLInputElement>): void => {
    handleKeyDown(index, e);
  };

  const handleSubmit = async (codeOverride?: string): Promise<void> => {
    const code = codeOverride || digits.join('');

    if (code.length !== 6) {

      toast.error('Please enter all 6 digits', {
        icon: <UserCheck className="w-6 h-6 mr-3 text-white" />,
        action: {
          label: "Undo",
          onClick: () => console.log("Undo"),
        },
        style: {
          background: "green",
        },
      });
      return;
    }

    setFormType('verify')
    submitMutation.mutate({ phone:formData.phoneNumber, otp: code })
  };

  return (
    <div className="flex-1 flex flex-col justify-center items-center px-6 py-12 lg:px-12">
      <Card className="w-full max-w-md shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
        <CardHeader className="text-center space-y-3">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mb-2">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Security Verification
          </CardTitle>
          <CardDescription className="text-gray-600">
            Enter the 4-digit verification code sent to your device
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Digit Input Fields */}
          <div className="flex justify-center gap-3">
            {digits.map((digit, index) => (
              <input
                key={index}
                ref={handleInputRef(index)}
                type="text"
                inputMode="numeric"
                pattern="[0-9]"
                maxLength={1}
                value={digit}
                onChange={handleInputChangeWrapper(index)}
                onKeyDown={handleKeyDownWrapper(index)}
                onFocus={(e) => e.target.select()}
                className={`w-14 h-14 text-center text-xl rounded-md font-bold border-2 transition-all duration-300 ${digit
                  ? 'border-green-500 bg-green-50 text-green-700 ring-2 ring-green-200'
                  : 'border-gray-300 hover:border-gray-400 focus:border-blue-500'
                  } focus:ring-2 focus:ring-blue-200 focus:scale-105 disabled:opacity-50`}
                disabled={submitMutation.isPending}
                aria-label={`Digit ${index + 1} of 4`}
              />
            ))}
          </div>

          {/* Progress Indicator */}
          <div className="flex justify-center space-x-1">
            {digits.map((digit, index) => (
              <div
                key={index}
                className={`h-1 w-6 rounded-full transition-all duration-300 ${digit ? 'bg-blue-500' : 'bg-gray-200'
                  }`}
              />
            ))}
          </div>

          {/* Resend OTP */}
          <div className="mt-2 flex justify-end">
            {
              canResend ? (
                <button
                  type="button"
                  disabled={submitMutation.isPending}
                  onClick={handleSendOTP}
                  className="text-lg text-blue-600 hover:underline hover:underline-offset-3 hover:text-blue-800 font-bold"
                >
                  Resend OTP
                </button>
              )
                :
                `Resend otp in ${timer}s`
            }

          </div>

          {/* Submit Button */}
          <Button
            onClick={() => handleSubmit()}
            disabled={!isFormComplete || submitMutation.isPending}
            className="w-full h-12 text-base font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] focus:ring-4 focus:ring-blue-200"
            type="submit"
          >
            {submitMutation.isPending ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Verifying Code...
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5 mr-2" />
                Verify Code
              </>
            )}
          </Button>

          {/* Info Banner */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              <p className="text-xs text-blue-700 text-center font-medium">
                TypeScript • Auto-demo on load • Smart navigation • Paste support
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyForm;