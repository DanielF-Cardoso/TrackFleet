import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 16,
        marginRight: 12,
        width: 200,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#10B981',
    },
    carName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1E293B',
        marginBottom: 4,
    },
    driverName: {
        fontSize: 14,
        color: '#64748B',
        marginBottom: 4,
    },
    time: {
        fontSize: 12,
        color: '#94A3B8',
    },
}); 