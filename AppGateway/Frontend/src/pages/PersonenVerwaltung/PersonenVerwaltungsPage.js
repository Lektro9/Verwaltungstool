import { useContext, useState } from 'react';
import { Button, Container } from '@material-ui/core';
import { DataGrid } from '@material-ui/data-grid';
import { useAuth } from '../../hooks/useAuth';
import { CreatePersonModal } from './createPersonModal';

import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';

const persons = [
  {
    id: 1,
    firstName: 'testName',
    lastName: 'testLastname',
    birthday: 1611586940792,
  },
  {
    id: 2,
    firstName: 'testName',
    lastName: 'testLastname',
    birthday: 1611586940792,
  },
  {
    id: 3,
    firstName: 'testName',
    lastName: 'testLastname',
    birthday: 1611586940792,
  },
  {
    id: 4,
    firstName: 'testName',
    lastName: 'testLastname',
    birthday: 1611586940792,
  },
  {
    id: 5,
    firstName: 'testName',
    lastName: 'testLastname',
    birthday: 1611586940792,
  },
  {
    id: 6,
    firstName: 'testName',
    lastName: 'testLastname',
    birthday: 1611586940792,
  },
];

export const PersonenVeraltungsPage = () => {
  const authState = useContext(useAuth);
  const URLData = 'http://localhost:3005/getData';
  const [myPersons, setMyPersons] = useState(persons);
  const [open, setOpen] = useState(false);

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'firstName', headerName: 'Vorname', width: 130 },
    { field: 'lastName', headerName: 'Nachname', width: 130 },
    {
      field: 'birthday',
      headerName: 'Geburtstag',
      type: 'date',
      width: 150,
      valueFormatter: (params) => new Date(params.value).toLocaleDateString(),
    },
    {
      field: 'fullName',
      headerName: 'Full name',
      description: 'This column has a value getter and is not sortable.',
      sortable: false,
      width: 180,
      valueGetter: (params) =>
        `${params.getValue('firstName') || ''} ${
          params.getValue('lastName') || ''
        }`,
    },
    {
      field: 'delete',
      headerName: 'Löschen',
      width: 150,
      renderCell: (params) => (
        <Button
          color='secondary'
          variant='contained'
          onClick={() => {
            deletePerson(params.getValue('id'));
          }}
        >
          lösche {params.getValue('id')}
        </Button>
      ),
    },
  ];

  const deletePerson = (id) => {
    //TODO: post delete here
    console.log(`delete Person with id: ${id}`);
    setMyPersons(myPersons.filter((per) => per.id !== id));
  };

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const addPersonFromChild = (newPerson) => {
    const newArr = [...myPersons, newPerson];
    setMyPersons(newArr);
  };

  return (
    <div>
      <h2>Personenverwaltung</h2>
      <Button
        onClick={() => {
          addPersonFromChild({
            id: new Date().getTime(),
            firstName: 'testName',
            lastName: 'testLastname',
            birthday: 1611586940792,
          });
        }}
      >
        addPers
      </Button>
      <Button variant='contained' color='primary' onClick={handleClickOpen}>
        Person Erstellen
      </Button>
      <Container maxWidth='md'>
        <div
          style={{
            width: '100%',
            height: 500,
          }}
        >
          <Dialog open={open} onClose={handleClose}>
            <DialogTitle id='createPerson' onClose={handleClose}>
              Person hinzufügen
            </DialogTitle>
            <DialogContent>
              <CreatePersonModal addPersonFromChild={addPersonFromChild} />
            </DialogContent>
          </Dialog>
          <DataGrid rows={myPersons} columns={columns} pageSize={10} />
        </div>
      </Container>
    </div>
  );
};
