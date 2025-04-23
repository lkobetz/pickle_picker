// import { applyMiddleware } from "redux";
// import { createLogger } from "redux-logger";
import { configureStore } from "@reduxjs/toolkit"
import reducer from "@/store/reducer";

// const middleware = applyMiddleware();
// createLogger({ collapsed: true });

const store = configureStore({
    reducer,
    // middleware,
});

export default store;