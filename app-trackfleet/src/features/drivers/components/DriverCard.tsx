import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { driverCardStyles as styles } from './DriverCard.styles';

interface Driver {
    id: string;
    firstName: string;
    lastName: string;
    cnh: string;
    cnhType: string;
    email: string;
    phone: string;
    street: string;
    number: number;
    district: string;
    city: string;
    state: string;
}

interface DriverCardProps {
    driver: Driver;
}

export default function DriverCard({ driver }: DriverCardProps) {
    const handlePress = () => {
        router.push({
            pathname: '/drivers/[id]',
            params: { id: driver.id }
        });
    };

    return (
        <TouchableOpacity style={styles.card} onPress={handlePress}>
            <View style={styles.header}>
                <MaterialCommunityIcons name="account" size={28} color="#3B82F6" style={styles.avatar} />
                <View style={styles.headerContent}>
                    <Text style={styles.name}>{driver.firstName} {driver.lastName}</Text>
                    <Text style={styles.email}>{driver.email}</Text>
                </View>
                <MaterialCommunityIcons name="chevron-right" size={24} color="#9CA3AF" />
            </View>
            <View style={styles.infoRow}>
                <Text style={styles.phone}>{driver.phone}</Text>
                <View style={styles.statusBadge}>
                    <Text style={styles.statusText}>{driver.cnhType} • {driver.isActive ? 'Ativo' : 'Inativo'}
                    </Text>
                </View>
            </View>
            <Text style={styles.lastLogin}>CNH: {driver.cnh}</Text>
        </TouchableOpacity>
    );
} 