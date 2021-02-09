import React, { useState } from 'react';
import { useTurniere } from '../hooks/useTurnier';

export const TurnierProvider = (props) => {
  const setTurniere = (turnierArr) => {
    setState({ ...state, turniere: turnierArr });
  };

  const initState = {
    turniere: [
      //   {
      //     id: 0,
      //     name: 'TestTurnier',
      //     teamIds: [1, 2, 3],
      //     games: [
      //       {
      //         id: 0,
      //         team1Id: 1,
      //         team2Id: 2,
      //         team1Points: 5,
      //         team2Points: 4,
      //       },
      //       {
      //         id: 1,
      //         team1Id: 2,
      //         team2Id: 1,
      //         team1Points: 2,
      //         team2Points: 3,
      //       },
      //     ],
      //   },
      //   {
      //     id: 1,
      //     name: 'TestTurnier 2',
      //     teamIds: [1, 2, 3],
      //     games: [
      //       {
      //         id: 2,
      //         team1Id: 1,
      //         team2Id: 2,
      //         team1Points: 5,
      //         team2Points: 4,
      //       },
      //     ],
      //   },
    ],
    setTurniere: setTurniere,
  };

  const [state, setState] = useState(initState);

  return (
    <useTurniere.Provider value={state}>{props.children}</useTurniere.Provider>
  );
};
