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
        color: '#1E293B',
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
    finalizeButton: {
        backgroundColor: '#3B82F6',
        padding: 8,
        borderRadius: 6,
        alignItems: 'center',
        marginTop: 12,
    },
    finalizeButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
}); 