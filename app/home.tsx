import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  StyleSheet,
  Text,
  TextInput,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
  View,
} from "react-native";
import {
  setTotal,
  setError,
  setImages,
  newSearch,
  incrementPage,
} from "@/store/actions";
import ImagesLayout from "@/app/components/ImagesLayout";
import { callApi } from "@/api/call";
import { IResponseData } from "../types/types";
import { IState } from "../store/reducer";

export default function HomeScreen(): React.ReactElement {
  const [searchInput, setSearchInput] = useState<string>('');
  const page = useSelector((state: IState) => state.page);
  const perPage = useSelector((state: IState) => state.perPage);
  const error = useSelector((state: IState) => state.error);
  const total = useSelector((state: IState) => state.total);
  const dispatch = useDispatch();

  async function fetchData() {
    const results = await callApi(
      searchInput,
      page,
      perPage
    );
    dispatch(incrementPage());
    return results;
  }
  async function onSubmit() {
    dispatch(newSearch());
    let results: IResponseData = await fetchData();
    if (!results.totalHits) {
      dispatch(setError(
        `Sorry, we couldn't find any images of ${searchInput}.`
      ));
    } else {
      dispatch(setTotal(results.totalHits));
      dispatch(setError(``));
      dispatch(setImages(results.hits));
    }
  }
  console.log('rendering home')
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.inputContainer}
            placeholder="Search for an image..."
            onChangeText={(value) => setSearchInput(value)}
          />
          <TouchableOpacity style={styles.button} onPress={onSubmit}>
            <Text>Search</Text>
          </TouchableOpacity>
        </View>
        {!error && total > 0 ? (
          <ImagesLayout
            // navigation={props.navigation}
            searchInput={searchInput}
          />
        ) : (
          <Text style={styles.error}>{error}</Text>
        )}
      </SafeAreaView>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  inputContainer: {
    height: 40,
    width: Dimensions.get("window").width / 1.7,
    borderColor: "gray",
    borderWidth: 1,
    marginHorizontal: 10,
    marginVertical: 10,
  },
  button: {
    alignSelf: "center",
    padding: 5,
    backgroundColor: "lightgray",
    marginHorizontal: 10,
  },
  error: {
    alignSelf: "center",
    margin: 5,
  },
});