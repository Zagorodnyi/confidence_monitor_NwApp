import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";

// Reducers
import reducer from "./reducer";

const middleware = [thunk];


const store = createStore(
    reducer,
    compose(applyMiddleware(...middleware))
);

export default store;
