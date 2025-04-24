import React, { useCallback, useRef } from "react";
import { FlatList, StyleSheet, Dimensions } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import _throttle from "lodash.throttle";
import ImagePreview from "@/app/components/ImagePreview";
import { useCallAPI } from "@/api/call";
import {
  setImages,
  setWindowDimensions,
  setColumns,
  addImageIds,
} from "@/store/actions";
import { IItem, IResponseData } from "@/types/types";
import { IState } from "../../store/reducer";

interface InheritedProps {
    searchInput: string
}

export default function AllImages(props: InheritedProps): React.ReactElement {
    const stateWidth = useSelector((state: IState) => state.width);
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
    const oldWidth = stateWidth;
    const { width, height } = Dimensions.get("window");
    dispatch(setWindowDimensions({ width, height }));
    // if this condition is true, device orientation has changed
    if (oldWidth !== width) {
      // calculate new number of columns based on new width
      const cols: number = Math.floor(width / 100);
      dispatch(setColumns(cols));
    }
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