"use client"
import React, { useState } from 'react';
import firebase from '../../../utils/db';
import { useRouter } from 'next/navigation'
import { useAuth } from '../../../context/AuthUserContext';

const PhoneAuth = () => {
  const router = useRouter()
  const { authUser, loading } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationId, setVerificationId] = useState('');

  const handleSendCode = () => {
    const recaptchaVerifier = new firebase.auth.RecaptchaVerifier('send-code-button', {
      size: 'invisible',
    });
    firebase.auth().signInWithPhoneNumber(phoneNumber, recaptchaVerifier)
      .then((verificationId) => {
        setVerificationId(verificationId);
      })
      .catch((error) => {
        return error
      });
  };

  const handleVerifyCode = () => {
    const credential = firebase.auth.PhoneAuthProvider.credential(verificationId.verificationId, verificationCode);
    firebase.auth().signInWithCredential(credential)
      .then((userCredential) => {
        router.push('/dashboard')
      })
      .catch((error) => {
        return error
      });
  };

  return (
    <>
      <input type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
      <button id="send-code-button" onClick={handleSendCode}>Send Code</button>
      <input type="text" value={verificationCode} onChange={(e) => setVerificationCode(e.target.value)} />
      <button onClick={handleVerifyCode}>Verify Code</button>
    </>
  );
};

export default PhoneAuth;
