import React from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import tw from '@/utils/tailwind';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import LicensePlate from '../components/LicensePlate';
import { vehiclesStyles as styles } from '../vehicles.styles';
import { router, useLocalSearchParams } from 'expo-router';
import EditVehicleModal from '../components/EditVehicleModal';
import { useCars } from '@/hooks/useCars';
import { deleteCar, inactivateCar } from '@/services/carService';

export default function VehicleDetailsScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const { cars, refetchCars } = useCars();
    const [editModalVisible, setEditModalVisible] = React.useState(false);

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'AVAILABLE':
                return { badge: styles.statusActive, text: styles.statusActiveText, label: 'Ativo' };
            case 'IN_USE':
                return { badge: styles.statusInactive, text: styles.statusInactiveText, label: 'Inativo' };
            case 'IN_MAINTENANCE':
                return { badge: styles.statusMaintenance, text: styles.statusMaintenanceText, label: 'Manutenção' };
            default:
                return { badge: {}, text: {}, label: status };
        }
    };

    const vehicle = React.useMemo(
        () => cars.find(v => v.id === id),
        [cars, id]
    );

    if (!vehicle) {
        return (
            <SafeAreaView style={tw`flex-1 bg-gray-50 justify-center items-center`}>
                <Text>Veículo não encontrado.</Text>
            </SafeAreaView>
        );
    }

    const handleEditSave = async () => {
        Alert.alert('Sucesso', 'Veículo editado com sucesso!');
        setEditModalVisible(false);
        await refetchCars();
    };

    const handleDelete = async () => {
        Alert.alert(
            'Remover veículo',
            'Tem certeza que deseja remover este veículo?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Remover',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await deleteCar(vehicle.id);
                            Alert.alert('Sucesso', 'Veículo removido com sucesso!');
                            router.back();
                        } catch (error: any) {
                            let apiMessage = 'Não foi possível remover o veículo.';
                            if (error?.response?.data?.message) {
                                if (Array.isArray(error.response.data.message)) {
                                    apiMessage = error.response.data.message.join('\n');
                                } else if (typeof error.response.data.message === 'object') {
                                    apiMessage = JSON.stringify(error.response.data.message, null, 2);
                                } else {
                                    apiMessage = error.response.data.message;
                                }
                            } else if (error?.message) {
                                apiMessage = error.message;
                            }
                            Alert.alert('Erro', apiMessage);
                        }
                    }
                }
            ]
        );
    };

    const handleInactivate = async () => {
        Alert.alert(
            'Inativar veículo',
            'Tem certeza que deseja inativar este veículo?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Inativar',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await inactivateCar(vehicle.id);
                            Alert.alert('Sucesso', 'Veículo inativado com sucesso!');
                            await refetchCars?.();
                            router.back();
                        } catch (error: any) {
                            let apiMessage = 'Não foi possível inativar o veículo.';
                            if (error?.response?.data?.message) {
                                if (Array.isArray(error.response.data.message)) {
                                    apiMessage = error.response.data.message.join('\n');
                                } else if (typeof error.response.data.message === 'object') {
                                    apiMessage = JSON.stringify(error.response.data.message, null, 2);
                                } else {
                                    apiMessage = error.response.data.message;
                                }
                            } else if (error?.message) {
                                apiMessage = error.message;
                            }
                            Alert.alert('Erro', apiMessage);
                        }
                    }
                }
            ]
        );
    };

    return (
        <SafeAreaView style={tw`flex-1 bg-gray-50`}>
            <ScrollView
                style={tw`flex-1`}
                contentContainerStyle={tw`p-4`}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => router.back()}
                    >
                        <MaterialCommunityIcons name="chevron-left" size={24} color="#3B82F6" />
                    </TouchableOpacity>
                    <Text style={styles.title}>
                        {vehicle.brand} {vehicle.model}
                    </Text>
                </View>

                <LicensePlate plate={vehicle.licensePlate} />

                <Card style={tw`mb-4`}>
                    <View style={styles.detailRow}>
                        <View style={styles.detailIcon}>
                            <MaterialCommunityIcons name="calendar" size={20} color="#3B82F6" />
                        </View>
                        <View>
                            <Text style={styles.detailLabel}>Ano</Text>
                            <Text style={styles.detailValue}>{vehicle.year}</Text>
                        </View>
                    </View>

                    <View style={styles.detailRow}>
                        <View style={styles.detailIcon}>
                            <MaterialCommunityIcons name="counter" size={20} color="#3B82F6" />
                        </View>
                        <View>
                            <Text style={styles.detailLabel}>Odômetro</Text>
                            <Text style={styles.detailValue}>
                                {Number(vehicle.odometer).toLocaleString()} km
                            </Text>
                        </View>
                    </View>

                    <View style={styles.detailRow}>
                        <View style={styles.detailIcon}>
                            <MaterialCommunityIcons name="numeric" size={20} color="#3B82F6" />
                        </View>
                        <View>
                            <Text style={styles.detailLabel}>Renavam</Text>
                            <Text style={styles.detailValue}>
                                {vehicle.renavam}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.detailRow}>
                        <View style={styles.detailIcon}>
                            <MaterialCommunityIcons name="truck-outline" size={20} color="#3B82F6" />
                        </View>
                        <View>
                            <Text style={styles.detailLabel}>Status</Text>
                            {(() => {
                                const { badge, text, label } = getStatusStyle(vehicle.status);
                                return (
                                    <View style={[styles.statusBadge, badge]}>
                                        <Text style={[styles.statusText, text]}>{label}</Text>
                                    </View>
                                );
                            })()}
                        </View>
                    </View>

                    <View style={[styles.detailRow, tw`border-b-0`]}>
                        <View style={styles.detailIcon}>
                            <MaterialCommunityIcons name="clock-edit-outline" size={20} color="#3B82F6" />
                        </View>
                        <View>
                            <Text style={styles.detailLabel}>Última atualização</Text>
                            <Text style={styles.detailValue}>
                                {vehicle.createdAt
                                    ? new Date(vehicle.createdAt).toLocaleString('pt-BR')
                                    : '-'}
                            </Text>
                        </View>
                    </View>
                </Card>
            </ScrollView>

            <View style={styles.footer}>
                <Button
                    title="Editar"
                    leftIcon={<MaterialCommunityIcons name="pencil" size={20} color="#FFFFFF" />}
                    onPress={() => setEditModalVisible(true)}
                    style={tw`flex-1 mx-2`}
                    variant="primary"
                />
                <Button
                    title="Remover"
                    leftIcon={<MaterialCommunityIcons name="trash-can" size={20} color="#FFFFFF" />}
                    onPress={handleDelete}
                    style={tw`flex-1 mx-2`}
                    variant="danger"
                />
                <Button
                    title="Inativar"
                    leftIcon={<MaterialCommunityIcons name="account-off" size={20} color="#FFFFFF" />}
                    onPress={handleInactivate}
                    style={tw`flex-1 mx-2`}
                    variant="secondary"
                />
            </View>

            <EditVehicleModal
                visible={editModalVisible}
                onClose={() => setEditModalVisible(false)}
                onSave={handleEditSave}
                vehicleId={vehicle.id}
                initialData={{
                    brand: vehicle.brand || '',
                    model: vehicle.model || '',
                    year: String(vehicle.year || ''),
                    color: vehicle.color || '',
                    licensePlate: vehicle.licensePlate || '',
                    odometer: String(vehicle.odometer || ''),
                    renavam: vehicle.renavam || '',
                }}
            />
        </SafeAreaView>
    );
}