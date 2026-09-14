<?php

namespace App\Repositories;

use App\Models\Idea;
use App\Models\MultipleIdea;
use App\Support\GuestIdentity;
use Illuminate\Support\Facades\Auth;

class IdeaRepository
{
    public function getUnavailableIdeasByStatus(int $listId, string $status)
    {
        $singleIdeas = Idea::where('list_id', $listId)
            ->where('status', $status)
            ->orderByDesc('updated_at')
            ->get()
            ->map(function ($idea) {
                $idea->is_mine = GuestIdentity::owns($idea);
                return $idea;
            });

        $multipleIdeas = MultipleIdea::with('idea')
            ->whereHas('idea', function ($query) use ($listId) {
                $query->where('list_id', $listId);
            })
            ->where('status', $status)
            ->orderByDesc('updated_at')
            ->get()
            ->map(function ($multipleIdea) {
                // Format "fake" idea
                return [
                    'id' => $multipleIdea->id,
                    'idea' => $multipleIdea->idea->idea,
                    'brand' => $multipleIdea->idea->brand,
                    'details' => $multipleIdea->idea->details,
                    'link' => $multipleIdea->idea->link,
                    'favorite' => $multipleIdea->idea->favorite,
                    'status_user' => $multipleIdea->status_user,
                    'status_user_id' => $multipleIdea->status_user_id,
                    'updated_at' => $multipleIdea->updated_at,
                    'status' => $multipleIdea->status,
                    'is_multiple' => 1,
                    'choice' => $multipleIdea->choice,
                    'is_mine' => GuestIdentity::owns($multipleIdea),
                ];
            });

        return $singleIdeas->concat($multipleIdeas);
    }

    public function getIdeasByStatus(int $listId, array $status)
    {
        return Idea::where('list_id', $listId)
            ->whereIn('status', $status)
            ->orderBy('brand')
            ->orderByDesc('favorite')
            ->orderBy('price')
            ->orderBy('idea')
            ->get();
    }

    public function updateIdea(Idea $idea, string $status, string $statusUser): void
    {
        $idea->status = $status;
        $idea->status_user = $statusUser;
        $idea->status_user_id = $status === 'available' ? null : Auth::id();
        $idea->status_guest_token = $status === 'available' ? null : GuestIdentity::current();
        $idea->save();
    }

    public function updateMultipleIdea(MultipleIdea $multipleIdea, string $status, ?string $choice = null): void
    {
        $multipleIdea->status = $status;
        $multipleIdea->choice = $choice;
        $multipleIdea->save();
    }
}
