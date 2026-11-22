<?php

namespace App\Models\Concerns;

/**
 * Dates reservations and purchases for the budget's year filter, whatever code changes the status.
 * updated_at can't be used: it moves on every edit and when the list is archived.
 */
trait TracksTakenAt
{
    protected static function bootTracksTakenAt(): void
    {
        static::saving(function ($model) {
            if (! $model->isDirty('status') || ! in_array($model->status, ['available', 'reserved', 'purchased'], true)) {
                return;
            }

            // An explicitly set date (imports, tests) wins.
            if (! $model->isDirty('taken_at')) {
                $model->taken_at = $model->status === 'available' ? null : now();
            }
            // The next buyer starts again from the occasion guessed from the date.
            if ($model->status === 'available') {
                $model->budget_occasion = null;
            }
        });
    }
}
