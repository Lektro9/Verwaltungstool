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
import { useContext, useState } from 'react';
import { useMannschaften } from '../../hooks/useMannschaft';
import { usePersons } from '../../hooks/usePerson';
import { CreateMannschaftModal } from './createMannschaftModal';

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
              {team.mitglieder.map((personId) => {
                const foundPers = getPerson(personId);
                if (foundPers) {
                  return (
                    <div key={personId}>
                      {getPerson(personId).id} - {getPerson(personId).firstName}
                      {getPerson(personId).lastName}
                    </div>
                  );
                } else {
                  return;
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
