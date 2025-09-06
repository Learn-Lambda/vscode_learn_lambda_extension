// import { FunctionalComponent } from "preact";

// import { Authorization } from "../../features/authorization/authorization";
// import { Tasks } from "../../features/tasks/tasks";

// import { match } from "ts-pattern";
// import { observer } from "mobx-preact";
// import { createStore } from "redux";
// import { useDispatch, useSelector } from "react-redux";
// import { State, store } from "../..";
// export enum Router {
//   loading,
//   authorization,
//   tasks,
// }

 

// export const App: FunctionalComponent = observer(() => {
//   const stateStatus = useSelector((state: State) => state.count);
//   const dispatch = useDispatch<typeof store.dispatch>();

//   return (
    
//     <div>
//       {match(stateStatus ?? "")
//         .with(Router.loading, () => <>loading</>)
//         .with(Router.authorization, () => <Authorization />)
//         .with(Router.tasks, () => <Tasks />)
//         .otherwise(() => {
//           return <></>;
//         })}
//       <div onClick={()=>     dispatch({ type: "INCREMENT" })} style={{ color: "white" }}>click</div>
//     </div>
//   );
// });
