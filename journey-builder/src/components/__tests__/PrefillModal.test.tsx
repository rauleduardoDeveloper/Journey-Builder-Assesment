import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { PrefillModal } from '../PrefillModal';
import { DataElement } from '../../types/dataSources';

describe('PrefillModal Component', () => {
  const mockDataElements: DataElement[] = [
    {
      label: 'Form A: email',
      value: { formId: 'form-a', field: 'email' },
      type: 'direct',
    },
    {
      label: 'Form B: name',
      value: { formId: 'form-b', field: 'name' },
      type: 'transitive',
    },
    {
      label: 'Global: timezone',
      value: { formId: 'global', field: 'timezone' },
      type: 'global',
    },
    {
      label: 'Action Properties: action_type',
      value: { formId: 'action', field: 'action_type' },
      type: 'action',
    },
  ];

  it('does not render when closed', () => {
    const mockOnClose = jest.fn();
    const mockOnSelectSource = jest.fn();

    const { container } = render(
      <PrefillModal
        open={false}
        onClose={mockOnClose}
        onSelectSource={mockOnSelectSource}
        sources={mockDataElements}
      />
    );

    expect(container.firstChild).toBeNull();
  });

  it('renders when open', () => {
    const mockOnClose = jest.fn();
    const mockOnSelectSource = jest.fn();

    render(
      <PrefillModal
        open={true}
        onClose={mockOnClose}
        onSelectSource={mockOnSelectSource}
        sources={mockDataElements}
      />
    );

    expect(screen.getByText('Select data element to map')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search data sources...')).toBeInTheDocument();
  });

  it('displays all data source categories', () => {
    const mockOnClose = jest.fn();
    const mockOnSelectSource = jest.fn();

    render(
      <PrefillModal
        open={true}
        onClose={mockOnClose}
        onSelectSource={mockOnSelectSource}
        sources={mockDataElements}
      />
    );

    expect(screen.getByText(/Direct Dependencies/i)).toBeInTheDocument();
    expect(screen.getByText(/Transitive Dependencies/i)).toBeInTheDocument();
    expect(screen.getByText(/Global/i)).toBeInTheDocument();
    expect(screen.getByText(/Action Properties/i)).toBeInTheDocument();
  });

  it('expands and collapses categories', () => {
    const mockOnClose = jest.fn();
    const mockOnSelectSource = jest.fn();

    render(
      <PrefillModal
        open={true}
        onClose={mockOnClose}
        onSelectSource={mockOnSelectSource}
        sources={mockDataElements}
      />
    );

    const directDepsButton = screen.getByText(/Direct Dependencies/i);
    fireEvent.click(directDepsButton);

    expect(screen.getByText('Form A: email')).toBeInTheDocument();

    fireEvent.click(directDepsButton);
    expect(screen.queryByText('Form A: email')).not.toBeInTheDocument();
  });

  it('filters sources by search query', () => {
    const mockOnClose = jest.fn();
    const mockOnSelectSource = jest.fn();

    render(
      <PrefillModal
        open={true}
        onClose={mockOnClose}
        onSelectSource={mockOnSelectSource}
        sources={mockDataElements}
      />
    );

    const searchInput = screen.getByPlaceholderText('Search data sources...');
    fireEvent.change(searchInput, { target: { value: 'email' } });

    expect(screen.getByText(/Direct Dependencies/i)).toBeInTheDocument();
    expect(screen.queryByText('Global')).not.toBeInTheDocument();
  });

  it('calls onSelectSource when a data element is selected', () => {
    const mockOnClose = jest.fn();
    const mockOnSelectSource = jest.fn();

    render(
      <PrefillModal
        open={true}
        onClose={mockOnClose}
        onSelectSource={mockOnSelectSource}
        sources={mockDataElements}
      />
    );

    const directDepsButton = screen.getByText(/Direct Dependencies/i);
    fireEvent.click(directDepsButton);

    const emailButton = screen.getByText('Form A: email');
    fireEvent.click(emailButton);

    expect(mockOnSelectSource).toHaveBeenCalledWith(mockDataElements[0]);
  });

  it('calls onClose when cancel button is clicked', () => {
    const mockOnClose = jest.fn();
    const mockOnSelectSource = jest.fn();

    render(
      <PrefillModal
        open={true}
        onClose={mockOnClose}
        onSelectSource={mockOnSelectSource}
        sources={mockDataElements}
      />
    );

    const cancelButton = screen.getByText('CANCEL');
    fireEvent.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('displays message when no sources match search', () => {
    const mockOnClose = jest.fn();
    const mockOnSelectSource = jest.fn();

    render(
      <PrefillModal
        open={true}
        onClose={mockOnClose}
        onSelectSource={mockOnSelectSource}
        sources={mockDataElements}
      />
    );

    const searchInput = screen.getByPlaceholderText('Search data sources...');
    fireEvent.change(searchInput, { target: { value: 'nonexistent' } });

    expect(screen.getByText('No data sources found')).toBeInTheDocument();
  });
});
