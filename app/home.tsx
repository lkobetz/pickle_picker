import React, { useCallback, useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useCallAPI } from "@/api/call";
import ImagesLayout from "@/app/components/ImagesLayout";
import {
  setTotal,
  setImages,
  newSearch,
} from "@/store/actions";
import { IState } from "@/store/reducer";
import { IResponseData } from "@/types/types";

export default function HomeScreen(): React.ReactElement {
  const [searchInput, setSearchInput] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const total = useSelector((state: IState) => state.total);
  const dispatch = useDispatch();
  const { callAPI } = useCallAPI()

  const onSubmit = useCallback(async() => {
    setError('');
    setLoading(true);
    dispatch(newSearch());
    let results: IResponseData = await callAPI(searchInput);
    if (!results.totalHits) {
      setError(
        `Sorry, we couldn't find any images of ${searchInput}.`
      );
      setLoading(false);
    } else {
      dispatch(setTotal(results.totalHits));
      setError(``);
      dispatch(setImages(results.hits));
    }
  }, [dispatch, searchInput]);

  useEffect(() => {
    if (total > 0) {
      setLoading(false);
    }
  }, [total]);

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
        {loading && <Text style={styles.infoText}>Loading...</Text>}
        {!!error && <Text style={styles.infoText}>{error}</Text>}
        {!error && total > 0 && !loading && (
          <ImagesLayout
            searchInput={searchInput}
          />
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
  infoText: {
    alignSelf: "center",
    margin: 5,
    fontSize: 16,
  },
});