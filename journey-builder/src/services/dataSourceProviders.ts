import {
  DataSourceProvider,
  DataElement,
  GroupedDataElements,
  DataSourceContext,
} from '../types/dataSources';

function getFormFields(form: any): string[] {
  return ['email', 'dynamic_checkbox_group', 'dynamic_object'];
}

class FormFieldsDataSourceProvider implements DataSourceProvider {
  id = 'form-fields';
  name = 'Form Fields';

  getElements(context: DataSourceContext): DataElement[] {
    const elements: DataElement[] = [];

    context.directDependencies.forEach((dep: any) => {
      const fields = getFormFields(dep);
      fields.forEach((field) => {
        elements.push({
          label: `${dep.data?.name || dep.id}: ${field}`,
          value: { formId: dep.id, field },
          type: 'direct',
        });
      });
    });

    context.transitiveDependencies.forEach((dep: any) => {
      const fields = getFormFields(dep);
      fields.forEach((field) => {
        elements.push({
          label: `${dep.data?.name || dep.id}: ${field}`,
          value: { formId: dep.id, field },
          type: 'transitive',
        });
      });
    });

    return elements;
  }

  groupElements(elements: DataElement[]): GroupedDataElements {
    const grouped: GroupedDataElements = {
      'Direct Dependencies': [],
      'Transitive Dependencies': [],
    };

    elements.forEach((el) => {
      if (el.type === 'direct') {
        grouped['Direct Dependencies'].push(el);
      } else if (el.type === 'transitive') {
        grouped['Transitive Dependencies'].push(el);
      }
    });

    return grouped;
  }
}

class ActionPropertiesDataSourceProvider implements DataSourceProvider {
  id = 'action-properties';
  name = 'Action Properties';

  getElements(context: DataSourceContext): DataElement[] {
    return [
      {
        label: 'Action Properties: action_type',
        value: { formId: 'action', field: 'action_type' },
        type: 'action',
      },
      {
        label: 'Action Properties: created_at',
        value: { formId: 'action', field: 'created_at' },
        type: 'action',
      },
      {
        label: 'Action Properties: updated_at',
        value: { formId: 'action', field: 'updated_at' },
        type: 'action',
      },
    ];
  }

  groupElements(elements: DataElement[]): GroupedDataElements {
    return {
      'Action Properties': elements,
    };
  }
}

class ClientOrgPropertiesDataSourceProvider implements DataSourceProvider {
  id = 'client-org-properties';
  name = 'Client Organization Properties';

  getElements(context: DataSourceContext): DataElement[] {
    return [
      {
        label: 'Client Organization Properties: org_name',
        value: { formId: 'client', field: 'org_name' },
        type: 'client',
      },
      {
        label: 'Client Organization Properties: org_id',
        value: { formId: 'client', field: 'org_id' },
        type: 'client',
      },
      {
        label: 'Client Organization Properties: industry',
        value: { formId: 'client', field: 'industry' },
        type: 'client',
      },
    ];
  }

  groupElements(elements: DataElement[]): GroupedDataElements {
    return {
      'Client Organization Properties': elements,
    };
  }
}

class GlobalDataSourceProvider implements DataSourceProvider {
  id = 'global-data';
  name = 'Global Data';

  getElements(context: DataSourceContext): DataElement[] {
    return [
      {
        label: 'Global: organization_name',
        value: { formId: 'global', field: 'organization_name' },
        type: 'global',
      },
      {
        label: 'Global: timezone',
        value: { formId: 'global', field: 'timezone' },
        type: 'global',
      },
      {
        label: 'Global: country',
        value: { formId: 'global', field: 'country' },
        type: 'global',
      },
      {
        label: 'Global: current_user_id',
        value: { formId: 'global', field: 'current_user_id' },
        type: 'global',
      },
      {
        label: 'Global: current_timestamp',
        value: { formId: 'global', field: 'current_timestamp' },
        type: 'global',
      },
    ];
  }

  groupElements(elements: DataElement[]): GroupedDataElements {
    return {
      'Global': elements,
    };
  }
}

const DATA_SOURCE_PROVIDERS: DataSourceProvider[] = [
  new FormFieldsDataSourceProvider(),
  new ActionPropertiesDataSourceProvider(),
  new ClientOrgPropertiesDataSourceProvider(),
  new GlobalDataSourceProvider(),
];

export function getAllDataElements(context: DataSourceContext) {
  const allElements: DataElement[] = [];
  const allGrouped: GroupedDataElements = {};

  DATA_SOURCE_PROVIDERS.forEach((provider) => {
    const elements = provider.getElements(context);
    allElements.push(...elements);

    const grouped = provider.groupElements(elements);
    Object.assign(allGrouped, grouped);
  });

  return {
    elements: allElements,
    grouped: allGrouped,
  };
}

export function registerDataSourceProvider(provider: DataSourceProvider) {
  DATA_SOURCE_PROVIDERS.push(provider);
}
