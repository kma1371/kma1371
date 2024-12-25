import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Pressable,
  useWindowDimensions,
} from 'react-native';
import axios from 'axios';
import { Image } from 'expo-image';
const BASE_URL = 'http://194.60.230.36:3000';
const ImagePage = ({ route }) => {
  const { selectedOstan, selectedShahr, selectedYademan } = route.params;
  const [images, setImages] = useState([]);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null); // For modal
  const [isModalVisible, setIsModalVisible] = useState(false); // Modal visibility
  const { width, height } = useWindowDimensions(); // Dynamic screen dimensions

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/images/${selectedOstan}/${selectedShahr}/${selectedYademan}`
        );
        setImages(response.data.images);
      } catch (err) {
        console.error('خطا در بارگذاری پوشه تصاویر ...');
        setError('مشکل در آماده سازی پوشه عکس ها : لطفا در بخش تماس با ما اطلاع رسانی کنید ...');
      }
    };

    fetchImages();
  }, [selectedOstan, selectedShahr, selectedYademan]);

  const openModal = (image) => {
    setSelectedImage(image);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setSelectedImage(null);
  };

  return (
    <View
      style={[
        styles.container,
        width > 600 ? styles.containerWide : styles.containerNormal, // Adjust layout based on width
      ]}
    >
      <Text style={styles.title}>تصاویر {selectedYademan}</Text>
      {error ? (
        <Text style={styles.error}>{error}</Text>
      ) : images.length > 0 ? (
        <FlatList
          data={images}
          keyExtractor={(item, index) => index.toString()}
          numColumns={width > 600 ? 3 : 1} // More columns for wider screens
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => openModal(item)}>
              <Image
                source={{ uri: `${BASE_URL}${item}` }}
                style={[
                  styles.image,
                  width > 600 ? styles.imageWide : styles.imageNormal, // Adjust image size
                ]}
              />
            </TouchableOpacity>
          )}
        />
      ) : (
        <Text style={styles.noImages}>هیچ تصویری برای این یادمان ثبت نشده است ...</Text>
      )}

      {/* Modal for showing selected image */}
      <Modal visible={isModalVisible} transparent={true} animationType="fade">
        <View style={styles.modalContainer}>
          <Pressable style={styles.modalBackdrop} onPress={closeModal} />
          <View style={styles.modalContent}>
            {selectedImage && (
              <Image
                source={{ uri: `${BASE_URL}${selectedImage}` }}
                style={[
                  styles.modalImage,
                  { width: width * 0.8, height: height * 0.6 }, // Dynamically resize based on screen
                ]}
              />
            )}
            <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  containerWide: {
    flexDirection: 'row', // Arrange items in rows for wide screens
    justifyContent: 'space-between',
  },
  containerNormal: {
    flexDirection: 'column', // Arrange items in columns for normal screens
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'right',
  },
  error: {
    fontSize: 16,
    color: 'red',
  },
  noImages: {
    fontSize: 16,
    color: '#999',
  },
  image: {
    marginBottom: 16,
    borderRadius: 8,
  },
  imageNormal: {
    width: '100%',
    height: 200,
    contentFit: 'cover',
  },
  imageWide: {
    width: '30%', // Use 30% width for wide screens
    height: 200,
    contentFit: 'cover',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Semi-transparent background
  },
  modalBackdrop: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5, // Shadow for Android
  },
  modalImage: {
    borderRadius: 8,
    contentFit: 'contain',
  },
  closeButton: {
    marginTop: 16,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#333',
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ImagePage;
