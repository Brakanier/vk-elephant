<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/
use App\Http\Controllers;

// Route::get('/', function () {
//     return view('welcome');
// });
Route::get('/', 'AppController@index');
Route::post('/top', 'AppController@top');
Route::post('/story', 'AppController@story');
