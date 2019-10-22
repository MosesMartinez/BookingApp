import {combineReducers} from "redux";
import dateReducer from "./dateReducer";
import appointmentReducer from "./appointmentReducer";

export default combineReducers({
    dateReducer,
    appointmentReducer,
})
