<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Player;
use Log;
use DB;
use Route;
use CURLFile;

class AppController extends Controller
{
    public function index(Request $request) {
        Log::info($request);

        if (!Player::where('vk_id', $request->vk_user_id)->exists()) {
            $player = new Player;
            $player->vk_id = $request->vk_user_id;
            $player->count = random_int(1, 5);
            $player->save();
        }
        $player = Player::where(['vk_id' => $request->vk_user_id])->first();
    
        if ($player->group_id != $request->vk_group_id && !empty($request->vk_group_id)) {
            $player->group_id = $request->vk_group_id;
            $player->save();
        }

        return view('welcome', ['player' => $player->toJson()]);
    }

    public function top(Request $request) {
        $players = Player::orderBy('count', 'DESC')->take(50)->get();
        $friends = Player::whereIn('vk_id', $request)->orderBy('count', 'DESC')->take(50)->get();
        $groups = DB::table('players')->select(DB::raw('group_id, SUM(count) as result'))->where('group_id', '!=', null)->groupBy('group_id')->orderBy('result', 'DESC')->take(50)->get();
        Log::info($groups);
        return response()->json([
            'all' => $players,
            'friends' => $friends,
            'groups' => $groups
            ]);
    }
    public function story(Request $request) {
        Log::info($request);
        $img = file_get_contents('images/elephant.png');
        $img_str = base64_encode($img);

        $img_curl = new CURLFile(realpath('images/story.jpg'));
        $post_fields = [
            'file' => $img_curl
        ];

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            "Content-Type:multipart/form-data"
        ]);
        curl_setopt($ch, CURLOPT_POST, 0);
        curl_setopt($ch, CURLOPT_URL, $request->url);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $post_fields);
        $output = curl_exec($ch);
        $err = curl_error($ch);
        curl_close( $ch );
        $res = json_decode($output);

        $add = false;

        if (isset($res->response->story)) {
            $player = Player::where([
                'vk_id' => $res->response->story->owner_id,
                'story' => false
                ])->first();
            if ($player) {
                $player->count++;
                $player->story = true;
                $player->save();
                $add = true;
            }
        }
        return response()->json([
            'add' => $add,
        ]);
    }

    private function createImageForStory($count) {
        $image_path = "story.jpg"; //Путь к изображению

        $file_new = "story_user.jpg"; //Путь к изображению
            
        $img = imagecreatefromjpeg($image_path); // создаём новое изображение из файла
            
        $font = "src/font/arial.ttf"; // путь к шрифту
        $font_size = 70; // размер шрифта общий
        $color = imageColorAllocate($img, 255, 255, 255); //Цвет шрифта
            
        $center = 540;
        $text = 'test';
            
        $box = imagettfbbox($font_size, 0, $font, $text);
        $left = $center-round(($box[2]-$box[0])/2);
        imagettftext($img, $font_size, 0, $left, 400, $color, $font, $text);
            
        imagepng($img, $file_new);
    }
}