import { styled } from '@mui/system';
import Table from '@mui/material/Table';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import IconButton from '@mui/material/IconButton';

export const StyledTable = styled(Table)(({ theme }) => ({
  minWidth: 700,
}));

export const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  marginTop: '40px',
}));

export const StyledTableCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.primary.white,
  color: theme.palette.primary.black,
  fontWeight: 'bold',
  textAlign: 'center',
  border: '1px solid black',
  padding: '1px',
  '&.stickyColumn': {
    position: 'sticky',
    left: 0,
    backgroundColor: theme.palette.background.paper,
    zIndex: 1,
  },
  '&.specialRowLabel': {
    backgroundColor: '#0076a2',
    color: '#ffffff',
    padding: 0,
  },
}));

export const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&.canceledRow': {
    backgroundColor: theme.palette.action.disabledBackground,
    pointerEvents: 'none',
    opacity: 0.5,
  },
}));

export const StyledButton = styled(Button)(({ theme }) => ({
  '&.inputTime': {
    minWidth: '100px',
  },
  '&.buttonsave': {
    marginRight: theme.spacing(1),
  },
}));

export const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogActions-root': {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
}));

export const StyledTextField = styled(TextField)(({ theme }) => ({
  margin: '20px',
}));

export const StyledSelect = styled(Select)(({ theme }) => ({
  minWidth: '150px',
  '&.select': {
    backgroundColor: theme.palette.background.paper,
  },
}));

export const StyledIconButton = styled(IconButton)(({ theme }) => ({
  '&.infoButton': {
    marginLeft: theme.spacing(1),
  },
}));
