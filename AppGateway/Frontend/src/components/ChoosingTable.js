import {
  Button,
  Checkbox,
  DialogActions,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@material-ui/core';
import { useState } from 'react';

export const ChoosingTable = (props) => {
  const [chosenTeams, setChosenTeams] = useState(
    props.teams.reduce((accumulator, currentValue) => {
      return { ...accumulator, [currentValue.id]: false };
    }, {})
  );
  const toggleTeam = (teamId, checked) => {
    chosenTeams[teamId] = checked;
    setChosenTeams({ ...chosenTeams });
  };
  return (
    <>
      <DialogTitle id='createTurnier'>{props.title}</DialogTitle>
      <DialogContent>
        <TableContainer>
          <Table size='small' aria-label='a dense table'>
            <TableHead>
              <TableRow>
                <TableCell>Auswahl</TableCell>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {props.teams.map((team) => (
                <TableRow key={team.id}>
                  <TableCell padding='checkbox'>
                    <Checkbox
                      checked={chosenTeams[team.id]}
                      onChange={(e) => {
                        toggleTeam(team.id, e.target.checked);
                      }}
                    />
                  </TableCell>
                  <TableCell component='th' scope='row'>
                    {team.id}
                  </TableCell>
                  <TableCell component='th' scope='row'>
                    {team.name}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      <DialogActions>
        <Button
          variant='contained'
          color={props.buttonInfo[0]}
          onClick={() => {
            let teamIds = [];
            for (const property in chosenTeams) {
              if (chosenTeams[property]) {
                teamIds.push(+property);
              }
            }
            props.action(teamIds, props.teamsAlreadyInTurnier, props.turnier);
          }}
        >
          {props.buttonInfo[1]}
        </Button>
      </DialogActions>
    </>
  );
};
