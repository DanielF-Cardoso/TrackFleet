import React, { useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  StatusBar,
} from 'react-native';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { loginSchema, LoginFormData } from '@/utils/validation';
import Button from '@/components/ui/Button';
import FormInput from '@/components/forms/FormInput';
import FadeInView from '@/components/ui/FadeInView';
import { loginStyles as styles } from '@/features/auth/screens/login.styles';
import { router } from 'expo-router';

export default function LoginScreen() {
  const { login, isLoading } = useAuth();
  const { showToast } = useToast();
  const [loginError, setLoginError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setLoginError(null);
    try {
      await login(data.email, data.password);
    } catch (error: any) {
      setLoginError(error.message || 'Credenciais inválidas ou gestor inativo');
      showToast({
        type: 'error',
        message: error.message || 'O login falhou. Tente novamente.',
      });
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <StatusBar barStyle="dark-content" />
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.content}>
            <FadeInView delay={100} style={styles.header}>
              <View style={styles.logoContainer}>
                <Feather name="truck" size={40} color="#ffffff" />
              </View>
              <Text style={styles.logoText}>TrackFleet</Text>
              <Text style={styles.logoSubText}>
                Gerencie sua frota com facilidade
              </Text>
            </FadeInView>

            <View style={styles.formContainer}>
              {loginError && (
                <FadeInView style={styles.errorContainer} delay={100}>
                  <Text style={styles.errorText}>{loginError}</Text>
                </FadeInView>
              )}

              <FadeInView delay={300} style={styles.inputContainer}>
                <FormInput
                  control={control}
                  name="email"
                  label="Endereço de e-mail"
                  placeholder="seu@email.com"
                  error={errors.email}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  leftIcon={<Feather name="mail" size={20} color="#4B5563" />}
                />
              </FadeInView>

              <FadeInView delay={400} style={styles.inputContainer}>
                <FormInput
                  control={control}
                  name="password"
                  label="Senha"
                  placeholder="••••••••"
                  error={errors.password}
                  isPassword={true}
                  leftIcon={<Feather name="lock" size={20} color="#4B5563" />}
                />
              </FadeInView>

              <FadeInView delay={500} style={styles.buttonContainer}>
                <Button
                  title="Entrar"
                  onPress={handleSubmit(onSubmit)}
                  isLoading={isLoading}
                  fullWidth
                  style={styles.button}
                />
              </FadeInView>

              <FadeInView delay={600} style={styles.passwordContainer}>
                <Text style={styles.passwordText}>
                  Esqueceu sua senha?
                </Text>
                <Text style={styles.passwordInfo}>
                  Entre em contato com o gestor da sua empresa
                </Text>
              </FadeInView>
            </View>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}