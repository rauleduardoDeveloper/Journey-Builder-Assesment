
# Journey Builder

A React application for building and visualizing form journey workflows with data prefilling capabilities. This application allows users to view form dependencies and configure how data from previous forms can prefill fields in downstream forms.

## Features

- **Form List Display**: View all available forms in a journey blueprint
- **Form Dependencies**: Automatically traverse and display direct and transitive form dependencies
- **Data Prefilling**: Configure which data sources should prefill form fields
- **Multiple Data Sources**: Direct/transitive dependencies, action properties, client org properties, and global data
- **Extensible Architecture**: Easy to add new data sources without modifying core code
- **Search & Filter**: Find data sources quickly
- **Comprehensive Tests**: Unit tests for components and services
- **TypeScript**: Full type safety throughout

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

```bash
cd journey-builder
npm install
cd ../frontendchallengeserver
npm install
```

### Running Locally

1. **Start the mock server:**

```bash
cd frontendchallengeserver
npm start
```

2. **In another terminal, start React dev server:**

```bash
cd journey-builder
npm start
```

### Running Tests

```bash
npm test                    # Interactive mode
npm test -- --coverage      # With coverage
```

## Using the Application

1. **View Forms**: Forms load automatically from the mock server
2. **Select Form**: Click any form in the left panel to select it
3. **Configure Prefills**: 
   - Click "Set Prefill" on any field to open the data source modal
   - Select a data element to map
   - Click "Clear" to remove a mapping
4. **Search**: Use the search box in the modal to find data sources

## Architecture: Extensible Data Sources

The application uses a **provider-based architecture** for adding new data sources without code changes.

### Adding New Data Sources

Create a provider implementing `DataSourceProvider`:

```typescript
import { DataSourceProvider, DataElement, GroupedDataElements, DataSourceContext } from '../types/dataSources';

class MyDataSourceProvider implements DataSourceProvider {
  id = 'my-source';
  name = 'My Data Source';

  getElements(context: DataSourceContext): DataElement[] {
    // context has: currentForm, allForms, directDependencies, transitiveDependencies
    return [
      {
        label: 'My Source: field_name',
        value: { formId: 'my-source', field: 'field_name' },
        type: 'global', // or: direct, transitive, action, client
      },
    ];
  }

  groupElements(elements: DataElement[]): GroupedDataElements {
    return { 'My Data Source': elements };
  }
}
```

Register it in your app:

```typescript
import { registerDataSourceProvider } from './services/dataSourceProviders';
registerDataSourceProvider(new MyDataSourceProvider());
```

That's it! Your data source automatically appears in the prefill modal.

## Built-in Data Sources

1. **Form Fields**: Fields from directly/transitively dependent forms
2. **Action Properties**: System action data (action_type, created_at, updated_at)
3. **Client Organization Properties**: Client/org data (org_name, org_id, industry)
4. **Global Data**: System-wide data (organization_name, timezone, country, etc.)

## Code Organization

```
src/
├── components/
│   ├── FormList.tsx          # Form selection list
│   ├── FormDetails.tsx       # Form fields & prefill status
│   ├── PrefillModal.tsx      # Data source selector
│   └── __tests__/            # Component tests
├── services/
│   ├── dataSourceProviders.ts  # Built-in providers
│   └── __tests__/              # Service tests
├── types/
│   └── dataSources.ts          # TypeScript interfaces
├── api.ts                    # API client
├── App.tsx                   # Main component
└── App.css                   # Styles
```

## Testing

Tests cover:
- FormList component (rendering, selection)
- PrefillModal component (filtering, grouping, selection)
- Data source providers (element generation, provider registration)

```bash
npm test                    # Run all tests
npm test -- --coverage      # Coverage report
```

## Build for Production

```bash
npm run build
```

## Troubleshooting

**Port 3000 Already in Use**:
- Option 1: Kill the process using port 3000
- Option 2: React will use port 3001 automatically
- Option 3: Change server port in `frontendchallengeserver/index.js`

**API Connection Issues**:
- Ensure mock server is running on port 3000
- Check API endpoint in `src/api.ts`

## Learn More

- [React Documentation](https://reactjs.org/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Create React App](https://create-react-app.dev/)
