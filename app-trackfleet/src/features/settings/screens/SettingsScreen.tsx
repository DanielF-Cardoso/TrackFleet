import React from 'react';
import { View, Text, SafeAreaView, ScrollView } from 'react-native';
import tw from '@/utils/tailwind';
import Card from '@/components/ui/Card';
import { settingsStyles as styles } from '../settings.styles';
import UserProfileCard from '../components/UserProfileCard';
import SettingsOption from '../components/SettingsOption';

export default function SettingsScreen() {
    return (
        <SafeAreaView style={tw`flex-1 bg-gray-50`}>
            <ScrollView style={tw`flex-1`} showsVerticalScrollIndicator={false}>
                <View style={tw`p-4`}>
                    <Text style={styles.title}>Configurações</Text>

                    <UserProfileCard />

                    <Card title="Configurações do App">
                        <SettingsOption
                            icon="Bell"
                            label="Notificações"
                            color="#3B82F6"
                        />
                        <SettingsOption
                            icon="Lock"
                            label="Segurança"
                            color="#3B82F6"
                        />
                        <SettingsOption
                            icon="HelpCircle"
                            label="Ajuda e Suporte"
                            color="#3B82F6"
                        />
                        <SettingsOption
                            icon="LogOut"
                            label="Sair"
                            color="#EF4444"
                            textColor="text-red-600"
                        />
                    </Card>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
} 