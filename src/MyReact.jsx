import { useState } from "react";

// both useState and useReducer have updater arguments
export function useReducer(reducer, initialState) {
  /* state updates gets queued to be processed before the next render, batching 
  multiple updates within the same cycle for efficiency */
  const [state, setState] = useState(initialState);

  /* dispatching an action calls a reducer with the current state and the action
    object, then stores the result as the next state */
  function dispatch(action) {
    /* dispatched actions are queued until the next render 
    reducer processes the action and updates the state, and the state change triggers
    a subscription leading to re-renders during the next render cycle
    reducer takes in the current state, s, initialState, and the action object, and 
    it returns the next state based on the action type */
    setState((s) => reducer(s, action));
  }

  return [state, dispatch];
}

/* 1. updating state request another render with the new state value
- but it does not affect the state variable in my already running event handler 

if I need the next state value, I can calculate it manually by calling the reducer,
which returns the next state 

2. React will ignore my update if the next state is equal to the previous state 
- happens when I change an object or an array directly

3. every case branch should copy all of the existing fields when returning the new
state 

4. if my state unexpectedly becomes undefined, I probably forgot to return state in
one of the cases or my action type doesn't match any of the case statements 

5. I'm getting a "too many re-renders" error
- I am unconditionally dispatching an action during render, so my component enters a
loop: render, dispatch( which cases a render), render, dispatch, and so on 

instead of calling the handler during render, I should be passing down an event handler
or an inline function 

only  omponent, initializer, and reducer functions need to be pure, React will never
call my event handlers twice */
