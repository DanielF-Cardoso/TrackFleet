import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Feather } from '@expo/vector-icons';
import tw from '@/utils/tailwind';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { createVehicleModalStyles as styles } from './CreateVehicleModal.styles';
import { createVehicleSchema } from '@/utils/validation';
import { z } from 'zod';

type CreateVehicleFormData = z.infer<typeof createVehicleSchema>;

interface CreateVehicleModalProps {
    visible: boolean;
    onClose: () => void;
    onSave: (data: CreateVehicleFormData) => Promise<void>;
}

export default function CreateVehicleModal({ visible, onClose, onSave }: CreateVehicleModalProps) {
    const [isLoading, setIsLoading] = useState(false);

    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<CreateVehicleFormData>({
        resolver: zodResolver(createVehicleSchema),
        defaultValues: {
            brand: '',
            model: '',
            year: '',
            color: '',
            licensePlate: '',
            odometer: '',
            renavam: '',
        },
    });

    const onSubmit = async (data: CreateVehicleFormData) => {
        setIsLoading(true);
        try {
            const payload = {
                ...data,
                year: Number(data.year),
                odometer: Number(data.odometer),
            };
            await onSave(payload);
            reset();
            Alert.alert('Sucesso', 'Veículo cadastrado com sucesso!');
            onClose();
        } catch (error: any) {
            let apiMessage = 'Não foi possível cadastrar o veículo.';
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
            setIsLoading(false);
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
                        <Text style={styles.modalTitle}>Novo Veículo</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Feather name="x" size={24} color="#6B7280" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.form}>
                        <Controller
                            control={control}
                            name="brand"
                            render={({ field: { onChange, value } }) => (
                                <Input
                                    label="Marca"
                                    placeholder="Ex: Toyota"
                                    value={value}
                                    onChangeText={onChange}
                                    error={errors.brand?.message}
                                    leftIcon={<Feather name="truck" size={20} color="#6B7280" />}
                                />
                            )}
                        />
                        <Controller
                            control={control}
                            name="model"
                            render={({ field: { onChange, value } }) => (
                                <Input
                                    label="Modelo"
                                    placeholder="Ex: Corolla"
                                    value={value}
                                    onChangeText={onChange}
                                    error={errors.model?.message}
                                    leftIcon={<Feather name="tag" size={20} color="#6B7280" />}
                                />
                            )}
                        />
                        <Controller
                            control={control}
                            name="year"
                            render={({ field: { onChange, value } }) => (
                                <Input
                                    label="Ano"
                                    placeholder="Ex: 2024"
                                    value={value}
                                    onChangeText={onChange}
                                    error={errors.year?.message}
                                    keyboardType="numeric"
                                    leftIcon={<Feather name="calendar" size={20} color="#6B7280" />}
                                />
                            )}
                        />
                        <Controller
                            control={control}
                            name="color"
                            render={({ field: { onChange, value } }) => (
                                <Input
                                    label="Cor"
                                    placeholder="Ex: Vermelho"
                                    value={value}
                                    onChangeText={onChange}
                                    error={errors.color?.message}
                                    leftIcon={<Feather name="droplet" size={20} color="#6B7280" />}
                                />
                            )}
                        />
                        <Controller
                            control={control}
                            name="licensePlate"
                            render={({ field: { onChange, value } }) => (
                                <Input
                                    label="Placa"
                                    placeholder="Ex: ABC-1234"
                                    value={value}
                                    onChangeText={onChange}
                                    error={errors.licensePlate?.message}
                                    autoCapitalize="characters"
                                    leftIcon={<Feather name="hash" size={20} color="#6B7280" />}
                                />
                            )}
                        />
                        <Controller
                            control={control}
                            name="odometer"
                            render={({ field: { onChange, value } }) => (
                                <Input
                                    label="Odômetro"
                                    placeholder="Ex: 10000"
                                    value={value}
                                    onChangeText={onChange}
                                    error={errors.odometer?.message}
                                    keyboardType="numeric"
                                    leftIcon={<Feather name="activity" size={20} color="#6B7280" />}
                                />
                            )}
                        />
                        <Controller
                            control={control}
                            name="renavam"
                            render={({ field: { onChange, value } }) => (
                                <Input
                                    label="Renavam"
                                    placeholder="Ex: 12345678900"
                                    value={value}
                                    onChangeText={onChange}
                                    error={errors.renavam?.message}
                                    keyboardType="numeric"
                                    leftIcon={<Feather name="file-text" size={20} color="#6B7280" />}
                                />
                            )}
                        />
                    </View>

                    <View style={styles.modalFooter}>
                        <Button
                            title="Cancelar"
                            variant="outline"
                            onPress={onClose}
                            style={tw`flex-1 mr-2`}
                        />
                        <Button
                            title="Salvar"
                            onPress={handleSubmit(onSubmit)}
                            isLoading={isLoading}
                            style={tw`flex-1 ml-2`}
                        />
                    </View>
                </View>
            </View>
        </Modal>
    );
}