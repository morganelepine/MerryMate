<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Lets a signed-out guest be recognised as the one who reserved/purchased an idea,
        // the same way status_user_id does for an authenticated user, so that only they can cancel it.
        Schema::table('ideas', function (Blueprint $table) {
            $table->string('status_guest_token')->nullable()->after('status_user_id');
        });

        Schema::table('multiple_ideas', function (Blueprint $table) {
            $table->string('status_guest_token')->nullable()->after('status_user_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('ideas', function (Blueprint $table) {
            $table->dropColumn('status_guest_token');
        });

        Schema::table('multiple_ideas', function (Blueprint $table) {
            $table->dropColumn('status_guest_token');
        });
    }
};
