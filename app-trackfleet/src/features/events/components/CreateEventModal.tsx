import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, TextInput, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { createEvent } from '@/services/eventService';
import { isValidOdometer } from '@/hooks/useEvents';

interface Car {
    id: string;
    name: string;
    plate: string;
}

interface Driver {
    id: string;
    name: string;
}

interface CreateEventModalProps {
    visible: boolean;
    onClose: () => void;
    onSave?: () => void; 
    cars: Car[];
    drivers: Driver[];
}

export default function CreateEventModal({
    visible,
    onClose,
    onSave,
    cars,
    drivers,
}: CreateEventModalProps) {
    const [selectedCarId, setSelectedCarId] = useState<string>('');
    const [selectedDriverId, setSelectedDriverId] = useState<string>('');
    const [odometer, setOdometer] = useState<string>('');
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        if (!selectedCarId || !selectedDriverId || !odometer || !isValidOdometer(odometer)) return;

        setLoading(true);
        try {
            await createEvent(selectedCarId, selectedDriverId, parseInt(odometer, 10));
            Alert.alert('Sucesso', 'Evento criado com sucesso!');
            setSelectedCarId('');
            setSelectedDriverId('');
            setOdometer('');
            onClose();
            onSave && onSave();
        } catch (error: any) {
            let apiMessage = 'Não foi possível criar o evento.';
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
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Registrar Saída</Text>
                        <TouchableOpacity onPress={onClose}>
                            <MaterialCommunityIcons name="close" size={24} color="#64748B" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Veículo</Text>
                        <View style={styles.selectContainer}>
                            {cars.map(car => (
                                <TouchableOpacity
                                    key={car.id}
                                    style={[
                                        styles.selectOption,
                                        selectedCarId === car.id && styles.selectOptionSelected,
                                    ]}
                                    onPress={() => setSelectedCarId(car.id)}
                                >
                                    <Text
                                        style={[
                                            styles.selectOptionText,
                                            selectedCarId === car.id && styles.selectOptionTextSelected,
                                        ]}
                                    >
                                        {car.name} - {car.plate}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Motorista</Text>
                        <View style={styles.selectContainer}>
                            {drivers.map(driver => (
                                <TouchableOpacity
                                    key={driver.id}
                                    style={[
                                        styles.selectOption,
                                        selectedDriverId === driver.id && styles.selectOptionSelected,
                                    ]}
                                    onPress={() => setSelectedDriverId(driver.id)}
                                >
                                    <Text
                                        style={[
                                            styles.selectOptionText,
                                            selectedDriverId === driver.id && styles.selectOptionTextSelected,
                                        ]}
                                    >
                                        {driver.name}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Odômetro (km)</Text>
                        <TextInput
                            style={styles.input}
                            keyboardType="numeric"
                            value={odometer}
                            onChangeText={setOdometer}
                            placeholder="Digite o odômetro atual"
                        />
                    </View>

                    <View style={styles.modalFooter}>
                        <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                            <Text style={styles.cancelButtonText}>Cancelar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.saveButton,
                                (!selectedCarId || !selectedDriverId || !odometer || loading) &&
                                styles.saveButtonDisabled,
                            ]}
                            onPress={handleSave}
                            disabled={!selectedCarId || !selectedDriverId || !odometer || loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.saveButtonText}>Registrar</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1E293B',
    },
    formGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#64748B',
        marginBottom: 8,
    },
    selectContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    selectOption: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 6,
        backgroundColor: '#F1F5F9',
        marginRight: 8,
        marginBottom: 8,
    },
    selectOptionSelected: {
        backgroundColor: '#3B82F6',
    },
    selectOptionText: {
        fontSize: 14,
        color: '#64748B',
    },
    selectOptionTextSelected: {
        color: '#fff',
    },
    input: {
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 6,
        padding: 12,
        fontSize: 16,
        color: '#1E293B',
    },
    modalFooter: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 12,
        marginTop: 20,
    },
    cancelButton: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 6,
        backgroundColor: '#F1F5F9',
    },
    cancelButtonText: {
        color: '#64748B',
        fontWeight: '600',
    },
    saveButton: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 6,
        backgroundColor: '#3B82F6',
    },
    saveButtonDisabled: {
        backgroundColor: '#94A3B8',
    },
    saveButtonText: {
        color: '#fff',
        fontWeight: '600',
    },
});