import { Tabs } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { View } from 'react-native';
import { tabBarStyles } from '@/layouts/TabLayout';

export default function TabsLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: '#3B82F6',
                tabBarInactiveTintColor: '#94A3B8',
            }}
        >
            <Tabs.Screen
                name="vehicles"
                options={{
                    title: 'Veículos',
                    tabBarIcon: ({ color }) => <MaterialCommunityIcons name="truck" size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="managers"
                options={{
                    title: 'Gestores',
                    tabBarIcon: ({ color }) => <MaterialCommunityIcons name="account-multiple" size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Dashboard',
                    tabBarIcon: ({ focused }) => (
                        <View style={[tabBarStyles.dashboardButton, focused && tabBarStyles.dashboardButtonActive]}>
                            <MaterialCommunityIcons
                                name="view-dashboard"
                                size={24}
                                color={focused ? '#FFFFFF' : '#3B82F6'}
                            />
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="drivers"
                options={{
                    title: 'Motoristas',
                    tabBarIcon: ({ color }) => <MaterialCommunityIcons name="card-account-details-outline" size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="events"
                options={{
                    title: 'Eventos',
                    tabBarIcon: ({ color }) => <MaterialCommunityIcons name="calendar" size={24} color={color} />,
                }}
            />
        </Tabs>
    );
}
