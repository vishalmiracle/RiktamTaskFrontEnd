import React, { ComponentProps, Dispatch } from "react";
import { Global, User } from "../../Utils/types";

export enum ActionType {
  SET_CURRENT_USER = "setCurrentUser",
  SET_GROUP_NAME = "setGroupName",
  SET_USERS = "setUser",
  SET_AUTHENTICATION = "setAuthentication",
}

export class ReducerPayload {
  currentUser?: User;
  groupName?: String;
  validSession?: boolean;
  lastGlobalStateUpdate?: Date | undefined;
}

type ContextType = [
  Global,
  Dispatch<{ type: ActionType; payload?: ReducerPayload }>
];
const GlobalContext = React.createContext<ContextType>([
  new Global(),
  {} as Dispatch<{ type: ActionType; payload?: ReducerPayload }>,
]);

function saveState(state: Global) {
  sessionStorage.setItem("GlobalContext", JSON.stringify(state));
  return state;
}

function loadState() {
  const savedContext = sessionStorage.getItem("GlobalContext");
  var parsingSavedContext = savedContext
    ? JSON.parse(savedContext)
    : initialGlobalState();
  parsingSavedContext.loadingFlag = false;

  return parsingSavedContext;
}
function initialGlobalState(): Global {
  return new Global();
}
function GlobalProvider(props: ComponentProps<any>) {
  function GlobalReducer(
    state: Global,
    action: { type: ActionType; payload?: ReducerPayload }
  ): Global {
    let noMatch = false;
    switch (action.type) {
      case ActionType.SET_CURRENT_USER:
        if (action.payload?.currentUser?.userId) {
          return saveState({
            ...state,
            currentUser: action.payload?.currentUser as User,
          });
        }
        break;

      case ActionType.SET_GROUP_NAME:
        if (action?.payload?.groupName)
          return saveState({ ...state, groupName: action?.payload?.groupName });
        break;
      case ActionType.SET_AUTHENTICATION:
        return saveState({
          ...state,
          validSession: action?.payload?.validSession,
        });
      default:
        noMatch = true;
        break;
    }
    if (!noMatch) {
      return saveState({
        ...state,
        lastGlobalStateUpdate: new Date(),
      });
    } else {
      return saveState({ ...state });
    }
  }

  const [state, dispatch] = React.useReducer(GlobalReducer, loadState());

  return (
    <GlobalContext.Provider value={[state, dispatch]}>
      {props.children}
    </GlobalContext.Provider>
  );
}

export { GlobalProvider, GlobalContext };
