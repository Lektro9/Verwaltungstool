import {
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
} from '@material-ui/core';
import { useContext } from 'react';
import { useMannschaften } from '../../hooks/useMannschaft';
import { usePersons } from '../../hooks/usePerson';

export const MannschaftsVerwaltungsPage = () => {
  const PersonState = useContext(usePersons);
  const MannschaftenState = useContext(useMannschaften);

  const getPerson = (personId) => {
    return PersonState.persons.find((person) => person.id === personId);
  };

  const deleteTeam = (teamId) => {
    MannschaftenState.setMannschaften(
      MannschaftenState.mannschaften.filter((team) => team.id !== teamId)
    );
  };

  const addTeam = (newTeam) => {
    MannschaftenState.setMannschaften([
      ...MannschaftenState.mannschaften,
      newTeam,
    ]);
  };

  return (
    <>
      <Button
        size='small'
        color='primary'
        onClick={() =>
          addTeam({
            id: new Date().getTime() / 10000,
            name: 'newTeam',
            mitglieder: [2, 3],
          })
        }
      >
        Team add
      </Button>
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
