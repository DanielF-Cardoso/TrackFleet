import React from 'react';
import { View, Text } from 'react-native';
import tw from '@/utils/tailwind';
import { licensePlateStyles as styles } from './LicensePlate.styles';

interface LicensePlateProps {
    plate: string;
}

export default function LicensePlate({ plate }: LicensePlateProps) {
    return (
        <View style={styles.container}>
            <View style={styles.plate}>
                <Text style={styles.text}>{plate}</Text>
            </View>
        </View>
    );
} 