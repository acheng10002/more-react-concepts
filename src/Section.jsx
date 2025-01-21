import { useContext } from "react";
import { LevelContext } from "./LevelContext";

export default function Section({ children }) {
  // LevelContext.Provider propagates the level value down the component tree
  const level = useContext(LevelContext);
  return (
    <section className="section">
      {/* each Section increments the level, dynamically creating a hierarchy 
      each LevelContext.Provider creates a new, independent context value,
      avoiding accidental modification of the parent context value */}
      <LevelContext.Provider value={level + 1}>
        {/* allows any number of nested Section components without manually
        managing levels */}
        {children}
      </LevelContext.Provider>
    </section>
  );
}
