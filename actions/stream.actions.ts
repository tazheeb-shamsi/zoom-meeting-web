"use server";

import { currentUser } from "@clerk/nextjs/server";
import { StreamClient } from "@stream-io/node-sdk";

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
const apiSecret = process.env.STREAM_SECRET_KEY;

export const tokenProvider = async () => {
  const user = await currentUser();

  if (!user) throw new Error("Login first requires");
  if (!apiKey) throw new Error("No API key");
  if (!apiSecret) throw new Error("No API Secret key");

  const client = new StreamClient(apiKey, apiSecret);

  const tokenExpiry = Math.round(new Date().getTime() / 1000) + 60 * 60; // 60 minutes
  const tokenIssued = Math.floor(Date.now() / 1000) - 60;

  const token = client.createToken(user.id, tokenExpiry, tokenIssued);

  return token;
};
