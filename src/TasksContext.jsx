import { createContext, useContext, useReducer } from "react";

// two separate contexts
const TasksContext = createContext(null);
const TasksDispatchContext = createContext(null);

/* context provider for managing and sharing tasks state and 
dispatch function throughout the app */
export function TasksProvider({ children }) {
  /* tasksReducer argument is function defining how the tasks state
  is updated based on dispatched actions 
  initialTasks is the initial state of the tasks 
  tasks - current state managed by tasksReducer 
  dispatch - function to send actions to the taskReducer, triggering
  state updates */
  const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);

  return (
    // shares tasks state with any component that subscribes to TasksContext
    <TasksContext.Provider value={tasks}>
      {/* shares dispatch function with any component that subscribes to
      TasksDispatchContext, allows components to update the tasks state 
      by dispatching actions */}
      <TasksDispatchContext.Provider value={dispatch}>
        {/* children within TasksProvider have access to tasks state and 
        dispatch function */}
        {children}
      </TasksDispatchContext.Provider>
    </TasksContext.Provider>
  );
}

/* useTasks and useTasksDispatch are custom hooks that allow other components
to consume tasks state and dispatch function */
export function useTasks() {
  return useContext(TasksContext);
}

export function useTasksDispatch() {
  return useContext(TasksDispatchContext);
}

/* reducers ensure immutability by always returning a new array
instead of mutating the original tasks array directly

reducer function that handles updates to a list of tasks

tasks is the current state, an array of task objects
each task has properties id, text, and done

action is object that describes what change should should occur
action has a type property and may include additional properties 
like id, text, or task to carry data */
function tasksReducer(tasks, action) {
  // switch checks the type property of action object
  switch (action.type) {
    case "added": {
      return [
        // copies the existing tasks array
        ...tasks,
        // appends a new task object to the end of the array
        {
          id: action.id,
          text: action.text,
          done: false,
        },
      ];
    }
    case "changed": {
      /* iterates over the tasks array and for each task t 
      and returns a new array where one task is replaced with
      its updated version */
      return tasks.map((t) => {
        /* checks if its id matches the id of the task 
        provided in action.task */
        if (t.id === action.task.id) {
          // if match, returns the updated task
          return action.task;
        } else {
          // if no match, returns the task as is
          return t;
        }
      });
    }
    case "deleted": {
      /* filters the tasks array to exclude the task with the id 
      matching action.id and returns a new array with the specified
      task removed */
      return tasks.filter((t) => t.id !== action.id);
    }
    default: {
      // throws an error of action.type does not match any case
      throw Error("Unknown action: " + action.type);
    }
  }
}

const initialTasks = [
  { id: 0, text: "Philosopher's Path", done: true },
  { id: 1, text: "Visit the temple", done: false },
  { id: 2, text: "Drink matcha", done: false },
];
