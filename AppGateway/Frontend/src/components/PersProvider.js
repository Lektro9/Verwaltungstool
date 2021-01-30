import React, { useState } from 'react';
import { usePersons } from '../hooks/usePerson';

export const PersProvider = (props) => {
  const setPersons = (PersonArr) => {
    setState({ ...state, persons: PersonArr });
  };

  const initState = {
    persons: [
      {
        id: 1,
        firstName: 'testName',
        lastName: 'testLastname',
        birthday: 1611586940792,
      },
      {
        id: 2,
        firstName: 'testName',
        lastName: 'testLastname',
        birthday: 1611586940792,
      },
      {
        id: 3,
        firstName: 'testName',
        lastName: 'testLastname',
        birthday: 1611586940792,
      },
      {
        id: 4,
        firstName: 'testName',
        lastName: 'testLastname',
        birthday: 1611586940792,
      },
      {
        id: 5,
        firstName: 'testName',
        lastName: 'testLastname',
        birthday: 1611586940792,
      },
      {
        id: 6,
        firstName: 'testName',
        lastName: 'testLastname',
        birthday: 1611586940792,
      },
    ],
    setPersons: setPersons,
  };

  const [state, setState] = useState(initState);

  return (
    <usePersons.Provider value={state}>{props.children}</usePersons.Provider>
  );
};
