<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('ideas', function (Blueprint $table) {
            $table->decimal('paid_price', 8, 2)->nullable()->after('promo_end_date');
        });
    }

    public function down(): void
    {
        Schema::table('ideas', function (Blueprint $table) {
            $table->dropColumn('paid_price');
        });
    }
};
