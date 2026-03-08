const SESSION_TOKENS = {
  admin: process.env.A3_ADMIN_SESSION_TOKEN || '',
  parent: process.env.A3_PARENT_SESSION_TOKEN || '',
  student: process.env.A3_STUDENT_SESSION_TOKEN || '',
};

function authHeader(token) {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export function headersForRole(role) {
  const token = SESSION_TOKENS[role] || '';
  return authHeader(token);
}

export function requiresRole(role) {
  if (!SESSION_TOKENS[role]) {
    return `Missing A3_${role.toUpperCase()}_SESSION_TOKEN`;
  }
  return null;
}
