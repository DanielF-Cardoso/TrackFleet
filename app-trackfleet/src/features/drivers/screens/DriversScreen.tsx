import React, { useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import tw from '@/utils/tailwind';
import { driversStyles as styles } from '../drivers.styles';
import SearchBar from '../components/SearchBar';
import DriverCard from '../components/DriverCard';
import CreateDriverModal from '../components/CreateDriverModal';
import { useDrivers } from '@/hooks/useDrivers';
import { createDriver } from '@/services/driverService';

export default function DriversScreen() {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const { drivers, loading, error, refetchDrivers } = useDrivers();

    const filteredDrivers = drivers.filter(driver =>
        driver.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        driver.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        driver.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        driver.phone.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <SafeAreaView style={tw`flex-1 bg-gray-50`}>
            <ScrollView
                style={tw`flex-1`}
                contentContainerStyle={tw`p-4`}
                showsVerticalScrollIndicator={false}
            >
                <Text style={styles.title}>Motoristas</Text>

                <SearchBar
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                />

                {loading ? (
                    <ActivityIndicator style={{ marginTop: 32 }} />
                ) : error ? (
                    <Text style={{ color: 'red', marginTop: 32 }}>{error}</Text>
                ) : drivers.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>Nenhum motorista cadastrado</Text>
                        <Text style={styles.emptySubText}>
                            Clique no botão + para adicionar um novo motorista
                        </Text>
                    </View>
                ) : (
                    filteredDrivers.map(driver => (
                        <DriverCard key={driver.id} driver={driver} />
                    ))
                )}
            </ScrollView>

            <TouchableOpacity
                style={styles.floatingButton}
                onPress={() => setIsModalVisible(true)}
            >
                <MaterialCommunityIcons name="plus" size={24} color="#FFFFFF" />
            </TouchableOpacity>

            <CreateDriverModal
                visible={isModalVisible}
                onClose={() => setIsModalVisible(false)}
                onSave={refetchDrivers}
            />
        </SafeAreaView>
    );
}