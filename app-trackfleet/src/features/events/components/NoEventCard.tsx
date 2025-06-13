import React from 'react';
import { View, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { styles } from './NoEventCard.styles';

export default function NoEventCard() {
    return (
        <View style={styles.card}>
            <MaterialCommunityIcons name="car-off" size={48} color="#94A3B8" />
            <Text style={styles.title}>Nenhum carro em uso</Text>
            <Text style={styles.description}>
                No momento, não há nenhum veículo em uso. Clique no botão + para registrar uma saída.
            </Text>
        </View>
    );
} 