export interface UserProfile {
    id: string;
    email: string;
    firstName: string | null;
    displayName: string | null;
    role: 'user' | 'admin' | 'superAdmin';
    onboardingComplete: boolean;
}

export interface OnboardingFormData {
    firstName: string;
    displayName: string;
}

export interface DisplayNameCheckResponse {
    available: boolean;
    message?: string;
}
