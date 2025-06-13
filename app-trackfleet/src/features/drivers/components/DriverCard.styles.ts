import { StyleSheet } from 'react-native';
import tw from '@/utils/tailwind';

export const driverCardStyles = StyleSheet.create({
    card: {
        ...tw`bg-white rounded-xl p-4 mb-4 shadow-sm`,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
    },
    header: {
        ...tw`flex-row items-center mb-2`,
    },
    headerContent: {
        ...tw`flex-1`,
    },
    avatar: {
        ...tw`mr-3`,
    },
    name: {
        ...tw`text-base font-bold text-gray-900`,
        fontFamily: 'sans-serif-medium',
    },
    email: {
        ...tw`text-xs text-gray-500`,
        fontFamily: 'sans-serif',
    },
    phone: {
        ...tw`text-xs text-gray-600`,
        fontFamily: 'sans-serif',
    },
    infoRow: {
        ...tw`flex-row items-center justify-between mb-2`,
    },
    statusBadge: {
        ...tw`px-2 py-1 rounded-full bg-blue-100`,
    },
    statusText: {
        ...tw`text-xs font-bold text-blue-700`,
    },
    lastLogin: {
        ...tw`text-xs text-gray-400 mt-1`,
        fontFamily: 'sans-serif',
    },
}); 