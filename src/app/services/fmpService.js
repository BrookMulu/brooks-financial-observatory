import axios from 'axios';

export const fetchIncomeStatement = async (symbol, period = 'annual') => {
  const apiKey = process.env.NEXT_PUBLIC_FMP_API_KEY; 
  const url = `https://financialmodelingprep.com/api/v3/income-statement/${symbol}?period=${period}&apikey=${apiKey}`;

  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching income statement:', error);
    throw error; 
  }
};
