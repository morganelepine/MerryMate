<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('budget_gifts', function (Blueprint $table) {
            $table->string('occasion')->default('christmas');
        });

        // Null: guessed from taken_at until the buyer corrects it.
        foreach (['ideas', 'multiple_ideas'] as $table) {
            Schema::table($table, function (Blueprint $table) {
                $table->string('budget_occasion')->nullable();
            });
        }
    }

    public function down(): void
    {
        Schema::table('budget_gifts', function (Blueprint $table) {
            $table->dropColumn('occasion');
        });

        foreach (['ideas', 'multiple_ideas'] as $table) {
            Schema::table($table, function (Blueprint $table) {
                $table->dropColumn('budget_occasion');
            });
        }
    }
};
