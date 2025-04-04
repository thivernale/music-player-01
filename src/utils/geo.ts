import axios from 'axios';

const GEO_API_URL = 'http://ip-api.com/json/?fields=countryCode';

export async function getCountryCode() {
  try {
    const res = await axios.get<{ countryCode?: string }>(`${GEO_API_URL}`);
    return res.data.countryCode as string;
  } catch (err: unknown) {
    console.log(err);
    return '';
  }
}
