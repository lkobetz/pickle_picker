import _throttle from "lodash.throttle";
import React, { useCallback, useRef } from "react";
import { FlatList, StyleSheet, Dimensions } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useCallAPI } from "@/api/call";
import ImagePreview from "@/app/components/ImagePreview";
import {
  setImages,
  setColumns,
  addImageIds,
} from "@/store/actions";
import { IState } from "@/store/reducer";
import { IItem, IResponseData } from "@/types/types";

interface InheritedProps {
    searchInput: string
}

export default function ImagesLayout(props: InheritedProps): React.ReactElement {
    const columns = useSelector((state: IState) => state.columns);
    const total = useSelector((state: IState) => state.total);
    const stateImages = useSelector((state: IState) => state.images);
    const imageIds = useSelector((state: IState) => state.imageIds);
    const dispatch = useDispatch();
    const { callAPI } = useCallAPI();

  const renderItem = useCallback((props: { item: IItem, index: number }) => {
    return <ImagePreview item={props.item} />;
  }, [])

  const getItemLayout = useCallback((data: ArrayLike<IItem> | null | undefined, index: number) => {
    return {
      length: 100,
      offset: 100 * index,
      index,
    };
  }, []);

  const onLayout = useCallback(() => {
    const { width } = Dimensions.get("window");
    const cols: number = Math.floor(width / 100);
    dispatch(setColumns(cols));
  }, []);

  const flatList: React.RefObject<FlatList> = useRef(null);

  const loadMore = useCallback(async() => {
    if (stateImages.length < total) {
      let results: IResponseData = await callAPI(props.searchInput);
      const itemsToAdd: IItem[] = [];
      const newImageIds: Record<string, string> = {};
      for (let i = 0; i < results.hits.length; i++) {
        if (!imageIds[results.hits[i].previewURL]) {
          itemsToAdd.push(results.hits[i]);
          newImageIds[results.hits[i].id] = results.hits[i].previewURL;
        }
      }
      if (results && itemsToAdd.length > 0) {
        dispatch(addImageIds(newImageIds))
        dispatch(setImages(itemsToAdd));
      }
    }
  }, [total, stateImages.length, dispatch]);

    const throttledLoadMore = _throttle(loadMore, 300, {
    leading: false,
    trailing: true,
    });

    return (
      <FlatList
        onLayout={onLayout}
        ref={flatList}
        horizontal={false}
        numColumns={columns}
        key={columns}
        data={stateImages}
        onEndReached={throttledLoadMore}
        onEndReachedThreshold={0.5}
        renderItem={renderItem}
        getItemLayout={getItemLayout}
        keyExtractor={(item) => String(item.previewURL)}
        contentContainerStyle={styles.imageContainer}
      ></FlatList>
    );
}

const styles = StyleSheet.create({
  imageContainer: {
    alignItems: "center",
  },
});