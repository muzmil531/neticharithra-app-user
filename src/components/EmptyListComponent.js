import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const EmptyListComponent = () => {
  return (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No news available</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    color: 'gray',
  },
});

export default EmptyListComponent;
