import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { vehicleCardStyles as styles } from './VehicleCard.styles';
import { router } from 'expo-router';

type StatusType = 'AVAILABLE' | 'IN_USE' | 'IN_MAINTENANCE';


interface Vehicle {
    id: string;
    managerId: string;
    licensePlate: string;
    brand: string;
    model: string;
    year: number;
    color: string;
    odometer: number;
    status: StatusType;
    renavam: string;
    createdAt: string;
}

interface VehicleCardProps {
    vehicle: Vehicle;
}

const getStatusStyle = (status: string) => {
    switch (status) {
        case 'AVAILABLE':
            return { badge: styles.statusActive, text: styles.statusActiveText, label: 'Ativo' };
        case 'IN_USE':
            return { badge: styles.statusInactive, text: styles.statusInactiveText, label: 'Inativo' };
        case 'IN_MAINTENANCE':
            return { badge: styles.statusMaintenance, text: styles.statusMaintenanceText, label: 'Manutenção' };
        default:
            return { badge: {}, text: {}, label: status };
    }
};

export default function VehicleCard({ vehicle }: VehicleCardProps) {
    const handlePress = () => {
        router.push({
            pathname: '/vehicles/[id]',
            params: { id: vehicle.id }
        });
    };

    return (
        <TouchableOpacity style={styles.card} onPress={handlePress}>
            <View style={styles.header}>
                <MaterialCommunityIcons name="car-back" size={28} color="#3B82F6" style={styles.avatar} />
                <View style={styles.headerContent}>
                    <Text style={styles.model}>{vehicle.brand} {vehicle.model}</Text>
                    <Text style={styles.plate}>{vehicle.licensePlate}</Text>
                </View>
                <MaterialCommunityIcons name="chevron-right" size={24} color="#9CA3AF" />
            </View>
            <View style={styles.infoRow}>
                <Text style={styles.manager}>Ano: {vehicle.year}</Text>
                {(() => {
                    const { badge, text, label } = getStatusStyle(vehicle.status);
                    return (
                        <View style={[styles.statusBadge, badge]}>
                            <Text style={[styles.statusText, text]}>{label}</Text>
                        </View>
                    );
                })()}
            </View>
            <Text style={styles.odometer}>{vehicle.odometer} km rodados</Text>
        </TouchableOpacity>
    );
} 