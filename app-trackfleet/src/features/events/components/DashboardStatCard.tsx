import React from 'react';
import { View, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { styles } from './DashboardStatCard.styles';

interface DashboardStatCardProps {
    title: string;
    value: number;
    icon: string;
    color: string;
}

export default function DashboardStatCard({ title, value, icon, color }: DashboardStatCardProps) {
    return (
        <View style={styles.card}>
            <View style={styles.iconContainer}>
                <MaterialCommunityIcons name={icon} size={24} color={color} />
            </View>
            <Text style={styles.value}>{value}</Text>
            <Text style={styles.title}>{title}</Text>
        </View>
    );
} 