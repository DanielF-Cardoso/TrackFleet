import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { styles } from '../events.styles';
import DashboardStatCard from '../components/DashboardStatCard';
import ActiveCarCard from '../components/ActiveCarCard';
import EventPendingCard from '../components/EventPendingCard';
import EventItemCard from '../components/EventItemCard';
import CreateEventModal from '../components/CreateEventModal';
import FinalizeEventModal from '../components/FinalizeEventModal';
import NoEventCard from '../components/NoEventCard';
import { useCars } from '@/hooks/useCars';
import { useDrivers } from '@/hooks/useDrivers';
import { useEvents } from '@/hooks/useEvents';
import { finalizeEvent } from '@/services/eventService';


export default function EventsScreen() {
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const [isFinalizeModalVisible, setIsFinalizeModalVisible] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<any>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const { activeEvents, loading: loadingEvents, error: errorEvents, refetchEvents, events } = useEvents();
    const { cars } = useCars();
    const { drivers } = useDrivers();

    const activeCars = cars.filter(car => car.status === 'IN_USE');
    const availableCars = cars.filter(car => car.status === 'AVAILABLE');

    const carOptions = cars
        .filter(car => car.status === 'AVAILABLE' && car.isActive)
        .map(car => ({
            id: car.id,
            name: `${car.brand} ${car.model}`,
            plate: car.licensePlate,
        }));

    const driverOptions = drivers
        .filter(driver => driver.isActive)
        .map(driver => ({
            id: driver.id,
            name: driver.firstName && driver.lastName
                ? `${driver.firstName} ${driver.lastName}`
                : driver.name || '',
        }));

    const filteredEvents = events.filter(event => {
        const car = cars.find(c => c.id === event.carId);
        const driver = drivers.find(d => d.id === event.driverId);
        const searchLower = searchQuery.toLowerCase();
        return (
            (car && car.brand.toLowerCase().includes(searchLower)) ||
            (car && car.model.toLowerCase().includes(searchLower)) ||
            (driver && driver.name.toLowerCase().includes(searchLower))
        );
    });

    const handleFinalizeEvent = async (data: { finalOdometer: number; endTime: Date }) => {
        if (!selectedEvent) return;
        try {
            await finalizeEvent(selectedEvent.id, data.finalOdometer);
            Alert.alert('Sucesso', 'Evento finalizado com sucesso!');
            setIsFinalizeModalVisible(false);
            setSelectedEvent(null);
            refetchEvents();
        } catch (error: any) {
            Alert.alert('Erro', error.message || 'Erro ao finalizar evento.');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollViewContent}
            >
                <Text style={styles.title}>Gestão de Frotas</Text>
                <View style={styles.statsContainer}>
                    <DashboardStatCard
                        title="Frota Ativos"
                        value={activeCars.length}
                        icon="car-connected"
                        color="#3B82F6"
                    />
                    <DashboardStatCard
                        title="Frota Disponível"
                        value={availableCars.length}
                        icon="car"
                        color="#10B981"
                    />
                    <DashboardStatCard
                        title="Total Motoristas"
                        value={drivers.length}
                        icon="account-group"
                        color="#8B5CF6"
                    />
                </View>

                {/* Eventos em Aberto */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Eventos em Aberto</Text>
                    {activeEvents.length === 0 ? (
                        <NoEventCard />
                    ) : (
                        activeEvents.map(event => {
                            const car = cars.find(c => c.id === event.carId);
                            const driver = drivers.find(d => d.id === event.driverId);
                            if (!car || !driver) return null;

                            return (
                                <EventPendingCard
                                    key={event.id}
                                    carName={`${car.brand} ${car.model}`}
                                    driverName={`${driver.firstName} ${driver.lastName}`}
                                    odometer={event.odometer}
                                    startTime={event.startAt}
                                    onFinalize={() => {
                                        setSelectedEvent(event);
                                        setIsFinalizeModalVisible(true);
                                    }}
                                />
                            );
                        })
                    )}
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Todos os Eventos</Text>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Buscar por carro ou motorista..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    {filteredEvents.map(event => {
                        const car = cars.find(c => c.id === event.carId);
                        const driver = drivers.find(d => d.id === event.driverId);
                        if (!car || !driver) return null;

                        return (
                            <EventItemCard
                                key={event.id}
                                carName={`${car.brand} ${car.model}`}
                                driverName={`${driver.firstName} ${driver.lastName}`}
                                startTime={event.startAt}
                                endTime={event.endAt}
                                initialOdometer={event.odometer}
                                finalOdometer={event.finalOdometer}
                            />
                        );
                    })}
                </View>
            </ScrollView>

            <TouchableOpacity
                style={styles.floatingButton}
                onPress={() => setIsCreateModalVisible(true)}
            >
                <MaterialCommunityIcons name="plus" size={24} color="#fff" />
            </TouchableOpacity>


            <CreateEventModal
                visible={isCreateModalVisible}
                onClose={() => setIsCreateModalVisible(false)}
                onSave={refetchEvents}
                cars={carOptions}
                drivers={driverOptions}
            />

            <FinalizeEventModal
                visible={isFinalizeModalVisible}
                onClose={() => setIsFinalizeModalVisible(false)}
                onSave={handleFinalizeEvent}
                initialOdometer={selectedEvent?.car?.odometer || 0}
            />
        </SafeAreaView>
    );
}