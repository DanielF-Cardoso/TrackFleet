import { StyleSheet } from 'react-native';
import tw from '@/utils/tailwind';

export const editManagerModalStyles = StyleSheet.create({
    modalOverlay: {
        ...tw`flex-1 justify-center items-center bg-black/50`,
    },
    modalContent: {
        ...tw`bg-white rounded-xl p-6 w-11/12 max-w-md`,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: {
        ...tw`text-xl font-bold text-gray-900 mb-4`,
        fontFamily: 'sans-serif-medium',
    },
    inputContainer: {
        ...tw`mb-4`,
    },
    label: {
        ...tw`text-sm font-medium text-gray-700 mb-1`,
        fontFamily: 'sans-serif-medium',
    },
    input: {
        ...tw`bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 text-gray-900`,
        fontFamily: 'sans-serif',
    },
    disabledInput: {
        ...tw`bg-gray-100`,
    },
    errorText: {
        ...tw`text-red-500 text-xs mt-1`,
        fontFamily: 'sans-serif',
    },
    buttonContainer: {
        ...tw`flex-row justify-end mt-4`,
    },
    button: {
        ...tw`px-4 py-2 rounded-lg ml-2`,
    },
    cancelButton: {
        ...tw`bg-gray-100`,
    },
    cancelButtonText: {
        ...tw`text-gray-700 font-medium`,
        fontFamily: 'sans-serif-medium',
    },
    saveButton: {
        ...tw`bg-blue-600`,
    },
    saveButtonText: {
        ...tw`text-white font-medium`,
        fontFamily: 'sans-serif-medium',
    },
}); 