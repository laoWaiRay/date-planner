import dotenv from 'dotenv'
import { OAuth2Client } from 'google-auth-library';
dotenv.config()

// Verify tokens on server-end
const client = new OAuth2Client(process.env.VITE_GOOGLE_CLIENT_ID);

export default async function verifyToken(token) {
  const ticket = await client.verifyIdToken({
    idToken: String(token),
    audience: process.env.VITE_GOOGLE_CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
    // Or, if multiple clients access the backend:
    //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });
  const payload = ticket.getPayload();
  // If request specified a G Suite domain:
  // const domain = payload['hd'];
  return payload.email
}