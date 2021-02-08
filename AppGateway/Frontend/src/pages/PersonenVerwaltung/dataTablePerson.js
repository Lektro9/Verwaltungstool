import React, { useState, useContext } from "react";

/*---Material---*/
import { Container } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import { DataGrid } from "@material-ui/data-grid";
import { usePersons } from "../../hooks/usePerson";

import { deletePerson } from "../../components/personCrud";
import EditPerson from "./editPerson";

const DataTablePerson = () => {
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
        `${params.getValue("firstName") || ""} ${
          params.getValue("lastName") || ""
        }`,
    },
    {
      field: "delete",
      headerName: "Löschen",

      renderCell: (params) => (
        <IconButton
          aria-label="delete"
          onClick={() => {
            deletePer(params.getValue("id"));
          }}
        >
          <DeleteIcon />
        </IconButton>
      ),
    },
    {
      field: "edit",
      headerName: "Editieren",

      renderCell: (params) => (
        <IconButton
          aria-label="edit"
          onClick={() => {
            editPer(params.getValue("id"));
          }}
        >
          <EditIcon />
        </IconButton>
      ),
    },
  ];

  const deletePer = (id) => {
    deletePerson(id);
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
      <EditPerson onClick={handleClose} dialogState={open} person={PersonState.persons.filter((person) => person.id === personId)} />
    </Container>
  );
};

export default DataTablePerson;
