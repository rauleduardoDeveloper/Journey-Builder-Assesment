import React, { useState, useMemo } from 'react';
import { DataElement, GroupedDataElements } from '../types/dataSources';

interface PrefillModalProps {
  open: boolean;
  onClose: () => void;
  onSelectSource: (source: DataElement) => void;
  sources: DataElement[];
}

function filterSources(sources: DataElement[], query: string): DataElement[] {
  if (!query) return sources;
  return sources.filter((src) =>
    src.label.toLowerCase().includes(query.toLowerCase())
  );
}

function groupSourcesByDisplay(sources: DataElement[]): GroupedDataElements {
  const grouped: any = {};

  sources.forEach((src) => {
    let category = '';
    if (src.type === 'direct') {
      category = 'Direct Dependencies';
    } else if (src.type === 'transitive') {
      category = 'Transitive Dependencies';
    } else if (src.type === 'action') {
      category = 'Action Properties';
    } else if (src.type === 'client') {
      category = 'Client Organization Properties';
    } else if (src.type === 'global') {
      category = 'Global';
    }

    if (!grouped[category]) grouped[category] = [];
    grouped[category].push(src);
  });

  return grouped;
}

export const PrefillModal: React.FC<PrefillModalProps> = ({
  open,
  onClose,
  onSelectSource,
  sources,
}) => {
  const [search, setSearch] = useState('');
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const filteredSources = useMemo(
    () => filterSources(sources, search),
    [sources, search]
  );

  const grouped = useMemo(
    () => groupSourcesByDisplay(filteredSources),
    [filteredSources]
  );

  if (!open) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#fff',
          padding: 24,
          borderRadius: 8,
          minWidth: 400,
          maxWidth: 600,
          maxHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 style={{ marginTop: 0, marginBottom: 16 }}>Select data element to map</h3>

        <input
          type="text"
          placeholder="Search data sources..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: '100%',
            padding: 8,
            marginBottom: 16,
            borderRadius: 4,
            border: '1px solid #ccc',
            fontSize: 14,
            boxSizing: 'border-box',
          }}
        />

        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            borderTop: '1px solid #eee',
            paddingTop: 12,
          }}
        >
          {Object.keys(grouped).length === 0 ? (
            <p style={{ color: '#999' }}>No data sources found</p>
          ) : (
            Object.keys(grouped).map((category) => (
              <div key={category} style={{ marginBottom: 16 }}>
                <button
                  onClick={() =>
                    setExpandedCategory(
                      expandedCategory === category ? null : category
                    )
                  }
                  style={{
                    fontWeight: 'bold',
                    background:
                      expandedCategory === category ? '#f0f0f0' : 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '8px 0',
                    fontSize: 14,
                    textAlign: 'left',
                    width: '100%',
                  }}
                >
                  {expandedCategory === category ? '▼' : '▶'} {category}
                </button>
                {expandedCategory === category && (
                  <ul
                    style={{
                      listStyle: 'none',
                      margin: '8px 0 0 0',
                      padding: 0,
                    }}
                  >
                    {grouped[category].map((src, idx) => (
                      <li key={idx} style={{ marginBottom: 4 }}>
                        <button
                          onClick={() => onSelectSource(src)}
                          style={{
                            padding: '8px 12px',
                            width: '100%',
                            border: '1px solid #ddd',
                            borderRadius: 4,
                            backgroundColor: '#fafafa',
                            cursor: 'pointer',
                            textAlign: 'left',
                            fontSize: 13,
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.backgroundColor = '#f0f0f0')
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.backgroundColor = '#fafafa')
                          }
                        >
                          {src.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))
          )}
        </div>

        <div
          style={{
            display: 'flex',
            gap: 8,
            marginTop: 16,
            borderTop: '1px solid #eee',
            paddingTop: 12,
          }}
        >
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: '10px 16px',
              border: '1px solid #ccc',
              borderRadius: 4,
              backgroundColor: '#f5f5f5',
              cursor: 'pointer',
              fontWeight: 500,
            }}
          >
            CANCEL
          </button>
        </div>
      </div>
    </div>
  );
};
