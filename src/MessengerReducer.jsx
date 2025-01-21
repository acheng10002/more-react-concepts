/* initial selected contact is Taylor, and sets initial messages 
for all contacts */
export const initialState = {
  selectedId: 0,
  messages: {
    0: "Hello, Taylor",
    1: "Hello, Alice",
    2: "Hello, Bob",
  },
};

/* messengerReducer takes state as an argument, so it can be declared 
outside the App component
reducer function takes in the current state and the action object 
and returns the next state based on the action type (changed selection,
edited message, sent message, or default unknown action */
export function messengerReducer(state, action) {
  switch (action.type) {
    case "changed_selection": {
      /* React sets the state to what I return from the reducer 
      when the dispatched action object is a changed selection, 
      sets the selected id to the contact that was clicked on
      (puts it in a bold tag) */
      return {
        ...state,
        selectedId: action.contactId,
        // message: " ";,
      };
    }
    // updates the reducer to store and update a separate message draft per contact
    case "edited_message": {
      /*  when the dispatched action object is an edited message, 
      sets selected contact's message in state to the message in the textarea */
      return {
        ...state,
        /* for edited message, reducer updates the message object 
        dynamically, based on the selected contact */
        messages: {
          // keeps messages for other contacts
          ...state.messages,
          // changes selected contact's message to be e.target.value
          [state.selectedId]: action.message,
        },
      };
    }
    case "sent_message": {
      /*  when the dispatched action object is a sent message, 
      sets selected contact's message to empty string in the textarea */
      return {
        ...state,
        messages: {
          ...state.messages,
          [state.selectedId]: "",
        },
      };
    }
    default: {
      throw Error("Unknown action: " + action.type);
    }
  }
}
