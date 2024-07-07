// StyledComponents.js
import { styled } from '@mui/system';
import { Table, TableContainer, TableCell, TableRow, Button, TextField, Select, IconButton, Box, RadioGroup, FormControlLabel, Radio, Typography, Grid } from '@mui/material';

export const FormContainer = styled('div')(({ theme }) => ({
  margin: "20px",
  padding: theme.spacing(2),
  boxShadow: "0px 0px 10px 2px rgba(0,0,0,0.1)",
  backgroundColor: "#fff",
  borderRadius: 2,
  maxWidth: '20',
  
}));

export const CustomTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  padding: '8px 16px',
}));

export const ErrorText = styled(Typography)(({ theme }) => ({
  color: "red",
  marginBottom: theme.spacing(2),
}));

export const CustomRadioGroup = styled(RadioGroup)(({ theme }) => ({
  marginTop: theme.spacing(15),
}));

export const CustomFormControlLabel = styled(FormControlLabel)(({ theme }) => ({
  marginRight: theme.spacing(2),
}));

export const CustomRadio = styled(Radio)(({ theme }) => ({
  color: theme.palette.primary.main,
  '&.Mui-checked': {
    color: theme.palette.primary.main,
  },
}));
export const SubmitButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
}));

export const StyledTable = styled(Table)(({ theme }) => ({
  width: '100%',
  borderCollapse: 'collapse',
  marginTop: '200px',
}));

export const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  width: '100vw',
  boxSizing: 'border-box',
  padding: '30px',
  marginTop: '70px',
}));

export const StyledTableCell = styled(TableCell)(({ theme }) => ({
  '&.head': {
    backgroundColor: '#151744',
    color: '#fff',
    border: '1px solid black',
    textAlign: 'center',
    
  },
  '&.body': {
    fontSize: 14,
    border: '1px solid black',
    padding: '8px',
    textAlign: 'center',
  },
}));

export const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
}));

export const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#151744',
  color: '#ffffff',
  margin: '10px',
}));

export const StyledTextField = styled(TextField)(({ theme }) => ({
  fullWidth: true,
  variant: 'outlined',
}));

export const StyledSelect = styled(Select)(({ theme }) => ({
  fullWidth: true,
  variant: 'outlined',
}));

export const StyledIconButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.primary.main,
}));

export const TrackerContainer = styled(Box)(({ theme }) => ({
  margin: '200px auto',
  padding: theme.spacing(2),
  boxShadow: '0px 0px 10px 2px rgba(0,0,0,0.1)',
  backgroundColor: '#fff',
  borderRadius: 8,
  maxWidth: '600px',
}));

export const AddHeadingButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
}));

export const MessageBox = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(2),
}));

export const RadioGroupContainer = styled(RadioGroup)(({ theme }) => ({
  margin: theme.spacing(2, 0),
}));

export const TabPanel = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  display: 'flex',
  flexDirection: 'column',
}));

export const StyledTabPanel = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1),
  display: 'flex',
  flexDirection: 'column',
  margin: theme.spacing(2, 0),
}));

