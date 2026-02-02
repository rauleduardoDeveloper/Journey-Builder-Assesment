const TENANT_ID = '1';
const BLUEPRINT_ID = 'bp_01jk766tckfwx84xjcxazggzyc';

export async function fetchFormGraph(): Promise<any> {
  const url = `http://localhost:3000/api/v1/${TENANT_ID}/actions/blueprints/${BLUEPRINT_ID}/graph`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch form graph');
  }
  return response.json();
}
