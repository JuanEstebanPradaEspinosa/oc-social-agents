#!/usr/bin/env node
/**
 * Twitter API v2 Client (OAuth 1.0a)
 * Simple wrapper for posting tweets using Access Token/Secret
 */

const crypto = require('crypto');
const https = require('https');
require('dotenv').config({ path: require('path').join(__dirname, '../..', '.env') });

class TwitterClient {
  constructor() {
    this.apiKey = process.env.TWITTER_API_KEY;
    this.apiSecret = process.env.TWITTER_API_SECRET;
    this.accessToken = process.env.TWITTER_ACCESS_TOKEN;
    this.accessTokenSecret = process.env.TWITTER_ACCESS_TOKEN_SECRET;

    if (!this.apiKey || !this.apiSecret || !this.accessToken || !this.accessTokenSecret) {
      throw new Error('Missing Twitter credentials in .env');
    }
  }

  // Generate OAuth 1.0a signature
  generateOAuthSignature(method, url, params) {
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const nonce = crypto.randomBytes(32).toString('base64').replace(/\W/g, '');

    const oauthParams = {
      oauth_consumer_key: this.apiKey,
      oauth_nonce: nonce,
      oauth_signature_method: 'HMAC-SHA1',
      oauth_timestamp: timestamp,
      oauth_token: this.accessToken,
      oauth_version: '1.0',
      ...params
    };

    // Create base string
    const sortedParams = Object.keys(oauthParams)
      .sort()
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(oauthParams[key])}`)
      .join('&');

    const baseString = `${method}&${encodeURIComponent(url)}&${encodeURIComponent(sortedParams)}`;

    // Create signing key
    const signingKey = `${encodeURIComponent(this.apiSecret)}&${encodeURIComponent(this.accessTokenSecret)}`;

    // Generate signature
    const signature = crypto.createHmac('sha1', signingKey).update(baseString).digest('base64');

    oauthParams.oauth_signature = signature;
    return oauthParams;
  }

  // Build OAuth header
  buildAuthHeader(method, url, params = {}) {
    const oauthParams = this.generateOAuthSignature(method, url, params);
    const headerValue = Object.keys(oauthParams)
      .filter(key => key.startsWith('oauth_'))
      .sort()
      .map(key => `${encodeURIComponent(key)}="${encodeURIComponent(oauthParams[key])}"`)
      .join(', ');
    return `OAuth ${headerValue}`;
  }

  // Verify credentials
  async verifyCredentials() {
    return new Promise((resolve, reject) => {
      const url = 'https://api.twitter.com/2/users/me';
      const authHeader = this.buildAuthHeader('GET', url);

      const options = {
        method: 'GET',
        headers: {
          'Authorization': authHeader,
          'User-Agent': 'OpenClaw-Twitter-Agent/1.0'
        }
      };

      const req = https.request(url, options, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            const json = JSON.parse(data);
            if (res.statusCode === 200) {
              resolve(json);
            } else {
              reject(new Error(`API Error ${res.statusCode}: ${JSON.stringify(json)}`));
            }
          } catch (e) {
            reject(e);
          }
        });
      });

      req.on('error', reject);
      req.end();
    });
  }

  // Post a tweet
  async postTweet(text) {
    return new Promise((resolve, reject) => {
      const url = 'https://api.twitter.com/2/tweets';
      const body = JSON.stringify({ text });
      const authHeader = this.buildAuthHeader('POST', url);

      const options = {
        method: 'POST',
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body),
          'User-Agent': 'OpenClaw-Twitter-Agent/1.0'
        }
      };

      const req = https.request(url, options, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            const json = JSON.parse(data);
            if (res.statusCode === 201) {
              resolve(json);
            } else {
              reject(new Error(`API Error ${res.statusCode}: ${JSON.stringify(json)}`));
            }
          } catch (e) {
            reject(e);
          }
        });
      });

      req.on('error', reject);
      req.write(body);
      req.end();
    });
  }
}

// CLI interface
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  try {
    const client = new TwitterClient();

    if (command === 'verify') {
      console.log('Verifying credentials...');
      const user = await client.verifyCredentials();
      console.log('✓ Connected as:', user.data.username);
      console.log('  User ID:', user.data.id);
      console.log('  Name:', user.data.name);
    } else if (command === 'post') {
      const text = args.slice(1).join(' ');
      if (!text) {
        console.error('Usage: twitter-api.js post <text>');
        process.exit(1);
      }
      console.log('Posting tweet...');
      const result = await client.postTweet(text);
      console.log('✓ Tweet posted!');
      console.log('  ID:', result.data.id);
      console.log('  Text:', result.data.text);
    } else {
      console.log('Usage:');
      console.log('  node twitter-api.js verify');
      console.log('  node twitter-api.js post <text>');
    }
  } catch (error) {
    console.error('✗ Error:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = TwitterClient;
