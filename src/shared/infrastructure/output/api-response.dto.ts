export class ApiResponseDto<T> {
  constructor(
    public readonly success: boolean,
    public readonly message: string,
    public readonly data: T | null = null,
    public readonly error?: string,
    public readonly timestamp: Date = new Date()
  ) {}

  static success<T>(data: T, message: string = 'Operación exitosa'): ApiResponseDto<T> {
    return new ApiResponseDto(true, message, data);
  }

  static error(message: string, error?: string): ApiResponseDto<null> {
    return new ApiResponseDto(false, message, null, error);
  }
}