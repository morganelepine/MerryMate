<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('ideas', function (Blueprint $table) {
            $table->decimal('promo_price', 8, 2)->nullable()->after('promo');
            $table->date('promo_end_date')->nullable()->after('promo_price');
        });

        // Separate call: on SQLite, dropping in the same blueprint rebuilds the table without the added columns.
        Schema::table('ideas', function (Blueprint $table) {
            $table->dropColumn('promo_details');
        });
    }

    public function down(): void
    {
        Schema::table('ideas', function (Blueprint $table) {
            $table->string('promo_details')->nullable()->after('promo');
        });

        Schema::table('ideas', function (Blueprint $table) {
            $table->dropColumn(['promo_price', 'promo_end_date']);
        });
    }
};
