import { AlertCircle, CheckCircle2 } from "lucide-react";
import { AppError } from "@/lib/appErrors";

const isDevelopment = process.env.NODE_ENV === "development";

interface AuthFeedbackProps {
  error?: AppError | null;
  success?: string | null;
}

export function AuthFeedback({ error, success }: AuthFeedbackProps) {
  if (error) {
    return (
      <div className="rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700">
        <div className="flex items-start gap-2 font-medium">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <div className="space-y-1">
            <div>{error.safeMessage}</div>
            {isDevelopment ? (
              <div className="text-xs text-rose-600/90">
                {[error.route, error.requestId, error.errorCode].filter(Boolean).join(" | ")}
              </div>
            ) : error.requestId ? (
              <div className="text-xs text-rose-600/90">requestId: {error.requestId}</div>
            ) : null}
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
        <div className="flex items-start gap-2">
          <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
          <span>{success}</span>
        </div>
      </div>
    );
  }

  return null;
}
