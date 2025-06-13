import ManagerDetailsScreen from '@/features/managers/screens/ManagerDetailsScreen';
import { Stack } from 'expo-router';

export default function ManagersDetailsRoute() {
    return (
        <>
            <Stack.Screen
                options={{
                    headerShown: false,
                }}
            />
            <ManagerDetailsScreen />
        </>
    );
} 