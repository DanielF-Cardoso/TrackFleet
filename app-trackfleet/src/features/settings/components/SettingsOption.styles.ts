import { StyleSheet } from 'react-native';
import tw from '@/utils/tailwind';

export const settingsOptionStyles = StyleSheet.create({
    container: {
        ...tw`flex-row items-center py-3 border-b border-gray-100`,
    },
    iconContainer: {
        ...tw`w-8 h-8 rounded-lg items-center justify-center mr-3`,
    },
    label: {
        ...tw`text-base`,
        fontFamily: 'sans-serif-medium',
    },
}); 