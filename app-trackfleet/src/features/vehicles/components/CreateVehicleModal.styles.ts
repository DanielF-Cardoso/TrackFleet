import { StyleSheet } from 'react-native';
import tw from '@/utils/tailwind';

export const createVehicleModalStyles = StyleSheet.create({
    modalOverlay: {
        ...tw`flex-1 bg-black bg-opacity-50 justify-end`,
    },
    modalContent: {
        ...tw`bg-white rounded-t-3xl p-6`,
        maxHeight: '90%',
    },
    modalHeader: {
        ...tw`flex-row justify-between items-center mb-6`,
    },
    modalTitle: {
        ...tw`text-xl font-bold text-gray-900`,
        fontFamily: 'sans-serif-medium',
    },
    form: {
        ...tw`mb-6`,
    },
    modalFooter: {
        ...tw`flex-row`,
    },
}); 