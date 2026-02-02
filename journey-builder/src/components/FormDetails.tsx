import React from 'react';

interface PrefillMapping {
  formId: string;
  field: string;
}

interface FormDetailsProps {
  form: any;
  prefillMap?: { [field: string]: PrefillMapping | null };
  onEditPrefill: (fieldKey: string) => void;
  onClearPrefill: (fieldKey: string) => void;
}

export const FormDetails: React.FC<FormDetailsProps> = ({
  form,
  prefillMap = {},
  onEditPrefill,
  onClearPrefill,
}) => {
  const fields = ['email', 'dynamic_checkbox_group', 'dynamic_object'];

  return (
    <div>
      <h3>{form.data?.name || form.id} Fields</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {fields.map((fieldKey) => {
          const mapping = prefillMap[fieldKey];
          return (
            <li
              key={fieldKey}
              style={{
                padding: '12px 0',
                borderBottom: '1px solid #eee',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <span style={{ fontWeight: 500 }}>{fieldKey}</span>
                {mapping && (
                  <div
                    style={{
                      marginTop: 4,
                      fontSize: 13,
                      color: '#0066cc',
                    }}
                  >
                    Prefilled from {mapping.formId === 'global' ? 'Global' : mapping.formId}: {mapping.field}
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                {mapping && (
                  <button
                    onClick={() => onClearPrefill(fieldKey)}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: '#f0f0f0',
                      border: '1px solid #ddd',
                      borderRadius: 4,
                      cursor: 'pointer',
                      fontSize: 12,
                    }}
                  >
                    ✕ Clear
                  </button>
                )}
                <button
                  onClick={() => onEditPrefill(fieldKey)}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: mapping ? '#f0f0f0' : '#0066cc',
                    color: mapping ? '#000' : '#fff',
                    border: '1px solid ' + (mapping ? '#ddd' : '#0066cc'),
                    borderRadius: 4,
                    cursor: 'pointer',
                    fontSize: 12,
                  }}
                >
                  {mapping ? 'Change' : 'Set Prefill'}
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
