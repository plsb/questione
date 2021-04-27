import { useState, useEffect, useCallback } from 'react';

import api from '../services/api';

function useTypeOfEvaluation() {
	const [typeList, setTypeList] = useState([]);

	const loadAllTypeOfEvaluations = useCallback(async () => {
		try {
			const response = await api.get('/all/type-of-evaluations');

			if (response) {
				setTypeList(response.data);
			}
		} catch (error) {
			setTypeList(null);
		}
	}, []);

	useEffect(() => {
		loadAllTypeOfEvaluations();
	}, []);

  return typeList;
}

export default useTypeOfEvaluation;
