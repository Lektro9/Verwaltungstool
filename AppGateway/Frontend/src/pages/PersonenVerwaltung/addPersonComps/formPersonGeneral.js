
import { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@material-ui/core";

const useStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "column",
  },
  formControl: {
    margin: "5px 10px",
    width: "60ch",
  },
});

const FormPersonGeneral = ({ onAddPersonData }) => {
  const classes = useStyles();

  const [menu, setMenu] = useState('');

  const handleMenuChange = (event) => {
    setMenu(event.target.value);
  };

  return (
    <div className={classes.root}>
      <FormControl className={classes.formControl}>
        <TextField
          variant="outlined"
          required
          id="firstName"
          label="Vorname"
          name="firstName"
          autoFocus
          onInput={onAddPersonData}
        />
      </FormControl>
      <FormControl className={classes.formControl}>
        <TextField
          variant="outlined"
          required
          name="lastName"
          label="Nachname"
          id="lastName"
          onInput={onAddPersonData}
        />
      </FormControl>
      <FormControl className={classes.formControl}>
        <TextField
          variant="outlined"
          required
          name="date"
          id="date"
          fullWidth
          type="date"
          onInput={onAddPersonData}
        />
      </FormControl>

      <FormControl className={classes.formControl}>
        <InputLabel id="personType-label">Personentyp</InputLabel>
        <Select
          labelId="personType-label"
          name="type"
          id="personType"
          value={menu}
          onChange={(e) => {onAddPersonData(e); handleMenuChange(e);}}
        >
          <MenuItem value={"fussballspieler"}>Fußballspieler</MenuItem>
          <MenuItem value={"handballspieler"}>Handballspieler</MenuItem>
          <MenuItem value={"tennisspieler"}>Tennisspieler</MenuItem>
          <MenuItem value={"trainer"}>Trainer</MenuItem>
          <MenuItem value={"physiotherapeut"}>Physiotherapeut</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
};

export default FormPersonGeneral;
