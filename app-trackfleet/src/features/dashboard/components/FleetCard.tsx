import React from 'react';
import { View, Text } from 'react-native';
import { fleetCardStyles as styles } from './FleetCard.styles';

interface FleetCardProps {
    icon: React.ReactNode;
    value: string | number;
    label: string;
    color: string;
}

export function FleetCard({ icon, value, label, color }: FleetCardProps) {
    return (
        <View style={styles.container}>
            <View style={[styles.iconContainer, { backgroundColor: `${color}20` }]}>
                {icon}
            </View>
            <Text style={styles.value}>{value}</Text>
            <Text style={styles.label}>{label}</Text>
        </View>
    );
} 