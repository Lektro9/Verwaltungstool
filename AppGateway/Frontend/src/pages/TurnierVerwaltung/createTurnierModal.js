import { Button, TextField } from '@material-ui/core';
import { useState } from 'react';

export const CreateTurnierModal = (props) => {
  const [turnierName, setTurnierName] = useState('');
  return (
    <>
      <TextField
        variant='outlined'
        required
        id='teamName'
        label='Name des Turniers'
        name='teamName'
        autoFocus
        onInput={(e) => setTurnierName(e.target.value)}
      />
      <Button
        size='small'
        variant='contained'
        color='primary'
        onClick={() => {
          props.addTurnier({
            id: Math.floor(Math.random() * 1000),
            name: turnierName,
            games: [],
          });
        }}
      >
        Turnier erstellen
      </Button>
    </>
  );
};
