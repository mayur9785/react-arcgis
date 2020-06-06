import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

export default function AlertDialog({ dialogOptions, open, closeDialog }) {
  let title = "";
  let message = "";
  if (dialogOptions) {
    title = dialogOptions.title || "";
    message = dialogOptions.message || "";
  }
  return (
    <div>
      <Dialog
        open={open}
        disableBackdropClick={true}
        onClose={closeDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
      >
        <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog} color="primary" autoFocus>
            Dismiss
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
