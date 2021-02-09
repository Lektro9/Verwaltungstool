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
import { AddMannschaftModal } from './addMannschaftModal';
import axios from 'axios';

const BASE_URL = 'http://localhost:3006';

export const MannschaftsVerwaltungsPage = () => {
  const PersonState = useContext(usePersons);
  const MannschaftenState = useContext(useMannschaften);
  const [mannschaftAddPersModals, setMannschaftAddPersModals] = useState(
    MannschaftenState.mannschaften.reduce((accumulator, currentValue) => {
      return { ...accumulator, [currentValue.id]: false };
    }, {})
  );
  const [open, setOpen] = useState(false);

  // update the boolean collection object so modal booleans are tracked correctly
  useEffect(() => {
    setMannschaftAddPersModals(MannschaftenState.mannschaften.reduce((accumulator, currentValue) => {
      return { ...accumulator, [currentValue.id]: false };
    }, {}))
    console.log(mannschaftAddPersModals)
  }, [MannschaftenState.mannschaften])

  const getPerson = (personId) => {
    return PersonState.persons.find((person) => person.id === personId);
  };

  const deleteTeam = (teamId) => {
    axios
      .delete(BASE_URL + '/deleteMannschaft/' + teamId)
      .then((response) => {
        MannschaftenState.setMannschaften(
          MannschaftenState.mannschaften.filter((team) => team.id !== teamId)
        );
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const addTeam = (teamInfo) => {
    axios
      .post(BASE_URL + '/createMannschaft', teamInfo)
      .then(function (response) {
        MannschaftenState.setMannschaften([
          ...MannschaftenState.mannschaften,
          response.data,
        ]);
      })
      .catch(function (error) {
        console.log(error);
      });

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
        MannschaftenState.setMannschaften(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addToTeam = (personIds, personsAlreadyInMannschaft) => {
    console.log(personIds)
    const personsNotAlreadyInMannschaft = personIds.filter(
      (x) => !personsAlreadyInMannschaft.includes(x)
    );
  }

  const openAddPersons = (mannschaftsId) => {
    mannschaftAddPersModals[mannschaftsId] = true;
    setMannschaftAddPersModals({ ...mannschaftAddPersModals });
  };

  const closeAddPersons = (mannschaftsId) => {
    mannschaftAddPersModals[mannschaftsId] = false;
    setMannschaftAddPersModals({ ...mannschaftAddPersModals });
  };

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
          <AddMannschaftModal inputFields={true} addTeam={addTeam} />
        </DialogContent>
      </Dialog>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {MannschaftenState.mannschaften.map((team) => (
          <Card style={{ width: '50vh', margin: 10 }} key={team.id}>
            <CardContent>
              <Typography gutterBottom variant='h5' component='h2'>
                {team.name}
              </Typography>
              <Dialog open={mannschaftAddPersModals[team.id]} onClose={() => { closeAddPersons(team.id) }}>
                <DialogTitle id='createPerson'>
                  Personen hinzufügen
                </DialogTitle>
                <DialogContent>
                  <AddMannschaftModal currentTeam={team} inputFields={false} addTeam={addToTeam} />
                </DialogContent>
              </Dialog>
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
              <Button
                size='small'
                color='primary'
                onClick={() => {
                  openAddPersons(team.id)
                }}
              >
                Personen hinzufügen
              </Button>
            </CardActions>
          </Card>
        ))}
      </div>
    </>
  );
};
