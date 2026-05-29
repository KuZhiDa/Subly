import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'Validation Last Payment At', async: false })
export class LastPaymentAtValidation implements ValidatorConstraintInterface {
  validate(value: any) {
    return value <= new Date();
  }
  defaultMessage() {
    return 'Дата оплаты не может быть в будущем';
  }
}
