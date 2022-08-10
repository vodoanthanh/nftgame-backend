export class HttpException extends Error {
  public status: number;
  public message: string;
  public data: any;
  public code: string | null;

  constructor(status: number, message: string, code: string | null = null, data: any = null) {
    super(message);
    this.code = code;
    this.status = status;
    this.message = message;
    this.data = data;
  }
}
