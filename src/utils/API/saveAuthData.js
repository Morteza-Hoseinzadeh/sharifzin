// After successful login or register
export const saveAuthData = (backendResponse) => {
  const authData = {
    token: backendResponse.token || backendResponse.tokens?.access_token,
    user: { ...backendResponse?.user },
    timestamp: new Date().toISOString(),
  };

  localStorage.setItem('sharifzin_auth_token', JSON.stringify(authData));
};
