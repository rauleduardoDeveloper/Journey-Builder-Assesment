export interface DataElement {
  label: string;
  value: {
    formId: string;
    field: string;
  };
  type: 'direct' | 'transitive' | 'action' | 'client' | 'global';
}

export interface GroupedDataElements {
  [category: string]: DataElement[];
}

export interface DataSourceProvider {
  id: string;
  name: string;
  getElements(context: DataSourceContext): DataElement[];
  groupElements(elements: DataElement[]): GroupedDataElements;
}

export interface DataSourceContext {
  currentForm: any;
  allForms: any[];
  directDependencies: any[];
  transitiveDependencies: any[];
}

export interface DataSourcesResult {
  elements: DataElement[];
  grouped: GroupedDataElements;
}
