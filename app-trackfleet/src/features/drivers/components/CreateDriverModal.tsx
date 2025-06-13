import React, { useEffect, useState } from 'react';
import { View, Text, Modal, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Feather } from '@expo/vector-icons';
import tw from '@/utils/tailwind';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { createDriverModalStyles as styles } from './CreateDriverModal.styles';
import { createDriverSchema } from '@/utils/validation';
import { createDriver } from '@/services/driverService';
import { maskCep, maskCNH, maskPhone } from '@/utils/helpers';
import { z } from 'zod';

interface CreateDriverModalProps {
    visible: boolean;
    onClose: () => void;
    onSave?: () => void;
}

type CreateDriverFormData = z.infer<typeof createDriverSchema>;

export default function CreateDriverModal({ visible, onClose, onSave }: CreateDriverModalProps) {
    const [isLoading, setIsLoading] = useState(false);

    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<CreateDriverFormData>({
        resolver: zodResolver(createDriverSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            cnh: '',
            cnhType: 'B',
            phone: '',
            street: '',
            number: 0,
            district: '',
            zipCode: '',
            city: '',
            state: '',
        },
    });

    useEffect(() => {
        if (Object.keys(errors).length > 0) {
            console.log('Erros de validação:', errors);
        }
    }, [errors]);

    const onSubmit: SubmitHandler<CreateDriverFormData> = async (data) => {
        setIsLoading(true);
        try {
            const payload = {
                ...data,
                phone: data.phone.replace(/\D/g, ''),
                zipCode: data.zipCode.replace(/\D/g, ''),
            };

            await createDriver(payload);
            reset();
            Alert.alert('Sucesso', 'Motorista cadastrado com sucesso!');
            onClose();
            onSave?.();
        } catch (error: any) {
            let apiMessage = 'Não foi possível cadastrar o motorista.';
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
                        <Text style={styles.modalTitle}>Cadastro de Motorista</Text>
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
                                name="email"
                                render={({ field: { onChange, value } }) => (
                                    <Input
                                        label="Email"
                                        placeholder="Ex: joao@exemplo.com"
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
                                name="cnh"
                                render={({ field: { onChange, value } }) => (
                                    <Input
                                        label="CNH"
                                        placeholder="Número da CNH"
                                        value={maskCNH(value || '')}
                                        onChangeText={text => onChange(maskCNH(text))}
                                        error={errors.cnh?.message}
                                        keyboardType="numeric"
                                        maxLength={11}
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
                                        maxLength={15}
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
                                                        value={value ? String(value) : ''}
                                                        onChangeText={text => onChange(Number(text))}
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
                                                maxLength={9}
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