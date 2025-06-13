import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import tw from '@/utils/tailwind';
import { settingsOptionStyles as styles } from './SettingsOption.styles';

interface SettingsOptionProps {
    icon: 'Bell' | 'Lock' | 'HelpCircle' | 'LogOut';
    label: string;
    color: string;
    textColor?: string;
}

const IconComponent = {
    Bell: (props) => <Feather name="bell" {...props} />,
    Lock: (props) => <Feather name="lock" {...props} />,
    HelpCircle: (props) => <Feather name="help-circle" {...props} />,
    LogOut: (props) => <Feather name="log-out" {...props} />,
};

export default function SettingsOption({ icon, label, color, textColor = 'text-gray-900' }: SettingsOptionProps) {
    const Icon = IconComponent[icon];

    return (
        <TouchableOpacity style={styles.container}>
            <View style={[styles.iconContainer, { backgroundColor: `${color}20` }]}>
                {Icon({ size: 20, color })}
            </View>
            <Text style={[styles.label, tw`${textColor}`]}>{label}</Text>
        </TouchableOpacity>
    );
} 