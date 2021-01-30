import React, { useState } from 'react';
import { useMannschaften } from '../hooks/useMannschaft';

export const MannProvider = (props) => {
  const setMannschaften = (mannArr) => {
    setState({ ...state, mannschaften: mannArr });
  };

  const initState = {
    mannschaften: [
      {
        id: 0,
        name: 'hey',
        mitglieder: [1, 2, 4, 6, 3, 5, 698],
      },
      {
        id: 1,
        name: 'hey',
        mitglieder: [2, 4, 6],
      },
      {
        id: 2,
        name: 'hey',
        mitglieder: [1, 2, 3],
      },
      {
        id: 3,
        name: 'team5',
        mitglieder: [3, 4, 9],
      },
    ],
    setMannschaften: setMannschaften,
  };

  const [state, setState] = useState(initState);

  return (
    <useMannschaften.Provider value={state}>
      {props.children}
    </useMannschaften.Provider>
  );
};
