import { View, Text, StyleSheet, ImageBackground } from "react-native";
import React, { useState } from "react";
import app_colors from "@/constants/app_colors";
import size from "@/constants/size";
import { StatusBar } from "expo-status-bar";
import { TouchableOpacity } from "react-native";
import { color } from "@rneui/base";

const index = () => {
  const [selectedFruit, setSelectedFruit] = useState("Apple");
  const fruits = [
    { name: "Apple", emoji: "🍎" },
    { name: "Banana", emoji: "🍌" },
    { name: "Grapes", emoji: "🍇" },
    { name: "Orange", emoji: "🍊" },
  ];
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Ripe Sense</Text>
      </View>

      <View style={{ alignItems: "center", rowGap: 16, flexGrow: 1 }}>
        <Text
          style={{
            textAlign: "center",
            fontSize: size.lg,
            color: app_colors.dark_blue,
            fontWeight: "200",
          }}
        >
          PICK A FRUIT
        </Text>
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
      </View>

      <View style={{ rowGap: 24, paddingBottom: 24 }}>
        <TouchableOpacity style={[styles.mainButton]}>
          <Text style={[styles.headerText, { color: "white" }]}>
            Take a Picture
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.mainButton, { backgroundColor: app_colors.dark_blue }]}
        >
          <Text style={[styles.headerText, { color: "white" }]}>
            Select from Gallery
          </Text>
        </TouchableOpacity>
      </View>
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
    justifyContent: "center",
    flexDirection: "row",
    columnGap: 6,
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
  },
});

export default index;
