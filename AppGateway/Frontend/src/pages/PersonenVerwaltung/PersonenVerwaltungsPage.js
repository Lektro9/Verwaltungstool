import { useState } from "react";

/*---Material---*/
import { Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
/*---Components---*/
import DataTablePerson from "./dataTablePerson";
import AddPerson from "./addPerson";

const useStyles = makeStyles({
  root:{
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center"
  },
 buttons:{
   marginBottom: "1em"
 }
});

export const PersonenVeraltungsPage = () => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className={classes.root}>
      <h2>Personenverwaltung</h2>
      <div className={classes.buttons}>
        <Button variant="contained" color="primary" onClick={handleClickOpen}>
          Person Erstellen
        </Button>
      </div>

      <DataTablePerson />
      {/* DialogWindow */}
      <AddPerson onClick={handleClose} dialogState={open} />
    </div>
  );
};
