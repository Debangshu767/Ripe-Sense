import { View, Text, StyleSheet, ImageBackground, Alert } from "react-native";
import React, { useState } from "react";
import app_colors from "@/constants/app_colors";
import size from "@/constants/size";
import { StatusBar } from "expo-status-bar";
import { TouchableOpacity } from "react-native";
import { color } from "@rneui/base";
import * as ImagePicker from "expo-image-picker";
import { Image } from "react-native";
import axios from "axios";
import LottieView from "lottie-react-native";

const index = () => {
  const [selectedFruit, setSelectedFruit] = useState("Banana");
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const fruits = [
    { name: "Banana", emoji: "🍌" },
    { name: "Apple", emoji: "🍎" },
    { name: "Grapes", emoji: "🍇" },
    { name: "Orange", emoji: "🍊" },
  ];
  const [image, setImage] = useState(null);

  const predictImage = async (imgUri) => {
    console.log("image : ", imgUri);
    const photo = imgUri;
    const formData = new FormData();
    try {
      setLoading(true);
      const imageData = new FormData();

      const result = await fetch(photo?.uri);
      const data = await result.blob();
      console.log(data);
      imageData.append("file", {
        name: data._data.name,
        uri: photo?.uri,
        type: data._data.type,
        fileName: data._data.name,
      });

      const res = await axios.post(
        "https://d37c-34-168-37-217.ngrok-free.app/predict",
        // http://localhost:9000
        imageData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (res.status == 200) {
        console.log("prediction : ", res.data);
        setPrediction(res.data);
      }
    } catch (error) {
      Alert.alert("Error in fetching data", error?.toString());
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const openCamera = async () => {
    // Ask the user for the permission to access the camera
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("You've refused to allow this appp to access your camera!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync();

    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Ripe Sense</Text>
      </View>

      <View style={{ alignItems: "center", rowGap: 16, flexGrow: 1 }}>
        {/* <Text
          style={{
            textAlign: "center",
            fontSize: size.lg,
            color: app_colors.dark_blue,
            fontWeight: "200",
          }}
        >
          Pick a Fruit
        </Text> */}
        <View style={styles.fruitToggleContainer}>
          {fruits.map((fruit, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.fruitItem,
                selectedFruit === fruit.name && {
                  backgroundColor: app_colors.greyish_blue,
                },
              ]}
              onPress={() => setSelectedFruit(fruit.name)}
            >
              <Text style={styles.fruitEmoji}>{fruit.emoji}</Text>
              <Text
                style={[
                  styles.fruitName,
                  selectedFruit === fruit.name && {
                    color: "white",
                  },
                ]}
              >
                {fruit.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {selectedFruit != "Banana" && (
          <View>
            <LottieView
              source={require("../assets/animations/Working.json")}
              style={{ height: 400, width: 400 }}
              autoPlay
              loop
            />
            <Text
              style={[
                styles.headerText,
                {
                  marginTop: -80,
                  color: app_colors.dark_blue,
                  fontWeight: "300",
                  fontSize: size.md,
                  paddingHorizontal: 16,
                  alignItems: "center",
                  textAlign: "center",
                },
              ]}
            >
              We are working very hard to bring predictions for other fruits.
            </Text>
            <Text
              style={[
                styles.headerText,
                {
                  color: app_colors.dark_blue,
                  fontWeight: "800",
                  fontSize: size.lg,
                  paddingHorizontal: 16,
                  alignItems: "center",
                  textAlign: "center",
                },
              ]}
            >
              STAY TUNED!
            </Text>
          </View>
        )}
      </View>

      {image && prediction == null && selectedFruit === "Banana" && (
        <View style={{ rowGap: 24, paddingBottom: 24 }}>
          {loading ? (
            <LottieView
              source={require("../assets/animations/Loading.json")}
              style={{ height: 250, width: "100%" }}
              autoPlay
              loop
            />
          ) : (
            <Image source={{ uri: image.uri }} style={styles.image} />
          )}
          <TouchableOpacity
            onPress={() => {
              predictImage(image);
            }}
            style={[styles.mainButton, { backgroundColor: app_colors.accent }]}
          >
            <Text style={[styles.headerText, { color: "white" }]}>
              Predict Ripeness
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setImage(null);
            }}
            style={[
              styles.mainButton,
              { backgroundColor: app_colors.dark_blue },
            ]}
          >
            <Text style={[styles.headerText, { color: "white" }]}>
              Select a different picture
            </Text>
          </TouchableOpacity>
        </View>
      )}
      {image === null && prediction === null && selectedFruit === "Banana" && (
        <View style={{ rowGap: 24, paddingBottom: 24 }}>
          <TouchableOpacity onPress={openCamera} style={[styles.mainButton]}>
            <Text style={[styles.headerText, { color: "white" }]}>
              Take a Picture
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={pickImage}
            style={[
              styles.mainButton,
              { backgroundColor: app_colors.dark_blue },
            ]}
          >
            <Text style={[styles.headerText, { color: "white" }]}>
              Select from Gallery
            </Text>
          </TouchableOpacity>
        </View>
      )}
      {image && prediction && selectedFruit === "Banana" && (
        <View style={{ rowGap: 24, paddingBottom: 24 }}>
          <Image source={{ uri: image.uri }} style={styles.image} />
          <View
            style={{
              flexDirection: "row",
              columnGap: 4,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={[{ fontSize: size.md, color: app_colors.neutral_dark }]}
            >
              {`The ${selectedFruit} is `}
            </Text>
            <Text
              style={{
                fontSize: size.xl,
                fontWeight: "800",
                color:
                  prediction.predicted_class === "unripe"
                    ? app_colors.primary
                    : prediction.predicted_class === "ripe"
                    ? "orange"
                    : "red",
              }}
            >
              {prediction.predicted_class.toUpperCase()}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              setPrediction(null);
              setImage(null);
            }}
            style={[
              styles.mainButton,
              { backgroundColor: app_colors.dark_blue },
            ]}
          >
            <Text style={[styles.headerText, { color: "white" }]}>
              Try Again
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 16,
    backgroundColor: "white",
    rowGap: 24,
  },
  header: {
    padding: 24,
    paddingBottom: 36,
    backgroundColor: "white",
    elevation: 1,
    justifyContent: "center",
  },
  headerText: {
    fontSize: size.lg,
    fontWeight: "200",
    color: app_colors.neutral_dark,
  },
  fruitToggleContainer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    columnGap: 12,
    rowGap: 12,
    flexWrap: "wrap",
  },
  fruitItem: {
    flexDirection: "column",
    alignItems: "center",
    rowGap: 12,
    padding: 12,
    borderRadius: 16,
    elevation: 2,
    backgroundColor: "white",
  },
  fruitEmoji: {
    textAlign: "center",
    fontSize: size.xxl,
  },
  fruitName: {
    textAlign: "center",
    fontWeight: "300",
    color: app_colors.neutral_dark,
  },
  mainButton: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    backgroundColor: app_colors.accent,
    alignItems: "center",
    marginHorizontal: 16,
    borderRadius: 24,
    elevation: 2,
  },
  image: {
    alignSelf: "center",
    width: 300,
    height: 250,
    borderRadius: 24,
  },
});

export default index;
