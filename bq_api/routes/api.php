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

Route::group(['prefix' => 'all'], function (){
    Route::get('/courses', 'ListAll@courses')->name('all.courses');
});

Route::group(['prefix' => 'user'], function (){
    Route::get('/', 'Adm\UserController@index')->name('user.index');
    Route::post('/isprofessor/{user}', 'Adm\UserController@isProfessor')->name('user.isProfessor');
});

Route::group(['prefix' => 'course'], function (){
    Route::get('/', 'Adm\CourseController@index')->name('course.index');
    Route::get('/coursesall', 'Adm\CourseController@coursesall')->name('course.coursesall');
    Route::post('/', 'Adm\CourseController@store')->name('course.store');
    Route::get('/show/{course}', 'Adm\CourseController@show')->name('course.show');
    Route::put('/{course}', 'Adm\CourseController@update')->name('course.update');
    Route::delete('/{course}', 'Adm\CourseController@destroy')->name('course.destroy');
});

Route::group(['prefix' => 'profile'], function (){
    Route::get('/', 'Adm\ProfileController@index')->name('profile.index');
    Route::post('/', 'Adm\ProfileController@store')->name('profile.store');
    Route::get('/show/{profile}', 'Adm\ProfileController@show')->name('profile.show');
    Route::put('/{profile}', 'Adm\ProfileController@update')->name('profile.update');
    Route::delete('/{profile}', 'Adm\ProfileController@destroy')->name('profile.destroy');
});

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
    Route::get('/show/{question}', 'Professor\QuestionController@show')->name('question.show');
    Route::delete('/{question}', 'Professor\QuestionController@destroy')->name('question.destroy');
    Route::put('/validate/{question}', 'Professor\QuestionController@validateQuestion')->name('question.validateQuestion');
    Route::post('/addobject/', 'Professor\QuestionHasKnowledgeObjectController@addKnowledgeObject')->name('question.addKnowledgeObject');
    Route::put('/deleteobject/', 'Professor\QuestionHasKnowledgeObjectController@deleteKnowledgeObject')->name('question.deleteKnowledgeObject');
});

Route::group(['prefix' => 'questionitem'], function (){
    Route::get('/', 'Professor\QuestionItemController@index')->name('questionitem.index');
    Route::post('/', 'Professor\QuestionItemController@store')->name('questionitem.store');
    Route::put('/{questionitem}', 'Professor\QuestionItemController@update')->name('questionitem.update');
    Route::delete('/{questionitem}', 'Professor\QuestionItemController@destroy')->name('questionitem.destroy');
});

Route::group(['prefix' => 'evaluation'], function (){
    Route::get('/', 'Professor\EvaluationController@index')->name('evaluation.index');
    Route::post('/', 'Professor\EvaluationController@store')->name('evaluation.store');
    Route::put('/{questionitem}', 'Professor\EvaluationController@update')->name('evaluation.update');
    Route::post('/addquestion/', 'Professor\EvaluationHasQuestionsController@addQuestion')->name('evaluation.addQuestion');
    Route::delete('/deletequestion/', 'Professor\EvaluationHasQuestionsController@deleteQuestion')->name('evaluation.deleteQuestion');
});

















