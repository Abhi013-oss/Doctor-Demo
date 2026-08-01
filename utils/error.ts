/**
  Parses any unknown error object or message into a clean user-facing string.
 */
export function handleError(error: unknown, fallbackMessage = "An unexpected error occurred. Please try again."): string {
  if (!error) return fallbackMessage;
  
  if (typeof error === "string") return error;
  
  if (error instanceof Error) {
    return error.message || fallbackMessage;
  }
  
  if (typeof error === "object" && error !== null && "message" in error && typeof (error as { message: unknown }).message === "string") {
    return (error as { message: string }).message;
  }
  
  return fallbackMessage;
}
