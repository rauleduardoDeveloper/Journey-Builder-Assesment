import React, { useEffect, useState } from 'react';
import { fetchFormGraph } from './api';
import { FormList } from './components/FormList';
import { FormDetails } from './components/FormDetails';
import { PrefillModal } from './components/PrefillModal';
import { getAllDataElements } from './services/dataSourceProviders';
import { DataElement } from './types/dataSources';
import './App.css';

function getFormById(forms: any[], id: string) {
  return forms.find(f => f.id === id);
}

function getDirectDependencies(form: any, forms: any[]) {
  return (form.data?.prerequisites || []).map((id: string) => getFormById(forms, id)).filter(Boolean);
}

function getTransitiveDependencies(form: any, forms: any[], visited = new Set()): any[] {
  let result: any[] = [];
  for (const id of form.data?.prerequisites || []) {
    if (!visited.has(id)) {
      visited.add(id);
      const dep = getFormById(forms, id);
      if (dep) {
        result.push(dep);
        result = result.concat(getTransitiveDependencies(dep, forms, visited));
      }
    }
  }
  return result;
}

function App() {
  const [forms, setForms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedForm, setSelectedForm] = useState<any | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalSources, setModalSources] = useState<any[]>([]);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [prefillMap, setPrefillMap] = useState<{ [formId: string]: { [field: string]: any } }>({});

  useEffect(() => {
    fetchFormGraph()
      .then((data) => {
        setForms(data.nodes || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const getPrefillSources = (form: any) => {
    const context = {
      currentForm: form,
      allForms: forms,
      directDependencies: getDirectDependencies(form, forms),
      transitiveDependencies: getTransitiveDependencies(form, forms),
    };

    const { elements } = getAllDataElements(context);
    return elements;
  };

  const handleSelectForm = (form: any) => {
    setSelectedForm(form);
  };

  const handleEditPrefill = (fieldKey: string) => {
    setEditingField(fieldKey);
    setModalSources(getPrefillSources(selectedForm));
    setModalOpen(true);
  };

  const handleClearPrefill = (fieldKey: string) => {
    if (!selectedForm) return;
    setPrefillMap(prev => ({
      ...prev,
      [selectedForm.id]: {
        ...prev[selectedForm.id],
        [fieldKey]: null,
      },
    }));
  };

  const handleSelectSource = (source: DataElement) => {
    if (!selectedForm || !editingField) return;
    setPrefillMap(prev => ({
      ...prev,
      [selectedForm.id]: {
        ...prev[selectedForm.id],
        [editingField]: source.value,
      },
    }));
    setModalOpen(false);
    setEditingField(null);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingField(null);
  };

  const EnhancedFormDetails = selectedForm ? (
    <div className="form-details-card">
      <FormDetails
        form={selectedForm}
        prefillMap={prefillMap[selectedForm.id] || {}}
        onEditPrefill={handleEditPrefill}
        onClearPrefill={handleClearPrefill}
      />
    </div>
  ) : null;

  return (
    <div className="App">
      <header className="App-header">
        <h1>Journey Builder Forms</h1>
        {loading && <p>Loading forms...</p>}
        {error && <p style={{ color: 'red' }}>Error: {error}</p>}
        {!loading && !error && (
          <div style={{ display: 'flex', gap: '2rem' }}>
            <div className="form-list-card">
              <FormList forms={forms} onSelect={handleSelectForm} />
            </div>
            {EnhancedFormDetails}
          </div>
        )}
        <PrefillModal
          open={modalOpen}
          onClose={handleCloseModal}
          onSelectSource={handleSelectSource}
          sources={modalSources}
        />
      </header>
    </div>
  );
}

export default App;
