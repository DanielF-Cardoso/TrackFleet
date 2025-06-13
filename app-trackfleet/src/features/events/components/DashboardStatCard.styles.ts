import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    card: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#F1F5F9',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    value: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1E293B',
        marginBottom: 4,
    },
    title: {
        fontSize: 14,
        color: '#64748B',
        textAlign: 'center',
    },
}); 