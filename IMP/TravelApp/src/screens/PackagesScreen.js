import React from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

const packages = [
  {
    id: '1',
    name: 'Manali Package',
    image: require('../assets/manali.jpg'),
    price: '₹5,999 - ₹8,999',
    description: 'Experience perfect solitude in Manali with this amazing package.',
  },
  {
    id: '2',
    name: 'Goa Package',
    image: require('../assets/goa.jpg'),
    price: '₹7,999 - ₹12,999',
    description: 'Enjoy beaches and nightlife in the party capital of India.',
  },
  // Add more packages
];

export default function PackagesScreen({ navigation }) {
  const renderPackage = ({ item }) => (
    <TouchableOpacity 
      style={styles.packageCard}
      onPress={() => navigation.navigate('PackageDetail', { package: item })}
    >
      <Image source={item.image} style={styles.packageImage} />
      <View style={styles.packageInfo}>
        <Text style={styles.packageName}>{item.name}</Text>
        <Text style={styles.packagePrice}>{item.price}</Text>
        <Text style={styles.packageDescription}>{item.description}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={packages}
        renderItem={renderPackage}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContainer: {
    padding: 15,
  },
  packageCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 15,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  packageImage: {
    width: '100%',
    height: 200,
  },
  packageInfo: {
    padding: 15,
  },
  packageName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  packagePrice: {
    fontSize: 16,
    color: '#27ae60',
    marginBottom: 5,
  },
  packageDescription: {
    fontSize: 14,
    color: '#666',
  },
});