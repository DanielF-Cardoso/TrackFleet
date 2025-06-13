import React, { useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { FleetCard } from '../components/FleetCard';
import { RecentCarItem } from '../components/RecentCarItem';
import { RecentDriverItem } from '../components/RecentDriverItem';
import ActiveCarCard from '../../events/components/ActiveCarCard';
import { dashboardStyles as styles } from './dashboard.styles';
import { useCars } from '@/hooks/useCars';
import { useEvents } from '@/hooks/useEvents';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useDrivers } from '@/hooks/useDrivers';
import { finalizeEvent } from '@/services/eventService';
import FinalizeEventModal from '@/features/events/components/FinalizeEventModal';
import { useManagerProfile } from '@/hooks/useManagerProfile';

export default function DashboardScreen() {
    const router = useRouter();

    const navigateToCarsList = () => {
        router.push('/vehicles');
    };

    const navigateToDriversList = () => {
        router.push('/drivers');
    };

    const navigateToCarDetails = (id: string) => {
        router.push(`/vehicles/${id}`);
    };

    const navigateToDriverDetails = (id: string) => {
        router.push(`/drivers/${id}`);
    };

    const openFinalizeModal = (event: any) => {
        setSelectedEvent(event);
        setOdometerInput('');
        setIsFinalizeModalVisible(true);
    };

    const { manager, loading: loadingManager, error: errorManager } = useManagerProfile();
    const { totalCars, loading: loadingCars, error: errorCars } = useCars();
    const { totalKilometers, loading: loadingOdometer, error: errorOdometer } = useCars();
    const { activeCars, loading: loadingActiveCars, error: errorActiveCars } = useCars();
    const { activeEvents, loading: loadingEvents, error: errorEvents, refetchEvents } = useEvents();


    const { cars, loading: loadingListCars, error: errorListCars } = useCars();
    const recentCars = [...cars]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 2);

    const { drivers, loading: loadingDrivers, error: errorDrivers } = useDrivers();
    const recentDrivers = [...drivers]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 2);

    const [isFinalizeModalVisible, setIsFinalizeModalVisible] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<any>(null);
    const [odometerInput, setOdometerInput] = useState('');

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
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.header}>
                    <View>
                        <Text style={styles.greeting}>Bem-vindo de volta,</Text>
                        <Text style={styles.username}>
                            {loadingManager ? '...' : manager?.firstName || 'Gestor'}
                        </Text>
                        {errorManager && <Text style={{ color: 'red' }}>{errorManager}</Text>}
                    </View>
                    <View style={styles.date}>
                        <Text style={styles.dateText}>
                            {new Date().toLocaleDateString('pt-BR', {
                                weekday: 'short',
                                month: 'short',
                                day: 'numeric',
                            })}
                        </Text>
                    </View>
                </View>

                <Text style={styles.sectionTitle}>Visão Geral da Frota</Text>

                <View style={styles.statsContainer}>
                    <FleetCard
                        icon={<Feather name="truck" size={20} color="#0066FF" />}
                        value={loadingCars ? '...' : totalCars}
                        label="Carros"
                        color="#0066FF"
                    />
                    {errorCars && <Text style={{ color: 'red' }}>{errorCars}</Text>}
                    <FleetCard
                        icon={<Feather name="map" size={20} color="#22C55E" />}
                        value={loadingOdometer ? '...' : totalKilometers.toLocaleString('pt-BR')}
                        label="Quilometros"
                        color="#22C55E"
                    />
                    {errorOdometer && <Text style={{ color: 'red' }}>{errorOdometer}</Text>}
                    <FleetCard
                        icon={<Feather name="clock" size={20} color="#F59E0B" />}
                        value={loadingActiveCars ? '...' : activeCars}
                        label="Carros Ativos"
                        color="#F59E0B"
                    />
                    {errorActiveCars && <Text style={{ color: 'red' }}>{errorActiveCars}</Text>}
                </View>

                {/* Active Cars Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Carros em Uso</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {loadingEvents ? (
                            <Text>Carregando...</Text>
                        ) : errorEvents ? (
                            <Text style={{ color: 'red' }}>{errorEvents}</Text>
                        ) : activeEvents.length === 0 ? (
                            <Text>Nenhum carro em uso</Text>
                        ) : (
                            activeEvents.map(event => (
                                <ActiveCarCard
                                    key={event.id}
                                    carName={`${event.car.brand} ${event.car.model}`}
                                    driverName={`${event.driver.firstName}`}
                                    startTime={event.startAt}
                                    onPress={() => openFinalizeModal(event)}
                                />
                            ))
                        )}
                    </ScrollView>
                </View>

                {/* Recently Added Cars */}
                <View style={styles.recentSection}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Carros Recentes</Text>
                        <TouchableOpacity onPress={navigateToCarsList}>
                            <Text style={styles.seeAllText}>Ver todos</Text>
                        </TouchableOpacity>
                    </View>

                    {loadingCars ? (
                        <Text>Carregando...</Text>
                    ) : errorCars ? (
                        <Text style={{ color: 'red' }}>{errorCars}</Text>
                    ) : recentCars.length === 0 ? (
                        <Text>Nenhum carro recente</Text>
                    ) : (
                        recentCars.map(car => (
                            <RecentCarItem
                                key={car.id}
                                name={`${car.brand} ${car.model}`}
                                licensePlate={car.licensePlate}
                                year={car.year}
                                odometer={`${car.odometer.toLocaleString('pt-BR')} km`}
                                lastUpdated={format(new Date(car.createdAt), "MMM dd, yyyy", { locale: ptBR })}
                                onPress={() => navigateToCarDetails(car.id)}
                            />
                        ))
                    )}
                </View>

                {/* Recently Added Drivers */}
                <View style={styles.recentSection}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Motoristas Recentes</Text>
                        <TouchableOpacity onPress={navigateToDriversList}>
                            <Text style={styles.seeAllText}>Ver todos</Text>
                        </TouchableOpacity>
                    </View>

                    {loadingDrivers ? (
                        <Text>Carregando...</Text>
                    ) : errorDrivers ? (
                        <Text style={{ color: 'red' }}>{errorDrivers}</Text>
                    ) : recentDrivers.length === 0 ? (
                        <Text>Nenhum motorista recente</Text>
                    ) : (
                        recentDrivers.map(driver => (
                            <RecentDriverItem
                                key={driver.id}
                                name={`${driver.firstName} ${driver.lastName}`}
                                cnh={driver.cnh}
                                cnhType={driver.cnhType}
                                email={driver.email}
                                lastUpdated={format(new Date(driver.createdAt), "MMM dd, yyyy", { locale: ptBR })}
                                onPress={() => navigateToDriverDetails(driver.id)}
                            />
                        ))
                    )}
                </View>
            </ScrollView>
            <FinalizeEventModal
                visible={isFinalizeModalVisible}
                onClose={() => setIsFinalizeModalVisible(false)}
                onSave={handleFinalizeEvent}
                initialOdometer={selectedEvent?.car?.odometer || 0}
            />
        </SafeAreaView>
    );
}