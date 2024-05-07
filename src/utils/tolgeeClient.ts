import axios from 'axios';

const tolgeeClient = axios.create({
  baseURL: 'https://app.tolgee.io/v2/projects/',
  headers: {
      'Accept': 'application/json',
      'X-API-Key': process.env.MEDUSA_ADMIN_TOLGEE_API_KEY,
  },
  maxBodyLength: Infinity,
});

export default tolgeeClient;
