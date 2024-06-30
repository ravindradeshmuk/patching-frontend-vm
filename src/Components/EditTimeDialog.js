import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';

function EditTimeDialog({ isPopupOpen, manualTime, handleManualTimeChange, handleSetTime, handlePopupClose, currentEditing }) {
  return (
    <Dialog open={isPopupOpen} onClose={handlePopupClose}>
      <DialogTitle>Edit Time</DialogTitle>
      <DialogContent>
        <TextField
          label="Manual Time"
          value={manualTime}
          onChange={handleManualTimeChange}
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => handleSetTime(currentEditing.rowIndex, currentEditing.columnName)} color="primary">
          Set Time
        </Button>
        <Button onClick={handlePopupClose} color="secondary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default EditTimeDialog;
