import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { recentDriverItemStyles as styles } from './RecentDriverItem.styles';

interface RecentDriverItemProps {
    name: string;
    cnh: string;
    cnhType: string;
    email: string;
    lastUpdated: string;
    onPress?: () => void;
}

export function RecentDriverItem({
    name,
    cnh,
    cnhType,
    email,
    lastUpdated,
    onPress,
}: RecentDriverItemProps) {
    return (
        <TouchableOpacity style={styles.container} onPress={onPress}>
            <View style={styles.header}>
                <Text style={styles.title}>{name}</Text>
                <View style={styles.statusContainer}>
                    <View style={styles.statusDot} />
                    <Text style={styles.statusText}>Ativo</Text>
                </View>
            </View>
            <View style={styles.cnhContainer}>
                <Text style={styles.label}>CNH</Text>
                <Text style={styles.value}>{cnh}</Text>
            </View>
            <View style={styles.detailsContainer}>
                <View>
                    <Text style={styles.label}>Tipo</Text>
                    <Text style={styles.value}>{cnhType}</Text>
                </View>
                <View>
                    <Text style={styles.label}>Email</Text>
                    <Text style={styles.value}>{email}</Text>
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