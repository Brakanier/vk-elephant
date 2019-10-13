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

        $player = Player::firstOrCreate(['vk_id' => $request->vk_user_id]);

        if ($player->group_id != $request->vk_group_id) {
            $player->group_id = $request->vk_group_id;
            $player->save();
        }

        return view('welcome', ['player' => $player->toJson()]);
    }

    public function top(Request $request) {
        $players = Player::orderBy('count', 'DESC')->limit(50)->get();
        $friends = Player::whereIn('vk_id', $request)->orderBy('count', 'DESC')->limit(10)->get();
        $groups = DB::table('players')->select(DB::raw('group_id, SUM(count) as result'))->where('group_id', '!=', null)->groupBy('group_id')->orderBy('result', 'DESC')->limit(50)->get();
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