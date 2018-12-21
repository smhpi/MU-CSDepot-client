import AppDispatcher from "./AppDispatcher";
import { ActionTypes } from "../constant";

let ServerAction = {
  receiveList(list) {
    console.log("2.in-action");
    AppDispatcher.dispatch({
      actionType: ActionTypes.RECEIVE_LIST,
      list
    });
  }
};

export default ServerAction;
