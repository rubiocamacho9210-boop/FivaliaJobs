const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(email: string): boolean {
  return emailRegex.test(email.trim());
}

export function hasLengthBetween(value: string, min: number, max: number): boolean {
  const length = value.trim().length;
  return length >= min && length <= max;
}

export const backendLimits = {
  register: {
    nameMax: 100,
    emailMax: 200,
    passwordMin: 8,
    passwordMax: 72,
  },
  post: {
    titleMin: 3,
    titleMax: 100,
    descriptionMin: 10,
    descriptionMax: 2000,
    categoryMax: 50,
  },
  profile: {
    bioMax: 500,
    categoryMax: 50,
    locationMax: 100,
    contactMax: 100,
  },
} as const;
