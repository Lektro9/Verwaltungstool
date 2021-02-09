import { useState } from "react";

/*---Material---*/
import { makeStyles } from "@material-ui/core/styles";
import {
  Button,
  Stepper,
  Typography,
  Step,
  StepLabel,
} from "@material-ui/core";
import ErrorIcon from "@material-ui/icons/Error";

/*---Comps---*/
import FormPersonGeneral from "./formPersonGeneral";
import FormPersonSpecific from "../addPersonComps/formPersonSpecific";
import OverviewPersonData from "../addPersonComps/overviewPersonData";

import { createPerson } from "../../../components/personCrud";

const useStyles = makeStyles({
  root: {
    width: "100%",
  },
});

const getSteps = () => {
  return ["Personendaten", "Typdaten"];
};

const initPersonObj = {
  type: "",
  firstName: "",
  lastName: "",
  birthday: "",
};

const personObj = {
  type: "",
  firstName: "",
  lastName: "",
  birthday: "",
};

const initSpecificObj = {};
const specificObj = {};

const CreatePersonModal = ({handleDialogClose, person}) => {
  const classes = useStyles();


  const [personGeneral, setPersonGeneral] = useState(initPersonObj);
  const [personSpecific, setPersonSpecific] = useState(initSpecificObj);
  const [activeStep, setActiveStep] = useState(0);
  const steps = getSteps();

  const onChangePersonDataGeneral = (e) => {
    e.preventDefault();
    personObj[e.target.name] = e.target.value;
    setPersonGeneral(personObj);
    console.log(personGeneral)
  };

  const onChangePersonDataSpecific = (e) => {
    specificObj[e.target.name] = e.target.value;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let merged = {...personObj, ...specificObj};
    merged.birthday = new Date(merged.birthday).getTime();
    createPerson(merged);
    handleDialogClose();
  };

  const handleNext = () => {
    setPersonGeneral(personObj);
    setPersonSpecific(specificObj);
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleReset = () => {
    setPersonGeneral(initPersonObj);
    setPersonSpecific(initSpecificObj);
    setActiveStep(0);
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <div>
            <FormPersonGeneral onAddPersonData={onChangePersonDataGeneral} person={personGeneral} />
          </div>
        );
      case 1:
        return (
          <FormPersonSpecific
            personType={personGeneral.type}
            handleSpecificData={onChangePersonDataSpecific}
            person={person[0]}
          />
        );
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
    <div className={classes.root}>
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
              <OverviewPersonData
                general={personGeneral}
                specific={personSpecific}
              />
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