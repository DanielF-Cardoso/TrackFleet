import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface FinalizeEventModalProps {
    visible: boolean;
    onClose: () => void;
    onSave: (data: { finalOdometer: number; endTime: Date }) => void;
    initialOdometer: number;
}

export default function FinalizeEventModal({
    visible,
    onClose,
    onSave,
    initialOdometer,
}: FinalizeEventModalProps) {
    const [finalOdometer, setFinalOdometer] = useState<string>('');

    const handleSave = () => {
        if (!finalOdometer) return;

        const odometerValue = parseInt(finalOdometer);
        if (isNaN(odometerValue) || odometerValue < initialOdometer) {
            return;
        }

        onSave({
            finalOdometer: odometerValue,
            endTime: new Date(),
        });

        setFinalOdometer('');
        onClose();
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
                        <Text style={styles.modalTitle}>Finalizar Evento</Text>
                        <TouchableOpacity onPress={onClose}>
                            <MaterialCommunityIcons name="close" size={24} color="#64748B" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Odômetro Inicial</Text>
                        <Text style={styles.initialOdometer}>{initialOdometer} km</Text>
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Odômetro Final (km)</Text>
                        <TextInput
                            style={styles.input}
                            keyboardType="numeric"
                            value={finalOdometer}
                            onChangeText={setFinalOdometer}
                            placeholder="Digite o odômetro final"
                        />
                    </View>

                    <View style={styles.modalFooter}>
                        <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                            <Text style={styles.cancelButtonText}>Cancelar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.saveButton,
                                (!finalOdometer || parseInt(finalOdometer) < initialOdometer) &&
                                styles.saveButtonDisabled,
                            ]}
                            onPress={handleSave}
                            disabled={!finalOdometer || parseInt(finalOdometer) < initialOdometer}
                        >
                            <Text style={styles.saveButtonText}>Finalizar</Text>
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
    initialOdometer: {
        fontSize: 16,
        color: '#1E293B',
        padding: 12,
        backgroundColor: '#F1F5F9',
        borderRadius: 6,
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