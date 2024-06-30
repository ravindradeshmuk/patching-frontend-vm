import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, List, ListItem, ListItemText } from '@mui/material';

function ChangeHistoryDialog({ isHistoryPopupOpen, changeHistory, handleHistoryPopupClose }) {
  return (
    <Dialog open={isHistoryPopupOpen} onClose={handleHistoryPopupClose}>
      <DialogTitle>Change History</DialogTitle>
      <DialogContent>
        <List>
          {changeHistory.map((change, index) => (
            <ListItem key={index}>
              <ListItemText
                primary={`Changed ${change.columnName} from ${change.oldValue} to ${change.newValue}`}
                secondary={`At ${change.timestamp}`}
              />
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleHistoryPopupClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ChangeHistoryDialog;
