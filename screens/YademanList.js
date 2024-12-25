import axios from 'axios';
import { View, Text, FlatList, StyleSheet, Modal, Button, Dimensions, TouchableOpacity } from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import RNPickerSelect from 'react-native-picker-select';
import MapView, { Marker } from 'react-native-maps';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ImagePage from './ImagePage';
import ProductionPage from './ProductionPage';
import FilmPage from './FilmPage';
import { Image } from 'expo-image';
const BASE_URL = 'http://194.60.230.36:3000';

const Stack = createNativeStackNavigator();
const YademanListBase = ({ navigation }) => {
  const [Ostanha, setOstanha] = useState([]);
  const [selectedOstan, setSelectedOstan] = useState(null);
  const [Shahrha, setShahrha] = useState([]);
  const [selectedShahr, setSelectedShahr] = useState(null);
  const [Yademanha, setYademanha] = useState([]);
  const [selectedYademan, setSelectedYademan] = useState(null);
  const mapRef = useRef(null);

  const initialRegion = {
    latitude: 35.3824,
    longitude: 47.1362,
    latitudeDelta: 0.5,
    longitudeDelta: 0.5,
  };

  const [selectedMarker, setSelectedMarker] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    axios.get(`${BASE_URL}/all-data`)
      .then(response => {
        const OstanOptions = response.data.uniqueOstanha.map((item) => ({
          label: item.Ostan,
          value: item.Ostan
        }));
        setOstanha(OstanOptions);
      })
      .catch(error => {
        console.error('Error fetching Ostanha:', error);
      });
  }, []);

  const fetchShahrha = (Ostan) => {
    setSelectedOstan(Ostan);
    setSelectedShahr(null);
    setYademanha([]);
    setSelectedYademan(null);

    axios.get(`${BASE_URL}/Shahrha?Ostan=${Ostan}`)
      .then(response => {
        const ShahrOptions = response.data.Shahrha.map((item) => ({
          label: item.Shahr,
          value: item.Shahr
        }));
        setShahrha(ShahrOptions);
      })
      .catch(error => {
        console.error('Error fetching Shahrha:', error);
      });
  };

  const fetchYademanha = (Shahr) => {
    setSelectedShahr(Shahr);
    setSelectedYademan(null);
    if (selectedOstan && Shahr) {
      axios.get(`${BASE_URL}/Yademanha?Ostan=${selectedOstan}&Shahr=${Shahr}`)
      .then(response => {
        setYademanha(response.data.Yademanha);
      })
      .catch(error => {
        console.error('Error fetching Yademanha:', error);
      });
    }
  };

  const handleYademanSelect = (Yademan) => {
    setSelectedYademan(Yademan);
    if (mapRef.current && Yademan.latitude && Yademan.longitude) {
      mapRef.current.animateToRegion({
        latitude: Yademan.latitude,
        longitude: Yademan.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      }, 3000);
    }
  };
  const handleMarkerPress = (Yademan) => {
    setSelectedMarker(Yademan);
    setModalVisible(true);
  };
  const markerSize = 40; // Change this value to resize your markers

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={initialRegion}
      >
        {Yademanha.map((Yademan, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: Yademan.latitude,
              longitude: Yademan.longitude
            }}
            onPress={() => handleMarkerPress({ id: index, name: Yademan.YademanName })}
            title={Yademan.YademanName}
          >
            <View style={{ width: 50, height: 50 }}>
            <Image
              source={selectedYademan && selectedYademan.YademanName === Yademan.YademanName
                ? require('./assets/Hefze-Asar-Logo.png')  // Selected icon
                : require('./assets/green-marker.png')    // Default icon
              }
              style={{ 
                width: '80%',
                height: '80%',
                resizeMode:'contain' 
                }} // Set the size here
            />
                
            </View>
          </Marker>
        ))}
      </MapView>

      <View style={styles.pickerContainer}>
        <View style={styles.picker}>
          <Text>انتخاب استان :</Text>
          <RNPickerSelect
            onValueChange={(value) => fetchShahrha(value)}
            items={Ostanha}
            placeholder={{ label: "انتخاب استان :", value: null }}
            style={pickerSelectStyles}
          />
        </View>

        <View style={styles.picker}>
          <Text>انتخاب شهر :</Text>
          <RNPickerSelect
            onValueChange={(value) => fetchYademanha(value)}
            items={Shahrha}
            placeholder={{ label: selectedOstan ? "انتخاب شهر :" : "یک استان انتخاب کنید، لطفا!", value: null }}
            disabled={!selectedOstan}
            style={pickerSelectStyles}
          />
        </View>

        <View style={styles.YademanListContainer}>
          {selectedShahr ? (
            <>
              <Text>یادمان ها در {selectedOstan} شهر {selectedShahr} :</Text>
              {Yademanha.length === 0 ? (
                <Text>no yademan</Text>
              ) : (
                <FlatList
                  data={Yademanha}
                  keyExtractor={(_item, index) => index.toString()}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.flatListItem}
                      onPress={() => handleYademanSelect(item)}
                    >
                      <Text style={styles.itemText}>{item.YademanName}</Text>
                    </TouchableOpacity>
                  )}
                  ItemSeparatorComponent={() => <View style={styles.separator} />}
                />
              )}
            </>
          ) : (
            <Text>ابتدا استان و سپس شهرستان مورد نظر خود را برای دیدن لیست یادمان ها انتخاب کنید ...</Text>
          )}
        </View>
      </View>
                <Modal visible={modalVisible} transparent={true} animationType="fade">
                    <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>داده های {selectedMarker?.name}</Text>
                    <TouchableOpacity onPress={() => { setModalVisible(false); 
                                      navigation.navigate('ImagePage', { selectedYademan: selectedMarker?.name, selectedOstan, selectedShahr }); }}>
                        <Text style={styles.modalOption}>تصاویر</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { setModalVisible(false); 
                                      navigation.navigate('FilmPage', { selectedYademan: selectedMarker?.name, selectedOstan, selectedShahr }); }}>
                        <Text style={styles.modalOption}>فیلم ها</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { setModalVisible(false); 
                                      navigation.navigate('ProductionPage', { selectedYademan: selectedMarker?.name, selectedOstan, selectedShahr }); }}>
                        <Text style={styles.modalOption}>تولیدات فرهنگی</Text>
                    </TouchableOpacity>
                    <Button title="بستن" onPress={() => setModalVisible(false)} />
                    </View>
                </Modal>
    </View>
    
  );
};

const YademanList = () => {
    return (
      
      <Stack.Navigator>
        <Stack.Screen name="YademanListBase" component={YademanListBase} options={{ title: 'یادمان ها' }} />
        <Stack.Screen name="ImagePage" component={ImagePage} 
          options={{ title: 'تصاویر', 
          headerTitleStyle:{fontSize:20,MarginRight: 20},}} />
        <Stack.Screen name="FilmPage" component={FilmPage} options={{ title: 'فیلم ها' }} />
        <Stack.Screen name="ProductionPage" component={ProductionPage} options={{ title: 'تولیدات' }} />
      </Stack.Navigator>
    
    );
  };
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row'
  },
  pickerContainer: {
    width: Dimensions.get('window').width * 0.35,
    paddingVertical: 20,
    paddingHorizontal: 5,
    backgroundColor: '#e8f5e9',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3, // For Android shadow
  },
  picker: {
    width: '100%',
    height: 60,
    marginBottom: 25,
  },
  YademanListContainer: {
    flex: 1,
    marginTop: 10,
    width: '100%',
    backgroundColor: '#e8f5e9',
  },
  map: {
    width: Dimensions.get('window').width * 0.65,
    height: '100%',
  },
  flatListItem: {
    padding: 15,
    marginVertical: 5,
    marginHorizontal: 1,
    backgroundColor: '#e3f2fd',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    //elevation: 2, // For Android shadow
    //borderColor: '#ddd',
    //borderWidth: 1,
  },
  itemText: {
    fontSize: 12,
    color: '#333',
    fontWeight: '500',
  },
  separator: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 15,
    color: '#fff',
  },
  modalOption: {
    fontSize: 16,
    marginBottom: 10,
    color: '#87ceeb',
  },
});
const pickerSelectStyles = {
  inputIOS: {
    fontSize: 14,
    padding: 10,
    borderWidth: 1,
    borderColor: '#e3f2fd',
    borderRadius: 5,
    color: 'black',
    backgroundColor: 'white',
    
  },
  inputAndroid: {
    fontSize: 8,
    paddingVertical: 18,
    paddingHorizontal: 65,
    borderWidth: 1,
    borderColor: '#e3f2fd',
    borderRadius: 5,
    color: 'blue',
    backgroundColor: '#e3f2fd',
    marginBottom: 15,
    height: 10,
  },
  
};

export default YademanList;
