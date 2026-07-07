import { showErrorToast, showSuccessToast } from "@/providers/toast-provider";
import { extractApiMessage } from "@/utils/api-message";

export function showApiSuccessToast(
  data: unknown,
  fallback = "Operation completed successfully"
) {
  showSuccessToast(extractApiMessage(data, fallback));
}

export function showApiErrorToast(
  error: unknown,
  fallback = "Something went wrong. Please try again."
) {
  showErrorToast(extractApiMessage(error, fallback));
}
