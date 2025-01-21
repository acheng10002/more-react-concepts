import { useState } from "react";
import { useTasksDispatch } from "./TasksContext";

export default function AddTask() {
  const [text, setText] = useState("");
  /* dispatch function used to send actions to the reducer managing
  global state */
  const dispatch = useTasksDispatch();
  return (
    <>
      <input
        placeholder="Add task"
        // binds the input's value to the text state
        value={text}
        // updates the text state whenever the user types in the input
        onChange={(e) => setText(e.target.value)}
      />
      <button
        onClick={() => {
          // when add button is clciked, resets the input field
          setText("");
          // sends an action to add a new task
          dispatch({
            type: "added",
            /* assigns a unique id to the new task and increments nextId
            for next task */
            id: nextId++,
            text: text,
          });
        }}
      >
        Add
      </button>
    </>
  );
}

let nextId = 3;
