import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { FormList } from '../FormList';

describe('FormList Component', () => {
  const mockForms = [
    {
      id: 'form-1',
      data: { name: 'Form A', prerequisites: [] },
    },
    {
      id: 'form-2',
      data: { name: 'Form B', prerequisites: ['form-1'] },
    },
    {
      id: 'form-unknown',
      data: {},
    },
  ];

  it('renders a list of forms', () => {
    const mockOnSelect = jest.fn();
    render(<FormList forms={mockForms} onSelect={mockOnSelect} />);

    expect(screen.getByText('Forms')).toBeInTheDocument();
    expect(screen.getByText('Form A')).toBeInTheDocument();
    expect(screen.getByText('Form B')).toBeInTheDocument();
  });

  it('calls onSelect when a form button is clicked', () => {
    const mockOnSelect = jest.fn();
    render(<FormList forms={mockForms} onSelect={mockOnSelect} />);

    const formButton = screen.getByText('Form A');
    fireEvent.click(formButton);

    expect(mockOnSelect).toHaveBeenCalledWith(mockForms[0]);
  });

  it('uses form id when form name is not available', () => {
    const mockOnSelect = jest.fn();
    render(<FormList forms={mockForms} onSelect={mockOnSelect} />);

    expect(screen.getByText('form-unknown')).toBeInTheDocument();
  });

  it('handles empty forms list', () => {
    const mockOnSelect = jest.fn();
    render(<FormList forms={[]} onSelect={mockOnSelect} />);

    expect(screen.getByText('Forms')).toBeInTheDocument();
  });

  it('handles multiple form selections', () => {
    const mockOnSelect = jest.fn();
    render(<FormList forms={mockForms} onSelect={mockOnSelect} />);

    fireEvent.click(screen.getByText('Form A'));
    expect(mockOnSelect).toHaveBeenCalledWith(mockForms[0]);

    fireEvent.click(screen.getByText('Form B'));
    expect(mockOnSelect).toHaveBeenCalledWith(mockForms[1]);

    expect(mockOnSelect).toHaveBeenCalledTimes(2);
  });
});
