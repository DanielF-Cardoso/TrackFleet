import { StyleSheet } from 'react-native';
import tw from '@/utils/tailwind';

export const addVehicleButtonStyles = StyleSheet.create({
    button: {
        ...tw`absolute right-6 bottom-8 h-14 w-14 rounded-full bg-blue-500 items-center justify-center shadow-lg`,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
}); 