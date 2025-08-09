// Email validation
export const validateEmail = (email: string): { isValid: boolean; message: string } => {
  if (!email) {
    return { isValid: false, message: 'Email is required' };
  }

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  
  if (!emailRegex.test(email)) {
    return { isValid: false, message: 'Please enter a valid email address' };
  }

  // Check for common email format issues
  if (email.includes('..')) {
    return { isValid: false, message: 'Email cannot contain consecutive dots' };
  }

  if (email.startsWith('.') || email.endsWith('.')) {
    return { isValid: false, message: 'Email cannot start or end with a dot' };
  }

  // Check for valid domain extensions
  const domain = email.split('@')[1];
  if (domain && domain.split('.').length < 2) {
    return { isValid: false, message: 'Please enter a valid email domain' };
  }

  return { isValid: true, message: '' };
};

// Phone number validation (Kenya format)
export const validatePhone = (phone: string): { isValid: boolean; message: string } => {
  if (!phone) {
    return { isValid: false, message: 'Phone number is required' };
  }

  // Remove all non-digit characters for validation
  const cleanPhone = phone.replace(/\D/g, '');

  // Kenya phone number patterns
  const kenyaPatterns = [
    /^254[17]\d{8}$/, // +254 7xx xxx xxx or +254 1xx xxx xxx
    /^0[17]\d{8}$/, // 07xx xxx xxx or 01xx xxx xxx
    /^[17]\d{8}$/, // 7xx xxx xxx or 1xx xxx xxx
  ];

  const isValidFormat = kenyaPatterns.some(pattern => pattern.test(cleanPhone));

  if (!isValidFormat) {
    return { 
      isValid: false, 
      message: 'Please enter a valid Kenyan phone number (e.g., +254 700 000 000)' 
    };
  }

  // Check for common invalid numbers
  const invalidNumbers = [
    '254700000000', '254711111111', '254722222222', '254733333333',
    '0700000000', '0711111111', '0722222222', '0733333333'
  ];

  if (invalidNumbers.includes(cleanPhone)) {
    return { isValid: false, message: 'Please enter a real phone number' };
  }

  return { isValid: true, message: '' };
};

// Format phone number for display
export const formatPhone = (phone: string): string => {
  const cleanPhone = phone.replace(/\D/g, '');
  
  if (cleanPhone.startsWith('254')) {
    return `+254 ${cleanPhone.slice(3, 6)} ${cleanPhone.slice(6, 9)} ${cleanPhone.slice(9)}`;
  } else if (cleanPhone.startsWith('0')) {
    return `${cleanPhone.slice(0, 4)} ${cleanPhone.slice(4, 7)} ${cleanPhone.slice(7)}`;
  } else if (cleanPhone.length === 9) {
    return `0${cleanPhone.slice(0, 3)} ${cleanPhone.slice(3, 6)} ${cleanPhone.slice(6)}`;
  }
  
  return phone;
};

// Common passwords list
const commonPasswords = [
  'password', '123456', '123456789', 'qwerty', 'abc123', 'password123',
  'admin', 'letmein', 'welcome', 'monkey', '1234567890', 'password1',
  'qwerty123', '123123', 'admin123', 'root', 'toor', 'pass', 'test',
  'guest', 'info', 'adm', 'mysql', 'user', 'administrator', 'oracle',
  'ftp', 'pi', 'puppet', 'ansible', 'ec2-user', 'vagrant', 'azureuser',
  'love', 'sex', 'god', 'jesus', 'allah', 'hello', 'charlie', 'aa123456',
  'password12', 'password123', 'admin12', 'admin123', '1q2w3e4r', 'qwertyuiop',
  'kenya', 'nairobi', 'mombasa', 'kisumu', 'nakuru', 'eldoret', 'thika',
  'panda', 'mart', 'pandamart', 'shopping', 'store', 'retail'
];

// Password strength validation
export const validatePassword = (password: string): { 
  isValid: boolean; 
  message: string; 
  strength: 'weak' | 'medium' | 'strong' | 'very-strong';
  checks: {
    length: boolean;
    uppercase: boolean;
    lowercase: boolean;
    numbers: boolean;
    symbols: boolean;
    common: boolean;
  }
} => {
  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    numbers: /\d/.test(password),
    symbols: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
    common: !commonPasswords.includes(password.toLowerCase())
  };

  const passedChecks = Object.values(checks).filter(Boolean).length;

  let strength: 'weak' | 'medium' | 'strong' | 'very-strong' = 'weak';
  let message = '';

  if (!password) {
    return { 
      isValid: false, 
      message: 'Password is required', 
      strength: 'weak', 
      checks 
    };
  }

  if (!checks.length) {
    message = 'Password must be at least 8 characters long';
  } else if (!checks.common) {
    message = 'This password is too common. Please choose a more secure password';
  } else if (passedChecks < 3) {
    message = 'Password is too weak. Add uppercase letters, numbers, or symbols';
    strength = 'weak';
  } else if (passedChecks < 4) {
    message = 'Password strength: Medium. Consider adding more character types';
    strength = 'medium';
  } else if (passedChecks < 5) {
    message = 'Password strength: Strong';
    strength = 'strong';
  } else {
    message = 'Password strength: Very Strong';
    strength = 'very-strong';
  }

  const isValid = checks.length && checks.common && passedChecks >= 3;

  return { isValid, message, strength, checks };
};

// Password strength color helper
export const getPasswordStrengthColor = (strength: string): string => {
  switch (strength) {
    case 'weak':
      return 'text-red-600 bg-red-100';
    case 'medium':
      return 'text-yellow-600 bg-yellow-100';
    case 'strong':
      return 'text-blue-600 bg-blue-100';
    case 'very-strong':
      return 'text-green-600 bg-green-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
};

// Real-time validation for forms
export const useFormValidation = () => {
  const validateField = (field: string, value: string) => {
    switch (field) {
      case 'email':
        return validateEmail(value);
      case 'phone':
        return validatePhone(value);
      case 'password':
        return validatePassword(value);
      default:
        return { isValid: true, message: '' };
    }
  };

  return { validateField };
};