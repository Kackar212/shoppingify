import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';

export function IsEachObject(validationOptions?: ValidationOptions) {
  return (object: Object, propertyName: string) => {
    registerDecorator({
      name: 'IsEachObject',
      target: object.constructor,
      propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any): boolean {
          if (!Array.isArray(value)) return false;

          const isEachPlainObject = !value.some(
            (element) => Object.getPrototypeOf(element) !== Object.prototype,
          );

          if (!isEachPlainObject) {
            return false;
          }

          return true;
        },
        defaultMessage: (validationArguments?: ValidationArguments): string =>
          `${validationArguments?.property} must be an array of objects`,
      },
    });
  };
}
