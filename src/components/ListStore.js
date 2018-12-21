import AppDispatcher from "./AppDispatcher";
import { ActionTypes } from "../constant";
import { EventEmitter } from "events";

let _list = [];

class ListStore extends EventEmitter {
  constructor(props) {
    super(props);
    AppDispatcher.register(action => {
      switch (action.actionTypes) {
        case ActionTypes.RECEIVE_LIST:
          _list = action.list;
          this.emit("change");
          break;
        default:
      }
    });
  }
  getAll() {
    return _list;
  }
}

export default new ListStore();
