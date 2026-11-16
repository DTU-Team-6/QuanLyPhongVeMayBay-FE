import test from 'node:test';
import assert from 'node:assert/strict';
import { isAdult, validateRegistration } from './authValidation.js';

test('isAdult checks the exact 18th birthday', () => {
  assert.equal(isAdult('2008-11-16', new Date(2026, 10, 16)), true);
  assert.equal(isAdult('2008-11-17', new Date(2026, 10, 16)), false);
  assert.equal(isAdult('2026-02-31', new Date(2026, 10, 16)), false);
});

test('validateRegistration reports password and age errors', () => {
  const errors = validateRegistration(
    {
      password: 'weak',
      confirmPassword: 'different',
      dateOfBirth: '2010-01-01',
    },
    new Date(2026, 10, 16),
  );

  assert.ok(errors.password);
  assert.ok(errors.confirmPassword);
  assert.ok(errors.dateOfBirth);
});
