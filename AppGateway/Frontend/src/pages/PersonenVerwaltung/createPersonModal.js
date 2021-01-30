import { useState } from 'react';

import { Button, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

export const CreatePersonModal = (props) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [date, setDate] = useState('');
  const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    textField: {
      marginLeft: '10px',
      marginRight: '10',
      width: '25ch',
    },
  }));

  const handleSubmit = (e) => {
    //TODO: here call server for a new Person
    e.preventDefault();
    console.log(firstName, lastName, date);
    addNewPerson(firstName, lastName, date);
    console.log('submit!');
  };

  const addNewPerson = (firstName, lastName, date) => {
    props.addPersonFromChild({
      id: Math.floor(Math.random() * 1000),
      firstName,
      lastName,
      birthday: new Date(date).getTime(),
    });
  };
  return (
    <div className={useStyles.root} onSubmit={handleSubmit}>
      <form noValidate>
        <TextField
          variant='outlined'
          className={useStyles.textField}
          required
          id='firstName'
          label='Vorname'
          name='firstName'
          autoFocus
          onInput={(e) => setFirstName(e.target.value)}
        />
        <TextField
          variant='outlined'
          className={useStyles.textField}
          style={{ marginLeft: 10 }}
          required
          name='lastName'
          label='Nachname'
          id='lastName'
          onInput={(e) => setLastName(e.target.value)}
        />
        <TextField
          variant='outlined'
          className={useStyles.textField}
          required
          style={{ paddingTop: 10, paddingBottom: 10 }}
          name='lastName'
          id='lastName'
          fullWidth
          type='date'
          onInput={(e) => setDate(e.target.value)}
        />
        <Button
          type='submit'
          variant='contained'
          color='primary'
          style={{ marginBottom: 20 }}
        >
          hinzufügen
        </Button>
      </form>
    </div>
  );
};
