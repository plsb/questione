import { useState, useEffect, useCallback } from 'react';

import api from '../services/api';

function useAmountQuestions() {
	const [amountQuestions, setAmountQuestions] = useState([]);
	
	const loadHowManyQuestions = useCallback(async () => {
		try {
			const response = await api.get('/evaluation/practice/how-many-questions');

			if (response) {
				setAmountQuestions(response.data);
			}
		} catch (error) {
			setAmountQuestions(null);
		}
	}, []);

	useEffect(() => {
		loadHowManyQuestions();
	}, []);

  return amountQuestions;
}

export default useAmountQuestions;