<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    // The budget is filtered by year: updated_at can't date a purchase, it moves on every edit or archiving.
    public function up(): void
    {
        foreach (['ideas', 'multiple_ideas'] as $table) {
            Schema::table($table, function (Blueprint $table) {
                $table->timestamp('taken_at')->nullable();
            });

            // Best guess for past reservations and purchases.
            DB::table($table)
                ->whereIn('status', ['reserved', 'purchased', 'archived'])
                ->whereNotNull('status_user_id')
                ->update(['taken_at' => DB::raw('updated_at')]);
        }
    }

    public function down(): void
    {
        foreach (['ideas', 'multiple_ideas'] as $table) {
            Schema::table($table, function (Blueprint $table) {
                $table->dropColumn('taken_at');
            });
        }
    }
};
