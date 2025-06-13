import { StyleSheet } from 'react-native';
import tw from '@/utils/tailwind';

export const dashboardStyles = StyleSheet.create({
    container: {
        ...tw`flex-1 bg-gray-50`,
    },
    scrollView: {
        ...tw`flex-1 px-4`,
    },
    header: {
        ...tw`flex-row justify-between items-center mt-4 mb-6`,
    },
    greeting: {
        ...tw`text-base text-gray-600`,
        fontFamily: 'sans-serif',
    },
    username: {
        ...tw`text-2xl font-bold text-gray-900`,
        fontFamily: 'sans-serif-medium',
    },
    date: {
        ...tw`bg-primary-50 px-3 py-1 rounded-full`,
    },
    dateText: {
        ...tw`text-sm font-medium text-primary-700`,
        fontFamily: 'sans-serif-medium',
    },
    sectionTitle: {
        ...tw`text-lg font-bold text-gray-900 mb-3`,
        fontFamily: 'sans-serif-medium',
    },
    statsContainer: {
        ...tw`flex-row justify-between mb-6`,
    },
    section: {
        ...tw`mb-6`,
    },
    activeCarsScroll: {
        ...tw`px-4`,
    },
    recentSection: {
        ...tw`mb-6`,
    },
    sectionHeader: {
        ...tw`flex-row justify-between items-center mb-3`,
    },
    seeAllText: {
        ...tw`text-primary-600 font-medium`,
        fontFamily: 'sans-serif-medium',
    },
    addButton: {
        ...tw`flex-row justify-center items-center bg-primary-500 py-3 px-4 rounded-lg`,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    addButtonText: {
        ...tw`text-white font-medium mr-2`,
        fontFamily: 'sans-serif-medium',
    },
    bottomSpacer: {
        ...tw`h-8`,
    },
});