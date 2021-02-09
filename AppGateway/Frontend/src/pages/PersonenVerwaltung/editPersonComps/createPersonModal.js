import { useState, useContext } from "react";

/*---Material---*/
import { makeStyles } from "@material-ui/core/styles";
import {
  Button,
  Stepper,
  Typography,
  Step,
  StepLabel,
  TextField,
  FormControl,
} from "@material-ui/core";
import ErrorIcon from "@material-ui/icons/Error";

/*---Comps---*/
import { updatePerson } from "../../../components/personCrud";
import { usePersons } from "../../../hooks/usePerson";

const useStyles = makeStyles({
  main: {
    width: "100%",
  },
  root: {
    display: "flex",
    flexDirection: "column",
  },
  formControl: {
    margin: "5px 10px",
    width: "60ch",
  },
});

const getSteps = () => {
  return ["Personendaten", "Typdaten"];
};

const CreatePersonModal = ({ handleDialogClose, person }) => {
  const classes = useStyles();
  const personState = useContext(usePersons);
console.log(person[0])
  const personSpecificKeys = {
    fussballspieler: "fieldPosition",
    handballspieler: "fieldPosition",
    tennisspieler: "handedness",
    trainer: "experience",
    physiotherapeut: "treatmentType",
  };

  const translation = {
    fieldPosition: "Position",
    handedness: "Handigkeit",
    experience: "Erfahrung",
    treatmentType: "Therapiemethode",
  };

  const [firstName, setFirstName] = useState(person[0].firstName);
  const [lastName, setLastName] = useState(person[0].lastName);
  const [birthday, setBirthday] = useState(
    new Date(person[0].birthday).toISOString().split("T")[0]
  );
  const [specific, setSpecific] = useState(
    person[0][person[0].type][personSpecificKeys[person[0].type]]
  );

  const [activeStep, setActiveStep] = useState(0);
  const steps = getSteps();

  const handleSubmit = (e) => {
    e.preventDefault();
    let updated = {
      type: person[0].type,
      firstName: firstName,
      lastName: lastName,
      birthday: new Date(birthday).getTime(),
    };
    updated[personSpecificKeys[person[0].type]] = specific;

    let result = updatePerson(person[0].id, updated);
    result.then((response) => {
      if (response.status === 200) {
        personState.persons.forEach((p) => {
          if (p.id === person[0].id) {
            p.firstName = firstName;
            p.lastName = lastName;
            p.birthday = birthday;
            p[personSpecificKeys[person[0].type]] = specific;
            personState.setPersons([...personState.persons]);
          }
        });
      }
    });

    handleDialogClose();
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleReset = () => {
    setFirstName(person[0].firstName);
    setLastName(person[0].lastName);
    setBirthday(new Date(person[0].birthday).toISOString().split("T")[0]);
    setSpecific(person[0][person[0].type][personSpecificKeys[person[0].type]]);
    setActiveStep(0);
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
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
                value={firstName}
                onInput={(e) => {
                  setFirstName(e.target.value);
                }}
              />
            </FormControl>
            <FormControl className={classes.formControl}>
              <TextField
                variant="outlined"
                required
                name="lastName"
                label="Nachname"
                id="lastName"
                value={lastName}
                onInput={(e) => {
                  setLastName(e.target.value);
                }}
              />
            </FormControl>
            <FormControl className={classes.formControl}>
              <TextField
                variant="outlined"
                required
                name="birthday"
                id="birthday"
                fullWidth
                type="date"
                value={birthday}
                onInput={(e) => {
                  setBirthday(e.target.value);
                }}
              />
            </FormControl>
          </div>
        );
      case 1:
        switch (person[0].type) {
          case "fussballspieler":
            return (
              <FormControl className={classes.formControl}>
                <TextField
                  variant="outlined"
                  required
                  name="fieldPosition"
                  label="Spielposition"
                  id="fussballfieldPosition"
                  value={specific}
                  onInput={(e) => {
                    setSpecific(e.target.value);
                  }}
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
                  value={specific}
                  onInput={(e) => {
                    setSpecific(e.target.value);
                  }}
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
                  value={specific}
                  onInput={(e) => {
                    setSpecific(e.target.value);
                  }}
                />
              </FormControl>
            );

          case "trainer":
            return (
              <FormControl className={classes.formControl}>
                <TextField
                  variant="outlined"
                  required
                  type="number"
                  name="experience"
                  label="Erfahrung"
                  id="experience"
                  value={specific}
                  onInput={(e) => {
                    setSpecific(e.target.value);
                  }}
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
                  value={specific}
                  onInput={(e) => {
                    setSpecific(e.target.value);
                  }}
                />
              </FormControl>
            );
          default:
            return <div>Wrong Persontype</div>;
        }
      default:
        return (
          <div>
            <ErrorIcon />
            Unknown step
          </div>
        );
    }
  };

  return (
    <div className={classes.main}>
      <Stepper activeStep={activeStep}>
        {steps.map((label) => {
          const stepProps = {};
          const labelProps = {};

          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      <div>
        {activeStep === steps.length ? (
          <div>
            <Typography className={classes.instructions}>
              <div>
                Type: {person[0].type} <br />
                Vorname: {firstName} <br />
                Nachname: {lastName} <br />
                Geburtstag: {birthday} <br />
                {translation[personSpecificKeys[person[0].type]]}: {specific}
              </div>
            </Typography>
            <Button onClick={handleReset} className={classes.button}>
              Reset
            </Button>
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              Hinzufügen
            </Button>
          </div>
        ) : (
          <div>
            <Typography className={classes.instructions}>
              {getStepContent(activeStep)}
            </Typography>
            <div>
              <Button variant="contained" color="primary" onClick={handleNext}>
                Weiter
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreatePersonModal;
