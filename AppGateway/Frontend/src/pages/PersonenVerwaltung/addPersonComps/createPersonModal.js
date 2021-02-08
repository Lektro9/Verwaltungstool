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
import FormPersonSpecific from "./formPersonSpecific";
import OverviewPersonData from "./overviewPersonData";

const useStyles = makeStyles({
  root: {
    width: "100%",
  },
});

const getSteps = () => {
  return ["Personendaten", "Typdaten"];
};

const CreatePersonModal = () => {
  const classes = useStyles();

  const initPersonObj = {
    type: "",
    firstName: "",
    lastName: "",
    date: "",
  };
  const personObj = initPersonObj;
  const specificObj = {};

  const [personGeneral, setPersonGeneral] = useState(initPersonObj);
  const [personSpecific, setPersonSpecific] = useState({});
  const [activeStep, setActiveStep] = useState(0);
  const steps = getSteps();

  const onChangePersonDataGeneral = (e) => {
    personObj[e.target.name] = e.target.value;
  };

  const onChangePersonDataSpecific = (e) => {
    specificObj[e.target.name] = e.target.value;
    console.log(specificObj)
  };

  const handleSubmit = (e) => {
    //TODO: here call server for a new Person
    e.preventDefault();
    console.log("submit!");
  };

  const handleNext = () => {
    // console.log(personGeneral);
    // console.log(personSpecific);
    setPersonGeneral(personObj);
    setPersonSpecific(personSpecific)
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };


  const handleReset = () => {
    setPersonGeneral(initPersonObj);
    setPersonSpecific({})
    setActiveStep(0);
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <div>
            <FormPersonGeneral onAddPersonData={onChangePersonDataGeneral} />
          </div>
        );
      case 1:
        return (
          <FormPersonSpecific
            personType={personGeneral.type}
            handleSpecificData={onChangePersonDataSpecific}
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
              <OverviewPersonData general={personGeneral} specific={personSpecific}/>
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

// const [date, setDate] = useState("");
// const handleAddPersonGeneralData = (pType, fName, lName, bDate) => {
//   setDate(new Date(bDate).getTime());
// };
// {
//   /* <Button disabled={activeStep === 0} onClick={handleBack}>
//                 Zurück
//               </Button> */
// }
// const handleBack = () => {
//   setActiveStep((prevActiveStep) => prevActiveStep - 1);
// };
