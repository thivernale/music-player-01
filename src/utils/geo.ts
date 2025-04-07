import axios from 'axios';

// const GEO_API_URL = 'http://ip-api.com/json/?fields=countryCode';
const GEO_API_URL = `https://geo.ipify.org/api/v2/country?apiKey=${import.meta.env.VITE_GEO_API_KEY}`;

// type ResponseType = { countryCode?: string };
type ResponseType = { location: { country: string } };

export async function getCountryCode() {
  try {
    const { data } = await axios.get<ResponseType>(`${GEO_API_URL}`);
    return data.location.country as string;
  } catch (err: unknown) {
    console.log(err);
    return '';
  }
}
