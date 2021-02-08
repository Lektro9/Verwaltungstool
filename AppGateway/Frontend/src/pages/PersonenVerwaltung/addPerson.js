/*---Components---*/
import CreatePersonModal from "./addPersonComps/createPersonModal";

/*---Material---*/
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";

const AddPerson = ({ onClick, dialogState }) => {
  return (
    <div>
      <Dialog open={dialogState} onClose={onClick}>
        <DialogTitle id="createPerson" onClose={onClick}>
          Person hinzufügen
        </DialogTitle>
        <DialogContent>
          <CreatePersonModal />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddPerson;
