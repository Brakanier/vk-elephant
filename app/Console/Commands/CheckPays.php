<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Pay;
use App\Player;
use Log;

class CheckPays extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'check:pays';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Check pays';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {   
        $key = 'c248dbc5ca0515566a72';
        $url = "https://api.vkdonate.ru?key={$key}&action=donates&count=15";
        $json = file_get_contents($url);
        
        $result = json_decode($json, true);

        if ($result['success'] && $result['count'] > 0) {
            foreach ($result['donates'] as $key => $donate) {
                if (Pay::where('pay_id', $donate['id'])->exists()) {
                    continue;
                } else {
                    Pay::create([
                        'pay_id' => $donate['id'],
                        'vk_id' => $donate['uid'],
                        'sum' => $donate['sum'],
                        'date' => $donate['date'],
                        'anon' => $donate['anon']
                    ]);
                    if (Player::where('vk_id', $donate['uid'])->exists()) {
                        $player = Player::where('vk_id', $donate['uid'])->first();
                        $add_count = intdiv($donate['sum'], 10);
                        $player->count += $add_count;
                        $player->save();
                    }
                }
            }
        }
        Log::info('RUN CHECK PAYS');
    }
}
