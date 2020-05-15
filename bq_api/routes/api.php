<?php

use Illuminate\Http\Request;
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
    Route::get('/courses', 'AllUsers@courses')->name('all.courses');
    Route::get('/objects', 'AllUsers@knowledgeObjects')->name('all.knowledgeObjects');
    Route::get('/skills', 'AllUsers@skills')->name('all.skills');
    Route::put('/update-profile-user', 'AllUsers@updateProfileUser')->name('all.updateProfileUser');
    Route::get('/courses-user', 'AllUsers@coursesUser')->name('all.coursesUser');
});

Route::group(['prefix' => 'user'], function (){
    Route::get('/', 'Adm\UserController@index')->name('user.index');
    Route::post('/isprofessor/{user}', 'Adm\UserController@isProfessor')->name('user.isProfessor');
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

/*NÃO SERÁ MAIS NECESSÁRIO O PERFIL
 * Route::group(['prefix' => 'profile'], function (){
    Route::get('/', 'Adm\ProfileController@index')->name('profile.index');
    Route::post('/', 'Adm\ProfileController@store')->name('profile.store');
    Route::get('/show/{profile}', 'Adm\ProfileController@show')->name('profile.show');
    Route::put('/{profile}', 'Adm\ProfileController@update')->name('profile.update');
    Route::delete('/{profile}', 'Adm\ProfileController@destroy')->name('profile.destroy');
});*/

Route::group(['prefix' => 'skill'], function (){
    Route::get('/', 'Adm\SkillController@index')->name('skill.index');
    Route::post('/', 'Adm\SkillController@store')->name('skill.store');
    Route::get('/show/{profile}', 'Adm\SkillController@show')->name('skill.show');
    Route::put('/{profile}', 'Adm\SkillController@update')->name('skill.update');
    Route::delete('/{profile}', 'Adm\SkillController@destroy')->name('skill.destroy');
});

Route::group(['prefix' => 'object'], function (){
    Route::get('/', 'Adm\KnowledgeObjectsController@index')->name('skill.index');
    Route::post('/', 'Adm\KnowledgeObjectsController@store')->name('skill.store');
    Route::get('/show/{profile}', 'Adm\KnowledgeObjectsController@show')->name('skill.show');
    Route::put('/{profile}', 'Adm\KnowledgeObjectsController@update')->name('skill.update');
    Route::delete('/{profile}', 'Adm\KnowledgeObjectsController@destroy')->name('skill.destroy');
});

//Rotas do usuário professor
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
    Route::get('/object-question/{idQuestion}', 'Professor\QuestionHasKnowledgeObjectController@index')->name('question.index');
    Route::post('/addobject/', 'Professor\QuestionHasKnowledgeObjectController@addKnowledgeObject')->name('question.addKnowledgeObject');
    Route::put('/update-object/{id}', 'Professor\QuestionHasKnowledgeObjectController@update')->name('question.update');
    Route::delete('/deleteobject/{id}', 'Professor\QuestionHasKnowledgeObjectController@deleteKnowledgeObject')->name('question.deleteKnowledgeObject');
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

Route::group(['prefix' => 'evaluation'], function (){
    Route::get('/', 'Professor\EvaluationController@index')->name('evaluation.index');
    Route::get('/show/{evaluation}', 'Professor\EvaluationController@show')->name('evaluation.show');
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
    //relatórios
    Route::get('/applications/result-answer-students/{idApplication}', 'Professor\EvaluationApplicationsController@resultAnswerStudents')->name('evaluationApplication.resultAnswerStudents');
    Route::get('/applications/result-percentage-question/{idApplication}', 'Professor\EvaluationApplicationsController@resultPercentageQuestions')->name('evaluationApplication.resultPercentageQuestions');
    //resolução da avaliação pelo student
    Route::get('/get-application/{id_application}', 'DoEvaluation@getApplication')->name('evaluationApplication.getApplication');
    Route::post('/start/{id_application}', 'DoEvaluation@startEvaluation')->name('evaluationApplication.startEvaluation');
    Route::put('/finish/{id_application}', 'DoEvaluation@finishEvaluation')->name('evaluationApplication.finishEvaluation');
    Route::put('/answer/{id_application}', 'DoEvaluation@answer')->name('evaluationApplication.answer');
    //resultados da avaliação student
    Route::get('/student/result/evaluations', 'ResultEvaluationStudent@evaluations')->name('evaluationApplication.evaluations');
    Route::get('/student/result/evaluations-specific/{idHead}', 'ResultEvaluationStudent@applicationSpecific')->name('evaluationApplication.applicationSpecific');
});
















