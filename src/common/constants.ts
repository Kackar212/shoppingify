export const ResponseMessage = {
  UserLoggedIn: 'User logged in successfully!',
  UserCreated: 'User created successfully!',
  ActivationMailResent: 'Mail sent successfully!',
  NewPassword: 'Mail with new password was sent if provided email exists in our database',
  ProductCreated: 'Product created successfully!',
  ProductFound: 'Product found!',
  ProductAdded: 'Product added to list successfully!',
  ProductRemovedFromList: 'Product removed from list successfully!',
} as const;

export const DatabaseError = {
  ERR_DUPLICATE_ENTRY: 1062,
  ERR_NO_DEFAULT_FOR_FIELD: 1364,
  ERR_NO_REFERENCED_ROW: 1452,
} as const;

const USER_ALREADY_EXISTS = 'USER_ALREADY_EXISTS';
const BAD_REQUEST = 'BAD_REQUEST';
const WRONG_CREDENTIALS = 'WRONG_CREDENTIALS';
const NOT_FOUND_ENTITY = 'NOT_FOUND_ENTITY';
const NOT_FOUND = 'NOT_FOUND';
const UNAUTHORIZED = 'UNAUTHORIZED';
const FORBIDDEN = 'FORBIDDEN';
const TOKEN_STILL_VALID = 'TOKEN_STILL_VALID';
const ACCOUNT_ALREADY_ACTIVATED = 'ACCOUNT_ALREADY_ACTIVATED';
const PASSWORD_ALREADY_RESETED = 'PASSWORD_ALREADY_RESETED';

export const Exceptions = {
  USER_ALREADY_EXISTS: { message: 'User already exists!', code: USER_ALREADY_EXISTS },
  BAD_REQUEST: { message: 'Bad Request', code: BAD_REQUEST },
  WRONG_CREDENTIALS: { message: 'Email or password is incorrect!', code: WRONG_CREDENTIALS },
  NOT_FOUND_ENTITY: (where: string) => ({
    message: 'Entity not found!',
    code: NOT_FOUND_ENTITY,
    where,
  }),
  TOKEN_STILL_VALID: {
    message: 'Previous activation token is still valid',
    code: TOKEN_STILL_VALID,
  },
  ACCOUNT_ALREADY_ACTIVATED: {
    message: 'Account is already activated',
    code: ACCOUNT_ALREADY_ACTIVATED,
  },
  PASSWORD_ALREADY_RESETED: {
    message: 'Password is already reseted',
    code: PASSWORD_ALREADY_RESETED,
  },
} as const;

export const ExceptionCode = {
  USER_ALREADY_EXISTS,
  BAD_REQUEST,
  WRONG_CREDENTIALS,
  NOT_FOUND_ENTITY,
  NOT_FOUND,
  UNAUTHORIZED,
  FORBIDDEN,
  TOKEN_STILL_VALID,
  ACCOUNT_ALREADY_ACTIVATED,
  PASSWORD_ALREADY_RESETED,
};
