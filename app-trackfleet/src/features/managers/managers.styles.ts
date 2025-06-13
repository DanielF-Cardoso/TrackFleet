import { StyleSheet } from 'react-native';
import tw from '@/utils/tailwind';

export const managersStyles = StyleSheet.create({
    header: {
        ...tw`flex-row items-center mb-4`,
    },
    title: {
        ...tw`text-2xl font-bold text-gray-900`,
        fontFamily: 'sans-serif-medium',
    },
    emptyContainer: {
        ...tw`py-10 items-center justify-center`,
    },
    emptyTitle: {
        ...tw`text-lg font-bold text-gray-700`,
        fontFamily: 'sans-serif-medium',
    },
    emptyText: {
        ...tw`text-lg font-bold text-gray-700`,
    },
    emptySubText: {
        ...tw`text-sm text-gray-500 mt-1 text-center`,
    },
    detailRow: {
        ...tw`flex-row items-center py-3 border-b border-gray-100`,
    },
    detailIcon: {
        ...tw`w-8 h-8 bg-blue-50 rounded-lg items-center justify-center mr-3`,
    },
    userAvatar: {
        ...tw`w-20 h-20 rounded-2xl items-center justify-center mb-4`,
        backgroundColor: '#3B82F6',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 8,
    },
    detailLabel: {
        ...tw`text-sm text-gray-500`,
        fontFamily: 'sans-serif',
    },
    detailValue: {
        ...tw`text-base text-gray-900 mt-1`,
        fontFamily: 'sans-serif-medium',
    },
    backButton: {
        ...tw`mr-3`,
    },
    footer: {
        ...tw`flex-row p-4 border-t border-gray-100 bg-white`,
    },
    footerButton: {
        ...tw`flex-row items-center justify-center flex-1 py-3 rounded-lg mx-2`,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    footerButtonText: {
        ...tw`text-white font-medium ml-2`,
        fontFamily: 'sans-serif-medium',
    },
    floatingButton: {
        ...tw`absolute right-6 bottom-8 h-14 w-14 rounded-full bg-blue-500 items-center justify-center shadow-lg`,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
}); 