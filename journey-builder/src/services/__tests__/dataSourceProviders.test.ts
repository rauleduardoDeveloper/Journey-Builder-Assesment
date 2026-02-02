import {
  getAllDataElements,
  registerDataSourceProvider,
} from '../dataSourceProviders';
import {
  DataSourceProvider,
  DataElement,
  GroupedDataElements,
  DataSourceContext,
} from '../../types/dataSources';

describe('Data Source Providers', () => {
  const mockContext: DataSourceContext = {
    currentForm: { id: 'form-d', data: { name: 'Form D' } },
    allForms: [
      { id: 'form-a', data: { name: 'Form A' } },
      { id: 'form-b', data: { name: 'Form B' } },
      { id: 'form-c', data: { name: 'Form C' } },
      { id: 'form-d', data: { name: 'Form D' } },
    ],
    directDependencies: [
      { id: 'form-b', data: { name: 'Form B' } },
    ],
    transitiveDependencies: [
      { id: 'form-a', data: { name: 'Form A' } },
    ],
  };

  it('returns elements from all data source providers', () => {
    const result = getAllDataElements(mockContext);

    expect(result.elements).toBeDefined();
    expect(result.elements.length).toBeGreaterThan(0);

    const types = new Set(result.elements.map((el) => el.type));
    expect(types.has('direct')).toBe(true);
    expect(types.has('transitive')).toBe(true);
    expect(types.has('action')).toBe(true);
    expect(types.has('client')).toBe(true);
    expect(types.has('global')).toBe(true);
  });

  it('groups elements by category', () => {
    const result = getAllDataElements(mockContext);

    expect(result.grouped).toBeDefined();
    expect(Object.keys(result.grouped).length).toBeGreaterThan(0);

    const categories = Object.keys(result.grouped);
    expect(categories.some((cat) => cat.includes('Dependencies'))).toBe(true);
    expect(categories.some((cat) => cat.includes('Action'))).toBe(true);
    expect(categories.some((cat) => cat.includes('Global'))).toBe(true);
  });

  it('includes form fields from dependencies', () => {
    const result = getAllDataElements(mockContext);

    const formBElements = result.elements.filter(
      (el) =>
        el.value.formId === 'form-b' &&
        el.type === 'direct'
    );
    expect(formBElements.length).toBeGreaterThan(0);

    const formAElements = result.elements.filter(
      (el) =>
        el.value.formId === 'form-a' &&
        el.type === 'transitive'
    );
    expect(formAElements.length).toBeGreaterThan(0);
  });

  it('includes global data elements', () => {
    const result = getAllDataElements(mockContext);

    const globalElements = result.elements.filter((el) => el.type === 'global');
    expect(globalElements.length).toBeGreaterThan(0);

    const globalFieldIds = globalElements.map((el) => el.value.field);
    expect(globalFieldIds.some((f) => f === 'organization_name')).toBe(true);
    expect(globalFieldIds.some((f) => f === 'timezone')).toBe(true);
  });

  it('includes action properties', () => {
    const result = getAllDataElements(mockContext);

    const actionElements = result.elements.filter((el) => el.type === 'action');
    expect(actionElements.length).toBeGreaterThan(0);

    const actionFieldIds = actionElements.map((el) => el.value.field);
    expect(actionFieldIds.some((f) => f === 'action_type')).toBe(true);
    expect(actionFieldIds.some((f) => f === 'created_at')).toBe(true);
  });

  it('includes client organization properties', () => {
    const result = getAllDataElements(mockContext);

    const clientElements = result.elements.filter((el) => el.type === 'client');
    expect(clientElements.length).toBeGreaterThan(0);

    const clientFieldIds = clientElements.map((el) => el.value.field);
    expect(clientFieldIds.some((f) => f === 'org_name')).toBe(true);
    expect(clientFieldIds.some((f) => f === 'org_id')).toBe(true);
  });

  it('supports extending with custom data sources', () => {
    const customProvider: DataSourceProvider = {
      id: 'custom-source',
      name: 'Custom Source',
      getElements: (context: DataSourceContext): DataElement[] => [
        {
          label: 'Custom: custom_field',
          value: { formId: 'custom', field: 'custom_field' },
          type: 'global',
        },
      ],
      groupElements: (elements: DataElement[]): GroupedDataElements => ({
        'Custom Source': elements,
      }),
    };

    registerDataSourceProvider(customProvider);

    const result = getAllDataElements(mockContext);
    const customElements = result.elements.filter(
      (el) => el.value.formId === 'custom'
    );

    expect(customElements.length).toBeGreaterThan(0);
    expect(customElements[0].value.field).toBe('custom_field');
  });
});
