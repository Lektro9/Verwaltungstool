import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@material-ui/core';
import { useContext, useState } from 'react';
import { useMannschaften } from '../../hooks/useMannschaft';

export const SelectTeamsAndPoints = (props) => {
  //this should only be the teams playing in the tourney
  const MannschaftenState = useContext(useMannschaften);

  const teamsInTournament = () => {
    const teamsInTournament = []
    props.turnier?.teilnehmer?.map((teilnehmerTeam) => {
      const returnTeam = MannschaftenState.mannschaften.find((team) => {
        if (team.id === teilnehmerTeam.mannschaftID) {
          return team;
        }
      });
      if (returnTeam)
        teamsInTournament.push(returnTeam)
    });
    return (teamsInTournament)
  }
  const [team1Id, setTeam1Id] = useState();
  const [team1Points, setTeam1Points] = useState(0);
  const [team2Id, setTeam2Id] = useState();
  const [team2Points, setTeam2Points] = useState(0);
  return (
    <>
      <FormControl style={{ width: '35%' }}>
        <InputLabel id='team1'>Team 1</InputLabel>
        <Select
          labelId='team1'
          id='simple-team1'
          value={team1Id}
          onChange={(event) => {
            setTeam1Id(event.target.value);
          }}
        >
          {teamsInTournament().length > 0 && teamsInTournament().map((team) => {
            return (
              <MenuItem value={team.id} key={team.id}>
                {team.name}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
      <TextField
        style={{ width: '5%', marginLeft: 10 }}
        id='standard-number'
        label='Pts'
        type='number'
        onChange={(event) => {
          setTeam1Points(event.target.value);
        }}
      />
      <TextField
        style={{ width: '5%', marginLeft: 40 }}
        id='standard-number'
        label='Pts'
        type='number'
        onChange={(event) => {
          setTeam2Points(event.target.value);
        }}
      />
      <FormControl style={{ width: '35%', marginLeft: 10 }}>
        <InputLabel id='team2'>Team 2</InputLabel>
        <Select
          labelId='team2'
          id='simple-team2'
          value={team2Id}
          onChange={(event) => {
            setTeam2Id(event.target.value);
          }}
        >
          {teamsInTournament().length > 0 && teamsInTournament().map((team) => {
            return (
              <MenuItem value={team.id} key={team.id}>
                {team.name}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
      <Button
        color='primary'
        onClick={() => {
          props.addGame({
            id: Math.floor(Math.random() * 1000),
            turnierId: props.turnier.id,
            team1Id,
            team1Points,
            team2Id,
            team2Points,
          });
        }}
      >
        add Match
      </Button>
    </>
  );
};
