import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { addVehicleButtonStyles as styles } from './AddVehicleButton.styles';
export default function AddVehicleButton() {
    return (
        <TouchableOpacity style={styles.button}>
            <Feather name="plus" size={24} color="#FFFFFF" />
        </TouchableOpacity>
    );
} 