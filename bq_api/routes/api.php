<?php

use Illuminate\Support\Facades\Route;

//Rotas de  autenticação
Route::post('/register', 'AuthController@register');
Route::post('/login', 'AuthController@login');
Route::post('/logout', 'AuthController@logout');
//Rotas de recuperação de senha
Route::post('/redefinepw', 'PasswordResetController@redefinePassword');
Route::post('/resetpw', 'PasswordResetController@reset');

Route::group(['prefix' => 'public'], function (){
    Route::get('/total-questions', 'FuncionalitiesPublics@totalQuestionsValid')->name('public.totalQuestions');
    Route::get('/total-professors', 'FuncionalitiesPublics@totalProfessors')->name('public.totalProfessors');
    Route::get('/total-students', 'FuncionalitiesPublics@totalStudents')->name('public.totalStudents');
    Route::get('/total-evaluations', 'FuncionalitiesPublics@totalEvaluations')->name('public.totalEvaluations');
});

Route::group(['prefix' => 'all'], function (){
    Route::get('/type-of-evaluations', 'AllUsers@typeOfevaluation')->name('all.typeOfevaluation');
    Route::get('/courses', 'AllUsers@courses')->name('all.courses');
    Route::get('/courses-with-questions-practice/{id}', 'AllUsers@coursesWithQuestionsByTypoOfEvaluation')->name('all.courses.practice');
    Route::get('/objects', 'AllUsers@knowledgeObjects')->name('all.knowledgeObjects');
    Route::get('/skills', 'AllUsers@skills')->name('all.skills');
    Route::get('/skills-with-questions-practice', 'AllUsers@skillsWithQuestionsByTypoOfEvaluation')->name('all.skills.practice');
    Route::put('/update-profile-user', 'AllUsers@updateProfileUser')->name('all.updateProfileUser');
    Route::get('/courses-user', 'AllUsers@coursesUser')->name('all.coursesUser');
    Route::get('/keywords', 'AllUsers@keywords')->name('all.keywords');
    Route::post('/set-show-tour-false', 'AllUsers@showTourFalse')->name('all.showTourFalse');
});

Route::group(['prefix' => 'user'], function (){
    Route::get('/', 'Adm\UserController@index')->name('user.index');
    Route::post('/isprofessor/{user}', 'Adm\UserController@isProfessor')->name('user.isProfessor');
    Route::put('/add-external-questions/{idUser}', 'Adm\UserController@addExternalQuestion')->name('user.addExternalQuestion');
});

Route::group(['prefix' => 'course-professor'], function (){
    //rotas ADM
    Route::get('/', 'Adm\CourseProfessorController@index')->name('courseProfessor.index');
    Route::get('/show/{course}', 'Adm\CourseProfessorController@show')->name('courseProfessor.show');
    Route::put('/{codigo}', 'Adm\CourseProfessorController@update')->name('courseProfessor.update');
    Route::get('/download-receipt', 'Adm\CourseProfessorController@downloadReceiptProfessor')->name('courseProfessor.downloadReceiptProfessor');
    //rotas para usuário comum
    Route::get('/user', 'UserCourseProfessorController@index')->name('userCourseProfessor.index');
    Route::post('/', 'UserCourseProfessorController@store')->name('userCourseProfessor.store');
});

Route::group(['prefix' => 'course'], function (){
    Route::get('/', 'Adm\CourseController@index')->name('course.index');
    Route::post('/', 'Adm\CourseController@store')->name('course.store');
    Route::get('/show/{course}', 'Adm\CourseController@show')->name('course.show');
    Route::put('/{course}', 'Adm\CourseController@update')->name('course.update');
    Route::delete('/{course}', 'Adm\CourseController@destroy')->name('course.destroy');
});

Route::group(['prefix' => 'skill'], function (){
    Route::get('/', 'Adm\SkillController@index')->name('skill.index');
    Route::post('/', 'Adm\SkillController@store')->name('skill.store');
    Route::get('/show/{skill}', 'Adm\SkillController@show')->name('skill.show');
    Route::put('/{skill}', 'Adm\SkillController@update')->name('skill.update');
    Route::delete('/{skill}', 'Adm\SkillController@destroy')->name('skill.destroy');
});

Route::group(['prefix' => 'object'], function (){
    Route::get('/', 'Adm\KnowledgeObjectsController@index')->name('object.index');
    Route::post('/', 'Adm\KnowledgeObjectsController@store')->name('object.store');
    Route::get('/show/{skill}', 'Adm\KnowledgeObjectsController@show')->name('object.show');
    Route::put('/{skill}', 'Adm\KnowledgeObjectsController@update')->name('object.update');
    Route::delete('/{skill}', 'Adm\KnowledgeObjectsController@destroy')->name('object.destroy');
});

Route::group(['prefix' => 'type-of-evaluation'], function (){
    Route::get('/', 'Adm\TypeOfEvaluationController@index')->name('typeOfEvaluation.index');
    Route::post('/', 'Adm\TypeOfEvaluationController@store')->name('typeOfEvaluation.store');
    Route::get('/show/{typeEvaluation}', 'Adm\TypeOfEvaluationController@show')->name('typeOfEvaluation.show');
    Route::put('/{typeEvaluation}', 'Adm\TypeOfEvaluationController@update')->name('typeOfEvaluation.update');
    Route::delete('/{typeEvaluation}', 'Adm\TypeOfEvaluationController@destroy')->name('typeOfEvaluation.destroy');
});

Route::group(['prefix' => 'class/student'], function (){
    Route::get('/', 'ClassStudentsStudent@index')->name('class.students.index');
    Route::get('/details/{id}', 'ClassStudentsStudent@details')->name('class.students.details');
    Route::get('/list-applications/{idclass}', 'ClassEvaluationApplicationsStudentsStudent@index')->name('class.students.evaluation.index');
    Route::get('/show/{id}', 'ClassStudentsStudent@show')->name('class.students.details');
    Route::post('/', 'ClassStudentsStudent@store')->name('class.store');
    Route::get('/overview/{idclass}', 'ClassEvaluationApplicationsStudentsStudent@overview')->name('classEvaluationApplicationStudents.overview');
    //Route::get('/list-persons/{class}', 'ClassStudentsStudent@listPersons')->name('class.list-persons');
    /*Route::get('/', 'ClassStudentsStudent@index')->name('class.index');
    Route::delete('/{id}', 'ClassStudentsStudent@destroy')->name('class.destroy');

    Route::get('/evaluations/{idClass}', 'ClassEvaluationsStudentsStudent@index')->name('class.evaluations.student.index');
    Route::get('/evaluations/answered/{idClass}', 'ClassEvaluationsStudentsStudent@evaluations')->name('class.evaluations.answered.evaluations');
    */

});

//Rotas do usuário professor
Route::group(['prefix' => 'class/professor'], function (){
    Route::get('/courses', 'Professor\ClassController@courses')->name('class.index');
    Route::get('/', 'Professor\ClassController@index')->name('class.index');
    Route::post('/', 'Professor\ClassController@store')->name('class.store');
    Route::get('/show/{class}', 'Professor\ClassController@show')->name('class.show');
    Route::get('/classes-professor', 'Professor\ClassController@classesProfessor')->name('class.classes-professor');
    Route::put('/{class}', 'Professor\ClassController@update')->name('class.update');
    Route::put('/change-status/{class}', 'Professor\ClassController@changeStatus')->name('class.changeStatus');
    //Route::delete('/{class}', 'Professor\ClassController@destroy')->name('class.destroy');
    //evaluations
   /* Route::get('/evaluation', 'Professor\ClassStudentsEvaluationController@index')->name('class.evaluation.index');
    Route::post('/evaluation', 'Professor\ClassStudentsEvaluationController@store')->name('class.evaluation.store');
    Route::put('/evaluation/{class}', 'Professor\ClassStudentsEvaluationController@update')->name('class.evaluation.update');
    Route::get('/evaluation/show/{evaluation}', 'Professor\EvaluationController@show')->name('class.evaluation.show');
    Route::get('/evaluation/show/questions/{evaluation}', 'Professor\EvaluationController@showQuestions')->name('class.evaluation.showQuestions');
   */
    //aplications
    Route::get('/list-applications/{idclass}', 'Professor\ClassStudentEvaluationApplicationsController@index')->name('classEvaluationApplication.index');
    /*Route::get('/applications/show/{idApplication}', 'Professor\EvaluationApplicationsController@show')->name('evaluationApplication.show');
    Route::put('/applications/{idApplication}', 'Professor\EvaluationApplicationsController@update')->name('evaluationApplication.update');
    Route::post('/add-application/', 'Professor\EvaluationApplicationsController@store')->name('evaluationApplication.store');
    Route::put('/change-status-application/{idApplication}', 'Professor\EvaluationApplicationsController@changeStatus')->name('evaluationApplication.changeStatus');
    */
    //visão geral
    Route::get('/overview/{idclass}', 'Professor\ClassStudentEvaluationApplicationsController@overview')->name('classEvaluationApplication.overview');
});

/*Route::group(['prefix' => 'class/professor'], function (){
    Route::get('/', 'Professor\ClassStudentsProfessor@index')->name('class.index');
    //Route::post('/', 'ClassStudentsStudent@store')->name('class.store');
});*/

Route::group(['prefix' => 'question'], function (){
    Route::get('/', 'Professor\QuestionController@index')->name('question.index');
    Route::post('/', 'Professor\QuestionController@store')->name('question.store');
    Route::put('/{question}', 'Professor\QuestionController@update')->name('question.update');
    Route::put('/update-course-skill/{question}', 'Professor\QuestionController@updateCourseSkill')->name('question.updateCourseSkill');
    Route::get('/show/{question}', 'Professor\QuestionController@show')->name('question.show');
    Route::delete('/{question}', 'Professor\QuestionController@destroy')->name('question.destroy');
    Route::put('/validate/{question}', 'Professor\QuestionController@validateQuestion')->name('question.validateQuestion');
    Route::post('/duplicate/{question}', 'Professor\QuestionController@duplicate')->name('question.duplicate');

    //objects
    Route::get('/object-question/{idQuestion}', 'Professor\QuestionHasKnowledgeObjectController@index')->name('question.objects.index');
    Route::post('/addobject/', 'Professor\QuestionHasKnowledgeObjectController@addKnowledgeObject')->name('question.addKnowledgeObject');
    Route::put('/update-object/{id}', 'Professor\QuestionHasKnowledgeObjectController@update')->name('question.objects.update');
    Route::delete('/deleteobject/{id}', 'Professor\QuestionHasKnowledgeObjectController@deleteKnowledgeObject')->name('question.deleteKnowledgeObject');
    //keyword
    Route::get('/keyword/{idQuestion}', 'Professor\KeywordsQuestionController@index')->name('keyword.index');
    Route::post('/keyword/', 'Professor\KeywordsQuestionController@store')->name('keyword.store');
    Route::delete('/keyword/{idQuestion}', 'Professor\KeywordsQuestionController@delete')->name('keyword.delete');

    Route::post('/upload-image', 'Professor\QuestionController@upload_image')->name('question.image');
});

Route::group(['prefix' => 'questionitem'], function (){
    Route::get('/', 'Professor\QuestionItemController@index')->name('questionitem.index');
    Route::post('/', 'Professor\QuestionItemController@store')->name('questionitem.store');
    Route::put('/{questionitem}', 'Professor\QuestionItemController@update')->name('questionitem.update');
    Route::delete('/{questionitem}', 'Professor\QuestionItemController@destroy')->name('questionitem.destroy');
});

Route::group(['prefix' => 'rank'], function (){
    Route::get('/by-user/', 'Professor\RankQuestionController@rankByUser')->name('rank.rankByUser');
    Route::get('/by-question/', 'Professor\RankQuestionController@rankByQuestion')->name('rank.rankByQuestion');
    Route::post('/', 'Professor\RankQuestionController@storeUpdate')->name('rank.storeUpdate');
});

Route::group(['prefix' => 'difficulty'], function (){
    Route::post('/', 'DifficultQuestionController@storeUpdate')->name('difficulty.storeUpdate');
});

Route::group(['prefix' => 'evaluation/practice'], function (){
    Route::get('/', 'Practice\EvaluationPracticeController@index')->name('evaluation.practice.index');
    Route::get('/show/{evaluation}', 'Practice\EvaluationPracticeController@show')->name('evaluation.practice.show');
    Route::get('/how-many-questions', 'Practice\EvaluationPracticeController@showHowManyQuestions')->name('evaluation.practice.showHowManyQuestions');
    Route::post('/', 'Practice\EvaluationPracticeController@store')->name('evaluation.practice.store');
    Route::put('/{evaluation}', 'Practice\EvaluationPracticeController@update')->name('evaluation.practice.update');
    Route::delete('/{evaluation}', 'Practice\EvaluationPracticeController@destroy')->name('evaluation.practice.destroy');
    Route::put('/change-status/{evaluation}', 'Practice\EvaluationPracticeController@changeStatus')->name('evaluation.practice.changeStatus');
    Route::get('/has-questions/{evaluation}', 'Practice\EvaluationPracticeController@hasQuestionsinEvaluation')->name('evaluation.practice.hasQuestionsinEvaluation');
    //EvaluationHasQuestionsPracticeController
    Route::put('/generate/{evaluation}', 'Practice\EvaluationHasQuestionsPracticeController@generateAutomaticQuestionsOfEvaluation')->name('evaluationHasQuestions.practice.generateAutomaticQuestionsOfEvaluation');
    //EvaluationApplicationsPracticeController
    Route::post('/add-application/{evaluation}', 'Practice\EvaluationApplicationsPracticeController@store')->name('evaluationApplication.practice.store');
    Route::get('/list-applications/{evaluation}', 'Practice\EvaluationApplicationsPracticeController@index')->name('evaluationApplication.practice.index');
    Route::get('/applications/status/{idApplication}', 'Practice\EvaluationApplicationsPracticeController@statusApplication')->name('evaluationApplication.practice.status');
    Route::get('/applications/show/{idApplication}', 'Practice\EvaluationApplicationsPracticeController@show')->name('evaluationApplication.pratice.show');
    Route::put('/applications/{idApplication}', 'Practice\EvaluationApplicationsPracticeController@update')->name('evaluationApplication.pratice.update');
});

Route::group(['prefix' => 'evaluation'], function (){
    Route::get('/', 'Professor\EvaluationController@index')->name('evaluation.index');
    Route::get('/show/{evaluation}', 'Professor\EvaluationController@show')->name('evaluation.show');
    Route::get('/show/questions/{evaluation}', 'Professor\EvaluationController@showQuestions')->name('evaluation.showQuestions');
    Route::get('/choose', 'Professor\EvaluationController@evaluationsToChoose')->name('evaluation.choose');
    Route::post('/', 'Professor\EvaluationController@store')->name('evaluation.store');
    Route::post('/duplicate/{evaluation}', 'Professor\EvaluationController@duplicate')->name('evaluation.duplicate');
    Route::put('/{evaluation}', 'Professor\EvaluationController@update')->name('evaluation.update');
    Route::put('/change-status/{evaluation}', 'Professor\EvaluationController@changeStatus')->name('evaluation.changeStatus');
    Route::delete('/{evaluation}', 'Professor\EvaluationController@destroy')->name('evaluation.destroy');
    //questões
    Route::post('/addquestion/', 'Professor\EvaluationHasQuestionsController@addQuestion')->name('evaluation.addQuestion');
    Route::delete('/deletequestion/{question}', 'Professor\EvaluationHasQuestionsController@deleteQuestion')->name('evaluation.deleteQuestion');
    Route::put('/cancel-or-not/{question}', 'Professor\EvaluationHasQuestionsController@cancelOrNot')->name('evaluation.cancelOrNot');
    //aplicacao da avaliação
    Route::get('/list-applications/', 'Professor\EvaluationApplicationsController@index')->name('evaluationApplication.index');
    Route::get('/applications/show/{idApplication}', 'Professor\EvaluationApplicationsController@show')->name('evaluationApplication.show');
    Route::put('/applications/{idApplication}', 'Professor\EvaluationApplicationsController@update')->name('evaluationApplication.update');
    Route::post('/add-application/', 'Professor\EvaluationApplicationsController@store')->name('evaluationApplication.store');
    Route::put('/change-status-application/{idApplication}', 'Professor\EvaluationApplicationsController@changeStatus')->name('evaluationApplication.changeStatus');
    //relatórios professor
    Route::get('/applications/result-answer-students/{idApplication}', 'Professor\EvaluationApplicationsController@resultAnswerStudents')->name('evaluationApplication.resultAnswerStudents');
    Route::get('/applications/result-percentage-question/{idApplication}', 'Professor\EvaluationApplicationsController@resultPercentageQuestions')->name('evaluationApplication.resultPercentageQuestions');
    Route::get('/applications/result-percentage-question-by-skill/{idApplication}', 'Professor\EvaluationApplicationsController@resultPercentageQuestionsBySkill')->name('evaluationApplication.resultPercentageQuestionsBySkill');
    Route::get('/applications/result-percentage-question-by-objects/{idApplication}', 'Professor\EvaluationApplicationsController@resultPercentageQuestionsByObjects')->name('evaluationApplication.resultPercentageQuestionsByObjects');
    //resolução da avaliação pelo student
    Route::get('/get-application/{id_application}', 'DoEvaluation@getApplication')->name('evaluationApplication.getApplication');
    Route::post('/start/{id_application}', 'DoEvaluation@startEvaluation')->name('evaluationApplication.startEvaluation');
    Route::put('/finish/{id_application}', 'DoEvaluation@finishEvaluation')->name('evaluationApplication.finishEvaluation');
    Route::put('/answer/{id_application}', 'DoEvaluation@answer')->name('evaluationApplication.answer');
    //resultados da avaliação student
    Route::get('/student/result/evaluations', 'ResultEvaluationStudent@evaluations')->name('evaluationApplication.evaluations');
    Route::get('/student/result/evaluations-specific/{idHead}', 'ResultEvaluationStudent@applicationSpecific')->name('evaluationApplication.applicationSpecific');
});
















