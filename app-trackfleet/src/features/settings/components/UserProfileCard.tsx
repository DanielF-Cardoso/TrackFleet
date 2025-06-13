import React from 'react';
import { View, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import tw from '@/utils/tailwind';
import Card from '@/components/ui/Card';
import { userProfileCardStyles as styles } from './UserProfileCard.styles';

export default function UserProfileCard() {
    return (
        <Card title="Perfil" style={tw`mb-4`}>
            <View style={styles.container}>
                <View style={styles.iconContainer}>
                    <Feather name="user" size={24} color="#3B82F6" />
                </View>
                <View>
                    <Text style={styles.name}>John Doe</Text>
                    <Text style={styles.email}>john.doe@trackfleet.com</Text>
                </View>
            </View>
        </Card>
    );
} 