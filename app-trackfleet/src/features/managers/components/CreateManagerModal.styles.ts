import { StyleSheet } from 'react-native';
import tw from '@/utils/tailwind';

export const createManagerModalStyles = StyleSheet.create({
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
        flexGrow: 1,
    },
    modalFooter: {
        ...tw`flex-row`,
    },
    scrollView: {
        flexGrow: 1,
    },
    scrollViewContent: {
        paddingBottom: 20,
    },
    addressCard: {
        ...tw`bg-gray-50 rounded-lg p-4 mb-4`,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    addressHeader: {
        ...tw`flex-row items-center mb-4`,
    },
    addressTitle: {
        ...tw`text-lg font-semibold text-gray-900 ml-2`,
        fontFamily: 'sans-serif-medium',
    },
    addressFields: {
        gap: 12,
    },
    row: {
        ...tw`flex-row`,
        gap: 12,
    },
    halfInput: {
        flex: 1,
    },
}); 