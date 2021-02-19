import React, { useState } from 'react';
import { useMannschaften } from '../hooks/useMannschaft';

export const MannProvider = (props) => {
  const setMannschaften = (mannArr) => {
    setState({ ...state, mannschaften: mannArr });
  };

  const initState = {
    mannschaften: [],
    setMannschaften: setMannschaften,
  };

  const [state, setState] = useState(initState);

  return (
    <useMannschaften.Provider value={state}>
      {props.children}
    </useMannschaften.Provider>
  );
};
