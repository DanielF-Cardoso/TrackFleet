import React from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import tw from '@/utils/tailwind';
import { searchBarStyles as styles } from './SearchBar.styles';

interface SearchBarProps {
    searchQuery: string;
    onSearchChange: (text: string) => void;
}

export default function SearchBar({ searchQuery, onSearchChange }: SearchBarProps) {
    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <Feather name="search" size={20} color="#6B7280" style={tw`mr-2`} />
                <TextInput
                    style={styles.input}
                    placeholder="Buscar motoristas..."
                    value={searchQuery}
                    onChangeText={onSearchChange}
                    placeholderTextColor="#6B7280"
                />
            </View>
            <TouchableOpacity style={styles.filterButton}>
                <Feather name="filter" size={20} color="#3B82F6" />
            </TouchableOpacity>
        </View>
    );
} 