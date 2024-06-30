import { css } from '@emotion/css';
import { useTheme } from '@mui/material/styles';

const useStyles = () => {
  const theme = useTheme();

  return {
    tableContainer: css`
      max-height: 600px;
      overflow: auto;
    `,
    table: css`
      min-width: 650px;
    `,
    headerCell: css`
      background-color: ${theme.palette.primary.main};
      color: ${theme.palette.common.white};
      font-weight: bold;
    `,
    stickyHeader: css`
      position: sticky;
      top: 0;
      z-index: 1;
    `,
    cell: css`
      padding: ${theme.spacing(1)};
    `,
    specialRowLabel: css`
      background-color: ${theme.palette.action.hover};
      font-weight: bold;
      text-align: center;
    `,
    inputContainer: css`
      display: flex;
      align-items: center;
    `,
    timeInput: css`
      margin-right: ${theme.spacing(1)};
    `,
    setTimeButton: css`
      margin-left: ${theme.spacing(1)};
    `,
  };
};

export default useStyles;
