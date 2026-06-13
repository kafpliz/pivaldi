export enum EAuth {
    signIn = 'auth/sign-in',
    signUp = 'auth/sign-up',
    confirmEmail = 'auth/verify',
    refreshTokens = 'auth/refresh',
    forgotPassword = 'auth/forgot-password-email',
    forgotPasswordConfirm = 'auth/forgot-password',
    resetPassword = 'auth/forgot-password/new',
    resend = "auth/resend"
}