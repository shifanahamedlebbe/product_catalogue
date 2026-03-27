import { toast } from 'sonner';

/**
 * Reusable API error handler that extracts error messages and shows a toast notification.
 */
export function handleApiError(error: unknown, fallback = 'Something went wrong'): void {
  const message = error instanceof Error ? error.message : fallback;
  toast.error(message, { duration: 4000 });
}
