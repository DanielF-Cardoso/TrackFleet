import { StyleSheet, Dimensions } from 'react-native';
import tw from '@/utils/tailwind';

export const CARD_WIDTH = Math.min(Dimensions.get('window').width - 32, 400);

export const driversStyles = StyleSheet.create({
    header: {
        ...tw`flex-row items-center mb-4`,
    },
    title: {
        ...tw`text-2xl font-bold text-gray-900`,
        fontFamily: 'sans-serif-medium',
    },
    emptyContainer: {
        ...tw`py-10 items-center justify-center`,
    },
    emptyTitle: {
        ...tw`text-lg font-bold text-gray-700`,
        fontFamily: 'sans-serif-medium',
    },
    emptyText: {
        ...tw`text-lg font-bold text-gray-700`,
    },
    emptySubText: {
        ...tw`text-sm text-gray-500 mt-1 text-center`,
    },
    floatingButton: {
        ...tw`absolute right-6 bottom-8 h-14 w-14 rounded-full bg-blue-500 items-center justify-center shadow-lg`,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    detailsScrollContent: {
        ...tw`flex-grow justify-center items-center py-8`,
    },
    detailsCard: {
        width: CARD_WIDTH,
        ...tw`bg-white rounded-xl p-6 items-center shadow-lg`,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 4,
    },
    detailsAvatarContainer: {
        ...tw`items-center mb-3 w-full`,
    },
    detailsAvatarCircle: {
        ...tw`w-24 h-24 rounded-full bg-blue-100 items-center justify-center mb-2 self-center`,
    },
    detailsName: {
        ...tw`text-2xl font-bold text-gray-800 mb-0.5 text-center self-center w-full`,
    },
    detailsStatusRow: {
        ...tw`flex-row items-center justify-center mb-2 w-full`,
    },
    detailsStatus: {
        ...tw`text-sm font-bold text-center`,
    },
    detailsDivider: {
        ...tw`w-full h-px bg-gray-200 my-3.5`,
    },
    detailsSectionTitle: {
        ...tw`text-base font-bold text-blue-500 mb-2 mt-2 self-start`,
    },
    detailsFieldBlock: {
        ...tw`w-full mb-2.5`,
    },
    detailsFieldBlockRow: {
        ...tw`flex-row w-full mb-2.5 gap-3`,
    },
    detailsFieldBlockHalf: {
        ...tw`flex-1`,
    },
    detailsFieldLabel: {
        ...tw`text-sm text-gray-500 font-semibold mb-0.5`,
    },
    detailsFieldValue: {
        ...tw`text-base text-gray-700 font-medium mb-0.5`,
    },
    detailsButtonRow: {
        ...tw`flex-row justify-between w-full mt-4.5 gap-3`,
    },
    detailsActionButton: {
        ...tw`flex-1 flex-row items-center justify-center py-3 rounded-lg`,
    },
    detailsEditButton: {
        ...tw`bg-blue-500`,
    },
    detailsDeleteButton: {
        ...tw`bg-red-500`,
    },
    detailsButtonText: {
        ...tw`text-white font-bold text-base`,
    },
}); 