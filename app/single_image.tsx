import * as React from "react";
import { Image, StyleSheet, Text, SafeAreaView, View } from "react-native";
import { useSelector } from "react-redux";
import { IItem } from "@/types/types";
import { IState } from "@/store/reducer";

export default function SingleImage(): React.ReactElement {
    const image = useSelector((state: IState) => state.selectedImage) as IItem;
    const height = useSelector((state: IState) => state.height) as number;
    return (
        <SafeAreaView style={styles.container}>
            <Image
                key={image.id}
                style={{ height: height / 2 }}
                source={{ uri: image.largeImageURL }}
                alt="an image"
                resizeMode="contain"
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
  },
  text: {
    fontSize: 20,
    textAlign: "center",
  },
});