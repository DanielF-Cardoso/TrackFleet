import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { recentCarItemStyles as styles } from './RecentCarItem.styles';

interface RecentCarItemProps {
    name: string;
    licensePlate: string;
    year: number;
    odometer: string;
    lastUpdated: string;
    onPress?: () => void;
}

export function RecentCarItem({
    name,
    licensePlate,
    year,
    odometer,
    lastUpdated,
    onPress,
}: RecentCarItemProps) {
    return (
        <TouchableOpacity style={styles.container} onPress={onPress}>
            <View style={styles.header}>
                <Text style={styles.title}>{name}</Text>
                <View style={styles.statusContainer}>
                    <View style={styles.statusDot} />
                    <Text style={styles.statusText}>Ativo</Text>
                </View>
            </View>
            <View style={styles.licensePlateContainer}>
                <Text style={styles.label}>Placa</Text>
                <Text style={styles.value}>{licensePlate}</Text>
            </View>
            <View style={styles.detailsContainer}>
                <View>
                    <Text style={styles.label}>Ano</Text>
                    <Text style={styles.value}>{year}</Text>
                </View>
                <View>
                    <Text style={styles.label}>Odometro</Text>
                    <Text style={styles.value}>{odometer}</Text>
                </View>
            </View>
            <View style={styles.footer}>
                <View style={styles.lastUpdated}>
                    <Feather name="clock" size={16} color="#6B7280" />
                    <Text style={styles.lastUpdatedText}>Cadastrado em {lastUpdated}</Text>
                </View>
                <Feather name="chevron-right" size={20} color="#6B7280" />
            </View>
        </TouchableOpacity>
    );
} 