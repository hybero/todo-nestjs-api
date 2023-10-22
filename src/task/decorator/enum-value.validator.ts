import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

@ValidatorConstraint({ name: 'isEnumValue', async: false })
export class IsEnumValue implements ValidatorConstraintInterface {
    validate(value: any, args: ValidationArguments) {
        const [validValues] = args.constraints;
        return validValues.includes(value);
    }

    defaultMessage(args: ValidationArguments) {
        return `${args.property} must be one of ${args.constraints[0].join(', ')}`;
    }
}