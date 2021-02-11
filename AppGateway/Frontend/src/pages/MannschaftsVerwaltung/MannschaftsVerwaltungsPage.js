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
import { useAuth } from '../../hooks/useAuth';

const BASE_URL_MANNSCHAFT = process.env.BASE_URL_MANNSCHAFT || 'http://localhost:3006';
const BASE_URL_PERSONEN = process.env.BASE_URL_PERSONEN || "http://localhost:3004/api/v1/personenverwaltung/persons/";

export const MannschaftsVerwaltungsPage = () => {
  const authState = useContext(useAuth);
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
  }, [MannschaftenState.mannschaften])

  const getPerson = (personId) => {
    return PersonState.persons.find((person) => person.id === personId);
  };

  const deleteTeam = (teamId) => {
    axios
      .delete(BASE_URL_MANNSCHAFT + '/deleteMannschaft/' + teamId)
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
      .post(BASE_URL_MANNSCHAFT + '/createMannschaft', teamInfo)
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
      .get(BASE_URL_MANNSCHAFT + '/getMannschaften')
      .then(function (response) {
        MannschaftenState.setMannschaften(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });

    axios
      .get(BASE_URL_PERSONEN)
      .then((response) => {
        PersonState.setPersons(response.data);
      })
      .catch(function (error) {
        console.error(error);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addToTeam = (selectedPersonIds, personsAlreadyInMannschaft, mannschaftID) => {

    const personsNotInMannschaft = selectedPersonIds.filter(
      (x) => !personsAlreadyInMannschaft.includes(x)
    );

    axios
      .put(BASE_URL_MANNSCHAFT + '/addToMannschaft', { personenIDs: personsNotInMannschaft, mannschaftID })
      .then(function (response) {
        const mannschaft = MannschaftenState.mannschaften.find((team) => team.id === response.data.id)
        mannschaft.mitglieder = response.data.mitglieder;
        MannschaftenState.setMannschaften([...MannschaftenState.mannschaften]);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  const deleteMitglied = (mitglied, team) => {
    axios
      .put(BASE_URL_MANNSCHAFT + '/removeFromMannschaft', { personenID: mitglied.personenId, mannschaftID: team.id })
      .then(function (response) {
        team.mitglieder = team.mitglieder.filter((person) => person.personenId !== mitglied.personenId)
        MannschaftenState.setMannschaften([...MannschaftenState.mannschaften]);
      })
      .catch(function (error) {
        console.log(error);
      });
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
      {authState.user.role ? <Button
        size='small'
        variant='contained'
        color='primary'
        onClick={() => {
          setOpen(true);
        }}
      >
        Team hinzufügen
      </Button> : ''}
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
                    <div key={personObject.personenId} style={{ display: 'flex', justifyContent: 'space-between', marginTop: 5 }}>
                      <div>
                        {getPerson(personObject.personenId).id} -
                      {getPerson(personObject.personenId).firstName} {' '}
                        {getPerson(personObject.personenId).lastName}
                      </div>
                      {authState.user.role ? <Button width='10' color='secondary' size='small' variant='text' onClick={() => {
                        deleteMitglied(personObject, team);
                      }}>x</Button> : ''}
                    </div>
                  );
                } else {
                  return <div key={personObject.personenId}></div>;
                }
              })}
            </CardContent>
            {authState.user.role ? <CardActions>
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
            </CardActions> : ''}
          </Card>
        ))}
      </div>
    </>
  );
};
