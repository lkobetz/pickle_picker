import { useRouter } from "expo-router";
import React, { PropsWithChildren } from "react";
import { Image, TouchableOpacity, StyleSheet } from "react-native";
import { useDispatch } from "react-redux";
import { IItem } from "@/types/types";
import { setSelectedImage } from "@/store/actions";

export default function ImagePreview({ item }: PropsWithChildren & { item: IItem }): React.ReactElement {
  const router = useRouter();
  const dispatch = useDispatch();

  return (
    <TouchableOpacity
      onPress={() => {
        dispatch(setSelectedImage(item));
        router.push({ pathname: "/single_image" })
      }}
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