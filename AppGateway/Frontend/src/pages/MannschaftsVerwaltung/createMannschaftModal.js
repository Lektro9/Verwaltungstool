import {
  Button,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from '@material-ui/core';
import { useContext, useState } from 'react';
import { usePersons } from '../../hooks/usePerson';

export const CreateMannschaftModal = (props) => {
  const PersonState = useContext(usePersons);
  const [chosenOnes, setChosenOnes] = useState(
    PersonState.persons.reduce((accumulator, currentValue) => {
      return { ...accumulator, [currentValue.id]: false };
    }, {})
  );
  const [teamName, setTeamName] = useState('');
  const togglePerson = (personId, checked) => {
    chosenOnes[personId] = checked;
    setChosenOnes({ ...chosenOnes });
  };
  return (
    <>
      <TextField
        variant='outlined'
        required
        id='teamName'
        label='Name der Mannschaft'
        name='teamName'
        autoFocus
        onInput={(e) => setTeamName(e.target.value)}
      />
      <TableContainer>
        <Table size='small' aria-label='a dense table'>
          <TableHead>
            <TableRow>
              <TableCell>Auswahl</TableCell>
              <TableCell>ID</TableCell>
              <TableCell>Vorname</TableCell>
              <TableCell>Nachname</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {PersonState.persons.map((person) => (
              <TableRow key={person.id}>
                <TableCell padding='checkbox'>
                  <Checkbox
                    checked={chosenOnes[person.id]}
                    onChange={(e) => {
                      togglePerson(person.id, e.target.checked);
                    }}
                  />
                </TableCell>
                <TableCell component='th' scope='row'>
                  {person.id}
                </TableCell>
                <TableCell component='th' scope='row'>
                  {person.firstName}
                </TableCell>
                <TableCell>{person.lastName}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Button
        size='small'
        variant='contained'
        color='primary'
        onClick={() => {
          let teamIds = [];
          for (const property in chosenOnes) {
            if (chosenOnes[property]) {
              teamIds.push(+property);
            }
          }
          props.addTeam({
            id: Math.floor(Math.random() * 1000),
            name: teamName,
            mitglieder: teamIds,
          });
        }}
      >
        neue Mannschaft erstellen
      </Button>
    </>
  );
};
