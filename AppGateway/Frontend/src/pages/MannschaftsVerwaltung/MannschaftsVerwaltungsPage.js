import {
  Button,
  Card,
  CardActions,
  CardContent,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
} from '@material-ui/core';
import { useContext, useEffect, useState } from 'react';
import { useMannschaften } from '../../hooks/useMannschaft';
import { usePersons } from '../../hooks/usePerson';
import { CreateMannschaftModal } from './createMannschaftModal';
import axios from 'axios';

const BASE_URL = 'http://localhost:3006';

export const MannschaftsVerwaltungsPage = () => {
  const PersonState = useContext(usePersons);
  const MannschaftenState = useContext(useMannschaften);
  const [open, setOpen] = useState(false);

  const getPerson = (personId) => {
    return PersonState.persons.find((person) => person.id === personId);
  };

  const deleteTeam = (teamId) => {
    MannschaftenState.setMannschaften(
      MannschaftenState.mannschaften.filter((team) => team.id !== teamId)
    );
  };

  const addTeam = (teamInfo) => {
    //TODO: here has to happen server communication?
    MannschaftenState.setMannschaften([
      ...MannschaftenState.mannschaften,
      teamInfo,
    ]);
  };
  const handleClose = () => {
    setOpen(false);
  };

  // Daten werden einmal beim Aufruf der Seite geholt
  useEffect(() => {
    axios
      .get(BASE_URL + '/getMannschaften')
      .then(function (response) {
        console.log(response.data);
        MannschaftenState.setMannschaften(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Button
        size='small'
        variant='contained'
        color='primary'
        onClick={() => {
          setOpen(true);
        }}
      >
        Team hinzufügen
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle id='createPerson' onClose={handleClose}>
          Neue Mannschaft
        </DialogTitle>
        <DialogContent>
          <CreateMannschaftModal addTeam={addTeam} />
        </DialogContent>
      </Dialog>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {MannschaftenState.mannschaften.map((team) => (
          <Card style={{ width: '50vh', margin: 10 }} key={team.id}>
            <CardContent>
              <Typography gutterBottom variant='h5' component='h2'>
                {team.name}
              </Typography>
              {team.mitglieder.map((personObject) => {
                const foundPers = getPerson(personObject.personenId);
                if (foundPers) {
                  return (
                    <div key={personObject.personenId}>
                      {getPerson(personObject.personenId).id} -{' '}
                      {getPerson(personObject.personenId).firstName}
                      {getPerson(personObject.personenId).lastName}
                    </div>
                  );
                } else {
                  return <div key={personObject.personenId}></div>;
                }
              })}
            </CardContent>
            <CardActions>
              <Button
                size='small'
                color='secondary'
                onClick={() => deleteTeam(team.id)}
              >
                Team Löschen
              </Button>
            </CardActions>
          </Card>
        ))}
      </div>
    </>
  );
};
