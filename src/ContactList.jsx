export default function ContactList({ contacts, selectedId, dispatch }) {
  return (
    <section className="contact-list">
      <ul>
        {/*} iterates through the contacts, and for each */}
        {contacts.map((contact) => (
          // creates a li element inside the unordered list
          <li key={contact.id}>
            {/* button with contact's name */}
            <button
              onClick={() => {
                {
                  /* instead of telling React what to do, tell React what the user just did
                change selection click event handler dispatches an action object that has 
                minimal info about what happened- the action is a changed selection, and the 
                contact.id/ contactId will get set to selectedId */
                }
                dispatch({
                  type: "changed_selection",
                  contactId: contact.id,
                });
              }}
            >
              {/* if the contact is the selected contact, put it in a bold tag */}
              {selectedId === contact.id ? <b>{contact.name}</b> : contact.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
