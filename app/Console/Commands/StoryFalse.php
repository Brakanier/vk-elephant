<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Player;

class StoryFalse extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'story:false';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Set all story column to false';

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
        Player::where('story', true)->update(['story' => false]);
    }
}
