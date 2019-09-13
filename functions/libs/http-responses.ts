export interface CallbackInterface {
  statusCode: number;
  body?: string;
}

export const UnAuthorized: CallbackInterface = {
  statusCode: 401,
  body: 'Invalid Authentication',
};

export const SuccessResponse = (body: string): CallbackInterface => {
  return {
    statusCode: 200,
    body,
  };
}

export const ErrorResponse = (body: string): CallbackInterface => {
  return {
    statusCode: 500,
    body,
  };
}
