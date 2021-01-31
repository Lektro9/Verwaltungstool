import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Typography,
} from '@material-ui/core';
import { useContext } from 'react';
import { useMannschaften } from '../../hooks/useMannschaft';
import { useTurniere } from '../../hooks/useTurnier';

export const TurnierVerwaltungsPage = () => {
  const TurniereState = useContext(useTurniere);
  const MannschaftenState = useContext(useMannschaften);
  const handleChange = (event) => {
    console.log(event);
  };
  const getTeamName = (teamId) => {
    const teamName = MannschaftenState.mannschaften.find(
      (team) => team.id === teamId
    )?.name;
    return teamName || 'Team not Found';
  };
  const addTurnier = (newTurnier) => {
    TurniereState.setTurniere([...TurniereState.turniere, newTurnier]);
  };
  const deleteTurnier = (turnierId) => {
    const newArr = TurniereState.turniere.filter(
      (turnier) => turnier.id !== turnierId
    );
    TurniereState.setTurniere(newArr);
  };
  return (
    <>
      <Button
        variant='outlined'
        color='primary'
        onClick={() => {
          const newTourney = {
            id: Math.floor(Math.random() * 1000),
            name: 'TestTurnier',
            teamIds: [1, 2, 3],
            games: [
              {
                id: Math.floor(Math.random() * 1000),
                team1Id: 1,
                team2Id: 2,
                team1Points: 5,
                team2Points: 4,
              },
              {
                id: Math.floor(Math.random() * 1000),
                team1Id: 2,
                team2Id: 1,
                team1Points: 2,
                team2Points: 3,
              },
            ],
          };
          addTurnier(newTourney);
        }}
      >
        addTourney
      </Button>
      <Container maxWidth='md'>
        {TurniereState.turniere.map((turnier) => (
          <Card style={{ width: '100%', margin: 10 }} key={turnier.id}>
            <CardContent>
              <Typography gutterBottom variant='h5' component='h2'>
                {turnier.name}
              </Typography>

              {turnier.games.map((game) => (
                <div style={{ display: 'flex' }} key={game.id}>
                  <Paper
                    elevation={1}
                    style={{
                      padding: 10,
                      margin: 10,
                      flexBasis: 0,
                      flexGrow: 1,
                      textAlign: 'center',
                    }}
                  >
                    {getTeamName(game.team1Id)} - {game.team1Points}
                  </Paper>
                  <Paper
                    elevation={1}
                    style={{
                      padding: 10,
                      margin: 10,
                      flexBasis: 0,
                      flexGrow: 1,
                      textAlign: 'center',
                    }}
                  >
                    {game.team2Points} - {getTeamName(game.team2Id)}
                  </Paper>
                </div>
              ))}
            </CardContent>
            <CardActions>
              <Button
                size='small'
                color='secondary'
                onClick={() => {
                  deleteTurnier(turnier.id);
                }}
              >
                Turnier Löschen
              </Button>
            </CardActions>
          </Card>
        ))}
      </Container>
    </>
  );
};
