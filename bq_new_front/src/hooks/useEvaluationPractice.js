import { useState, useEffect, useCallback } from 'react';

import api from '../services/api';

function useEvaluationPractice() {
	const [evaluationList, setEvaluationList] = useState([]);
	
	const loadAllEvaluationPractice = useCallback(async () => {
		try {
			const response = await api.get('/evaluation/practice');

			if (response) {
				setEvaluationList(response.data);
			}
		} catch (error) {
			setEvaluationList(null);
		}
	}, []);

	useEffect(() => {
		loadAllEvaluationPractice();
	}, []);

  return evaluationList;
}

export default useEvaluationPractice;