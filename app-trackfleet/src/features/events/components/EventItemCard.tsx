import React from 'react';
import { View, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { styles } from './EventItemCard.styles';
import { formatDate, formatTime } from '@/utils/helpers';

interface EventItemCardProps {
    carName: string;
    driverName: string;
    startTime?: string | Date;
    endTime?: string | Date;
    initialOdometer: number;
    finalOdometer?: number | null;
}

export default function EventItemCard({
    carName,
    driverName,
    startTime,
    endTime,
    initialOdometer,
    finalOdometer,
}: EventItemCardProps) {
    const isActive = !endTime;

    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <MaterialCommunityIcons name="car" size={20} color="#3B82F6" />
                <Text style={styles.carName}>{carName}</Text>
                <View style={[styles.statusDot, isActive && styles.statusDotActive]} />
            </View>

            <View style={styles.infoRow}>
                <Text style={styles.label}>Motorista:</Text>
                <Text style={styles.value}>{driverName}</Text>
            </View>

            <View style={styles.infoRow}>
                <Text style={styles.label}>Odômetro:</Text>
                <Text style={styles.value}>
                    {initialOdometer} km {finalOdometer ? `→ ${finalOdometer} km` : ''}
                </Text>
            </View>

            <View style={styles.infoRow}>
                <Text style={styles.label}>Horário:</Text>
                <Text style={styles.value}>
                    {formatDate(startTime)} {formatTime(startTime)}
                    {endTime ? ` → ${formatTime(endTime)}` : ''}
                </Text>
            </View>

            <View style={styles.statusContainer}>
                <Text style={[styles.statusText, isActive && styles.statusTextActive]}>
                    {isActive ? 'Em andamento' : 'Finalizado'}
                </Text>
            </View>
        </View>
    );
}