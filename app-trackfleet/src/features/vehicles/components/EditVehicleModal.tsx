import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import tw from '@/utils/tailwind';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { editVehicleModalStyles as styles } from './EditVehicleModal.styles';
import { updateCar } from '@/services/carService';
import { z } from 'zod';
import { editVehicleSchema } from '@/utils/validation';

interface EditVehicleModalProps {
    visible: boolean;
    onClose: () => void;
    vehicleId: string;
    initialData: EditVehicleFormData;
    onSuccess?: () => void;
}

type EditVehicleFormData = z.infer<typeof editVehicleSchema>;

export default function EditVehicleModal({
    visible,
    onClose,
    vehicleId,
    initialData,
    onSuccess,
}: EditVehicleModalProps) {
    const [isLoading, setIsLoading] = useState(false);

    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<EditVehicleFormData>({
        resolver: zodResolver(editVehicleSchema),
        defaultValues: initialData,
    });

    const onSubmit = async (data: EditVehicleFormData) => {
        setIsLoading(true);
        try {
            const payload = {
                ...data,
                year: Number(data.year),
                odometer: Number(data.odometer),
            };
            await updateCar(vehicleId, payload);
            Alert.alert('Sucesso', 'Veículo atualizado com sucesso!');
            reset(data);
            onClose();
            onSuccess?.();
        } catch (error: any) {
            let apiMessage = 'Não foi possível editar o veículo.';
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
                        <Text style={styles.modalTitle}>Editar Veículo</Text>
                        <TouchableOpacity onPress={onClose}>
                            <MaterialCommunityIcons name="close" size={24} color="#6B7280" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.form}>
                        <Controller
                            control={control}
                            name="brand"
                            render={({ field: { onChange, value } }) => (
                                <Input
                                    label="Marca"
                                    placeholder="Ex: Honda"
                                    value={value}
                                    onChangeText={onChange}
                                    error={errors.brand?.message}
                                    leftIcon={<MaterialCommunityIcons name="truck-outline" size={20} color="#6B7280" />}
                                />
                            )}
                        />
                        <Controller
                            control={control}
                            name="model"
                            render={({ field: { onChange, value } }) => (
                                <Input
                                    label="Modelo"
                                    placeholder="Ex: Civic"
                                    value={value}
                                    onChangeText={onChange}
                                    error={errors.model?.message}
                                    leftIcon={<MaterialCommunityIcons name="car" size={20} color="#6B7280" />}
                                />
                            )}
                        />
                        <Controller
                            control={control}
                            name="year"
                            render={({ field: { onChange, value } }) => (
                                <Input
                                    label="Ano"
                                    placeholder="Ex: 2020"
                                    value={value}
                                    onChangeText={onChange}
                                    error={errors.year?.message}
                                    keyboardType="numeric"
                                    leftIcon={<MaterialCommunityIcons name="calendar" size={20} color="#6B7280" />}
                                />
                            )}
                        />
                        <Controller
                            control={control}
                            name="color"
                            render={({ field: { onChange, value } }) => (
                                <Input
                                    label="Cor"
                                    placeholder="Ex: Branco"
                                    value={value}
                                    onChangeText={onChange}
                                    error={errors.color?.message}
                                    leftIcon={<MaterialCommunityIcons name="palette" size={20} color="#6B7280" />}
                                />
                            )}
                        />
                        <Controller
                            control={control}
                            name="licensePlate"
                            render={({ field: { onChange, value } }) => (
                                <Input
                                    label="Placa"
                                    placeholder="Ex: ABC1D23"
                                    value={value}
                                    onChangeText={onChange}
                                    error={errors.licensePlate?.message}
                                    leftIcon={<MaterialCommunityIcons name="license" size={20} color="#6B7280" />}
                                    autoCapitalize="characters"
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
                                    leftIcon={<MaterialCommunityIcons name="counter" size={20} color="#6B7280" />}
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
                                    leftIcon={<MaterialCommunityIcons name="numeric" size={20} color="#6B7280" />}
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
                            title="Salvar alterações"
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