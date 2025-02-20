import React from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

const clientId = "487726092738-em7bbfrm419vuvp8cpfpk2jibi5n1u5p.apps.googleusercontent.com";

const GoogleRegisterButton = () => {
  const handleSuccess = (response: any) => {
    console.log("Google SignUp Success:", response);
  };

  const handleFailure = () => {
    console.log("Google SignUp Failed");
  };

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <GoogleLogin 
        onSuccess={handleSuccess}
        onError={handleFailure}
        useOneTap
        theme="filled_blue"
        text="signup_with"
        size="large"
        width="500"
      />
    </GoogleOAuthProvider>
  );
};

export default GoogleRegisterButton;
