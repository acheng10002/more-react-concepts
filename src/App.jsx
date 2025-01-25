/* createContext can take in any value, referred to as the default static 
value of the context, and returns a context object that can be used to 
passed down data to components 

hooks allow me to have function components with state and side-effects */
import React, {
  useState,
  createContext,
  useContext,
  useRef,
  useEffect,
  useCallback,
  useMemo,
  memo,
  Profiler,
} from "react";
import { useReducer } from "./MyReact";
import Header from "./components/Header";
import ProductDetail from "./components/ProductDetail";
import AddTask from "./AddTask";
import TaskList from "./TaskList";
import { TasksProvider } from "./TasksContext";
import Heading from "./Heading";
import Section from "./Section";
import AddTaskOne from "./AddTaskOne";
import TaskListOne from "./TaskListOne";
import Chat from "./Chat";
import ContactList from "./ContactList";
import { initialState, messengerReducer } from "./messengerReducer";
import "./App.css";

/* static default value is an object with three properties 

the context does not hold the information, it only represents the kind of 
information I can provide or read from components */
export const ShopContext = createContext({
  products: [],
  cartItems: [],
  addToCart: () => {},
});

// ThemeContext provides the current theme which is a string
/* if React can't find any providers for a particular context in the parent 
tree, the context value returned by useContext() will be equal to the default
value that I specified when I created that context */
const ThemeContext = createContext(null);

const ThemeContextOne = createContext("light");

// CurrentUserContext holds the object representing the current user
const CurrentUserContext = createContext(null);

const AuthContext = createContext(null);

// a Form component rendered within an App component
const UsernameForm = ({ onSubmit }) => {
  const [username, setUsername] = useState("");

  return (
    /* 1. substitute HTML form element with a Form component
    Form component renders all its inner content with React's children prop */
    <Form
      onSubmit={(event) => {
        onSubmit(username);
        /* prevents browser from reloading which is the native browser
        behavior for a form submit */
        event.preventDefault();
      }}
    >
      {/* 3. InputField component becomes generic/abstract while all props are
      passed to it to specialize it 
      it encapsulates a label with an input field into one component */}
      <InputField value={username} onChange={setUsername}>
        Your name:
      </InputField>
      {/* 2. Button component can be used to render my button element */}
      <Button type="submit">Send</Button>
    </Form>
  );
};

/* 3 steps make my Form a composable React component 
Form renders the HTML form element, but everything within is rendered with
React's children */

/* React children prop - special prop to render something within
a component where the component isn't aware of it ahead of time */
const Form = ({ onSubmit, children }) => (
  <form onSubmit={onSubmit}>{children}</form>
);

/* Button is a specialized component because it uses a submit type to 
make it work in my submit form, and instead of passing onClick to the
button, onSubmit from the form element is used instead 

I can add more props to the Button component without bothering other
components */
const Button = ({ color = "white", onClick, type = "button", children }) => (
  <button style={{ backgroundColor: color }} type={type} onClick={onClick}>
    {children}
  </button>
);

const InputField = ({ value, onChange, children }) => {
  <label>
    {children}
    <input
      type="text"
      value={value}
      onChange={(event) => onChange(event.target.value)}
    />
  </label>;
};
/* could also do this
const ShopContext = createContext(null) */

/* outlet context - can be used to pass data from a parent component
                    through an <Outlet /> to a child component 
Context API can be used to do similar things outside of outlet scenarios 

- using the Context API to pass state and data deep into React components
- real-world application of the Context API
- drawbacks of using the Context API 
1. can lead to performance issues
   when I update the state in a context, it can cause all components that
   are consuming that context to re-render, even if the state that are using
   from the context hasn't changed
2. can make my code harder to follow
    important to keep my code organized and well-structured to avoid confusions
    
- solutions to the drawbacks
1. use multiple smaller contexts instead of a single large context 
   can reduce the number of components that are consuming the context, and
   minimize unnecessary re-renders
2. Context API may not be the best solution for the problems 
3. could rely on external state management systems like Zustand and Redux 

every component takes care of itself yet contributes to a greater goal in the
component hierarchy of a React application */

const SplitPane = ({ left, right }) => (
  <div>
    <div className="left-pane">{left}</div>
    <div className="right-pane">{right}</div>
  </div>
);

const Copyright = ({ label }) => <div>Copyright by {label}</div>;

function Toggle() {
  const [on, setOn] = useState(false);
  const toggle = () => setOn((o) => !o);
  return <Switch on={on} onToggle={toggle} />;
}

/* to get on state and toggle handler to the right components, I
have to drill props through the Switch component 

global variables, AngularJS's non-isolate `$scope` inheritance or 
$rootScope lead to a confusing data model
becomes difficult to find where data is initialized, where it's 
updated, and where it's used

ESModules let me be more explicit about where my values are used, 
making it easier to track values and eases the process determining
what impact my changes will have on the rest of the application 

wait until I need to reuse a block before breaking it out 

only use defaultProps for things that are not required */
function Switch({ on, onToggle }) {
  return (
    <div>
      <SwitchMessage on={on} />
      <SwitchButton onToggle={onToggle} />
    </div>
  );
}

function SwitchMessage({ on }) {
  return <div>The button is {on ? "on" : "off"}</div>;
}

function SwitchButton({ onToggle }) {
  return <button onClick={onToggle}>Toggle</button>;
}

/* - what are reducers 
reducers - pure functions that take a previous state and an action to
           return a new state
action - object with a type property describing what the user did, as well
         as any other properties that my reducer might need to produce the
         new state 
         
pure function - always produces the same output for the same input
                does not cause side effects (state should not be mutated in
                pure function because this causes side effects) 
                pure functions can be tested in isolation
How would I declare a reducer? */

function reducer(state, action) {
  switch (action.type) {
    case "incremented_count": {
      return { count: state.count + 1 };
    }
    case "decremented_count": {
      return { count: state.count - 1 };
    }
    case "set_count": {
      return { count: action.value };
    }
    default: {
      throw new Error("unknown action: " + action.type);
    }
  }
}

function TaskApp() {
  let nextId = 3;

  const initialTasks = [
    { id: 0, text: "Visit Kafka Museum", done: true },
    { id: 1, text: "Watch a puppet show", done: false },
    { id: 2, text: "Lennon Wall pic", done: false },
  ];

  /* TaskApp holds an array of tasks in state, and uses
  3 different event handlers to add, remove, and edit tasks 
  
  to reduce the complexity of managing state logic, I can
  keep all the state logic in a single function outside my
  component called a reducer */
  const [tasks, setTasks] = useState(initialTasks);

  function handleAddTask(text) {
    setTasks([
      ...tasks,
      {
        id: nextId++,
        text: text,
        done: false,
      },
    ]);
  }

  function handleChangeTask(task) {
    setTasks(
      tasks.map((t) => {
        if (t.id === task.id) {
          return task;
        } else {
          return t;
        }
      })
    );
  }

  function handleDeleteTask(taskId) {
    setTasks(tasks.filter((t) => t.id !== taskId));
  }

  return (
    <>
      <h1>Prague itinerary</h1>
      <AddTaskOne onAddTaskOne={handleAddTask} />
      <TaskListOne
        tasks={tasks}
        onChangeTask={handleChangeTask}
        onDeleteTask={handleDeleteTask}
      />
    </>
  );
}

/* 2. write a reducer function 
reducer function is where I put my state logic, it takes 2 args
the current state and the action object, and it returns the next state 
for React to set 
because the reducer function takes state (tasks) as an argument, I can
declare it outside of my component */
function tasksReducer(tasks, action) {
  if (action.type === "added") {
    return [
      ...tasks,
      {
        id: nextId++,
        text: action.text,
        done: false,
      },
    ];
  } else if (action.type === "changed") {
    return tasks.map((t) => {
      if (t.id === action.task.id) {
        return action.task;
      } else {
        return t;
      }
    });
  } else if (action.type === "deleted") {
    return tasks.filter((t) => t.id !== action.id);
  } else {
    throw Error("Unknown action: " + action.type);
  }
}

function TaskAppOne() {
  /* 3. useReducer must be passed an initial state, it returns a stateful
  value and a way to set state (the dispatch function) */
  const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);

  /* TaskApp holds an array of tasks in state, and uses 3 different event 
  handlers to add, remove, and edit tasks 
  to reduce the complexity of managing state logic, I can keep all the 
  state logic in a single function outside my component called a reducer */
  // const [tasks, setTasks] = useState(initialTasks);

  /* 1. move from setting state to dispatching actions
  instead of telling React what to do by setting state, specify what the user 
  just did by dispatching actions from my event handlers 
  
  now the event handlers only specify what happened by dispatching actions
  and the reducer function determines how the state updates in response to them */
  function handleAddTask(text) {
    // dispatch an added action, user just clicked add
    dispatch(
      /* object passed to dispatch is the action object 
      action object should contain minimal info about what happened */
      {
        // type says what happened
        type: "added",
        id: nextId++,
        text: text,
      }
    );
  }

  function handleChangeTask(task) {
    // dispatch an changed action, user just clicked edit
    dispatch({
      type: "changed",
      task: task,
    });
  }

  function handleDeleteTask(taskId) {
    // dispatch a deleted action, user just clicked delete
    dispatch({
      type: "deleted",
      id: taskId,
    });
  }

  return (
    <>
      <h1>Prague itinerary</h1>
      <AddTaskOne onAddTaskOne={handleAddTask} />
      <TaskListOne
        tasks={tasks}
        onChangeTask={handleChangeTask}
        onDeleteTask={handleDeleteTask}
      />
    </>
  );
}

let nextId = 3;

const initialTasks = [
  { id: 0, text: "Visit Kafka Museum", done: true },
  { id: 1, text: "Watch a puppet show", done: false },
  { id: 2, text: "Lennon Wall pic", done: false },
];

/* What steps can I follow to migrate from useState to useReducer?
similar to set in useState, React only updates the state in the next render, after
calling the dispatch function 
set function and dispatch function use Object.is() to determine if the state has
changed, if it hasn't the component won't re-render 

how to migrate useState to useReducer
1. move from setting state to dispatching actions
2. write a reducer function
3. use the reducer from my component */

const App = () => {
  /*  - when to use reducers - when a component becomes too big, hard to read 
or debug because of its state logic, use reducers to separate the state logic 
and even store it in a different file 
actions make state-related bugs easy to track back to the dispatched action
What does the dispatch function do?
useReducer hook - takes a reducer function and an initial state as arguments, 
                  returns an array with teo values, the current state and a dispatch 
                  function 
dispatch function - receives an action object as an argument, which gets passed 
                    to the reducer function and the returned value from it is used
                    to updated the state */
  // const [state, dispatch] = useReducer(reducer, { count: 0 });

  function handleClick() {
    /* here the return value from the reducer function would be { count: state.count + 1 } */
    dispatch({ type: "incremented_count" });
  }
  const [cartItems, setCartItems] = useState([
    // list of items in cart
  ]);
  /* to update context and have it change over time, combine it with state 
  declare a state variable in the parent component, and pass the current state
  down as the context value to the provider 
  
  two independent, multiple contexts here, ThemeContext provides the current theme, 
  a string
  CurrentUserContext holds the object representing the current user */
  const [theme, setTheme] = useState("light");
  const [themeOne, setThemeOne] = useState("dark");
  const [currentUser, setCurrentUser] = useState(null);

  // some custom hook that fetches products and returns the fetched products
  const products = "";

  const addToCart = () => {
    // add to cart logic (this adds to cartItems)
  };

  const onSubmit = (username) => console.log(username);

  function FormOne() {
    return (
      <Panel title="Welcome">
        <ButtonOne>Sign up</ButtonOne>
        <ButtonOne>Log in</ButtonOne>
      </Panel>
    );
  }

  function FormTwo({ children }) {
    return (
      <PanelOne title="Welcome">
        <LoginButton />
      </PanelOne>
    );
  }

  function FormThree({ children }) {
    return (
      <PanelTwo title="Welcome">
        <ButtonFour>Sign up</ButtonFour>
        <ButtonFour>Log in</ButtonFour>
      </PanelTwo>
    );
  }

  function LoginForm() {
    const { setCurrentUser } = useContext(CurrentUserContext);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const canLogin = firstName.trim() !== "" && lastName.trim() !== "";
    return (
      <>
        <label>
          First name{": "}
          <input
            required
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </label>
        <label>
          Last name{": "}
          <input
            required
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </label>
        <ButtonThree
          disabled={!canLogin}
          onClick={() => {
            setCurrentUser({
              name: firstName + " " + lastName,
            });
          }}
        >
          Log in
        </ButtonThree>
        {!canLogin && <i>Fill in both fields.</i>}
      </>
    );
  }

  function Greeting() {
    const { currentUser } = useContext(CurrentUserContext);
    return <p>You logged in as {currentUser.name}.</p>;
  }

  function WelcomePanel({ children }) {
    const { currentUser } = useContext(CurrentUserContext);
    return (
      <Panel title="Welcome">
        {currentUser !== null ? <Greeting /> : <LoginForm />}
      </Panel>
    );
  }

  function Panel({ title, children }) {
    const theme = useContext(ThemeContext);
    const className = "panel-" + theme;
    return (
      <section className={className}>
        <h1>{title}</h1>
        {children}
      </section>
    );
  }

  function PanelOne({ title, children }) {
    return (
      <section className="panel">
        <h1>{title}</h1>
        {children}
      </section>
    );
  }

  function PanelTwo({ title, children }) {
    const themeOne = useContext(ThemeContextOne);
    const className = "panel-" + themeOne;
    return (
      <section className={className}>
        <h1>{title}</h1>
        {children}
      </section>
    );
  }

  function ButtonOne({ children }) {
    const theme = useContext(ThemeContext);
    const className = "button-" + theme;
    return <button className={className}>{children}</button>;
  }

  function ButtonTwo({ children, onClick }) {
    return (
      <button className="button" onClick={onClick}>
        {children}
      </button>
    );
  }

  function LoginButton() {
    const { currentUser, setCurrentUser } = useContext(CurrentUserContext);

    if (currentUser !== null) {
      return <p>You logged in as {currentUser.name}.</p>;
    }

    return (
      <ButtonTwo
        onClick={() => {
          // currentUser state variable holds an object
          setCurrentUser({ name: "Advika" });
        }}
      >
        Log in as Advika
      </ButtonTwo>
    );
  }

  function ButtonThree({ children, disabled, onClick }) {
    const theme = useContext(ThemeContext);
    const className = "button-" + theme;
    return (
      <button className={className} disabled={disabled} onClick={onClick}>
        {children}
      </button>
    );
  }

  function ButtonFour({ children, onClick }) {
    const themeOne = useContext(ThemeContextOne);
    const className = "button-" + themeOne;
    return (
      <button className={className} onClick={onClick}>
        {children}
      </button>
    );
  }

  /* if I dislike the "pyramid" of contexts closer to the root of my app, the
  nesting of it, I can extract the providers into a single component that will
  hide the "plumbin" and renders the children passed to it inside the necessary
  providers 
  
  theme and setTheme are needed in App, so App still owns that piece of state */
  function MyProviders({ children, theme, setTheme }) {
    const [currentUser, setCurrentUser] = useState(null);
    return (
      <ThemeContext.Provider value={theme}>
        <CurrentUserContext.Provider
          value={{
            currentUser,
            setCurrentUser,
          }}
        >
          {children}
        </CurrentUserContext.Provider>
      </ThemeContext.Provider>
    );
  }

  /* if there is no need to re-render components, I can wrap a function
  with useCallback and wrap object creation into useMemo 
  this way, the components calling the context object won't need to re-render
  unless currentUser has changed */
  const login = useCallback((response) => {
    const { currentUser, login } = useContext(AuthContext);
    // storeCredentials(response.credentials);
    // setCurrentUser(response.user);
  }, []);

  const contextValue = useMemo(
    () => ({
      currentUser,
      login,
    }),
    [currentUser, login]
  );

  const contacts = [
    { id: 0, name: "Taylor", email: "taylor@mail.com" },
    { id: 1, name: "Alice", email: "alice@mail.com" },
    { id: 2, name: "Bob", email: "bob@mail.com" },
  ];

  /* useReducer hook takes the reducer function and initial state, and it
  returns a stateful value, state, and a way to set that value, the dispatch
  function, that dispatch user actions to the reducer */
  const [state, dispatch] = useReducer(messengerReducer, initialState);
  // contact with id matching the selected id is assigned to contact
  const contact = contacts.find((c) => c.id === state.selectedId);
  /* Messenger will read the message for the currently selected contact 
  message for the selected contact is assigned to message */
  const message = state.messages[state.selectedId];

  function Messenger() {
    const [state, dispatch] = useReducer(messengerReducer, initialState);
    const message = state.messages[state.selectedId];
    const contact = contacts.find((c) => c.id === state.selectedId);
    return (
      <div>
        <ContactList
          contacts={contacts}
          selectedId={state.selectedId}
          dispatch={dispatch}
        />
        <Chat
          key={contact.id}
          message={message}
          contact={contact}
          dispatch={dispatch}
        />
      </div>
    );
  }

  function Counter() {
    /* 3. uses the reducer from my component 
    useReducer takes counterReducer and the initial state, and returns
    the next state (calculated by counterReducer) and a way to set the 
    next state (the dispatch function) */
    const [state, dispatch] = useReducer(counterReducer, { age: 42 });

    function counterReducer(state, action) {
      /* 2. based on the action object, counterReducer calculates and 
      returns the next state */
      if (action.type === "incremented_age") {
        return {
          /* not modifying state, insterad returning a new obejct from
          my reducer */
          age: state.age + 1,
        };
      }
    }

    return (
      <>
        <button
          onClick={() => {
            /* 1. click event handler dispatches an action object that 
          increments the age 
          dispatcher tells React what the user actions to the reducer are */
            dispatch({ type: "incremented_age" });
          }}
        >
          Increment Age
        </button>
        <p>Hello! You are {state.age}</p>
      </>
    );
  }

  /* useRef lets me manage, reference, a value that's not needed for rendering
  1. if I want a component to remember some info, but I don't want that info to 
     trigger new renders/ referencing a value with ref
  2. used when performing imperative action or accessing specific elements 
       rendered in the DOM/ manipulating the DOM with a ref 
  3. . if I want to persist values throughout the component's lifecycle, so the
     value of the ref won't be destroyed every time a component renders/ avoiding
     recreating the ref contents  
  1. useRef provides a way to access and interact with DOM elements; useRef 
  can be used for: 
  - scrolling to a specific position
  - measuring the dimensions of an element
  - triggering animations */
  function ButtonComponent() {
    /* creates a ref object buttonRef with a current property of initially 
    set to null 
    useRef creates a mutable reference, allowing me to update its value without
    triggering a re-render
    useState manages an immutable state that triggers re-renders when updated */
    const buttonRef = useRef(null);

    /* handles side effects (data fetching, subscription, or manually updating
    DOM) */
    useEffect(() => {
      // side effect is to call focus method of the button element, makes it active
      buttonRef.current.focus();
      // change the button's text
      buttonRef.current.textContent = "Hey, I'm different!";
      // after 2 sec, change the text back
      let timeout = setTimeout(() => {
        buttonRef.current.textContent = "Click Me!";
      }, 2000);
      /* useEffect will get executed once on the mount of the component 
      it will never trigger a component re-render */
    }, []);

    // establishes a connection between the buttonRef and the button in the DOM
    return <button ref={buttonRef}>Click Me!</button>;
  }

  // another example of using a ref to manipulate the DOM
  function Form() {
    // 1. declare a ref object with an initial value of null
    const inputRef = useRef(null);

    function handleClick() {
      /* 3. React creates the DOM node and puts it on the screen
      4. React sets up the current property of my ref object to that DOM node 
      5. I can then access the DOM node and call methods like focus() 
      React will set the current property back to null when the node is
      removed from the screen */
      inputRef.current.focus();
    }

    return (
      <>
        {/* 2. ref object gets passed as the ref attribute to the JSX of the DOM node 
        I want to manipulate */}
        <input ref={inputRef} />
        <button onClick={handleClick}>Focus the input</button>
      </>
    );
  }

  function CatFriends() {
    // 1. ref object with an initial value of null
    const listRef = useRef(null);

    function scrollToIndex(index) {
      /* 3. React creates the DOM node and puts it on the screen
      4. React sets up the current property of my ref object to that DOM node 
      5. I can then access the DOM node and call methods */
      const listNode = listRef.current;
      /* This line assumes a particular DOM structure: 
      finds all the img elements directly nested inside li elements within listNode 
      access the image at the specified index from the resulting NodeList */
      const imgNode = listNode.querySelectorAll("li > img")[index];
      // scrolls the imgNode into the viewport
      imgNode.scrollIntoView({
        // scrolls smoothly instead of instantly
        behavior: "smooth",
        /* aligns the element's vertical position as closely as possible to the 
        visible area */
        block: "nearest",
        // centers the element horizontally in the viewport
        inline: "center",
      });
    }

    return (
      <>
        <nav>
          <button onClick={() => scrollToIndex(0)}>Neo</button>
          <button onClick={() => scrollToIndex(1)}>Millie</button>
          <button onClick={() => scrollToIndex(2)}>Bella</button>
        </nav>
        <div>
          {/* 2. ref object gets passed as ref attribute to DOM node's JSX */}
          <ul ref={listRef}>
            <li>
              <img src="https://placecats.com/neo/300/200" alt="Neo" />
            </li>
            <li>
              <img src="https://placecats.com/millie/200/200" alt="Millie" />
            </li>
            <li>
              <img src="https://placecats.com/bella/199/200" alt="Bella" />
            </li>
          </ul>
        </div>
      </>
    );
  }

  function VideoPlayer() {
    const [isPlaying, setIsPlaying] = useState(false);
    const ref = useRef(null);

    function handleClick() {
      // opposite of isPlaying is assigned to nextIsPlaying
      const nextIsPlaying = !isPlaying;
      // sets isPlaying to its opposite
      setIsPlaying(nextIsPlaying);

      // if nextIsPlaying is true
      if (nextIsPlaying) {
        /* React sets up the current property of my ref object to the video
        accesses video and call play method */
        ref.current.play();
      } else {
        // if nextIsPlaying is false, accesses video and calls pause method
        ref.current.pause();
      }
    }

    return (
      <>
        <button onClick={handleClick}>{isPlaying ? "Pause" : "Play"}</button>
        <video
          width="250"
          ref={ref}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        >
          <source
            src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
            type="video/mp4"
          />
        </video>
      </>
    );
  }

  /* React.forwardRef is needed to forward the ref from the parent FormONe 
  component to the DOM element inside the MyInput child component */
  const MyInput = React.forwardRef((props, ref) => {
    return <input {...props} ref={ref} />;
  });

  /* creates a ref in the parent FormOne component and passes the
  ref as a prop to the child component, letting the parent manipulate
  the DOM inside of my component */
  function FormOne() {
    const inputRef = useRef(null);

    function handleClick() {
      inputRef.current.focus();
    }

    return (
      <>
        <MyInput ref={inputRef} />
        <button onClick={handleClick}>Focus the input</button>
      </>
    );
  }

  // avoids recreating the ref contents
  function Video() {
    const playerRef = useRef(null);
    if (playerRef.current === null) {
      /* result of new VideoPlayer() is only used for the initial render, and
        not calling this function on every render because the condition only
        executes during initialization */
      playerRef.current = new VideoPlayer();
    }
  }

  /* rendering and painting of the screen comes before React runs the useEffect,
    the connection between the ref and button is already established before the 
    effect is executed */

  /* memoization - optimizes expensive or complex calculations, where it caches
                     the result of a function call and stores it to be used later
                     without recalculating it 
    memoized value get recalculated only when the dependencies of the useMemo hook changes 
    has the same two arguments as useEffect, a calculateValue callback and a dependencies array 
  function Cart({ products }) {
    /* this way, whenever a user opens/closes the cart multiple times, the app won't recalculate 
    the totalPrice and use the cached value as long as products did not change 
    const totalPrice = useMemo(() => {
      products.reduce(
        (total, product) => total + product.price * product.quantity,
        0
      );
      /* useMemo will execute the callback on mount, and on subsequent re-renders, it will only
    re-execute the callback whenever one of the dependencies changes 
    }, [products]);

    return (
      <div>
        {/* some other content in the cart 
};
{
  /* products to display 
        <p>
          Total Price: <strong>${totalPrice}</strong>
        </p>
        {/* some button to checkout 
      </div>
    );
  } */

  function Stopwatch() {
    /* parameter is initialValue I want the ref obkect's current property to be,
    it can be any type, and it's ignored after the initial render 
    useRef returns a ref object with the current property 
    if the ref object object is passed to React as a ref attribute, React will 
    set its current property 
    on the next renders, useRef will return the same object */
    const intervalRef = useRef(0);
    // ...
  }

  function handleStartClick() {
    const intervalId = setInterval(() => {
      // ...
    }, 1000);
    /* changing a ref does not trigger a re-render 
    to update the value inside the ref, I need to manually change its current property */
    intervalRef.current = intervalId;
  }

  function handleStopClick() {
    // I can read the interval ID from the ref so that I can call clear that interval
    const intervalId = intervalRef.current;
    clearInterval(intervalId);
  }

  // referencing a value with a ref
  function StopwatchOne() {
    const [startTime, setStartTime] = useState(null);
    const [now, setNow] = useState(null);
    const intervalRef = useRef(null);

    function handleStart() {
      setStartTime(Date.now());
      setNow(Date.now());

      clearInterval(intervalRef.current);
      /* setInterval continuously updates the now state to the current timestamp
      that way, the stopwatch display updates in real time */
      intervalRef.current = setInterval(() => {
        setNow(Date.now());
      }, 10);
    }

    function handleStop() {
      clearInterval(intervalRef.current);
    }

    let secondsPassed = 0;
    if (startTime != null && now != null) {
      secondsPassed = (now - startTime) / 1000;
    }

    return (
      <>
        <h1>Time passed: {secondsPassed.toFixed(3)}</h1>
        <button onClick={handleStart}>Start</button>
        <button onClick={handleStop}>Stop</button>
      </>
    );
  }

  /* custom hook that sets up an interval and clears it after unmounting 
  it's a combo of setInterval and clearInterval tied to the component lifecycle 
  callback is the function I want to execute repeatedly
  delay is the interval duration 
  if delay is null, the interval is paused */
  function useInterval(callback, delay) {
    /* the savedCallback ref object will store the latest version of the callback,
    will persist across renders without reinitializing, and updates to the ref won't
    trigger a re-render 
    useRef returns a object with a mutable current property that's shared between 
    renders */
    const savedCallback = useRef();

    /* the latest interval callback gets saved into the ref object
    ensures savedCallback reference always points to the most recent callback */
    useEffect(() => {
      savedCallback.current = callback;
      /* this useEffect runs whenever the callback changes 
      when the interval calls savedCallback.current(), it always executes the latest
      version of the function */
    }, [callback]);

    // sets up the interval
    useEffect(() => {
      // defines how tick invokes the callback stored in savedCallback
      function tick() {
        /* when the interval triggers, tick will execute, and tick uses
        savedCallback.current() to ensure it always has the latest version
        of the callback */
        savedCallback.current();
      }
      // if delay is null, the interval is paused, and no setInterval is created
      if (delay !== null) {
        /* I can read and call the ref object from inside my interval 
        if delay is valid, a new interval is created 
        creates an interval that executes the tick every delay ms */
        let id = setInterval(tick, delay);
        // clears the interval after component's unmounting, or when delay changes
        return () => clearInterval(id);
      }
      // when delay changes, effect re-runs, stops the previous interval, starts a new one
    }, [delay]);
  }

  function CounterTwo() {
    let [count, setCount] = useState(0);
    let [delay, setDelay] = useState(1000);
    const [isRunning, setIsRunning] = useState(true);

    useInterval(
      () => {
        setCount(count + 1);
      },
      isRunning ? delay : null
    );

    function handleDelayChange(e) {
      setDelay(Number(e.target.value));
    }

    return (
      <>
        <h1>{count}</h1>
        <input value={delay} onChange={handleDelayChange} />
      </>
    );
  }

  function CounterThree() {
    const [count, setCount] = useState(0);

    // side effect that needs cleanup
    useEffect(() => {
      let id = setInterval(() => {
        setCount(count + 1);
      }, 1000);
      // returns the cleanup function
      return () => clearInterval(id);
    });
    return <h1>{count}</h1>;
  }

  function CounterFour() {
    const [count, setCount] = useState(0);
    /* savedCallback ref object has mutable current property that's shared 
    between renders and will persist across re-renders */
    const savedCallback = useRef();

    function callback() {
      // can read fresh props, state, etc.
      setCount(count + 1);
    }

    useEffect(() => {
      // latest interval callback can be saved into current
      savedCallback.current = callback;
    });

    useEffect(() => {
      function tick() {
        savedCallback.current();
      }
      /* then the latest interval callback can be read and called from inside 
      the interval */
      let id = setInterval(tick, 1000);
      return () => clearInterval(id);
      // the effect never re-executes, and the interval doesn't get reset
    }, []);

    /* thanks to savedCallback ref, I can always read the callback that I set
    after the last render, and call it from the interval tick */

    return <h1>{count}</h1>;
  }
  /* many subscription APIs can remove the old listener and add a new listener at 
  any time, setInterval cannot do that 
  when clearInterval and setInterval are run, their timings shift 
  if re-rendering and re-applying effects happen too often, the interval never 
  gets a change to fire */

  /* information in ref is local to each copy of my component, unlike the variables 
  outside which are shared 
  
  function MyComponent() {
  // ...
  // 🚩 Don't write a ref during rendering
  myRef.current = 123;
  // ...
  // 🚩 Don't read a ref during rendering
  return <h1>{myOtherRef.current}</h1>;
}

if I have to read or write something during render, use state instead

function MyComponent() {
  // ...
  useEffect(() => {
    // ✅ You can read or write refs in effects
    myRef.current = 123;
  });
  // ...
  function handleClick() {
    // ✅ You can read or write refs in event handlers
    doSomething(myOtherRef.current);
  }
  // ...
} 
  */

  function FormComponent() {
    // const [name, setName] = useState("");
    // instead, create a reference using useRef
    const inputRef = useRef(null);
    // store the error state
    const [error, setError] = useState(false);

    const handleSubmit = (e) => {
      /* in React, better to use useRef hook, using the virtual DOM, than use the 
      document object's API
      manipulating the DOM directly with these APIs/methods can lease to unexpected
      behaviors:
      1. race conditions - when multiple components are trying to manipulate the same
                           DOM element
         ex. one component might remove an element from the DOM while another is still
         trying to manipulate it
      2. accessibility issues - ex. if I manipulate the DOM in a way that changes the
         order or structure of the content, it can make it hard for users who use 
         screen readers and other assistive technologies to access the info
      3. inefficient updates - direct DOM manipulation means the browser needs to 
                               recalculate the layout and repaint the affected elements,
                               which can be a slow and expensive operation 
                               
      useRef creates a reference to a DOM element and accesses its properties and methods
      without any of the complexities of 1, 2, or 3 */
      // const nameInput = document.querySelector("#name").value;

      // checks if the input field is empty, and if it is, an alert is fired
      /* if (nameInput === "") {
        alert("name cannot be blank");
      } */
      e.preventDefault();
      // have the reference access the input element's value
      const value = inputRef.current.value;

      // update error state based on the input value
      if (!value) {
        setError(true);
      } else {
        // submit the form
      }
    };

    const handleChange = () => {
      // setName(e.target.value);
      const value = inputRef.current.value;

      // update error state based on the input value
      if (value) {
        setError(false);
      }
    };

    return (
      <form onSubmit={handleSubmit}>
        <input
          // id="name"
          // name="full name"
          type="text"
          ref={inputRef}
          // value={name}
          onChange={handleChange}
          // placeholder="full name"
        />
        <button type="submit">Submit</button>
        {/* render error message if the error state is true */}
        {error && <p>name field cannot be blank!</p>}
      </form>
    );
  }

  /* I can alter the style of an element in vanilla JS 
  const element = document.querySelector('#element');
  element.style.display = 'none'; */
  const RefExample = () => {
    const boxRef = useRef(null);
    /* isAnimating state keeps track of whether or not the animation is currently
    playing */
    const [isAnimating, setIsAnimating] = useState(false);

    function handleStartAnimation() {
      setIsAnimating(true);
      /* creates a reference to the div element I want animate 
      transform property is applied to the boxRef.current element using the DOM API */
      boxRef.current.style.transform = "translateX(300px)";
      /* resets the element's transform property after 1 second, allowing the element
      to return to its original position and complete the animation */
      setTimeout(() => {
        setIsAnimating(false);
        boxRef.current.style.transform = "";
      }, 1000);
    }

    return (
      <div className="App">
        <div
          // CSS class allows additional styling to the element during the animation
          className={`box ${isAnimating ? "is-animating" : ""}`}
          ref={boxRef}
        >
          <p>Hello, I'm an animated box!</p>
        </div>
        <button onClick={handleStartAnimation}>Start Animation</button>
      </div>
    );
  };

  function CandyDispenser() {
    const initialCandies = ["snickers", "skittles", "twix", "milky way"];
    const [candies, setCandies] = useState(initialCandies);
    const dispense = (candy) => {
      setCandies((allCandies) => allCandies.filter((c) => c !== candy));
    };
    /* on the second render of the component, the original dispense function 
    gets garbage collected, freeing up memory, and then a new one is created
    with useCallback, the original dispense won't get garbage collected, and
    a new one is created */

    // const dispenseCallback = useCallback(dispense, []);
    /* reasons why useMemo and useCallback are built into React:
    referential equality and computationally expensive calculations
    when I define an object inside my component, it is not going to be 
    referentially equal to the alst time that same object was defined 
    
    objects, arrays, and functio in JavaScript are compared by reference,
    not by value
    each object has a unique reference in memory
    even if two objects have the same content, they are considered distinct 
    if they don't share the same reference 
    a variable always has the same reference to the obejct it points to */

    /*
    function CountButton({ onClick, count }) {
      return <button onClick={onClick}>{count}</button>
    }
    
    function DualCounter() {
      const [count1, setCount1] = React.useState(0)
      const increment1 = () => setCount1((c) => c + 1)
    
      const [count2, setCount2] = React.useState(0)
      const increment2 = () => setCount2((c) => c + 1)
    
      return (
        <>
          <CountButton count={count1} onClick={increment1} />
          <CountButton count={count2} onClick={increment2} />
        </>
      )
    }
    */
    /* this is an escape hatch for situations when rendering takes a substantial
    amount of time (highly interactive graphics, charts, animations, React will 
    only re-render 'CountButton' when its props change */
    const CountButton = memo(function CountButton({ onClick, count }) {
      return <button onClick={onClick}>{count}</button>;
    });

    /* increment1 and increment2 function are defined within the component 
    functions, meaning every time DualCounter is re-rendered, those functions
    will be new and React will re-render both of the CountButtons anyway 
    this avoids unnecessary re-renders of CountButton */
    function DualCounter() {
      const [count1, setCount1] = useState(0);
      const increment1 = useCallback(() => setCount1((c) => c + 1), []);

      const [count2, setCount2] = useState(0);
      const increment2 = useCallback(() => setCount2((c) => c + 1), []);

      return (
        <>
          <CountButton count={count1} onClick={increment1} />
          <CountButton count={count2} onClick={increment2} />
        </>
      );
    }

    return (
      <div>
        <h1>Candy Dispenser</h1>
        <div>
          <div>Available Candy</div>
          {candies.length === 0 ? (
            <button onClick={() => setCandies(initialCandies)}>refill</button>
          ) : (
            <ul>
              {candies.map((candy) => (
                <li key={candy}>
                  <button onClick={() => dispense(candy)}>grab</button> {candy}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    );
  }
  return (
    <>
      <div>
        <ContactList
          contacts={contacts}
          // selectedId is the id of the selected contact
          selectedId={state.selectedId}
          dispatch={dispatch}
        />
        <Chat
          key={contact.id}
          message={message}
          contact={contact}
          dispatch={dispatch}
        />
      </div>

      {/* ContextObject.Provider - Provider component accepts a prop called
      value, which is the context value that's going to be passed down to the
      components no matter how deeply they're nested 
      
      if no value is passed to Context.Provider, then the returned value will 
      be the defaultValue passed to createContext for that context 
      
      React automatically re-renderscomponents that read some context if it changes, 
      React re-renders all children that use a particular context starting from the 
      provider that receives a different value 
      
      skipping re-renders with memo does not prevent children from receiving fresh 
      context values passing something via context
      only works if SomeContext that I use to provide context and SomeContext
      that I use to read it are exactly the same object */}
      <ShopContext.Provider
        value={{
          cartItems,
          products,
          addToCart,
        }}
      >
        {/* prop drilling - pass cartItemsCount down to the Header component 
      and then Links component that is part of the Header */}
        <Header />
        {/* pass products and addToCart to ProductDetail component */}
        <ProductDetail />
        {/* <UsernameForm onSubmit={onSubmit} /> */}
        {/* Form component could be used directly in the App 
      App component makes it a specialized Form component by passing all the
      displayed information as children and other props to it 
      here, I take all the components, Form, InputField, and Button
      give them their props, onSubmit, username, setUsername, and
      arrange them however I want them to appear within the Form component */}
        <UsernameForm
          onSubmit={(event) => {
            onSubmit(username);
            event.preventDefault();
          }}
        >
          <InputField
          /* value={username} onChange={setUsername} */
          >
            Your name:
          </InputField>
          <Button color="violet" type="submit">
            Send
          </Button>
        </UsernameForm>
        <SplitPane
          left={
            <div>
              <ul>
                <li>
                  <a href="#">Link 1</a>
                </li>
                <li>
                  <a href="#">Link 2</a>
                </li>
              </ul>
            </div>
          }
          right={<Copyright label="Robin" />}
        />
      </ShopContext.Provider>
      {/* updating a value via contet - 
      checking "dark mode" checkbox updates the state, changing 
      the provided value re-renders all components using the context */}
      <ThemeContext.Provider value={theme}>
        <FormOne />
        <label>
          <input
            type="checkbox"
            checked={theme === "dark"}
            onChange={(e) => {
              setTheme(e.target.checked ? "dark" : "light");
            }}
          />
          Use dark mode
        </label>
      </ThemeContext.Provider>
      {/* combine { currentUser, setCurrentUser } into a single object and 
      pass it down through the context inside the value={} 
      
      any component below, such as LoginButton, can then read both currentIser
      amd setCurrentUser, and then call setCurrentUser when needed */}
      <CurrentUserContext.Provider
        value={{
          currentUser,
          setCurrentUser,
        }}
      >
        <FormTwo />
      </CurrentUserContext.Provider>
      <ThemeContext.Provider value={theme}>
        <CurrentUserContext.Provider
          value={{
            currentUser,
            setCurrentUser,
          }}
        >
          <WelcomePanel />
          <label>
            <input
              type="checkbox"
              checked={theme === "dark"}
              onChange={(e) => {
                setTheme(e.target.checked ? "dark" : "light");
              }}
            />
            Use dark mode
          </label>
        </CurrentUserContext.Provider>
      </ThemeContext.Provider>
      <MyProviders theme={theme} setTheme={setTheme}>
        <WelcomePanel />
        <label>
          <input
            type="checkbox"
            checked={theme === "dark"}
            onChange={(e) => {
              setTheme(e.target.checked ? "dark" : "light");
            }}
          />
          Use dark mode
        </label>
      </MyProviders>
      <TasksProvider>
        <h1>Day off in Kyoto</h1>
        <AddTask />
        <TaskList />
      </TasksProvider>
      <ThemeContextOne.Provider value={themeOne}>
        <FormThree />
      </ThemeContextOne.Provider>
      {/* Toggle theme button is always light necause it's outside
      any theme context provider, and the default context theme value is 
      'light' */}
      <ButtonFour
        onClick={() => {
          setThemeOne(themeOne === "dark" ? "light" : "dark");
        }}
      >
        Toggle theme
      </ButtonFour>
      <ThemeContextOne.Provider value="dark">
        <ButtonFour>Dark</ButtonFour>
        {/* I can override the context for a part of the tree by wrapping
        that part in a provider with a different value */}
        <ThemeContextOne.Provider value="light">
          <ButtonFour>Light</ButtonFour>
        </ThemeContextOne.Provider>
      </ThemeContextOne.Provider>
      <Section>
        <Heading>Title</Heading>
        <Section>
          <Heading>Heading</Heading>
          <Heading>Heading</Heading>
          <Heading>Heading</Heading>
          <Section>
            <Heading>Sub-heading</Heading>
            <Heading>Sub-heading</Heading>
            <Heading>Sub-heading</Heading>
            <Section>
              <Heading>Sub-sub-heading</Heading>
              <Heading>Sub-sub-heading</Heading>
              <Heading>Sub-sub-heading</Heading>
            </Section>
          </Section>
        </Section>
      </Section>
      {/* context value is an object with two properties 
      whenever App re-renders, this context value will be a different 
      object */}
      <AuthContext.Provider value={contextValue}></AuthContext.Provider>
      <Toggle />
      <TaskApp />
      {/* readability - useReducer cleanly separates the HOW of update 
      logic from the what happened of event handlers 
      debugging - with useReducer, I can add a console log into my 
      reducer to see every state update and why it happened (due to 
      which action) 
      testing - reducer functions can be exported and tested separately
      and in isolation, I can assert that my reducer returns a particular
      state for a particular initial state and action */}
      <TaskAppOne />
      <Messenger />
      <Counter />
      <ButtonComponent />
      <CandyDispenser />
      <Stopwatch />
      <StopwatchOne />
      <Form />
      <CatFriends />
      <VideoPlayer />
      <FormOne />
      <FormComponent />
      <RefExample />
      <CounterTwo />
      <CounterThree />
      <CounterFour />
    </>
  );
};

export default App;

/* two other advanced React patterns used for component compositions:
render prop components and higher-order components */

/* vanilla JS's imperative programming approach - I manually specify every 
step to manipulate the DOM and manage app state
- I'm focused on how to update the UI
React's declarative programming approach - I describe the descired outcome
and the framework handles the underlying steps to update the DOM
- I'm focused on what the UI should look like, based on state 

when a state gets changed, React tries to re-render the component, and it 
will destroy all local variables not controlled by React and re-execute them

React hooks - special functions that allow me to use state and other features
              in functional components without using class components
Explore useRef hook and its use cases
  Why should I prefer useRef hook over other DOM manipulation methods like
  querySelector?
Explain memoization and how useCallback and useMemo can be used 
  What is the difference between useMemo and useCallback?
  How do useMemo and useCallback help optimize the performance of React
  components?
  When should I memoize a value? */
