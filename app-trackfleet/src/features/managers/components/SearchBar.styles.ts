import { StyleSheet } from 'react-native';
import tw from '@/utils/tailwind';

export const searchBarStyles = StyleSheet.create({
    container: {
        ...tw`flex-row items-center mb-4`,
    },
    searchContainer: {
        ...tw`flex-1 flex-row items-center bg-white rounded-lg border border-gray-200 px-3 py-2`,
    },
    input: {
        ...tw`flex-1 text-base text-gray-900`,
        fontFamily: 'sans-serif',
    },
    filterButton: {
        ...tw`ml-3 p-3 bg-blue-50 rounded-lg`,
    },
}); 