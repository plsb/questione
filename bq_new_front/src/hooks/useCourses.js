import { useState, useEffect, useCallback } from 'react';

import api from '../services/api';

function useCourses() {
	const [courseList, setCourseList] = useState([]);
	
	const loadAllCourses = useCallback(async () => {
		try {
			const response = await api.get('/all/courses');

			if (response) {
				setCourseList(response.data);
			}
		} catch (error) {
			setCourseList(null);
		}
	}, []);

	useEffect(() => {
		loadAllCourses();
	}, []);

  return courseList;
}

export default useCourses;