import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'isTwoDecimalPlaces', async: false })
export class TwoDecimalPlacesValidator implements ValidatorConstraintInterface {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  validate(value: number, _args: ValidationArguments): boolean {
    if (typeof value !== 'number') return false;

    const decimalPart = value.toString().split('.')[1];
    return !decimalPart || decimalPart.length === 2;
  }
}
