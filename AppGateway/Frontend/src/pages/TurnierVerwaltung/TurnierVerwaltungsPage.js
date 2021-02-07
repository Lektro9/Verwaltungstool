import {
  Button,
  Card,
  CardActions,
  CardContent,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Paper,
  Typography,
} from '@material-ui/core';
import { useContext, useState } from 'react';
import { ChoosingTable } from '../../components/ChoosingTable';
import { useMannschaften } from '../../hooks/useMannschaft';
import { useTurniere } from '../../hooks/useTurnier';
import { CreateTurnierModal } from './createTurnierModal';
import { SelectTeamsAndPoints } from './selectTeamsAndPoints';

export const TurnierVerwaltungsPage = () => {
  const TurniereState = useContext(useTurniere);
  const MannschaftenState = useContext(useMannschaften);
  const [open, setOpen] = useState(false);
  const [turnierRemoveMannModals, setTurnierRemoveMannModals] = useState(
    TurniereState.turniere.reduce((accumulator, currentValue) => {
      return { ...accumulator, [currentValue.id]: false };
    }, {})
  );
  const [turnierAddMannModals, setTurnierAddMannModals] = useState(
    TurniereState.turniere.reduce((accumulator, currentValue) => {
      return { ...accumulator, [currentValue.id]: false };
    }, {})
  );

  const getTeamName = (teamId) => {
    const teamName = MannschaftenState.mannschaften.find(
      (team) => team.id === teamId
    )?.name;
    return teamName || 'Team not Found';
  };
  const getTeamsFromIds = (teamIds) => {
    const teamsInTourney = [];
    teamIds.forEach((teamId) => {
      MannschaftenState.mannschaften.forEach((mannschaft) => {
        if (mannschaft.id === teamId) {
          teamsInTourney.push(mannschaft);
        }
      });
    });
    return teamsInTourney;
  };
  const addTurnier = (newTurnier) => {
    TurniereState.setTurniere([newTurnier, ...TurniereState.turniere]);
  };
  const deleteTurnier = (turnierId) => {
    const newArr = TurniereState.turniere.filter(
      (turnier) => turnier.id !== turnierId
    );
    TurniereState.setTurniere(newArr);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const addGame = (game) => {
    const modifyTourney = TurniereState.turniere.find(
      (turnier) => turnier.id === game.turnierId
    );
    modifyTourney.games.push(game);
    TurniereState.setTurniere([...TurniereState.turniere]);
  };

  const removeTeamsFromTurnier = (
    teamIds,
    teamsAlreadyInTurnier = [],
    turnier
  ) => {
    teamIds.forEach((teamId) => {
      const index = turnier.teamIds.indexOf(teamId);
      if (index > -1) {
        turnier.teamIds.splice(index, 1);
      }
      //remove all games with those teams
      turnier.games.forEach((game) => {
        if (game.team1Id === teamId || game.team2Id === teamId) {
          const indexOfGame = turnier.games.indexOf(game);
          if (indexOfGame > -1) {
            turnier.games.splice(indexOfGame, 1);
          }
        }
      });
    });

    TurniereState.setTurniere([...TurniereState.turniere]);
  };

  const addTeamsToTurnier = (
    teamIds,
    teamsAlreadyInTurnier = [],
    turnier = {}
  ) => {
    //find duplicates, so they won't be added twice
    const teamsNotAlreadyInTurnier = teamIds.filter(
      (x) => !teamsAlreadyInTurnier.includes(x)
    );
    turnier.teamIds = [...turnier.teamIds, ...teamsNotAlreadyInTurnier];
    TurniereState.setTurniere([...TurniereState.turniere]);
  };

  const openAddTeam = (turnierId) => {
    turnierAddMannModals[turnierId] = true;
    setTurnierAddMannModals({ ...turnierAddMannModals });
  };

  const openRemoveTeam = (turnierId) => {
    turnierRemoveMannModals[turnierId] = true;
    setTurnierRemoveMannModals({ ...turnierRemoveMannModals });
  };

  const closeAddTeam = (turnierId) => {
    turnierAddMannModals[turnierId] = false;
    setTurnierAddMannModals({ ...turnierAddMannModals });
  };
  const closeRemoveTeam = (turnierId) => {
    turnierRemoveMannModals[turnierId] = false;
    setTurnierRemoveMannModals({ ...turnierRemoveMannModals });
  };
  const deleteGame = (turnier, game) => {
    const indexOfGame = turnier.games.indexOf(game);
    if (indexOfGame > -1) {
      turnier.games.splice(indexOfGame, 1);
    }
    TurniereState.setTurniere([...TurniereState.turniere]);
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
      <Button
        variant='outlined'
        color='primary'
        onClick={() => {
          setOpen(true);
        }}
      >
        Turnier hinzufügen
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle id='createTurnier' onClose={handleClose}>
          Turnier hinzufügen
        </DialogTitle>
        <DialogContent>
          <CreateTurnierModal addTurnier={addTurnier} />
        </DialogContent>
      </Dialog>
      <Container maxWidth='md'>
        {TurniereState.turniere.map((turnier) => (
          <Card style={{ width: '100%', margin: 10 }} key={turnier.id}>
            <CardContent>
              <Typography gutterBottom variant='h5' component='h2'>
                {turnier.name}
              </Typography>
              <Button
                size='small'
                color='primary'
                onClick={() => {
                  openAddTeam(turnier.id);
                }}
              >
                Mannschaften hinzufügen
              </Button>
              <Button
                size='small'
                color='secondary'
                onClick={() => {
                  openRemoveTeam(turnier.id);
                }}
              >
                Mannschaften entfernen
              </Button>
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
                  <Button
                    style={{ height: '40%', marginTop: 15 }}
                    size='small'
                    variant='contained'
                    color='secondary'
                    onClick={() => {
                      deleteGame(turnier, game);
                    }}
                  >
                    X
                  </Button>
                </div>
              ))}
              <Divider style={{ marginTop: 20 }} />
              <SelectTeamsAndPoints turnier={turnier} addGame={addGame} />
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
            <Dialog
              open={turnierRemoveMannModals[turnier.id]}
              onClose={() => {
                closeRemoveTeam(turnier.id);
              }}
            >
              <ChoosingTable
                title={'Mannschaften entfernen'}
                teams={getTeamsFromIds(turnier.teamIds)}
                action={removeTeamsFromTurnier}
                turnier={turnier}
                buttonInfo={['secondary', 'entfernen']}
              />
            </Dialog>
            <Dialog
              open={turnierAddMannModals[turnier.id]}
              onClose={() => {
                closeAddTeam(turnier.id);
              }}
            >
              <ChoosingTable
                title={'Mannschaften hinzufügen'}
                teams={MannschaftenState.mannschaften}
                teamsAlreadyInTurnier={turnier.teamIds}
                action={addTeamsToTurnier}
                turnier={turnier}
                buttonInfo={['primary', 'hinzufügen']}
              />
            </Dialog>
          </Card>
        ))}
      </Container>
    </>
  );
};
