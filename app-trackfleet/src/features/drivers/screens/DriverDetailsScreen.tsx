import React, { useState, useMemo } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import EditDriverModal from '../components/EditDriverModal';
import { driversStyles } from '../drivers.styles';
import { useDrivers } from '@/hooks/useDrivers';
import { inactivateDriver } from '@/services/driverService';

export default function DriverDetailsScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    const { drivers, loading, error, refetchDrivers } = useDrivers();
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);

    const driver = useMemo(
        () => drivers.find(d => d.id === id),
        [drivers, id]
    );

    if (loading) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: '#E5E7EB', justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator />
            </SafeAreaView>
        );
    }

    if (error) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: '#E5E7EB', justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: 'red' }}>{error}</Text>
            </SafeAreaView>
        );
    }

    if (!driver) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: '#E5E7EB', justifyContent: 'center', alignItems: 'center' }}>
                <Text>Motorista não encontrado.</Text>
            </SafeAreaView>
        );
    }
    const handleInactivate = async () => {
        Alert.alert(
            'Inativar Motorista',
            'Tem certeza que deseja inativar este motorista?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Inativar',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await inactivateDriver(driver.id);
                            Alert.alert('Sucesso', 'Motorista inativado com sucesso!');
                            refetchDrivers?.();
                            setIsEditModalVisible(false);
                            router.back();
                        } catch (error: any) {
                            let apiMessage = 'Não foi possível inativar o Motorista.';
                            if (error?.response?.data?.message) {
                                if (Array.isArray(error.response.data.message)) {
                                    apiMessage = error.response.data.message.join('\n');
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
        <SafeAreaView style={{ flex: 1, backgroundColor: '#E5E7EB' }}>
            <ScrollView contentContainerStyle={driversStyles.detailsScrollContent}>
                <View style={driversStyles.detailsCard}>
                    <TouchableOpacity
                        style={{ position: 'absolute', top: 16, left: 16, zIndex: 10, backgroundColor: '#fff', borderRadius: 20, padding: 6, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 4 }}
                        onPress={() => router.back()}
                    >
                        <MaterialCommunityIcons name="arrow-left" size={28} color="#3B82F6" />
                    </TouchableOpacity>
                    <View style={driversStyles.detailsAvatarContainer}>
                        <View style={driversStyles.detailsAvatarCircle}>
                            <MaterialCommunityIcons name="account" size={64} color="#3B82F6" />
                        </View>
                    </View>
                    <Text style={driversStyles.detailsName}>{driver.firstName} {driver.lastName}</Text>
                    <View style={driversStyles.detailsStatusRow}>
                        <MaterialCommunityIcons name="card-account-details" size={14} color={'#10B981'} style={{ marginRight: 4 }} />
                        <Text style={[driversStyles.detailsStatus, { color: '#10B981' }]}>CNH: {driver.cnh} ({driver.cnhType})</Text>
                    </View>
                    <View style={driversStyles.detailsStatusRow}>
                        <MaterialCommunityIcons name="circle" size={14} color={driver.isActive ? '#10B981' : '#EF4444'} style={{ marginRight: 4 }} />
                        <Text style={[driversStyles.detailsStatus, { color: driver.isActive ? '#10B981' : '#EF4444' }]}>
                            {driver.isActive ? 'Ativo' : 'Inativo'}
                        </Text>
                    </View>
                    <View style={driversStyles.detailsDivider} />

                    <View style={driversStyles.detailsFieldBlock}>
                        <Text style={driversStyles.detailsFieldLabel}>Email</Text>
                        <Text style={driversStyles.detailsFieldValue}>{driver.email}</Text>
                    </View>
                    <View style={driversStyles.detailsFieldBlock}>
                        <Text style={driversStyles.detailsFieldLabel}>Telefone</Text>
                        <Text style={driversStyles.detailsFieldValue}>{driver.phone}</Text>
                    </View>
                    <View style={driversStyles.detailsDivider} />
                    <Text style={driversStyles.detailsSectionTitle}>Endereço</Text>
                    <View style={driversStyles.detailsFieldBlock}>
                        <Text style={driversStyles.detailsFieldLabel}>Rua</Text>
                        <Text style={driversStyles.detailsFieldValue}>{driver.address.street}</Text>
                    </View>
                    <View style={driversStyles.detailsFieldBlockRow}>
                        <View style={driversStyles.detailsFieldBlockHalf}>
                            <Text style={driversStyles.detailsFieldLabel}>Número</Text>
                            <Text style={driversStyles.detailsFieldValue}>{driver.address.number}</Text>
                        </View>
                        <View style={driversStyles.detailsFieldBlockHalf}>
                            <Text style={driversStyles.detailsFieldLabel}>Bairro</Text>
                            <Text style={driversStyles.detailsFieldValue}>{driver.address.district}</Text>
                        </View>
                    </View>
                    <View style={driversStyles.detailsFieldBlockRow}>
                        <View style={driversStyles.detailsFieldBlockHalf}>
                            <Text style={driversStyles.detailsFieldLabel}>Cidade</Text>
                            <Text style={driversStyles.detailsFieldValue}>{driver.address.city}</Text>
                        </View>
                        <View style={driversStyles.detailsFieldBlockHalf}>
                            <Text style={driversStyles.detailsFieldLabel}>Estado</Text>
                            <Text style={driversStyles.detailsFieldValue}>{driver.address.state}</Text>
                        </View>
                    </View>
                    {driver.isActive && (
                        <View style={driversStyles.detailsButtonRow}>
                            <TouchableOpacity
                                style={[driversStyles.detailsActionButton, driversStyles.detailsEditButton]}
                                onPress={() => setIsEditModalVisible(true)}
                            >
                                <MaterialCommunityIcons name="pencil" size={20} color="#fff" style={{ marginRight: 8 }} />
                                <Text style={driversStyles.detailsButtonText}>Editar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[driversStyles.detailsActionButton, driversStyles.detailsDeleteButton]}
                                onPress={handleInactivate}
                            >
                                <MaterialCommunityIcons name="account-off" size={20} color="#fff" style={{ marginRight: 8 }} />
                                <Text style={driversStyles.detailsButtonText}>Inativar</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </ScrollView>

            <EditDriverModal
                visible={isEditModalVisible}
                onClose={() => setIsEditModalVisible(false)}
                driverId={driver.id}
                initialData={{
                    firstName: driver.firstName,
                    lastName: driver.lastName,
                    email: driver.email,
                    phone: driver.phone,
                    cnh: driver.cnh,
                    cnhType: driver.cnhType,
                    street: driver.address?.street || '',
                    number: driver.address?.number !== undefined && driver.address?.number !== null
                        ? String(driver.address.number)
                        : '',
                    district: driver.address?.district || '',
                    zipCode: driver.address?.zipCode || '',
                    city: driver.address?.city || '',
                    state: driver.address?.state || '',
                }}
                onSuccess={() => {
                    refetchDrivers();
                    setIsEditModalVisible(false);
                }} />
        </SafeAreaView>
    );
}