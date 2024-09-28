import { FaExclamationTriangle } from "react-icons/fa";

export default function FormError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <div className="bg-destructive/15 flex items-center gap-x-2 rounded-md p-3 text-sm text-destructive-foreground">
      <FaExclamationTriangle className="h-4 w-4" />
      <p>{message}</p>
    </div>
  );
}
