<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('budget_recipients', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('name');
            $table->timestamps();
            $table->unique(['user_id', 'name']);
        });

        Schema::create('budget_gifts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('budget_recipient_id')->constrained('budget_recipients')->cascadeOnDelete();
            $table->unsignedSmallInteger('year');
            $table->string('title');
            $table->decimal('price', 8, 2)->nullable();
            $table->string('status')->default('idea');
            $table->timestamps();
            $table->index(['budget_recipient_id', 'year']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('budget_gifts');
        Schema::dropIfExists('budget_recipients');
    }
};
