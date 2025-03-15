// jest-dom adds custom jest matchers for asserting on DOM nodes.
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import '@testing-library/jest-dom/vitest';

afterEach(() => {
  cleanup();
});
