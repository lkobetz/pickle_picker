import { Stack } from "expo-router";
import { Provider } from "react-redux";
import store from "@/store/index";

export default function RootLayout() {
  return (
    <Provider store={store}>
        <Stack>
            {/* <Stack.Screen name="(blah)"/> */}
        </Stack>
    </Provider>
  );
}