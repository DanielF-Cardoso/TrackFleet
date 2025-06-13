import VehicleDetailsScreen from '@/features/vehicles/screens/VehicleDetailsScreen';
import { Stack } from 'expo-router';

export default function VehicleDetailsRoute() {
    return (
        <>
            <Stack.Screen
                options={{
                    headerShown: false,
                }}
            />
            <VehicleDetailsScreen />
        </>
    );
} 