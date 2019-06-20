import auth from 'utils/auth';

async function bootstrapAppData() {
  const isAuthenticated = await auth.isAuthenticated();
  if (!isAuthenticated) {
    return { user: null, isAuthenticated: false, dossiers: [] };
  }
  const user = await auth.getUser();
  return {
    user,
    isAuthenticated
  };
}

export { bootstrapAppData };
