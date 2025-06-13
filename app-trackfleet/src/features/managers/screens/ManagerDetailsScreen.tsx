import React, { useState, useMemo } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Alert, StyleSheet, Dimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import EditManagerModal from '../components/EditManagerModal';
import { useManagers } from '@/hooks/useManager';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale/pt-BR';
import { inactivateManager } from '@/services/managerService';

export default function ManagerDetailsScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    const { managers, loading, error, refetchManagers } = useManagers();
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);

    const manager = useMemo(
        () => managers.find(m => m.id === id),
        [managers, id]
    );

    if (loading) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: '#E5E7EB', justifyContent: 'center', alignItems: 'center' }}>
                <Text>Carregando...</Text>
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

    if (!manager) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: '#E5E7EB', justifyContent: 'center', alignItems: 'center' }}>
                <Text>Gestor não encontrado.</Text>
            </SafeAreaView>
        );
    }

    const handleInactivate = async () => {
        Alert.alert(
            'Inativar Gestor',
            'Tem certeza que deseja inativar este gestor?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Inativar',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await inactivateManager(manager.id);
                            Alert.alert('Sucesso', 'Gestor inativado com sucesso!');
                            refetchManagers?.();
                            setIsEditModalVisible(false);
                            router.back();
                        } catch (error: any) {
                            let apiMessage = 'Não foi possível inativar o gestor.';
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
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.idCard}>
                    <TouchableOpacity
                        style={{ position: 'absolute', top: 16, left: 16, zIndex: 10, backgroundColor: '#fff', borderRadius: 20, padding: 6, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 4 }}
                        onPress={() => router.back()}
                    >
                        <MaterialCommunityIcons name="arrow-left" size={28} color="#3B82F6" />
                    </TouchableOpacity>
                    <View style={styles.avatarContainer}>
                        <View style={styles.avatarCircle}>
                            <MaterialCommunityIcons name="account" size={64} color="#3B82F6" />
                        </View>
                    </View>
                    <Text style={styles.name}>{manager.firstName} {manager.lastName}</Text>
                    <View style={styles.statusRow}>
                        <MaterialCommunityIcons name="circle" size={14} color={manager.isActive ? '#10B981' : '#EF4444'} style={{ marginRight: 4 }} />
                        <Text style={[styles.status, { color: manager.isActive ? '#10B981' : '#EF4444' }]}>
                            {manager.isActive ? 'Ativo' : 'Inativo'}
                        </Text>
                    </View>
                    <View style={styles.divider} />

                    <View style={styles.fieldBlock}>
                        <Text style={styles.fieldLabel}>Email</Text>
                        <Text style={styles.fieldValue}>{manager.email}</Text>
                    </View>
                    <View style={styles.fieldBlock}>
                        <Text style={styles.fieldLabel}>Telefone</Text>
                        <Text style={styles.fieldValue}>{manager.phone}</Text>
                    </View>
                    <View style={styles.divider} />
                    <Text style={styles.sectionTitle}>Endereço</Text>
                    <View style={styles.fieldBlock}>
                        <Text style={styles.fieldLabel}>Rua</Text>
                        <Text style={styles.fieldValue}>{manager.address?.street || ''}</Text>
                    </View>
                    <View style={styles.fieldBlockRow}>
                        <View style={styles.fieldBlockHalf}>
                            <Text style={styles.fieldLabel}>Número</Text>
                            <Text style={styles.fieldValue}>{manager.address?.number || ''}</Text>
                        </View>
                        <View style={styles.fieldBlockHalf}>
                            <Text style={styles.fieldLabel}>Bairro</Text>
                            <Text style={styles.fieldValue}>{manager.address?.district || ''}</Text>
                        </View>
                    </View>
                    <View style={styles.fieldBlockRow}>
                        <View style={styles.fieldBlockHalf}>
                            <Text style={styles.fieldLabel}>Cidade</Text>
                            <Text style={styles.fieldValue}>{manager.address?.city || ''}</Text>
                        </View>
                        <View style={styles.fieldBlockHalf}>
                            <Text style={styles.fieldLabel}>Estado</Text>
                            <Text style={styles.fieldValue}>{manager.address?.state || ''}</Text>
                        </View>
                    </View>
                    <View style={styles.fieldBlockRow}>
                        <View style={styles.fieldBlockHalf}>
                            <Text style={styles.fieldLabel}>CEP</Text>
                            <Text style={styles.fieldValue}>{manager.address?.zipCode || ''}</Text>
                        </View>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.fieldBlock}>
                        <Text style={styles.fieldLabel}>Ultimo login</Text>
                        <Text style={styles.fieldValue}>{manager.lastLogin
                            ? format(new Date(manager.lastLogin), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })
                            : 'Nunca'}</Text>
                    </View>
                    {manager.isActive && (
                        <View style={styles.buttonRow}>
                            <TouchableOpacity
                                style={[styles.actionButton, styles.editButton]}
                                onPress={() => setIsEditModalVisible(true)}
                            >
                                <MaterialCommunityIcons name="pencil" size={20} color="#fff" style={{ marginRight: 8 }} />
                                <Text style={styles.buttonText}>Editar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.actionButton, styles.deleteButton]}
                                onPress={handleInactivate}
                            >
                                <MaterialCommunityIcons name="account-off" size={20} color="#fff" style={{ marginRight: 8 }} />
                                <Text style={styles.buttonText}>Inativar</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </ScrollView>

            <EditManagerModal
                visible={isEditModalVisible}
                onClose={() => setIsEditModalVisible(false)}
                managerId={manager.id}
                initialData={{
                    firstName: manager.firstName,
                    lastName: manager.lastName,
                    email: manager.email,
                    phone: manager.phone,
                    street: manager.address?.street || '',
                    number: manager.address?.number || '',
                    district: manager.address?.district || '',
                    zipCode: manager.address?.zipCode || '',
                    city: manager.address?.city || '',
                    state: manager.address?.state || '',
                }}
                onSuccess={refetchManagers}
            />
        </SafeAreaView>
    );
}

const CARD_WIDTH = Math.min(Dimensions.get('window').width - 32, 400);

const styles = StyleSheet.create({
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 32,
    },
    idCard: {
        width: CARD_WIDTH,
        backgroundColor: '#fff',
        borderRadius: 18,
        padding: 24,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 4,
    },
    avatarContainer: {
        alignItems: 'center',
        marginBottom: 12,
        width: '100%',
    },
    avatarCircle: {
        width: 90,
        height: 90,
        borderRadius: 45,
        backgroundColor: '#E0E7FF',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
        alignSelf: 'center',
    },
    name: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#1E293B',
        marginBottom: 2,
        textAlign: 'center',
        alignSelf: 'center',
        width: '100%',
    },
    statusRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
        width: '100%',
    },
    status: {
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    divider: {
        width: '100%',
        height: 1,
        backgroundColor: '#E5E7EB',
        marginVertical: 14,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#3B82F6',
        marginBottom: 8,
        marginTop: 8,
        alignSelf: 'flex-start',
    },
    fieldBlock: {
        width: '100%',
        marginBottom: 10,
    },
    fieldBlockRow: {
        flexDirection: 'row',
        width: '100%',
        marginBottom: 10,
        gap: 12,
    },
    fieldBlockHalf: {
        flex: 1,
    },
    fieldLabel: {
        fontSize: 13,
        color: '#64748B',
        fontWeight: '600',
        marginBottom: 2,
    },
    fieldValue: {
        fontSize: 15,
        color: '#334155',
        fontWeight: '500',
        marginBottom: 2,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 18,
        gap: 12,
    },
    actionButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 8,
    },
    editButton: {
        backgroundColor: '#3B82F6',
    },
    deleteButton: {
        backgroundColor: '#EF4444',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});