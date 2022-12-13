export const ResponseMessage = {
  UserLoggedIn: 'User logged in successfully!',
  UserCreated: 'User created successfully!',
} as const;

export const DatabaseError = {
  ERR_DUPLICATE_ENTRY: 1062,
} as const;

const USER_ALREADY_EXISTS = 'USER_ALREADY_EXISTS';
const BAD_REQUEST = 'BAD_REQUEST';
const WRONG_CREDENTIALS = 'WRONG_CREDENTIALS';
const NOT_FOUND_ENTITY = 'NOT_FOUND_ENTITY';
const NOT_FOUND = 'NOT_FOUND';
const UNAUTHORIZED = 'UNAUTHORIZED';
const FORBIDDEN = 'FORBIDDEN';

export const Exceptions = {
  USER_ALREADY_EXISTS: { message: 'User already exists!', code: USER_ALREADY_EXISTS },
  BAD_REQUEST: { message: 'Bad Request', code: BAD_REQUEST },
  WRONG_CREDENTIALS: { message: 'Email or password is incorrect!', code: WRONG_CREDENTIALS },
  NOT_FOUND_ENTITY: (where: string) => ({
    message: 'Entity not found!',
    code: NOT_FOUND_ENTITY,
    where,
  }),
} as const;

export const ExceptionCode = {
  USER_ALREADY_EXISTS,
  BAD_REQUEST,
  WRONG_CREDENTIALS,
  NOT_FOUND_ENTITY,
  NOT_FOUND,
  UNAUTHORIZED,
  FORBIDDEN,
};
