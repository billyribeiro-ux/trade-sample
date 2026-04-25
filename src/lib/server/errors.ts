export class AppError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
  }
}

export class ValidationError extends AppError {
  constructor(message = 'Invalid request.') {
    super(message, 400);
  }
}

export class PermissionError extends AppError {
  constructor(message = 'You do not have permission to perform this action.') {
    super(message, 403);
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found.') {
    super(message, 404);
  }
}

export class RateLimitError extends AppError {
  constructor(message = 'Too many requests. Please try again later.') {
    super(message, 429);
  }
}

export class EntitlementError extends AppError {
  constructor(message = 'You do not have access to this product.') {
    super(message, 403);
  }
}

export class DownloadQuotaExceededError extends AppError {
  constructor(message = 'Download limit reached.') {
    super(message, 429);
  }
}
