import React from 'react';

interface FormListProps {
  forms: any[];
  onSelect: (form: any) => void;
}

export const FormList: React.FC<FormListProps> = ({ forms, onSelect }) => (
  <div>
    <h2>Forms</h2>
    <ul>
      {forms.map((form) => (
        <li key={form.id || form.data?.id}>
          <button onClick={() => onSelect(form)}>
            {form.data?.name || form.id}
          </button>
        </li>
      ))}
    </ul>
  </div>
);
