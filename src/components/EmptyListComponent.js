import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const EmptyListComponent = () => {
  const { colors } = useTheme();

  return (
    <View style={[styles.emptyContainer, { backgroundColor: colors.screenBackground }]}>
      <View style={[styles.emptyContent, {
        backgroundColor: colors.cardBackground,
        borderColor: colors.borderLight
      }]}>
        <Text style={[styles.emptyIcon, { color: colors.textTertiary }]}>📰</Text>
        <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>No News Available</Text>
        <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
          Check back later for the latest updates
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingVertical: 40,
  },
  emptyContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 30,
    borderRadius: 12,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    width: '100%',
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 6,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default EmptyListComponent;
