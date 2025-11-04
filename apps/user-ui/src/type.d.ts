type LoginFormDataTypes = {
    phoneNumber: string,
    countryCode: string,
    rememberMe: boolean
}
type AlertType = {
    type: 'success' | 'error' | 'info';
    message: string
} | null;