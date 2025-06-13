import DriverDetailsScreen from '@/features/drivers/screens/DriverDetailsScreen';
import { Stack } from 'expo-router';

export default function DriversDetailsRoute() {
    return (
        <>
            <Stack.Screen
                options={{
                    headerShown: false,
                }}
            />
            <DriverDetailsScreen />
        </>
    );
} 