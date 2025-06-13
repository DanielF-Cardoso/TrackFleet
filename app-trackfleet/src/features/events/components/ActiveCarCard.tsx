import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { styles } from './ActiveCarCard.styles';
import { formatTime } from '@/utils/helpers';

interface ActiveCarCardProps {
    carName: string;
    driverName: string;
    startTime: Date;
    onPress?: () => void;
}

export default function ActiveCarCard({ carName, driverName, startTime, onPress }: ActiveCarCardProps) {

    return (
        <TouchableOpacity style={styles.card} onPress={onPress}>
            <View style={styles.header}>
                <MaterialCommunityIcons name="car" size={24} color="#3B82F6" />
                <View style={styles.statusDot} />
            </View>
            <Text style={styles.carName}>{carName}</Text>
            <Text style={styles.driverName}>Motorista: {driverName}</Text>
            <Text style={styles.time}>Saída: {formatTime(startTime)}</Text>
        </TouchableOpacity>
    );
} 