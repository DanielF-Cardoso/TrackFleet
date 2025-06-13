import React, { useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import tw from '@/utils/tailwind';
import { managersStyles as styles } from '../managers.styles';
import SearchBar from '../components/SearchBar';
import ManagerCard from '../components/ManagerCard';
import CreateManagerModal from '../components/CreateManagerModal';
import { useManagers } from '@/hooks/useManager';

export default function ManagersScreen() {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const { managers, loading, error, refetchManagers, createManager } = useManagers();

    const filteredManagers = managers.filter(manager =>
    (`${manager.firstName} ${manager.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        manager.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        manager.phone.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <SafeAreaView style={tw`flex-1 bg-gray-50`}>
            <ScrollView
                style={tw`flex-1`}
                contentContainerStyle={tw`p-4`}
                showsVerticalScrollIndicator={false}
            >
                <Text style={styles.title}>Gestores</Text>

                <SearchBar
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                />

                {loading ? (
                    <Text>Carregando...</Text>
                ) : error ? (
                    <Text style={{ color: 'red' }}>{error}</Text>
                ) : managers.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>Nenhum gestor cadastrado</Text>
                        <Text style={styles.emptySubText}>
                            Clique no botão + para adicionar um novo gestor
                        </Text>
                    </View>
                ) : (
                    filteredManagers.map(manager => (
                        <ManagerCard key={manager.id} manager={manager} />
                    ))
                )}
            </ScrollView>

            <TouchableOpacity
                style={styles.floatingButton}
                onPress={() => setIsModalVisible(true)}
            >
                <MaterialCommunityIcons name="plus" size={24} color="#FFFFFF" />
            </TouchableOpacity>

            <CreateManagerModal
                visible={isModalVisible}
                onClose={() => setIsModalVisible(false)}
                onSave={createManager}
            />
        </SafeAreaView>
    );
}