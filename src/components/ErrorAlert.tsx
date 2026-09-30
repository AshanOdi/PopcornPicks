import { Alert, AlertTitle, Button } from '@mui/material';

interface ErrorAlertProps {
  message: string;
  /** If given, shows a "Try again" button */
  onRetry?: () => void;
}

/** Friendly error box used whenever an API request fails. */
function ErrorAlert({ message, onRetry }: ErrorAlertProps) {
  return (
    <Alert
      severity="error"
      sx={{ my: 2 }}
      action={
        onRetry && (
          <Button color="inherit" size="small" onClick={onRetry}>
            Try again
          </Button>
        )
      }
    >
      <AlertTitle>Oops!</AlertTitle>
      {message}
    </Alert>
  );
}

export default ErrorAlert;
