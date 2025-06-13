import { StyleSheet, Platform } from 'react-native';
import tw from '@/utils/tailwind';

export const loginStyles = StyleSheet.create({
    container: {
        ...tw`flex-1 bg-white`,
    },
    safeArea: {
        ...tw`flex-1`,
    },
    content: {
        ...tw`flex-1 px-6`,
    },
    header: {
        ...tw`items-center justify-center py-8`,
    },
    logoContainer: {
        ...tw`w-20 h-20 rounded-2xl items-center justify-center mb-4`,
        backgroundColor: '#3B82F6',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 8,
    },
    logoText: {
        ...tw`text-3xl font-bold text-gray-900`,
        fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif-medium',
    },
    logoSubText: {
        ...tw`text-base text-gray-600 mt-1`,
        fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
    },
    formContainer: {
        ...tw`flex-1 pt-4`,
    },
    inputContainer: {
        ...tw`mb-4`,
    },
    buttonContainer: {
        ...tw`mt-6`,
    },
    button: {
        ...tw`rounded-xl py-4`,
        backgroundColor: '#3B82F6',
    },
    passwordContainer: {
        ...tw`mt-8 p-4 bg-gray-50 rounded-xl border border-gray-100`,
    },
    passwordText: {
        ...tw`text-sm font-medium text-gray-700 text-center mb-2`,
    },
    passwordInfo: {
        ...tw`text-xs text-gray-500 text-center leading-5`,
    },
    errorContainer: {
        backgroundColor: '#FEE2E2',
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
    },
    errorText: {
        color: '#DC2626',
        textAlign: 'center',
    },
}); 