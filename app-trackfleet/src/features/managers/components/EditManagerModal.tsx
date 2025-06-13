import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Feather } from '@expo/vector-icons';
import tw from '@/utils/tailwind';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { createManagerModalStyles as styles } from './CreateManagerModal.styles';
import { updateManagerSchema } from '@/utils/validation';
import { updateManager } from '@/services/managerService';
import { Picker } from '@react-native-picker/picker';
import { maskCep, maskPhone } from '@/utils/helpers';

type UpdateManagerFormData = z.infer<typeof updateManagerSchema>;

export default function EditManagerModal({
    visible,
    onClose,
    managerId,
    initialData,
    onSuccess,
}: {
    visible: boolean;
    onClose: () => void;
    managerId: string;
    initialData: UpdateManagerFormData;
    onSuccess?: () => void;
}) {
    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<UpdateManagerFormData>({
        resolver: zodResolver(updateManagerSchema),
        defaultValues: initialData,
    });

    const [isLoading, setIsLoading] = React.useState(false);

    const onSubmit: SubmitHandler<UpdateManagerFormData> = async (data) => {
        setIsLoading(true);
        try {
            await updateManager(managerId, data);
            Alert.alert('Sucesso', 'Gestor atualizado com sucesso!');
            onClose();
            onSuccess?.();
        } catch (error: any) {
            let apiMessage = 'Não foi possível atualizar o gestor.';
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
                        <Text style={styles.modalTitle}>Editar Gestor</Text>
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
                                                    <View style={{ marginBottom: 12 }}>
                                                        <Text style={{ fontWeight: '600', color: '#64748B', marginBottom: 4 }}>Estado</Text>
                                                        <View style={{
                                                            borderWidth: 1,
                                                            borderColor: errors.state ? '#EF4444' : '#E2E8F0',
                                                            borderRadius: 6,
                                                            overflow: 'hidden',
                                                            height: 44,
                                                            width: '100%',
                                                            backgroundColor: '#fff',
                                                            justifyContent: 'center',
                                                        }}>
                                                            <Picker
                                                                selectedValue={value}
                                                                onValueChange={onChange}
                                                                style={{ height: 44, color: '#111', textAlign: 'center' }}
                                                            >
                                                                <Picker.Item label="Selecione o estado" value="" />
                                                                <Picker.Item label="AC" value="AC" />
                                                                <Picker.Item label="AL" value="AL" />
                                                                <Picker.Item label="AP" value="AP" />
                                                                <Picker.Item label="AM" value="AM" />
                                                                <Picker.Item label="BA" value="BA" />
                                                                <Picker.Item label="CE" value="CE" />
                                                                <Picker.Item label="DF" value="DF" />
                                                                <Picker.Item label="ES" value="ES" />
                                                                <Picker.Item label="GO" value="GO" />
                                                                <Picker.Item label="MA" value="MA" />
                                                                <Picker.Item label="MT" value="MT" />
                                                                <Picker.Item label="MS" value="MS" />
                                                                <Picker.Item label="MG" value="MG" />
                                                                <Picker.Item label="PA" value="PA" />
                                                                <Picker.Item label="PB" value="PB" />
                                                                <Picker.Item label="PR" value="PR" />
                                                                <Picker.Item label="PE" value="PE" />
                                                                <Picker.Item label="PI" value="PI" />
                                                                <Picker.Item label="RJ" value="RJ" />
                                                                <Picker.Item label="RN" value="RN" />
                                                                <Picker.Item label="RS" value="RS" />
                                                                <Picker.Item label="RO" value="RO" />
                                                                <Picker.Item label="RR" value="RR" />
                                                                <Picker.Item label="SC" value="SC" />
                                                                <Picker.Item label="SP" value="SP" />
                                                                <Picker.Item label="SE" value="SE" />
                                                                <Picker.Item label="TO" value="TO" />
                                                            </Picker>
                                                        </View>
                                                        {errors.state && (
                                                            <Text style={{ color: '#EF4444', fontSize: 12 }}>{errors.state.message}</Text>
                                                        )}
                                                    </View>
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