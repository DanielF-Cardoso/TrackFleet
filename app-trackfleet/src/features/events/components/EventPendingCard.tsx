import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { styles } from './EventPendingCard.styles';
import { formatDate } from '@/utils/helpers';

interface EventPendingCardProps {
    carName: string;
    driverName: string;
    odometer: number;
    startTime: string | Date | undefined;
    onFinalize: () => void;
}

export default function EventPendingCard({
    carName,
    driverName,
    odometer,
    startTime,
    onFinalize,
}: EventPendingCardProps) {
    const start = startTime
        ? typeof startTime === 'string'
            ? new Date(startTime)
            : startTime
        : undefined;

    const calculateDuration = (start?: Date) => {
        if (!start || isNaN(start.getTime())) return '-';
        const now = new Date();
        const diff = now.getTime() - start.getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        return `${hours}h ${minutes}m`;
    };

    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <MaterialCommunityIcons name="car" size={20} color="#3B82F6" />
                <Text style={styles.carName}>{carName}</Text>
            </View>
            <View style={styles.infoRow}>
                <Text style={styles.label}>Motorista:</Text>
                <Text style={styles.value}>{driverName}</Text>
            </View>
            <View style={styles.infoRow}>
                <Text style={styles.label}>Odômetro:</Text>
                <Text style={styles.value}>{odometer} km</Text>
            </View>
            <View style={styles.infoRow}>
                <Text style={styles.label}>Início:</Text>
                <Text style={styles.value}>{formatDate(start)}</Text>
            </View>
            <View style={styles.infoRow}>
                <Text style={styles.label}>Tempo em uso:</Text>
                <Text style={styles.value}>{calculateDuration(start)}</Text>
            </View>
            <TouchableOpacity style={styles.finalizeButton} onPress={onFinalize}>
                <Text style={styles.finalizeButtonText}>Finalizar</Text>
            </TouchableOpacity>
        </View>
    );
}