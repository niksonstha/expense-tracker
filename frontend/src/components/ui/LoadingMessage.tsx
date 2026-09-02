interface LoadingMessageProps {
  message?: string;
}

export function LoadingMessage({
  message = "Loading...",
}: LoadingMessageProps) {
  return (
    <p role="status" aria-live="polite">
      {message}
    </p>
  );
}
