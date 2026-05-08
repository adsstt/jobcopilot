const isDevelopment = process.env.NODE_ENV === "development";

export interface SafeErrorPayload {
  requestId?: string;
  errorCode?: string;
  safeMessage: string;
  route?: string;
  status?: number;
}

export class AppError extends Error {
  requestId?: string;
  errorCode?: string;
  route?: string;
  status?: number;
  safeMessage: string;

  constructor(payload: SafeErrorPayload) {
    super(payload.safeMessage);
    this.name = "AppError";
    this.requestId = payload.requestId;
    this.errorCode = payload.errorCode;
    this.route = payload.route;
    this.status = payload.status;
    this.safeMessage = payload.safeMessage;
  }
}

export function normalizeResponseError(error: unknown, fallbackMessage: string) {
  if (isSafeErrorPayload(error)) {
    return new AppError({
      requestId: error.requestId,
      errorCode: error.errorCode,
      route: error.route,
      status: error.status,
      safeMessage: error.safeMessage || fallbackMessage,
    });
  }

  if (error instanceof Error) {
    return new AppError({ safeMessage: error.message || fallbackMessage });
  }

  return new AppError({ safeMessage: fallbackMessage });
}

export function describeError(error: unknown) {
  if (error instanceof AppError) {
    const details = [error.safeMessage];
    const meta = [error.route, error.requestId, error.errorCode].filter(Boolean).join(" | ");
    if (meta && isDevelopment) {
      details.push(meta);
    } else if (error.requestId) {
      details.push(`requestId: ${error.requestId}`);
    }
    return details.join("\n");
  }

  if (error instanceof Error) return error.message;
  return "当前操作失败，请稍后重试";
}

function isSafeErrorPayload(error: unknown): error is SafeErrorPayload {
  return Boolean(
    error &&
      typeof error === "object" &&
      "safeMessage" in error &&
      typeof (error as { safeMessage?: unknown }).safeMessage === "string"
  );
}
