import { Stack } from "expo-router";
import { ReactElement, useState } from "react";
import { Dimensions, Image, StyleSheet, Text, SafeAreaView, View } from "react-native";
import { useSelector } from "react-redux";
import { IState } from "@/store/reducer";
import { IItem } from "@/types/types";

export default function SingleImage(): ReactElement {
    const image = useSelector((state: IState) => state.selectedImage) as IItem;
    const [loading, setLoading] = useState<boolean>(true);
    const { height } = Dimensions.get("window");
    
    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen
                options={{
                    title: `Image by ${image.user}`,
                }}
            />
            { loading && (
                <Text style={styles.loadingText}>Loading...</Text>
            )}
            <Image
              key={image.id}
              style={{ height: height / 2 }}
              source={{ uri: image.largeImageURL }}
              alt="an image"
              resizeMode="contain"
              onLoadEnd={() => setLoading(false)}
            />
            <View style={styles.info}>
                <Text style={styles.text}>User: {image.user}</Text>
                <Text style={styles.text}>Tags: {image.tags}</Text>
                <Text style={styles.text}>
                    Resolution: {image.imageWidth}x{image.imageHeight}
                </Text>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  info: {
    flexDirection: "column",
    margin: 20,
  },
  text: {
    fontSize: 20,
    textAlign: "left",
    marginBottom: 10,
  },
  loadingText: {
    fontSize: 20,
    textAlign: "center",
    marginTop: 20,
  },
});