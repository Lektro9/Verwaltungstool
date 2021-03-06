import React, { useState, useContext, useEffect } from "react";
import axios from "axios";

/*---Material---*/
import { Container } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import { DataGrid } from "@material-ui/data-grid";
import { usePersons } from "../../hooks/usePerson";

import EditPerson from "./editPerson";
import { useAuth } from "../../hooks/useAuth";

const REACT_APP_PERSONEN = process.env.REACT_APP_PERSONEN || "http://localhost:3004/api/personenverwaltung";

const DataTablePerson = () => {
  const authState = useContext(useAuth);
  const PersonState = useContext(usePersons);

  const [open, setOpen] = useState(false);
  const [personId, setPersonId] = useState(0);

  const handleClose = () => {
    setOpen(false);
  };

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "type", headerName: "Type", width: 130 },
    { field: "firstName", headerName: "Vorname", width: 130 },
    { field: "lastName", headerName: "Nachname", width: 130 },
    {
      field: "birthday",
      headerName: "Geburtstag",
      type: "date",
      width: 150,
      valueFormatter: (params) => new Date(params.value).toLocaleDateString(),
    },
    {
      field: "fullName",
      headerName: "Full name",
      description: "This column has a value getter and is not sortable.",
      sortable: false,
      width: 180,
      valueGetter: (params) =>
        `${params.getValue("firstName") || ""} ${params.getValue("lastName") || ""
        }`,
    },
    {
      field: "delete",
      headerName: "Löschen",

      renderCell: (params) => {
        if (authState.user.role) {
          return (
            <IconButton
              aria-label="delete"
              onClick={() => {
                deletePer(params.getValue("id"));
              }}
            >
              <DeleteIcon />
            </IconButton>
          );
        }
      },
    },
    {
      field: "edit",
      headerName: "Editieren",

      renderCell: (params) => {
        if (authState.user.role) {
          return (
            <IconButton
              aria-label="edit"
              onClick={() => {
                editPer(params.getValue("id"));
              }}
            >
              <EditIcon />
            </IconButton>
          );
        }
      },
    },
  ];

  const deletePer = (id) => {
    axios
      .delete(REACT_APP_PERSONEN + '/persons/' + id)
      .then(() => {
        PersonState.setPersons(
          PersonState.persons.filter((person) => person.id !== id)
        );
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const editPer = (id) => {
    setPersonId(id);
    setOpen(true);
  };

  return (
    <Container>
      <div
        style={{
          width: "100%",
          height: 500,
        }}
      >
        <DataGrid rows={PersonState.persons} columns={columns} pageSize={10} />
      </div>
      <EditPerson
        onClick={handleClose}
        dialogState={open}
        person={PersonState.persons.filter((person) => person.id === personId)}
      />
    </Container>
  );
};

export default DataTablePerson;
