import { StyleSheet } from 'react-native';
import tw from '@/utils/tailwind';

export const fleetCardStyles = StyleSheet.create({
    container: {
        ...tw`bg-white rounded-xl p-4 shadow-sm flex-1 mr-2 items-center`,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    value: {
        ...tw`text-xl font-bold text-gray-900 mt-2`,
        fontFamily: 'sans-serif-medium',
    },
    label: {
        ...tw`text-xs text-gray-500 mt-1`,
        fontFamily: 'sans-serif',
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
}); 