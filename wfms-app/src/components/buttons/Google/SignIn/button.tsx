import React from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

const clientId = "487726092738-em7bbfrm419vuvp8cpfpk2jibi5n1u5p.apps.googleusercontent.com";

const GoogleLoginButton = () => {
  const handleSuccess = (response: any) => {
    console.log("Google SignIn Success:", response);
  };

  const handleFailure = () => {
    console.log("Google SignIn Failed");
  };

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <GoogleLogin 
        onSuccess={handleSuccess}
        onError={handleFailure}
        useOneTap
        theme="filled_blue"
        text="continue_with"
        size="large"
        width="500"
      />
    </GoogleOAuthProvider>
  );
};

export default GoogleLoginButton;
