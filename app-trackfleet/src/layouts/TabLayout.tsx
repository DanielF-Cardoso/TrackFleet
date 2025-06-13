import { StyleSheet } from 'react-native';

export const tabBarStyles = StyleSheet.create({
    dashboardButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        marginTop: -15,
    },
    dashboardButtonActive: {
        backgroundColor: '#3B82F6',
        shadowColor: '#3B82F6',
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
}); 