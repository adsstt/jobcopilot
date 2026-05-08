import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";

const isDevelopment = process.env.NODE_ENV === "development";

export class ApiRouteError extends Error {
  status: number;
  errorCode: string;
  safeMessage: string;

  constructor(options: {
    message: string;
    status?: number;
    errorCode: string;
    safeMessage: string;
  }) {
    super(options.message);
    this.name = "ApiRouteError";
    this.status = options.status ?? 400;
    this.errorCode = options.errorCode;
    this.safeMessage = options.safeMessage;
  }
}

export function createRequestId(request?: Request) {
  return request?.headers.get("x-request-id") || randomUUID();
}

export function unauthorized(message = "Authentication required.") {
  return new ApiRouteError({
    message,
    status: 401,
    errorCode: "AUTH_REQUIRED",
    safeMessage: "请先登录后再继续操作",
  });
}

export function badRequest(message: string, safeMessage = message, errorCode = "BAD_REQUEST") {
  return new ApiRouteError({
    message,
    safeMessage,
    errorCode,
    status: 400,
  });
}

export function buildApiErrorResponse(options: {
  error: unknown;
  route: string;
  requestId: string;
  safeMessage: string;
  errorCode: string;
  status?: number;
}) {
  const normalized = normalizeApiError(options.error, options.safeMessage, options.errorCode, options.status);

  if (options.error instanceof Error) {
    console.error("[api-error]", {
      requestId: options.requestId,
      route: options.route,
      errorCode: normalized.errorCode,
      status: normalized.status,
      message: options.error.message,
      stack: options.error.stack,
      error: options.error,
    });
  } else {
    console.error("[api-error]", {
      requestId: options.requestId,
      route: options.route,
      errorCode: normalized.errorCode,
      status: normalized.status,
      error: options.error,
    });
  }

  return NextResponse.json(
    {
      error: {
        requestId: options.requestId,
        errorCode: normalized.errorCode,
        safeMessage: normalized.safeMessage,
        ...(isDevelopment
          ? {
              route: options.route,
              status: normalized.status,
            }
          : {}),
      },
    },
    {
      status: normalized.status,
      headers: {
        "x-request-id": options.requestId,
      },
    }
  );
}

export function createStreamErrorEvent(options: {
  error: unknown;
  route: string;
  requestId: string;
  safeMessage: string;
  errorCode: string;
  status?: number;
}) {
  const normalized = normalizeApiError(options.error, options.safeMessage, options.errorCode, options.status);

  if (options.error instanceof Error) {
    console.error("[api-error]", {
      requestId: options.requestId,
      route: options.route,
      errorCode: normalized.errorCode,
      status: normalized.status,
      message: options.error.message,
      stack: options.error.stack,
      error: options.error,
    });
  } else {
    console.error("[api-error]", {
      requestId: options.requestId,
      route: options.route,
      errorCode: normalized.errorCode,
      status: normalized.status,
      error: options.error,
    });
  }

  return {
    type: "error",
    error: {
      requestId: options.requestId,
      errorCode: normalized.errorCode,
      safeMessage: normalized.safeMessage,
      ...(isDevelopment
        ? {
            route: options.route,
            status: normalized.status,
          }
        : {}),
    },
  };
}

function normalizeApiError(error: unknown, fallbackSafeMessage: string, fallbackCode: string, fallbackStatus?: number) {
  if (error instanceof ApiRouteError) {
    return {
      status: error.status,
      errorCode: error.errorCode,
      safeMessage: error.safeMessage,
    };
  }

  return {
    status: fallbackStatus ?? 500,
    errorCode: fallbackCode,
    safeMessage: fallbackSafeMessage,
  };
}
