import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Feather } from '@expo/vector-icons';
import tw from '@/utils/tailwind';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { editDriverModalStyles as styles } from './EditDriverModal.styles';
import { updateDriver } from '@/services/driverService';
import { updateDriverSchema } from '@/utils/validation';
import { z } from 'zod';
import { maskCep, maskPhone } from '@/utils/helpers';

type EditDriverFormData = z.infer<typeof updateDriverSchema>;

interface EditDriverModalProps {
    visible: boolean;
    onClose: () => void;
    driverId: string;
    onSuccess?: () => void;
    initialData?: EditDriverFormData;
}

export default function EditDriverModal({
    visible,
    onClose,
    driverId,
    onSuccess,
    initialData
}: EditDriverModalProps) {
    const [isLoading, setIsLoading] = useState(false);

    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<EditDriverFormData>({
        resolver: zodResolver(updateDriverSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            cnh: '',
            cnhType: 'B',
            email: '',
            phone: '',
            street: '',
            number: 0,
            district: '',
            city: '',
            zipCode: '',
            state: '',
        },
    });

    useEffect(() => {
        if (initialData) {
            reset(initialData);
        }
    }, [initialData, reset]);

    const onSubmit = async (data: EditDriverFormData) => {
        setIsLoading(true);
        try {
            const addressFields = ['street', 'number', 'district', 'zipCode', 'city', 'state'];
            const changedFields: any = {};
            const changedAddress: any = {};

            Object.keys(data).forEach((key) => {
                if (data[key] !== initialData?.[key]) {
                    if (addressFields.includes(key)) {
                        changedAddress[key] = key === 'number' ? parseInt(data[key], 10) : data[key];
                    } else {
                        changedFields[key] = data[key];
                    }
                }
            });

            if (Object.keys(changedAddress).length > 0) {
                changedFields.address = changedAddress;
            }

            if (Object.keys(changedFields).length === 0) {
                Alert.alert('Nada alterado', 'Nenhum campo foi modificado.');
                setIsLoading(false);
                return;
            }

            console.log('Payload enviado para updateDriver:', changedFields);

            await updateDriver(driverId, changedFields);
            Alert.alert('Sucesso', 'Motorista atualizado com sucesso!');
            onClose();
            onSuccess?.();
        } catch (error: any) {
            let apiMessage = 'Não foi possível atualizar o motorista.';
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
                        <Text style={styles.modalTitle}>Editar Motorista</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Feather name="x" size={24} color="#6B7280" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView
                        style={styles.scrollView}
                        contentContainerStyle={styles.scrollViewContent}
                        showsVerticalScrollIndicator={false}
                    >
                        <View style={styles.form}>
                            <View style={styles.row}>
                                <View style={styles.halfInput}>
                                    <Controller
                                        control={control}
                                        name="firstName"
                                        render={({ field: { onChange, value } }) => (
                                            <Input
                                                label="Nome"
                                                placeholder="Ex: João"
                                                value={value}
                                                onChangeText={onChange}
                                                error={errors.firstName?.message}
                                                leftIcon={<Feather name="user" size={20} color="#6B7280" />}
                                            />
                                        )}
                                    />
                                </View>
                                <View style={styles.halfInput}>
                                    <Controller
                                        control={control}
                                        name="lastName"
                                        render={({ field: { onChange, value } }) => (
                                            <Input
                                                label="Sobrenome"
                                                placeholder="Ex: Silva"
                                                value={value}
                                                onChangeText={onChange}
                                                error={errors.lastName?.message}
                                            />
                                        )}
                                    />
                                </View>
                            </View>
                            <Controller
                                control={control}
                                name="cnh"
                                render={({ field: { onChange, value } }) => (
                                    <Input
                                        label="CNH"
                                        placeholder="Número da CNH"
                                        value={value}
                                        onChangeText={onChange}
                                        error={errors.cnh?.message}
                                        leftIcon={<Feather name="credit-card" size={20} color="#6B7280" />}
                                    />
                                )}
                            />
                            <Controller
                                control={control}
                                name="cnhType"
                                render={({ field: { onChange, value } }) => (
                                    <View style={styles.cnhTypeContainer}>
                                        <Text style={styles.cnhTypeLabel}>Tipo de CNH</Text>
                                        <View style={styles.cnhTypeButtons}>
                                            {['A', 'B', 'C', 'D', 'E'].map((type) => (
                                                <TouchableOpacity
                                                    key={type}
                                                    style={[styles.cnhTypeButton, value === type && styles.selectedCnhTypeButton]}
                                                    onPress={() => onChange(type)}
                                                >
                                                    <Text style={[styles.cnhTypeButtonText, value === type && styles.selectedCnhTypeButtonText]}>
                                                        {type}
                                                    </Text>
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                    </View>
                                )}
                            />
                            <Controller
                                control={control}
                                name="email"
                                render={({ field: { onChange, value } }) => (
                                    <Input
                                        label="Email"
                                        placeholder="Ex: joao@email.com"
                                        value={value}
                                        onChangeText={onChange}
                                        error={errors.email?.message}
                                        keyboardType="email-address"
                                        leftIcon={<Feather name="mail" size={20} color="#6B7280" />}
                                    />
                                )}
                            />
                            <Controller
                                control={control}
                                name="phone"
                                render={({ field: { onChange, value } }) => (
                                    <Input
                                        label="Telefone"
                                        placeholder="Ex: (11) 99999-9999"
                                        value={maskPhone(value || '')}
                                        onChangeText={text => onChange(maskPhone(text))}
                                        error={errors.phone?.message}
                                        keyboardType="phone-pad"
                                        leftIcon={<Feather name="phone" size={20} color="#6B7280" />}
                                    />
                                )}
                            />

                            <View style={styles.addressCard}>
                                <View style={styles.addressHeader}>
                                    <Feather name="map-pin" size={20} color="#6B7280" />
                                    <Text style={styles.addressTitle}>Endereço</Text>
                                </View>

                                <View style={styles.addressFields}>
                                    <Controller
                                        control={control}
                                        name="street"
                                        render={({ field: { onChange, value } }) => (
                                            <Input
                                                label="Rua"
                                                placeholder="Ex: Rua das Flores"
                                                value={value}
                                                onChangeText={onChange}
                                                error={errors.street?.message}
                                            />
                                        )}
                                    />

                                    <View style={styles.row}>
                                        <View style={styles.halfInput}>
                                            <Controller
                                                control={control}
                                                name="number"
                                                render={({ field: { onChange, value } }) => (
                                                    <Input
                                                        label="Número"
                                                        placeholder="Ex: 123"
                                                        value={value}
                                                        onChangeText={onChange}
                                                        error={errors.number?.message}
                                                        keyboardType="numeric"
                                                    />
                                                )}
                                            />
                                        </View>
                                        <View style={styles.halfInput}>
                                            <Controller
                                                control={control}
                                                name="district"
                                                render={({ field: { onChange, value } }) => (
                                                    <Input
                                                        label="Bairro"
                                                        placeholder="Ex: Centro"
                                                        value={value}
                                                        onChangeText={onChange}
                                                        error={errors.district?.message}
                                                    />
                                                )}
                                            />
                                        </View>
                                    </View>

                                    <View style={styles.row}>
                                        <View style={styles.halfInput}>
                                            <Controller
                                                control={control}
                                                name="city"
                                                render={({ field: { onChange, value } }) => (
                                                    <Input
                                                        label="Cidade"
                                                        placeholder="Ex: São Paulo"
                                                        value={value}
                                                        onChangeText={onChange}
                                                        error={errors.city?.message}
                                                    />
                                                )}
                                            />
                                        </View>
                                        <View style={styles.halfInput}>
                                            <Controller
                                                control={control}
                                                name="state"
                                                render={({ field: { onChange, value } }) => (
                                                    <Input
                                                        label="Estado"
                                                        placeholder="Ex: SP"
                                                        value={value}
                                                        onChangeText={onChange}
                                                        error={errors.state?.message}
                                                        autoCapitalize="characters"
                                                    />
                                                )}
                                            />
                                        </View>
                                    </View>
                                    <Controller
                                        control={control}
                                        name="zipCode"
                                        render={({ field: { onChange, value } }) => (
                                            <Input
                                                label="CEP"
                                                placeholder="Ex: 01000-000"
                                                value={maskCep(value || '')}
                                                onChangeText={text => onChange(maskCep(text))}
                                                error={errors.zipCode?.message}
                                                keyboardType="numeric"
                                            />
                                        )}
                                    />
                                </View>
                            </View>
                        </View>
                    </ScrollView>

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