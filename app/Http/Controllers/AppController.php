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
        $players = Player::orderBy('count', 'DESC')->take(30)->get();
        $friends = Player::whereIn('vk_id', $request)->orderBy('count', 'DESC')->take(30)->get();
        $groups = DB::table('players')->select(DB::raw('group_id, SUM(count) as result'))->where('group_id', '!=', null)->groupBy('group_id')->orderBy('result', 'DESC')->take(30)->get();
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
}