import { StyleSheet } from 'react-native';
import tw from '@/utils/tailwind';

export const editVehicleModalStyles = StyleSheet.create({
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
    statusContainer: {
        ...tw`mb-4`,
    },
    statusLabel: {
        ...tw`text-sm font-medium text-gray-700 mb-1`,
    },
    statusButtons: {
        ...tw`flex-row`,
    },
    statusButton: {
        ...tw`flex-1 py-2 border border-gray-300 rounded-lg mr-2 items-center justify-center`,
    },
    statusButtonText: {
        ...tw`text-sm font-medium text-gray-700`,
    },
    activeStatusButton: {
        ...tw`bg-green-50 border-green-500`,
    },
    activeStatusButtonText: {
        ...tw`text-green-700`,
    },
    inactiveStatusButton: {
        ...tw`bg-red-50 border-red-500`,
    },
    inactiveStatusButtonText: {
        ...tw`text-red-700`,
    },
    maintenanceStatusButton: {
        ...tw`bg-yellow-50 border-yellow-500`,
    },
    maintenanceStatusButtonText: {
        ...tw`text-yellow-700`,
    },
    modalFooter: {
        ...tw`flex-row`,
    },
}); 