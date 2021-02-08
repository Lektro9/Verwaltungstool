import { makeStyles } from "@material-ui/core/styles";
import { TextField, FormControl } from "@material-ui/core";

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

const FormPersonSpecific = ({ handleSpecificData, personType }) => {
  const classes = useStyles();

  console.log(personType);
  const displayInputfield = () => {
    switch (personType) {
      case "fussballspieler":
        return (
          <FormControl className={classes.formControl}>
            <TextField
              variant="outlined"
              required
              name="fieldPosition"
              label="Spielposition"
              id="fussballfieldPosition"
              onInput={handleSpecificData}
            />
          </FormControl>
        );

      case "handballspieler":
        return (
          <FormControl className={classes.formControl}>
            <TextField
              variant="outlined"
              required
              name="fieldPosition"
              label="Spielposition"
              id="handballfieldPosition"
              onInput={handleSpecificData}
            />
          </FormControl>
        );

      case "tennisspieler":
        return (
          <FormControl className={classes.formControl}>
            <TextField
              variant="outlined"
              required
              name="handedness"
              label="Händigkeit"
              id="handedness"
              onInput={handleSpecificData}
            />
          </FormControl>
        );

      case "trainer":
        return (
          <FormControl className={classes.formControl}>
            <TextField
              variant="outlined"
              required
              name="experience"
              label="Erfahrung"
              id="experience"
              onInput={handleSpecificData}
            />
          </FormControl>
        );

      case "physiotherapeut":
        return (
          <FormControl className={classes.formControl}>
            <TextField
              variant="outlined"
              required
              name="treatmentType"
              label="Behandlungsmethode"
              id="treatmentType"
              onInput={handleSpecificData}
            />
          </FormControl>
        );
      default:
        return <div>Wrong Persontype</div>;
    }
  };

  return <div className={classes.root}>{displayInputfield()}</div>;
};

export default FormPersonSpecific;
