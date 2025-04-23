import React, { PropsWithChildren } from "react";
import { Image, TouchableOpacity, StyleSheet } from "react-native";
import { IItem } from "@/types/types";

export default function ImagePreview({ item }: PropsWithChildren & { item: IItem }): React.ReactElement {

  return (
    <TouchableOpacity
      // onPress={() =>
      //   navigation.navigate("SingleImage", {
      //     item: item,
      //   })
      // }
    >
      <Image
        key={item.id}
        style={styles.singleImage}
        source={{ uri: item.previewURL }}
        alt="an image"
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  singleImage: {
    height: 100,
    width: 100,
    margin: 2,
  },
});