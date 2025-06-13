import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { managerCardStyles as styles } from './ManagerCard.styles';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale/pt-BR';

interface Manager {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: any;
    isActive: boolean;
    lastLogin?: string;
}

interface ManagerCardProps {
    manager: Manager;
}

const getStatusStyle = (isActive: boolean) => {
    if (isActive) {
        return { badge: styles.statusActive, text: styles.statusActiveText, label: 'Ativo' };
    } else {
        return { badge: styles.statusInactive, text: styles.statusInactiveText, label: 'Inativo' };
    }
};

export default function ManagerCard({ manager }: ManagerCardProps) {
    const handlePress = () => {
        router.push({
            pathname: '/managers/[id]',
            params: { id: manager.id }
        });
    };

    return (
        <TouchableOpacity style={styles.card} onPress={handlePress}>
            <View style={styles.header}>
                <MaterialCommunityIcons name="account" size={28} color="#3B82F6" style={styles.avatar} />
                <View style={styles.headerContent}>
                    <Text style={styles.name}>{manager.firstName} {manager.lastName}</Text>
                    <Text style={styles.email}>{manager.email}</Text>
                </View>
                <MaterialCommunityIcons name="chevron-right" size={24} color="#9CA3AF" />
            </View>
            <View style={styles.infoRow}>
                <Text style={styles.phone}>{manager.phone}</Text>
                {(() => {
                    const { badge, text, label } = getStatusStyle(manager.isActive);
                    return (
                        <View style={[styles.statusBadge, badge]}>
                            <Text style={[styles.statusText, text]}>{label}</Text>
                        </View>
                    );
                })()}
            </View>
            <Text style={styles.lastLogin}>
                Último Login: {manager.lastLogin
                    ? format(new Date(manager.lastLogin), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })
                    : 'Nunca'}
            </Text>
        </TouchableOpacity>
    );
}