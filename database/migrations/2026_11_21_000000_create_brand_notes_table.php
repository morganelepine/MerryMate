<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('brand_notes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('brand');
            $table->text('content');
            $table->timestamps();
            $table->unique(['user_id', 'brand']);
        });

        // Referral info used to live on each idea: keep the first one found per (list owner, brand).
        $rows = DB::table('ideas')
            ->join('gift_lists', 'gift_lists.id', '=', 'ideas.list_id')
            ->whereNotNull('ideas.brand')
            ->whereNotNull('ideas.membership')
            ->where('ideas.membership', '!=', '')
            ->orderBy('ideas.id')
            ->get(['gift_lists.user_id', 'ideas.brand', 'ideas.membership', 'ideas.membership_reduction']);

        $notes = [];
        $now = now();
        foreach ($rows as $row) {
            $key = $row->user_id . '|' . $row->brand;
            if (isset($notes[$key])) {
                continue;
            }
            $notes[$key] = [
                'user_id' => $row->user_id,
                'brand' => $row->brand,
                'content' => $row->membership_reduction
                    ? "{$row->membership} — {$row->membership_reduction}"
                    : $row->membership,
                'created_at' => $now,
                'updated_at' => $now,
            ];
        }

        foreach (array_chunk(array_values($notes), 500) as $chunk) {
            DB::table('brand_notes')->insert($chunk);
        }

        Schema::table('ideas', function (Blueprint $table) {
            $table->dropColumn(['membership', 'membership_reduction']);
        });
    }

    public function down(): void
    {
        Schema::table('ideas', function (Blueprint $table) {
            $table->string('membership')->nullable();
            $table->string('membership_reduction')->nullable();
        });

        Schema::dropIfExists('brand_notes');
    }
};
