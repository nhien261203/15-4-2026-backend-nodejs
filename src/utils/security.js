const crypto = require("crypto");

const SECRET = process.env.JWT_SECRET || "pet-shop-secret";
const EXPIRES_IN_MS = 7 * 24 * 60 * 60 * 1000;

function base64url(input) {
  return Buffer.from(input)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function signPayload(payload) {
  const header = { alg: "HS256", typ: "JWT" };
  const body = {
    ...payload,
    exp: Date.now() + EXPIRES_IN_MS,
  };

  const encodedHeader = base64url(JSON.stringify(header));
  const encodedBody = base64url(JSON.stringify(body));
  const data = `${encodedHeader}.${encodedBody}`;

  const signature = crypto
    .createHmac("sha256", SECRET)
    .update(data)
    .digest("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

  return `${data}.${signature}`;
}

function verifyToken(token) {
  const [encodedHeader, encodedBody, signature] = token.split(".");
  if (!encodedHeader || !encodedBody || !signature) {
    throw new Error("Invalid token format");
  }

  const data = `${encodedHeader}.${encodedBody}`;
  const expectedSignature = crypto
    .createHmac("sha256", SECRET)
    .update(data)
    .digest("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

  if (expectedSignature !== signature) {
    throw new Error("Invalid signature");
  }

  const payload = JSON.parse(Buffer.from(encodedBody, "base64").toString("utf8"));

  if (payload.exp < Date.now()) {
    throw new Error("Token expired");
  }

  return payload;
}

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, "sha512").toString("hex");
  return `${salt}:${hash}`;
}

function comparePassword(password, storedHash) {
  const [salt, originalHash] = storedHash.split(":");
  if (!salt || !originalHash) return false;

  const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, "sha512").toString("hex");
  return crypto.timingSafeEqual(Buffer.from(originalHash), Buffer.from(hash));
}

module.exports = {
  signPayload,
  verifyToken,
  hashPassword,
  comparePassword,
};