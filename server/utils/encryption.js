const CryptoJS = require('crypto-js');
require('dotenv').config();

const crypto = require('crypto');

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || '';

const getKey = () => {
  if (!ENCRYPTION_KEY) {
    throw new Error('ENCRYPTION_KEY is not set');
  }

  let keyBuffer;
  try {
    if (/^[a-f0-9]{64}$/i.test(ENCRYPTION_KEY)) {
      keyBuffer = Buffer.from(ENCRYPTION_KEY, 'hex');
    } else if (/^[A-Za-z0-9+/=]+$/.test(ENCRYPTION_KEY)) {
      keyBuffer = Buffer.from(ENCRYPTION_KEY, 'base64');
    } else {
      keyBuffer = Buffer.from(ENCRYPTION_KEY, 'utf8');
    }
  } catch (e) {
    throw new Error('Invalid ENCRYPTION_KEY encoding');
  }

  if (keyBuffer.length !== 32) {
    throw new Error('ENCRYPTION_KEY must be 32 bytes for AES-256-GCM');
  }
  return keyBuffer;
};

const encrypt = (text) => {
  if (text === undefined || text === null) return null;
  const key = getKey();
  const iv = crypto.randomBytes(12);

  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const plaintext = Buffer.isBuffer(text) ? text : Buffer.from(String(text), 'utf8');
  const ciphertext = Buffer.concat([cipher.update(plaintext), cipher.final()]);
  const authTag = cipher.getAuthTag();

  return Buffer.concat([iv, authTag, ciphertext]).toString('base64');
};

const decrypt = (encryptedText) => {
  if (!encryptedText) return null;
  const key = getKey();
  const data = Buffer.from(encryptedText, 'base64');

  const iv = data.slice(0, 12);
  const authTag = data.slice(12, 28);
  const ciphertext = data.slice(28);

  const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(authTag);
  const decrypted = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
  return decrypted.toString('utf8');
};

const encryptObject = (obj, fields) => {
  if (!obj || !fields) return obj;
  const out = { ...obj };
  for (const field of fields) {
    if (out[field] !== undefined && out[field] !== null) {
      out[field] = encrypt(out[field]);
    }
  }
  return out;
};

const decryptObject = (obj, fields) => {
  if (!obj || !fields) return obj;
  const out = { ...obj };
  for (const field of fields) {
    if (out[field] !== undefined && out[field] !== null) {
      out[field] = decrypt(out[field]);
    }
  }
  return out;
};

const hashPassword = async (password) => {
  const bcrypt = require('bcryptjs');
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
};

const comparePassword = async (password, hash) => {
  const bcrypt = require('bcryptjs');
  return bcrypt.compare(password, hash);
};

const generateToken = (length = 32) => {
  return crypto.randomBytes(length).toString('hex');
};

module.exports = {
  encrypt,
  decrypt,
  encryptObject,
  decryptObject,
  hashPassword,
  comparePassword,
  generateToken,
};
