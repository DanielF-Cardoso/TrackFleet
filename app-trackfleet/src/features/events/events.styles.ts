import tw from '@/utils/tailwind';

export const styles = {
    container: {
        ...tw`flex-1 bg-gray-50`,
    },
    scrollView: {
        ...tw`flex-1`,
    },
    scrollViewContent: {
        ...tw`pt-4`,
    },
    title: {
        ...tw`text-2xl font-bold text-gray-900 ml-4 mb-3 mt-2`,
        fontFamily: 'sans-serif-medium',
    },
    section: {
        ...tw`p-4`,
    },
    sectionTitle: {
        ...tw`text-lg font-bold mb-3 text-gray-900`,
    },
    statsContainer: {
        ...tw`flex-row justify-between px-4 mt-4 gap-3`,
    },
    statCard: {
        ...tw`flex-1 bg-white rounded-xl p-4`,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    statValue: {
        ...tw`text-2xl font-bold text-gray-900 mb-1`,
    },
    statLabel: {
        ...tw`text-sm text-gray-500`,
    },
    activeCarsScroll: {
        ...tw`flex-row`,
    },
    floatingButton: {
        ...tw`absolute right-6 bottom-6 w-14 h-14 rounded-full bg-blue-500 items-center justify-center`,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    searchInput: {
        ...tw`bg-white rounded-lg p-3 mb-4 text-base text-gray-900 border border-gray-200`,
    },
}; 