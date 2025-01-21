/* createContext can take in any value, referred to as the default static 
value of the context, and returns a context object that can be used to 
passed down data to components 

hooks allow me to have function components with state and side-effects */
import {
  useState,
  createContext,
  useContext,
  useCallback,
  useMemo,
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

  function counterReducer(state, action) {
    /* 2. based on the action object, counterReducer calculates and 
    returns the next state */
    if (action.type === "increment_age") {
      return {
        /* not modifying state, insterad returning a new obejct from
        my reducer */
        age: state.age + 1,
      };
    }
  }

  function Counter() {
    /* 3. uses the reducer from my component 
    useReducer takes counterReducer and the initial state, and returns
    the next state (calculated by counterReducer) and a way to set the 
    next state (the dispatch function) */
    const [state, dispatch] = useReducer(counterReducer, { age: 42 });

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
    </>
  );
};

export default App;

/* two other advanced React patterns used for component compositions:
render prop components and higher-order components */
