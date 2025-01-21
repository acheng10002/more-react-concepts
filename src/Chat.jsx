export default function Chat({ contact, message, dispatch }) {
  return (
    <section className="chat">
      <textarea
        value={message}
        placeholder={"Chat to " + contact.name}
        onChange={(e) => {
          {
            /* instead of telling React what to do, tells React what the user just did
         textarea change event handler dispatches an action object - the action is an 
         edited message, and e.target.value gets passed as message */
          }
          dispatch({
            type: "edited_message",
            /* e.target.value gets passed and tells React what the contact's 
            new remembered message is */
            message: e.target.value,
          });
        }}
      />
      <br />
      <button
        onClick={() => {
          /* send click event handler first alerts the user with a pop-up of the
          selected contact's message
          then it dispatches an action object - the action is an sent message */
          alert(`Sending "${message}" to ${contact.email}`);
          dispatch({
            type: "sent_message",
          });
        }}
      >
        Send to {contact.email}
      </button>
    </section>
  );
}
