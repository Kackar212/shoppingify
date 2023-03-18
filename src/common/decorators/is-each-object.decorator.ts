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

          const isEachObject = !value.some(
            (element) => typeof element !== 'object' || element === null || Array.isArray(element),
          );

          if (!isEachObject) {
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
