import { lazy, number, optional, Schema, strictObject } from '../src';
import { Employee, employeeSchema } from './employeeSchema';

export interface Boss {
  promotedAt?: number;
  assistant?: Employee;
}
export const bossSchema: Schema<Boss> = strictObject({
  promotedAt: ['promotedAt', optional(number())],
  assistant: ['assistant', optional(lazy(() => employeeSchema))],
});
