import { StyleSheet } from 'react-native';
import tw from '@/utils/tailwind';

export const userProfileCardStyles = StyleSheet.create({
    container: {
        ...tw`flex-row items-center`,
    },
    iconContainer: {
        ...tw`w-12 h-12 bg-blue-100 rounded-full items-center justify-center mr-3`,
    },
    name: {
        ...tw`text-base font-medium text-gray-900`,
        fontFamily: 'sans-serif-medium',
    },
    email: {
        ...tw`text-sm text-gray-500`,
        fontFamily: 'sans-serif',
    },
}); 