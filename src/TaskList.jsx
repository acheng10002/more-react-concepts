import { useState } from "react";
import { useTasks, useTasksDispatch } from "./TasksContext";

export default function TaskList() {
  // retrieves the current list of tasks from the context
  const tasks = useTasks();
  return (
    <ul>
      {/* iterates over tasks array, creates a li lement with a key,
      and renders the Tasks component, passing the task object as a prop */}
      {tasks.map((task) => (
        <li key={task.id}>
          <Task task={task} />
        </li>
      ))}
    </ul>
  );
}

// task object passed as prop from the parent TaskList
function Task({ task }) {
  const [isEditing, setIsEditing] = useState(false);
  // retrieves dispatch function to manage state updates
  const dispatch = useTasksDispatch();
  let taskContent;
  if (isEditing) {
    // renders either an editable input field
    taskContent = (
      <>
        <input
          // displays input field with task text as its value
          value={task.text}
          onChange={(e) => {
            dispatch({
              /* onChange handler dispatches a changed action to update 
              the task text as the user types */
              type: "changed",
              task: {
                ...task,
                text: e.target.value,
              },
            });
          }}
        />
        <button onClick={() => setIsEditing(false)}>Save</button>
      </>
    );
    // or renders plain text with an edit button
  } else {
    taskContent = (
      <>
        {/* displays task text */}
        {task.text}
        <button onClick={() => setIsEditing(true)}>Edit</button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        // sets checkbox state based on the task's done property
        checked={task.done}
        onChange={(e) => {
          dispatch({
            /* dispatches a changed action to update the done property
            of the task to match the checkbox state */
            type: "changed",
            task: {
              ...task,
              done: e.target.checked,
            },
          });
        }}
      />
      {/* renders either the task text or editable input field, 
      depending on isEditing */}
      {taskContent}
      <button
        onClick={() => {
          dispatch({
            // dispatches a deleted action with the task's id when clicked
            type: "deleted",
            id: task.id,
          });
        }}
      >
        Delete
      </button>
    </label>
  );
}
