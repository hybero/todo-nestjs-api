import { IsNotEmpty, Validate } from 'class-validator';
import { IsEnumValue } from '../decorator/enum-value.validator';

export class TaskFlagDto {
  @IsNotEmpty()
  @Validate(IsEnumValue, [['active', 'cancelled', 'finished']])
  flag: 'active' | 'cancelled' | 'finished';
}