import { StyleSheet } from 'react-native';
import tw from '@/utils/tailwind';

export const recentDriverItemStyles = StyleSheet.create({
    container: {
        ...tw`bg-white rounded-xl shadow-sm mb-4 p-4`,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    header: {
        ...tw`flex-row justify-between items-start mb-6`,
    },
    title: {
        ...tw`text-xl font-bold text-gray-900`,
        fontFamily: 'sans-serif-medium',
    },
    statusContainer: {
        ...tw`bg-green-50 px-3 py-1 rounded-full flex-row items-center`,
    },
    statusDot: {
        ...tw`w-2 h-2 rounded-full bg-green-500 mr-2`,
    },
    statusText: {
        ...tw`text-green-700`,
        fontFamily: 'sans-serif-medium',
    },
    cnhContainer: {
        ...tw`mb-4`,
    },
    label: {
        ...tw`text-gray-500 mb-1`,
        fontFamily: 'sans-serif',
    },
    value: {
        ...tw`text-gray-900`,
        fontFamily: 'sans-serif-medium',
    },
    detailsContainer: {
        ...tw`flex-row justify-between mb-4`,
    },
    footer: {
        ...tw`flex-row items-center justify-between pt-4 border-t border-gray-100`,
    },
    lastUpdated: {
        ...tw`flex-row items-center`,
    },
    lastUpdatedText: {
        ...tw`text-gray-500 ml-2`,
        fontFamily: 'sans-serif',
    },
}); 