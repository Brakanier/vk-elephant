<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Player;
use Log;

class AppController extends Controller
{
    public function index(Request $request) {
        Log::info($request);
        // $player = Player::firstOrCreate(['vk_id' => $request->vk_user_id]);
        $player = Player::first();

        // if ($player->group_id != $request->vk_group_id) {
        //     $player->group_id = $request->vk_group_id;
        //     $player->save();
        // }

        return view('welcome', ['player' => $player->toJson()]);
    }

    public function top() {
        $players = Player::orderBy('count', 'DESC')->get();
        return response()->json($players);
    }
}