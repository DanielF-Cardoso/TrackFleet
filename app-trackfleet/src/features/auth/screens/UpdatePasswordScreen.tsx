import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Lock, ArrowLeft, Eye, EyeOff } from 'lucide-react-native';
import {
  updatePasswordSchema,
  UpdatePasswordFormData,
} from '../utils/validation';
import { simulateUpdatePassword } from '../data/mockData';
import { useToast } from '../hooks/useToast';
import FormInput from '../components/forms/FormInput';
import Button from '../components/ui/Button';
import tw from '../utils/tailwind';

export default function UpdatePasswordScreen() {
  const router = useRouter();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdatePasswordFormData>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: UpdatePasswordFormData) => {
    setIsLoading(true);
    setUpdateError(null);

    try {
      await simulateUpdatePassword(data.currentPassword, data.newPassword);
      showToast({
        type: 'success',
        message: 'Password updated successfully',
      });
      router.back();
    } catch (error) {
      setUpdateError('Current password is incorrect');
      showToast({
        type: 'error',
        message: 'Failed to update password',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.header}>
            <TouchableWithoutFeedback onPress={() => router.back()}>
              <View style={styles.backButton}>
                <ArrowLeft size={24} color="#000000" />
              </View>
            </TouchableWithoutFeedback>
            <Text style={styles.title}>Update Password</Text>
            <View style={styles.placeholder} />
          </View>

          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.subtitle}>
              Enter your current password and a new password to update
            </Text>

            {updateError && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{updateError}</Text>
              </View>
            )}

            <View style={styles.formContainer}>
              <FormInput
                control={control}
                name="currentPassword"
                label="Current Password"
                placeholder="Enter current password"
                error={errors.currentPassword}
                isPassword={true}
                leftIcon={<Lock size={20} color="#6B7280" />}
              />

              <FormInput
                control={control}
                name="newPassword"
                label="New Password"
                placeholder="Enter new password"
                error={errors.newPassword}
                isPassword={true}
                leftIcon={<Lock size={20} color="#6B7280" />}
              />

              <FormInput
                control={control}
                name="confirmPassword"
                label="Confirm Password"
                placeholder="Confirm new password"
                error={errors.confirmPassword}
                isPassword={true}
                leftIcon={<Lock size={20} color="#6B7280" />}
              />

              <View style={styles.buttonsContainer}>
                <Button
                  title="Cancel"
                  variant="outline"
                  onPress={() => router.back()}
                  style={styles.cancelButton}
                />
                <Button
                  title="Update Password"
                  onPress={handleSubmit(onSubmit)}
                  isLoading={isLoading}
                  style={styles.updateButton}
                />
              </View>

              <View style={styles.hint}>
                <Text style={styles.hintText}>
                  Hint: For demo purposes, use "password123" as the current password
                </Text>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    ...tw`flex-1 bg-white`,
  },
  safeArea: {
    ...tw`flex-1`,
  },
  header: {
    ...tw`flex-row items-center justify-between p-4 border-b border-gray-200`,
  },
  backButton: {
    ...tw`p-2`,
  },
  title: {
    ...tw`text-xl font-bold text-gray-900`,
  },
  placeholder: {
    ...tw`w-10`,
  },
  scrollContent: {
    ...tw`p-6`,
  },
  subtitle: {
    ...tw`text-base text-gray-500 mb-6`,
  },
  errorContainer: {
    ...tw`bg-red-50 p-3 rounded-lg mb-4`,
  },
  errorText: {
    ...tw`text-sm text-red-700 text-center`,
  },
  formContainer: {
    ...tw``,
  },
  buttonsContainer: {
    ...tw`flex-row justify-between mt-6`,
  },
  cancelButton: {
    ...tw`flex-1 mr-2`,
  },
  updateButton: {
    ...tw`flex-1 ml-2`,
  },
  hint: {
    ...tw`mt-6 p-3 bg-gray-50 rounded-lg`,
  },
  hintText: {
    ...tw`text-xs text-gray-500 text-center`,
  },
});