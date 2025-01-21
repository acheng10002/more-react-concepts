import { useState } from "react";

export default function AddTaskOne({ onAddTaskOne }) {
  const [text, setText] = useState("");
  return (
    <>
      <input
        placeholder="Add task"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        onClick={() => {
          setText("");
          onAddTaskOne(text);
        }}
      >
        Add
      </button>
    </>
  );
}
