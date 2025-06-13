import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    carName: {
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 8,
        flex: 1,
        color: '#1E293B',
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#94A3B8',
    },
    statusDotActive: {
        backgroundColor: '#10B981',
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    label: {
        fontSize: 14,
        color: '#64748B',
    },
    value: {
        fontSize: 14,
        fontWeight: '500',
        color: '#1E293B',
    },
    statusContainer: {
        marginTop: 8,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: '#E2E8F0',
        alignItems: 'flex-end',
    },
    statusText: {
        fontSize: 12,
        color: '#64748B',
        fontWeight: '500',
    },
    statusTextActive: {
        color: '#10B981',
    },
}); 