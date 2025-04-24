import React, { useCallback, useRef } from "react";
import { FlatList, StyleSheet, Dimensions } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import _throttle from "lodash.throttle";
import ImagePreview from "@/app/components/ImagePreview";
import { useCallAPI } from "@/api/call";
import {
  setImages,
  setWindowDimensions,
  setScrollRow,
  setPerPage,
  setColumns,
  setScrollRowGoal,
  finishedLoadingImages,
} from "@/store/actions";
import { IItem, initialResponseData, IResponseData } from "@/types/types";
import { IState } from "../../store/reducer";

interface InheritedProps {
    searchInput: string
}

export default function AllImages(props: InheritedProps): React.ReactElement {
    const stateWidth = useSelector((state: IState) => state.width);
    const columns = useSelector((state: IState) => state.columns);
    const scrollRow = useSelector((state: IState) => state.scrollRow);
    const scrollRowGoal = useSelector((state: IState) => state.scrollRowGoal);
    const perPage = useSelector((state: IState) => state.perPage);
    const total = useSelector((state: IState) => state.total);
    const stateImages = useSelector((state: IState) => state.images);
    const allImagesLoaded = useSelector((state: IState) => state.allImagesLoaded);
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
      const prevColumns: number = columns;
      // calculate new number of columns based on new width
      const cols: number = Math.floor(width / 100);
      // calculate row to autoscroll to based on current scrollRow and new number of columns
      const rowToScrollTo = Math.floor(
        (scrollRow * prevColumns) / cols
      );
      dispatch(setColumns(cols));
      dispatch(setScrollRowGoal(rowToScrollTo));
    }
    // call autoScroll outside the condition because onLayout will be called again after the new column number is set
    if (scrollRow !== scrollRowGoal) {
      autoScroll();
    }
  }, []);

  const flatList: React.RefObject<FlatList> = useRef(null);

  const autoScroll = useCallback(() => {
    if (scrollRowGoal) {
      flatList?.current?.scrollToIndex({
        index: scrollRowGoal,
        animated: false,
      });
    }
  }, []);
  
  const handleScroll = useCallback((event: any) => {
    // get y-coordinate of current location
    const currentScrollLocation = event.nativeEvent.contentOffset.y;
    // set the row that the user has currently scrolled to on the state in order to scroll to it on orientation change
    const row = Math.floor(currentScrollLocation / 100);
    dispatch(setScrollRow(row));
  }, []);

  const fetchData = useCallback(async() => {
      const results = await callAPI(
        props.searchInput,
        perPage
      );
      return results;
  }, [props.searchInput, perPage, dispatch]);

  const loadMore = useCallback(async() => {
    if (!allImagesLoaded) {
      let results: IResponseData | undefined = initialResponseData;
      // condition checks if the following page doesn't have fewer than the designated number of images per page...
      if (
        total - stateImages.length >=
        perPage * 2
      ) {
        // setCall(true);
        results = await fetchData();
        /// ...if the following page has fewer images, combine the last two pages into one api call and stop loading more.
      } else {
        // let unique: Record<any, any> = {};
        // let images = stateImages;
        // for (let i = 0; i < images.length; i++) {
        //   if (!unique[images[i].id]) {
        //     unique[images[i].id] = 1;
        //   } else {
        //     unique[images[i].id]++;
        //   }
        // }
        let newPerPage = total - stateImages.length;
        // setCall(true);
        dispatch(setPerPage(newPerPage));
        results = await fetchData();
        if (results && results.hits) {
          dispatch(setImages(results.hits));
          dispatch(finishedLoadingImages());
        }
      }
      if (results && results.hits) {
        // setCall(false);
        dispatch(setImages(results.hits));
      }
    }
  }, [allImagesLoaded, fetchData, total, stateImages.length, perPage, dispatch]);

    const throttledLoadMore = _throttle(loadMore, 300, {
    leading: false,
    trailing: true,
    });

    return (
      <FlatList
        onLayout={onLayout}
        ref={flatList}
        // horizontal={false}
        numColumns={columns}
        key={columns}
        data={stateImages}
        onScroll={(event) => handleScroll(event)}
        onEndReached={throttledLoadMore}
        onEndReachedThreshold={0.5}
        renderItem={renderItem}
        getItemLayout={getItemLayout}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.imageContainer}
      ></FlatList>
    );
}

const styles = StyleSheet.create({
  imageContainer: {
    alignItems: "center",
  },
});