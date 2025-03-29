import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tour & Travel</Text>
        <Text style={styles.headerSubtitle}>Explore the world with us</Text>
      </View>

      <View style={styles.searchBar}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search destinations..."
        />
      </View>

      <View style={styles.featuredPackages}>
        <Text style={styles.sectionTitle}>Popular Packages</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity 
            style={styles.packageCard}
            onPress={() => navigation.navigate('PackageDetail', { id: 1 })}
          >
            <Image 
              source={require('../assets/manali.jpg')} 
              style={styles.packageImage}
            />
            <Text style={styles.packageTitle}>Manali Package</Text>
            <Text style={styles.packagePrice}>From ₹5,999</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.packageCard}
            onPress={() => navigation.navigate('PackageDetail', { id: 2 })}
          >
            <Image 
              source={require('../assets/goa.jpg')} 
              style={styles.packageImage}
            />
            <Text style={styles.packageTitle}>Goa Package</Text>
            <Text style={styles.packagePrice}>From ₹7,999</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <View style={styles.services}>
        <Text style={styles.sectionTitle}>Our Services</Text>
        <View style={styles.serviceGrid}>
          <TouchableOpacity style={styles.serviceCard}>
            <Icon name="plane" size={24} color="#27ae60" />
            <Text style={styles.serviceTitle}>Flights</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.serviceCard}>
            <Icon name="hotel" size={24} color="#27ae60" />
            <Text style={styles.serviceTitle}>Hotels</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.serviceCard}>
            <Icon name="car" size={24} color="#27ae60" />
            <Text style={styles.serviceTitle}>Transport</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.serviceCard}>
            <Icon name="map-marker" size={24} color="#27ae60" />
            <Text style={styles.serviceTitle}>Activities</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

// Add these new styles to your existing StyleSheet
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    backgroundColor: '#27ae60',
  },
  headerTitle: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#fff',
    marginTop: 5,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    padding: 15,
  },
  featuredPackages: {
    marginVertical: 15,
  },
  packageCard: {
    width: 250,
    marginHorizontal: 10,
    borderRadius: 10,
    backgroundColor: '#fff',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  packageImage: {
    width: '100%',
    height: 150,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  packageTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    padding: 10,
  },
  packagePrice: {
    fontSize: 14,
    color: '#27ae60',
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  searchBar: {
    padding: 15,
  },
  searchInput: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  serviceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 15,
    justifyContent: 'space-between',
  },
  serviceCard: {
    width: '48%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  serviceTitle: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: 'bold',
  },
});