import React from 'react';
import { Controller, Control, FieldValues, Path, FieldError } from 'react-hook-form';
import Input from '../ui/Input';

interface FormInputProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  placeholder?: string;
  error?: FieldError;
  isPassword?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  keyboardType?: 'default' | 'number-pad' | 'decimal-pad' | 'numeric' | 'email-address' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
}

function FormInput<T extends FieldValues>({
  name,
  control,
  label,
  placeholder,
  error,
  isPassword,
  leftIcon,
  rightIcon,
  keyboardType,
  autoCapitalize,
}: FormInputProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, value } }) => (
        <Input
          label={label}
          placeholder={placeholder}
          onChangeText={onChange}
          onBlur={onBlur}
          value={value?.toString()}
          error={error?.message}
          isPassword={isPassword}
          leftIcon={leftIcon}
          rightIcon={rightIcon}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
        />
      )}
    />
  );
}

export default FormInput;