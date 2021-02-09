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
import { useContext, useState, useEffect } from 'react';
import { ChoosingTable } from '../../components/ChoosingTable';
import { useMannschaften } from '../../hooks/useMannschaft';
import { useTurniere } from '../../hooks/useTurnier';
import { CreateTurnierModal } from './createTurnierModal';
import { SelectTeamsAndPoints } from './selectTeamsAndPoints';
import axios from 'axios';
import { useAuth } from '../../hooks/useAuth';

const BASE_URL_TURNIER = "http://localhost:3007";
const BASE_URL_MANNSCHAFTEN = "http://localhost:3006";

export const TurnierVerwaltungsPage = () => {
  const authState = useContext(useAuth);
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

  // Daten werden einmal beim Aufruf der Seite geholt
  useEffect(() => {
    axios
      .get(BASE_URL_MANNSCHAFTEN + '/getMannschaften')
      .then(function (response) {
        MannschaftenState.setMannschaften(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
    axios
      .get(BASE_URL_TURNIER + '/getTurniere')
      .then(function (response) {
        TurniereState.setTurniere([...response.data]);
      })
      .catch(function (error) {
        console.log(error);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // update the boolean collection object so modal booleans are tracked correctly
  useEffect(() => {
    setTurnierRemoveMannModals(TurniereState.turniere.reduce((accumulator, currentValue) => {
      return { ...accumulator, [currentValue.id]: false };
    }, {}))
    setTurnierAddMannModals(TurniereState.turniere.reduce((accumulator, currentValue) => {
      return { ...accumulator, [currentValue.id]: false };
    }, {}))
  }, [TurniereState.turniere])

  const getTeamName = (teamId) => {
    const teamName = MannschaftenState.mannschaften.find(
      (team) => team.id === teamId
    )?.name;
    return teamName || 'Team not Found';
  };
  const getTeamsFromIds = (teilnehmer) => {
    const teamsInTourney = [];
    if (teilnehmer && teilnehmer.length > 0) {
      teilnehmer.forEach((team) => {
        MannschaftenState.mannschaften.forEach((mannschaft) => {

          if (mannschaft.id === team.mannschaftID) {
            teamsInTourney.push(mannschaft);
          }
        });
      });
    }
    return teamsInTourney;
  };
  const addTurnier = (newTurnier) => {
    axios
      .post(BASE_URL_TURNIER + '/createTurnier', newTurnier)
      .then(function (response) {
        TurniereState.setTurniere([
          ...TurniereState.turniere,
          response.data,
        ]);
      })
      .catch(function (error) {
        console.log(error);
      });
    TurniereState.setTurniere([newTurnier, ...TurniereState.turniere]);
  };
  const deleteTurnier = (turnier) => {
    axios
      .delete(BASE_URL_TURNIER + '/deleteTurnier/' + turnier.id)
      .then(function (response) {
        const indexOfGame = TurniereState.turniere.indexOf(turnier);
        if (indexOfGame > -1) {
          TurniereState.turniere.splice(indexOfGame, 1);
        }
        TurniereState.setTurniere([...TurniereState.turniere]);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const handleClose = () => {
    setOpen(false);
  };

  const addGame = (game) => {
    axios
      .post(BASE_URL_TURNIER + '/addSpielToTurnier', { turnierID: game.turnierId, game: game })
      .then(function (response) {
        const turnier = TurniereState.turniere.find(
          (turnier) => turnier.id === response.data.id
        );
        turnier.games = response.data.games;

        TurniereState.setTurniere([...TurniereState.turniere]);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const removeTeamsFromTurnier = (
    teamIds,
    teamsAlreadyInTurnier = [],
    turnier
  ) => {
    axios
      .delete(BASE_URL_TURNIER + '/removeTeilnehmerFromTurnier', { data: { turnierID: turnier.id, teilnehmerIDs: teamIds } })
      .then(function (response) {
        turnier.teilnehmer = response.data.teilnehmer
        turnier.games = response.data.games
        TurniereState.setTurniere([
          ...TurniereState.turniere
        ]);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const addTeamsToTurnier = (
    selectedTeamIds,
    teamsAlreadyInTurnier = [],
    turnier = {}
  ) => {

    //find duplicates, so they won't be added twice
    const teamsIdsAlreadyInTurnier = [];
    teamsAlreadyInTurnier.forEach((teamInTurnier) => {
      selectedTeamIds.forEach((teamId) => {
        if (teamInTurnier.mannschaftID === teamId) {
          teamsIdsAlreadyInTurnier.push(teamInTurnier.mannschaftID)
        }
      })
    })
    const teamIdsNotInTurnier = selectedTeamIds.filter(
      (teamId) => {
        if (!teamsIdsAlreadyInTurnier.includes(teamId)) {
          return teamId
        }
      }
    );

    axios
      .post(BASE_URL_TURNIER + '/addTeilnehmerToTurnier', { turnierID: turnier.id, teilnehmerIDs: teamIdsNotInTurnier })
      .then(function (response) {
        turnier.teilnehmer = response.data.teilnehmer
        TurniereState.setTurniere([
          ...TurniereState.turniere
        ]);
      })
      .catch(function (error) {
        console.log(error);
      });
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
    axios
      .delete(BASE_URL_TURNIER + '/removeSpielFromTurnier/' + game.id)
      .then(function (response) {
        const indexOfGame = turnier.games.indexOf(game);
        if (indexOfGame > -1) {
          turnier.games.splice(indexOfGame, 1);
        }
        TurniereState.setTurniere([...TurniereState.turniere]);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  return (
    <>
      {authState.user.role ? <Button
        variant='outlined'
        color='primary'
        onClick={() => {
          setOpen(true);
        }}
      >
        Turnier hinzufügen
      </Button> : ''}
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
              {authState.user.role ? <>
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
              </> : ''}
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
                    {getTeamName(game.team1Id)} - {game.team1Punkte}
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
                    {game.team2Punkte} - {getTeamName(game.team2Id)}
                  </Paper>
                  {authState.user.role ? <Button
                    style={{ height: '40%', marginTop: 15 }}
                    size='small'
                    variant='contained'
                    color='secondary'
                    onClick={() => {
                      deleteGame(turnier, game);
                    }}
                  >
                    X
                  </Button> : ''}
                </div>
              ))}
              <Divider style={{ marginTop: 20 }} />
              {authState.user.role ? <SelectTeamsAndPoints turnier={turnier} addGame={addGame} /> : ''}
            </CardContent>
            {authState.user.role ? <CardActions>
              <Button
                size='small'
                color='secondary'
                onClick={() => {
                  deleteTurnier(turnier);
                }}
              >
                Turnier Löschen
              </Button>
            </CardActions> : ''}
            <Dialog
              open={turnierRemoveMannModals[turnier.id]}
              onClose={() => {
                closeRemoveTeam(turnier.id);
              }}
            >
              <ChoosingTable
                title={'Mannschaften entfernen'}
                teams={getTeamsFromIds(turnier.teilnehmer)}
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
                teamsAlreadyInTurnier={turnier.teilnehmer}
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
