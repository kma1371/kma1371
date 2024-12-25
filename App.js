import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text,ImageBackground ,TouchableOpacity, Button, FlatList, StyleSheet, ScrollView  } from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';
import YademanList from './screens/YademanList.js';

import { Image } from 'expo-image';
import { enableScreens } from 'react-native-screens';
enableScreens();


const Stack = createNativeStackNavigator();
const HomeScreen = ({ navigation }) =>  {
  const [isLoading, setIsLoading] = useState(true);
  

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <View style={styles.splashContainer}>
        <Image
          source={require('./assets/splash.png')} // Adjust path to your image
          style={styles.splashImage}
        />
      </View>
    );
  }

  return (
    <ImageBackground
      source={require('./assets/download.jpg')} // Path to your image
      style={styles.background}
    >
    <View style={styles.container}>
      {/* Header with text and image */}
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>اطلس الکترونیک دفاع مقدس استان کردستان</Text>
        <Image source={require('./assets/images/TopLogoMpage.png')} style={styles.headerImage} />
      </View>

      
      {/* Menu or buttons */}
      <ScrollView contentContainerStyle={styles.menuContainer}>
        <View style={styles.menuContainer}>
          <View style={styles.row}>
          {/* Button 1 with Icon */}
            <TouchableOpacity style={styles.menubutton} onPress={() => navigation.navigate('راهنمای یادمان ها')}>
              <LinearGradient
                colors={['#FF4500', '#FF9E80', '#F5FFFA']} // Gradient colors
                style={styles.menubuttoncolor}
              >
              <Image 
              source={require('./assets/images/pelak.png')} 
              style={styles.buttonImage}
              />
              <Text style={styles.buttonText}>راهنمای یادمان ها</Text>
              </LinearGradient>
            </TouchableOpacity>
            
          </View>
        </View>
      </ScrollView>
      
      {/* Footer */}
      <Text style={styles.footerText}>تمامی حقوق مادی و معنوی این اثر متعلق به ستاد حفظ آثار و نشر ارزش های دفاع مقدس استان کردستان است.</Text>
    </View>
    </ImageBackground>
  );
};

export default function App() {
  
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="خانه">
        <Stack.Screen name="خانه" component={HomeScreen} options={{headerShown: false}}/>
        <Stack.Screen name="راهنمای یادمان ها" component={YademanList} options={{headerShown: false}} />
       </Stack.Navigator>
      
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  splashImage: {
    width: 200,  // Adjust size to fit your image
    height: 200, // Adjust size to fit your image
    contentFit: 'contain',  // Ensures the image fits well within the container
  },
  background: {
    flex: 1,              // Ensures the background covers the whole screen
    contentFit: 'cover',  // Ensures the image covers the screen without stretching
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    //paddingHorizontal: 20,
    //marginTop:0,
    alignItems: 'center'
    //backgroundColor: '#ffffff',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
    marginTop:50,
    backgroundColor: '#93FFE8',
    padding: 10,
    borderRadius: 10,
  },
  headerText: {
    fontSize: 16,
    fontWeight: 'bold',
    //fontFamily: 'B Homa',
    color: 'green',
    marginRight: 10,
    textAlign: 'center',
  },
  headerImage: {
    width: 40,
    height: 40,
  },
  menuContainer: {
    width: '100%',
    justifyContent: 'center',
  },
  menubutton: {
    
    borderRadius: 50,
    
    overflow: 'hidden', 
  },
  menubuttoncolor: {
    flexDirection: 'row', 
    alignItems: 'center',
    justifyContent: 'space-between',
    //backgroundColor: "#007BFF",
    padding: 20,  // Increase padding for a larger button
    width: '95%',  // Full-width button
    height: 80,  // Custom height for large button
    marginVertical: 10,
    marginHorizontal: 10,
    borderRadius: 50,
    width: 300,
  },
  row: {
    flexDirection: 'column',  // Align buttons horizontally
    justifyContent: 'space-around',  // Space between two buttons
    marginBottom: 20,  // Space between rows
  },
  buttonImage: {
    width: 70,  // Image width for the button
    height: 90, // Image height for the button
    //marginRight: 10,
    
  },
  buttonText: {
    color: 'blue',
    fontSize: 20,  // Text size remains consistent across buttons
    textAlign:'right', // Space between icon and text
    //fontFamily: 'times new royal',
  },
  comboBoxContainer: {
    flexDirection: 'row', // Place pickers side by side
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  pickerContainer: {
    alignItems: 'center', // Center label and picker
    width: '45%', // Adjust width for proper spacing
  },
  pickerLabel: {
    fontSize: 16,
    marginBottom: 5, // Space between label and picker
    fontWeight: 'bold',
  },
  pickerStyle: {
    height: 50,
    width: '100%',
  },
  
  footerText: {
    textAlign: 'center',
    fontSize: 10,
    marginBottom: 20,
    color: 'black',
  },
});


