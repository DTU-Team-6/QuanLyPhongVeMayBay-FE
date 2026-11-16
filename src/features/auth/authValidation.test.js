import test from 'node:test';
import assert from 'node:assert/strict';
import { adultDateLimit, isAdult, validateRegistration } from './authValidation.js';

test('isAdult checks the exact 18th birthday', () => {
  const today = new Date('2026-11-15T17:30:00Z');
  assert.equal(isAdult('2008-11-16', today), true);
  assert.equal(isAdult('2008-11-17', today), false);
  assert.equal(isAdult('2026-02-31', today), false);
  assert.equal(adultDateLimit(new Date('2024-02-29T05:00:00Z')), '2006-02-28');
});

test('validateRegistration enforces phone and bcrypt byte limit', () => {
  const errors = validateRegistration({
    password: `Ab1${'ế'.repeat(24)}`,
    confirmPassword: `Ab1${'ế'.repeat(24)}`,
    dateOfBirth: '1990-01-01',
    phone: 'không hợp lệ',
  }, new Date('2026-11-16T05:00:00Z'));

  assert.ok(errors.password);
  assert.ok(errors.phone);
  assert.equal(errors.dateOfBirth, undefined);
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
