import { lazy, optional, Schema, strictObject, string } from '../src';
import { Boss, bossSchema } from './bossSchema';

export interface Employee {
  department: string;
  boss?: Boss;
}
export const employeeSchema: Schema<Employee> = strictObject({
  department: ['department', string()],
  boss: ['boss', optional(lazy(() => bossSchema))],
});
