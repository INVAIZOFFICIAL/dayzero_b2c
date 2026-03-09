export const useAuthForm = () => {
  const validateEmail = (email: string): string | null => {
    const trimmed = email.trim();
    if (!trimmed) return '이메일을 입력해주세요';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      return '올바른 이메일 형식이 아니에요. @ 기호를 포함해주세요';
    }
    return null;
  };

  const getPasswordChecks = (password: string) => ({
    length: password.length >= 8,
    letter: /[a-zA-Z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*]/.test(password),
  });

  const isPasswordValid = (password: string) => {
    const checks = getPasswordChecks(password);
    return Object.values(checks).every(Boolean);
  };

  return { validateEmail, getPasswordChecks, isPasswordValid };
};
