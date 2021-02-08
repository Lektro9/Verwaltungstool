/*---Components---*/
import CreatePersonModal from "./editPersonComps/createPersonModal";

/*---Material---*/
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";

const EditPerson = ({ onClick, dialogState, person }) => {
    console.log("s,", person)
  return (
    <div>
      <Dialog open={dialogState} onClose={onClick}>
        <DialogTitle id="createPerson" onClose={onClick}>
          Person hinzufügen
        </DialogTitle>
        <DialogContent>
          <CreatePersonModal handleDialogClose={onClick} person={person}/>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EditPerson;
