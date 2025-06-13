import { Stack } from 'expo-router';

export function RootNavigation() {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
            }}
        />
    );
} 