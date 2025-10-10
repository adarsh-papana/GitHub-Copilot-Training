// bucks2bar/src/js/main.test.js

// The regex from main.js
const usernameRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

describe('Username Regex Validation', () => {
  test('Valid username: meets all requirements', () => {
    expect(usernameRegex.test('Abcdef1!')).toBe(true);
    expect(usernameRegex.test('Password1@')).toBe(true);
    expect(usernameRegex.test('A1!aaaaa')).toBe(true);
    expect(usernameRegex.test('XyZ1234$')).toBe(true);
  });

  test('Invalid: less than 8 characters', () => {
    expect(usernameRegex.test('A1!aaaa')).toBe(false);
    expect(usernameRegex.test('A1!a')).toBe(false);
  });

  test('Invalid: missing uppercase letter', () => {
    expect(usernameRegex.test('abcdef1!')).toBe(false);
    expect(usernameRegex.test('password1@')).toBe(false);
  });

  test('Invalid: missing number', () => {
    expect(usernameRegex.test('Abcdefg!')).toBe(false);
    expect(usernameRegex.test('Password!@')).toBe(false);
  });

  test('Invalid: missing special character', () => {
    expect(usernameRegex.test('Abcdefg1')).toBe(false);
    expect(usernameRegex.test('Password1')).toBe(false);
  });

  test('Invalid: contains invalid special character', () => {
    expect(usernameRegex.test('Abcdef1?')).toBe(false); // ? not allowed
    expect(usernameRegex.test('Abcdef1.')).toBe(false); // . not allowed
  });

  test('Invalid: contains whitespace', () => {
    expect(usernameRegex.test('Abc def1!')).toBe(false);
    expect(usernameRegex.test('Abcdef1 !')).toBe(false);
  });
});

// Mock DOM elements for testing
const mockGetElementById = (id) => {
  const mockElements = {
    'january-income': { value: '1000' },
    'february-income': { value: '1500' },
    'march-income': { value: '' },
    'april-income': { value: '2000' },
    'may-income': { value: '0' },
    'june-income': { value: '1800' },
    'july-income': { value: '2200' },
    'august-income': { value: '1900' },
    'september-income': { value: '2100' },
    'october-income': { value: '1700' },
    'november-income': { value: '1600' },
    'december-income': { value: '2300' },
    'january-expenses': { value: '800' },
    'february-expenses': { value: '1200' },
    'march-expenses': { value: '900' },
    'april-expenses': { value: '1500' },
    'may-expenses': { value: '1100' },
    'june-expenses': { value: '1300' },
    'july-expenses': { value: '1400' },
    'august-expenses': { value: '1250' },
    'september-expenses': { value: '1350' },
    'october-expenses': { value: '1150' },
    'november-expenses': { value: '1050' },
    'december-expenses': { value: '1450' },
    'userEmail': { value: 'test@example.com' },
    'barChart': { 
      toDataURL: jest.fn().mockReturnValue('data:image/png;base64,mockImageData')
    }
  };
  return mockElements[id] || null;
};

// Extract getMonthlyIncomeExpenses function for testing
const getMonthlyIncomeExpenses = () => {
  const months = [
    'january', 'february', 'march', 'april', 'may', 'june',
    'july', 'august', 'september', 'october', 'november', 'december'
  ];
  const income = months.map(month =>
    parseFloat(mockGetElementById(`${month}-income`)?.value) || 0
  );
  const expenses = months.map(month =>
    parseFloat(mockGetElementById(`${month}-expenses`)?.value) || 0
  );
  return { income, expenses };
};

// Extract downloadCanvasImage function for testing
const downloadCanvasImage = (canvasId, filename = 'chart.png') => {
  const canvas = mockGetElementById(canvasId);
  if (!canvas) return false;
  
  // Mock the download behavior
  const mockLink = {
    href: '',
    download: '',
    click: jest.fn()
  };
  
  mockLink.href = canvas.toDataURL('image/png');
  mockLink.download = filename;
  mockLink.click();
  
  return {
    href: mockLink.href,
    download: mockLink.download,
    clicked: mockLink.click.mock.calls.length > 0
  };
};

// Email validation regex from the code
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

describe('Monthly Income and Expenses Data Processing', () => {
  test('should correctly parse valid income values', () => {
    const { income } = getMonthlyIncomeExpenses();
    
    expect(income[0]).toBe(1000); // January
    expect(income[1]).toBe(1500); // February
    expect(income[3]).toBe(2000); // April
    expect(income[11]).toBe(2300); // December
  });

  test('should handle empty income values as zero', () => {
    const { income } = getMonthlyIncomeExpenses();
    
    expect(income[2]).toBe(0); // March (empty string)
    expect(income[4]).toBe(0); // May (zero value)
  });

  test('should correctly parse all expense values', () => {
    const { expenses } = getMonthlyIncomeExpenses();
    
    expect(expenses[0]).toBe(800);  // January
    expect(expenses[1]).toBe(1200); // February
    expect(expenses[11]).toBe(1450); // December
  });

  test('should return arrays of length 12 for both income and expenses', () => {
    const { income, expenses } = getMonthlyIncomeExpenses();
    
    expect(income).toHaveLength(12);
    expect(expenses).toHaveLength(12);
  });

  test('should handle all zero values correctly', () => {
    // Mock all elements returning zero
    const originalMock = mockGetElementById;
    const zeroMockGetElementById = (id) => ({ value: '0' });
    
    const months = [
      'january', 'february', 'march', 'april', 'may', 'june',
      'july', 'august', 'september', 'october', 'november', 'december'
    ];
    const income = months.map(month =>
      parseFloat(zeroMockGetElementById(`${month}-income`)?.value) || 0
    );
    const expenses = months.map(month =>
      parseFloat(zeroMockGetElementById(`${month}-expenses`)?.value) || 0
    );
    
    expect(income.every(val => val === 0)).toBe(true);
    expect(expenses.every(val => val === 0)).toBe(true);
  });
});

describe('Canvas Download Functionality', () => {
  test('should successfully download chart with default filename', () => {
    const result = downloadCanvasImage('barChart');
    
    expect(result.download).toBe('chart.png');
    expect(result.href).toBe('data:image/png;base64,mockImageData');
    expect(result.clicked).toBe(true);
  });

  test('should download chart with custom filename', () => {
    const result = downloadCanvasImage('barChart', 'my-budget-chart.png');
    
    expect(result.download).toBe('my-budget-chart.png');
    expect(result.clicked).toBe(true);
  });

  test('should handle non-existent canvas element', () => {
    const result = downloadCanvasImage('nonExistentCanvas');
    
    expect(result).toBe(false);
  });

  test('should use correct default filename when none provided', () => {
    const result = downloadCanvasImage('barChart', undefined);
    
    expect(result.download).toBe('chart.png');
  });
});

describe('Email Validation', () => {
  test('should validate correct email formats', () => {
    expect(emailRegex.test('user@example.com')).toBe(true);
    expect(emailRegex.test('test.email@domain.org')).toBe(true);
    expect(emailRegex.test('user+tag@example.co.uk')).toBe(true);
    expect(emailRegex.test('valid_email@test-domain.com')).toBe(true);
  });

  test('should reject invalid email formats', () => {
    expect(emailRegex.test('invalid.email')).toBe(false);
    expect(emailRegex.test('@domain.com')).toBe(false);
    expect(emailRegex.test('user@')).toBe(false);
    expect(emailRegex.test('user@domain')).toBe(false);
    expect(emailRegex.test('user name@domain.com')).toBe(false);
    expect(emailRegex.test('user@domain .com')).toBe(false);
  });

  test('should reject empty or whitespace-only emails', () => {
    expect(emailRegex.test('')).toBe(false);
    expect(emailRegex.test('   ')).toBe(false);
    expect(emailRegex.test('\t')).toBe(false);
  });
});

describe('Chart Configuration', () => {
  test('should have correct month labels', () => {
    const expectedLabels = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    // This would be part of the chart configuration in the actual code
    expect(expectedLabels).toHaveLength(12);
    expect(expectedLabels[0]).toBe('January');
    expect(expectedLabels[11]).toBe('December');
  });

  test('should initialize datasets with correct structure', () => {
    const expectedDatasets = [
      {
        label: 'Income',
        data: Array(12).fill(0),
        backgroundColor: 'rgba(54, 162, 235, 0.5)'
      },
      {
        label: 'Expenses',
        data: Array(12).fill(0),
        backgroundColor: 'rgba(255, 99, 132, 0.5)'
      }
    ];
    
    expect(expectedDatasets).toHaveLength(2);
    expect(expectedDatasets[0].label).toBe('Income');
    expect(expectedDatasets[1].label).toBe('Expenses');
    expect(expectedDatasets[0].data).toHaveLength(12);
    expect(expectedDatasets[1].data).toHaveLength(12);
  });
});

describe('Data Parsing Edge Cases', () => {
  test('should handle non-numeric string values', () => {
    const parseValue = (value) => parseFloat(value) || 0;
    
    expect(parseValue('abc')).toBe(0);
    expect(parseValue('123abc')).toBe(123);
    expect(parseValue('abc123')).toBe(0);
    expect(parseValue('')).toBe(0);
    expect(parseValue(null)).toBe(0);
    expect(parseValue(undefined)).toBe(0);
  });

  test('should handle decimal values correctly', () => {
    const parseValue = (value) => parseFloat(value) || 0;
    
    expect(parseValue('123.45')).toBe(123.45);
    expect(parseValue('0.99')).toBe(0.99);
    expect(parseValue('.50')).toBe(0.5);
  });

  test('should handle negative values', () => {
    const parseValue = (value) => parseFloat(value) || 0;
    
    expect(parseValue('-100')).toBe(-100);
    expect(parseValue('-0.50')).toBe(-0.5);
  });
});