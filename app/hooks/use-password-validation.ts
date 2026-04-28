import { useState, useEffect } from 'react';

export interface PasswordRequirement {
  id: string;
  label: string;
  met: boolean;
  regex: RegExp;
}

export type StrengthLevel = 'Weak' | 'Medium' | 'Strong' | '';

export const usePasswordValidation = (password: string) => {
  const [requirements, setRequirements] = useState<PasswordRequirement[]>([
    { id: 'length', label: 'auth.password.length', met: false, regex: /^.{8,}$/ },
    { id: 'upper', label: 'auth.password.upper', met: false, regex: /[A-Z]/ },
    { id: 'lower', label: 'auth.password.lower', met: false, regex: /[a-z]/ },
    { id: 'number', label: 'auth.password.number', met: false, regex: /[0-9]/ },
    { id: 'special', label: 'auth.password.special', met: false, regex: /[^A-Za-z0-9]/ },
  ]);

  const [strength, setStrength] = useState<StrengthLevel>('');
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const updatedRequirements = requirements.map((req) => ({
      ...req,
      met: req.regex.test(password),
    }));

    setRequirements(updatedRequirements);

    const metCount = updatedRequirements.filter((req) => req.met).length;
    
    if (password === '') {
      setStrength('');
      setIsValid(false);
    } else if (metCount < 3) {
      setStrength('Weak');
      setIsValid(false);
    } else if (metCount < 5) {
      setStrength('Medium');
      setIsValid(false);
    } else {
      setStrength('Strong');
      setIsValid(true);
    }
  }, [password]);

  return { requirements, strength, isValid };
};
