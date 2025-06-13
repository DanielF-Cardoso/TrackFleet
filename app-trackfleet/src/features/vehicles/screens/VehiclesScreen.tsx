import React, { useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import tw from '@/utils/tailwind';
import { vehiclesStyles as styles } from '../vehicles.styles';
import VehicleCard from '../components/VehicleCard';
import CreateVehicleModal from '../components/CreateVehicleModal';
import SearchBar from '../components/SearchBar';
import { useCars } from '@/hooks/useCars';
import { createCar } from '@/services/carService';

export default function VehiclesScreen() {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const { cars, loading, error, refetchCars } = useCars();

    const handleSaveVehicle = async (data) => {
        await createCar(data);
        await refetchCars();
        setIsModalVisible(false);
    };


    const filteredVehicles = cars.filter(vehicle =>
        vehicle.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vehicle.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vehicle.licensePlate.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <SafeAreaView style={tw`flex-1 bg-gray-50`}>
            <ScrollView
                style={tw`flex-1`}
                contentContainerStyle={tw`p-4`}
                showsVerticalScrollIndicator={false}
            >
                <Text style={styles.title}>Veículos</Text>

                <SearchBar
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                />

                {loading ? (
                    <Text>Carregando...</Text>
                ) : error ? (
                    <Text style={{ color: 'red' }}>{error}</Text>
                ) : cars.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>Nenhum veículo cadastrado</Text>
                        <Text style={styles.emptySubText}>
                            Clique no botão + para adicionar um novo veículo
                        </Text>
                    </View>
                ) : (
                    filteredVehicles.map(vehicle => (
                        <VehicleCard key={vehicle.id} vehicle={vehicle} />
                    ))
                )}
            </ScrollView>

            <TouchableOpacity
                style={styles.floatingButton}
                onPress={() => setIsModalVisible(true)}
            >
                <MaterialCommunityIcons name="plus" size={24} color="#FFFFFF" />
            </TouchableOpacity>

            <CreateVehicleModal
                visible={isModalVisible}
                onClose={() => setIsModalVisible(false)}
                onSave={handleSaveVehicle}
            />
        </SafeAreaView>
    );
}