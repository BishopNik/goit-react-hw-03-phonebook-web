/** @format */

import axios from 'axios';

const URL = 'https://64ecc0eef9b2b70f2bfae760.mockapi.io/phoneBook';

async function fetchGet() {
	const response = await axios.get(URL);
	return response.data;
}

const API = {
	fetchGet,
};

export { API };
