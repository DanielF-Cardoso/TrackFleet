import { StyleSheet } from 'react-native';
import tw from '@/utils/tailwind';

export const licensePlateStyles = StyleSheet.create({
    container: {
        ...tw`items-center my-6`,
    },
    plate: {
        ...tw`bg-white rounded-lg px-6 py-4 border-2 border-gray-200`,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    text: {
        ...tw`text-2xl font-bold text-gray-900 tracking-wider`,
        fontFamily: 'sans-serif-medium',
    },
}); 