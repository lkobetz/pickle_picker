import { createLogger } from "redux-logger";
import { configureStore } from "@reduxjs/toolkit"
import reducer from "@/store/reducer";

createLogger({ collapsed: true });

const store = configureStore({
    reducer,
});

export default store;