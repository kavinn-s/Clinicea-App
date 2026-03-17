import dotenv from 'dotenv';
dotenv.config();

const BASE_URL = 'https://cpaas.messagecentral.com/messages/v1/auth/otp';

/**
 * Message Central Service
 * Documentation: https://cpaas.messagecentral.com
 */

export const sendOTP = async (mobileNumber) => {
    // Ensure mobile is in format like 91XXXXXXXXXX
    const cleanMobile = mobileNumber.replace(/\D/g, '');
    const mobileWithoutCode = cleanMobile.length > 10 ? cleanMobile.slice(-10) : cleanMobile;
    const countryCode = cleanMobile.length > 10 ? cleanMobile.slice(0, cleanMobile.length - 10) : '91';

    const url = `https://cpaas.messagecentral.com/verification/v3/send?countryCode=${countryCode}&mobileNumber=${mobileWithoutCode}&flowType=SMS&customerId=${process.env.MESSAGE_CENTRAL_CUSTOMER_ID}`;

    try {
        console.log(`Sending OTP to: ${countryCode}${mobileWithoutCode} using URL: ${url}`);
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'authToken': process.env.MESSAGE_CENTRAL_AUTH_TOKEN,
                'Content-Type': 'application/json'
            }
        });

        const responseText = await response.text();
        console.log(`MessageCentral Status: ${response.status}`);
        console.log(`MessageCentral Raw Response: ${responseText}`);

        if (!responseText) {
            return { success: false, message: `Empty response from MessageCentral (Status: ${response.status})` };
        }

        const data = JSON.parse(responseText);
        
        if (data.responseCode === 200) {
            return { success: true, verificationId: data.data.verificationId };
        } else {
            return { success: false, message: data.message || 'Failed to send OTP' };
        }
    } catch (error) {
        console.error('Error in messageCentral OTP service (send):', error);
        throw error;
    }
};

export const verifyOTP = async (mobileNumber, otp, verificationId) => {
    const cleanMobile = mobileNumber.replace(/\D/g, '');
    const mobileWithoutCode = cleanMobile.length > 10 ? cleanMobile.slice(-10) : cleanMobile;
    const countryCode = cleanMobile.length > 10 ? cleanMobile.slice(0, cleanMobile.length - 10) : '91';

    const url = `https://cpaas.messagecentral.com/verification/v3/validateOtp?countryCode=${countryCode}&mobileNumber=${mobileWithoutCode}&code=${otp}&verificationId=${verificationId}&customerId=${process.env.MESSAGE_CENTRAL_CUSTOMER_ID}`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'authToken': process.env.MESSAGE_CENTRAL_AUTH_TOKEN,
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();
        console.log('MessageCentral VerifyOTP Response:', data);

        if (data.responseCode === 200) {
            return { success: true };
        } else {
            return { success: false, message: data.message || 'Invalid OTP' };
        }
    } catch (error) {
        console.error('Error in messageCentral OTP service (verify):', error);
        throw error;
    }
};
