import React, { useCallback, useState } from "react";
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
} from "@/store/actions";
import ImagesLayout from "@/app/components/ImagesLayout";
import { useCallAPI } from "@/api/call";
import { IResponseData } from "../types/types";
import { IState } from "../store/reducer";

export default function HomeScreen(): React.ReactElement {
  const [searchInput, setSearchInput] = useState<string>('');
  const error = useSelector((state: IState) => state.error);
  const total = useSelector((state: IState) => state.total);
  const dispatch = useDispatch();
  const { callAPI } = useCallAPI()

  const onSubmit = useCallback(async() => {
    dispatch(newSearch());
    let results: IResponseData = await callAPI(searchInput);
    if (!results.totalHits) {
      dispatch(setError(
        `Sorry, we couldn't find any images of ${searchInput}.`
      ));
    } else {
      dispatch(setTotal(results.totalHits));
      dispatch(setError(``));
      dispatch(setImages(results.hits));
    }
  }, [dispatch, searchInput]);

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