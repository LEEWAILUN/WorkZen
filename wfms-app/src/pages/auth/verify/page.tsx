import React, { useState } from 'react';
import axios from 'axios';

const VerifyEmail = ({ email }: { email: string }) => {
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');
  const [resendDisabled, setResendDisabled] = useState(false);

  const verifyCode = async () => {
    try {
      const response = await axios.post('http://localhost:5173/api/auth/verify', { email, code });
      setMessage(response.data.message);
    } catch (error) {
      setMessage('Invalid or expired code');
    }
  };

  const resendCode = async () => {
    setResendDisabled(true);
    try {
      await axios.post('http://localhost:5173/api/auth/resend-code', { email });
      setMessage('New verification code sent');
      setTimeout(() => setResendDisabled(false), 60000);
    } catch (error) {
      setMessage('Error resending code');
    }
  };

  return (
    <div>
      <h2>Verify Your Email</h2>
      <p>Enter the 6-digit code sent to {email}</p>
      <input
        type="text"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        maxLength={6}
      />
      <button onClick={verifyCode}>Verify</button>
      <button onClick={resendCode} disabled={resendDisabled}>
        {resendDisabled ? 'Wait 1 min' : 'Resend Code'}
      </button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default VerifyEmail;
