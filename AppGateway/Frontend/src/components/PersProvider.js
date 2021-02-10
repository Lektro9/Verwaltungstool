import React, { useState, useEffect } from "react";
import { usePersons } from "../hooks/usePerson";

export const PersProvider = (props) => {
  const setPersons = (PersonArr) => {
    setState({ ...state, persons: PersonArr });
  };


  const initState = {
    persons: [],
    setPersons: setPersons,
  };

  const [state, setState] = useState(initState);

  return (
    <usePersons.Provider value={state}>{props.children}</usePersons.Provider>
  );
};
