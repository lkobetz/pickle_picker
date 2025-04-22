import React, { useRef, useState } from "react";
import { FlatList, StyleSheet, Dimensions } from "react-native";
import { connect } from "react-redux";
import _throttle from "lodash.throttle";
import ImagePreview from "@/app/components/ImagePreview";
import { callApi } from "@/app/api/call";
import {
  setImages,
  setWindowDimensions,
  setScrollRow,
  incrementPage,
  setPerPage,
  setColumns,
  setScrollRowGoal,
  finishedLoadingImages,
} from "@/app/store/actions";
import { IDimensions, IItem, initialResponseData, IResponseData } from "@/app/types/types";

interface AllImagesProps {
    width: number
    setWindowDimensions: (dimensions: IDimensions) => {}
    columns: number
    setColumns: (cols: number) => {}
    scrollRow: number
    setScrollRow: (row: number) => {}
    setScrollRowGoal: (row: number) => {}
    scrollRowGoal: number
    searchInput: string
    page: number
    perPage: number
    setPerPage: (newPerPage: number) => {}
    total: number
    images: IItem[]
    setImages: (images: IItem[]) => {}
    incrementPage: () => {}
    allImagesLoaded: boolean
    finishedLoadingImages: () => {}
}

export default function AllImages(props: AllImagesProps): React.ReactElement {
  const [call, setCall] = useState<boolean>(false);


  function renderItem (props: { item: IItem, index: number }) {
    return <ImagePreview item={props.item} />;
  }
  function getItemLayout (data: ArrayLike<IItem> | null | undefined, index: number) {
    return {
      length: 100,
      offset: 100 * index,
      index,
    };
  }

  function onLayout() {
    const oldWidth = props.width;
    const { width, height } = Dimensions.get("window");
    props.setWindowDimensions({ width, height });
    // if this condition is true, device orientation has changed
    if (oldWidth !== width) {
      const prevColumns: number = props.columns;
      // calculate new number of columns based on new width
      const cols: number = Math.floor(width / 100);
      // calculate row to autoscroll to based on current scrollRow and new number of columns
      const rowToScrollTo = Math.floor(
        (props.scrollRow * prevColumns) / cols
      );
      props.setColumns(cols);
      props.setScrollRowGoal(rowToScrollTo);
    }
    // call autoScroll outside the condition because onLayout will be called again after the new column number is set
    if (props.scrollRow !== props.scrollRowGoal) {
      autoScroll();
    }
  }

  const flatList: React.RefObject<FlatList> = useRef(null);

  function autoScroll() {
    if (props.scrollRowGoal) {
      flatList?.current?.scrollToIndex({
        index: props.scrollRowGoal,
        animated: false,
      });
    }
  }
  function handleScroll(event: any) {
    // get y-coordinate of current location
    const currentScrollLocation = event.nativeEvent.contentOffset.y;
    // set the row that the user has currently scrolled to on the state in order to scroll to it on orientation change
    const row = Math.floor(currentScrollLocation / 100);
    props.setScrollRow(row);
  }

  async function fetchData() {
    if (!call) {
      const results = await callApi(
        props.searchInput,
        props.page,
        props.perPage
      );
      props.incrementPage();
      return results;
    }
  }
  async function loadMore() {
    if (!props.allImagesLoaded) {
      let results: IResponseData | undefined = initialResponseData;
      // condition checks if the following page doesn't have fewer than the designated number of images per page...
      if (
        props.total - props.images.length >=
        props.perPage * 2
      ) {
        results = await fetchData();
        /// ...if the following page has fewer images, combine the last two pages into one api call and stop loading more.
      } else {
        let unique: Record<any, any> = {};
        let images = props.images;
        for (let i = 0; i < images.length; i++) {
          if (!unique[images[i].id]) {
            unique[images[i].id] = 1;
          } else {
            unique[images[i].id]++;
            console.log("index:", i, "image:", images[i].largeImageURL);
          }
        }
        let newPerPage = props.total - props.images.length;
        setCall(true);
        props.setPerPage(newPerPage);
        results = await fetchData();
        if (results && results.hits) {
          props.setImages(results.hits);
          console.log("final total:", props.images.length);
          props.finishedLoadingImages();
        }
      }
      if (results && results.hits) {
        setCall(false);
        props.setImages(results.hits);
        console.log("all images loaded?", props.allImagesLoaded);
      }
    }
}

    const throttledLoadMore = _throttle(loadMore, 300, {
    leading: false,
    trailing: true,
    });

    console.log(
      "number of images:",
      props.total,
      "images in array:",
      props.images.length,
      "page:",
      props.page
    );

    return (
      <FlatList
        onLayout={onLayout}
        ref={flatList}
        horizontal={false}
        numColumns={props.columns}
        key={props.columns}
        data={props.images}
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

const mapStateToProps = (state, ownProps) => ({
  searchInput: ownProps.searchInput,
  navigation: ownProps.navigation,
  total: state.total,
  perPage: state.perPage,
  images: state.images,
  width: state.width,
  scrollRow: state.scrollRow,
  columns: state.columns,
  page: state.page,
  scrollRowGoal: state.scrollRowGoal,
  allImagesLoaded: state.allImagesLoaded,
});

const mapDispatchToProps = (dispatch) => ({
  setPerPage: (num: number) => dispatch(setPerPage(num)),
  setImages: (images: IItem[]) => dispatch(setImages(images)),
  setWindowDimensions: (dimensions: IDimensions) =>
    dispatch(setWindowDimensions(dimensions)),
  setScrollRow: (position: number) => dispatch(setScrollRow(position)),
  incrementPage: () => dispatch(incrementPage()),
  setColumns: (columns: number) => dispatch(setColumns(columns)),
  setScrollRowGoal: (row: number) => dispatch(setScrollRowGoal(row)),
  finishedLoadingImages: () => dispatch(finishedLoadingImages()),
});

module.exports = connect(mapStateToProps, mapDispatchToProps)(AllImages);

const styles = StyleSheet.create({
  imageContainer: {
    alignItems: "center",
  },
});