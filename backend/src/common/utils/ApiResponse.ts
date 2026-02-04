import { Response } from 'express';

interface ApiResponseData<T> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: unknown;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

export class ApiResponse {
  static success<T>(
    res: Response,
    data: T,
    message: string = 'Success',
    statusCode: number = 200
  ): Response {
    const response: ApiResponseData<T> = {
      success: true,
      message,
      data,
    };
    return res.status(statusCode).json(response);
  }

  static created<T>(
    res: Response,
    data: T,
    message: string = 'Resource created successfully'
  ): Response {
    return this.success(res, data, message, 201);
  }

  static error(
    res: Response,
    message: string = 'An error occurred',
    statusCode: number = 500,
    errors?: unknown
  ): Response {
    const response: ApiResponseData<never> = {
      success: false,
      message,
      errors,
    };
    return res.status(statusCode).json(response);
  }

  static paginated<T>(
    res: Response,
    data: T[],
    page: number,
    limit: number,
    total: number,
    message: string = 'Success'
  ): Response {
    const totalPages = Math.ceil(total / limit);
    
    const response: ApiResponseData<T[]> = {
      success: true,
      message,
      data,
      meta: {
        page,
        limit,
        total,
        totalPages,
      },
    };
    
    return res.status(200).json(response);
  }

  static noContent(res: Response): Response {
    return res.status(204).send();
  }
}
