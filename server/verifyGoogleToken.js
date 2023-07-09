import dotenv from 'dotenv'
import { OAuth2Client } from 'google-auth-library';
dotenv.config()

// Verify tokens on server-end
const client = new OAuth2Client(process.env.VITE_GOOGLE_CLIENT_ID);

export default async function verifyToken(token) {
  const ticket = await client.verifyIdToken({
    idToken: String(token),
    audience: process.env.VITE_GOOGLE_CLIENT_ID,
  });
  const payload = ticket.getPayload();
  return payload.email
}