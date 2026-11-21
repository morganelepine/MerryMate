<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Existing duplicates would make the unique index fail: keep the oldest follow of each pair.
        $keptIds = DB::table('followed_lists')
            ->selectRaw('MIN(id) as id')
            ->groupBy('user_id', 'gift_list_id')
            ->pluck('id');

        DB::table('followed_lists')->whereNotIn('id', $keptIds)->delete();

        Schema::table('followed_lists', function (Blueprint $table) {
            $table->unique(['user_id', 'gift_list_id']);
        });
    }

    public function down(): void
    {
        Schema::table('followed_lists', function (Blueprint $table) {
            $table->dropUnique(['user_id', 'gift_list_id']);
        });
    }
};
