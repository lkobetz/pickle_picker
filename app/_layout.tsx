import { Stack } from "expo-router";
import { Provider } from "react-redux";
import store from "@/store/index";

export default function RootLayout() {
  return (
    <Provider store={store}>
        <Stack>
            <Stack.Screen name="index" options={{ title: 'Picture Picker' }}/>
            <Stack.Screen name="single_image"/>
        </Stack>
    </Provider>
  );
}