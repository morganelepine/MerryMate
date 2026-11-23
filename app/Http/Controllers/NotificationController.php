<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use App\Models\User;
use App\Models\GiftList;
use App\Notifications\NotifyRequestAccessToList;
use App\Notifications\NotifyResponseToRequestAccess;

class NotificationController extends Controller
{
    #index all notifications
    public function index(Request $request)
    {
        $this->markAllNotifications();

        $dateFormat = 'd/m/Y';
        $notifications = [];

        foreach (Auth::user()->notifications as $notification) {
            $notification->formatted_created_at = Carbon::parse($notification->created_at)->format($dateFormat);
            array_push($notifications, $notification);
            // $notification->markAsRead();
        }

        return response()->json(['notifications' => $notifications]);
    }

    #unread notifications
    public function indexUnreadNotifications(Request $request)
    {
        $dateFormat = 'd/m/Y';
        $unread_notifications = [];
        // $unread_notifications = Auth::user()->unreadNotifications()->get();

        foreach (Auth::user()->unreadNotifications as $notification) {
            $notification->formatted_created_at = Carbon::parse($notification->created_at)->format($dateFormat);
            array_push($unread_notifications, $notification);
        }

        return response()->json(['unread_notifications' => $unread_notifications]);
    }

    #mark notification as read
    public function markNotification(Request $request, $id)
    {
        Auth::user()->unreadNotifications->where('id', $id)->markAsRead();
        return response();
    }

    #mark all notifications as read
    public function markAllNotifications()
    {
        Auth::user()->unreadNotifications->markAsRead();
        return response();
    }

    #delete specific notification
    public function destroy(Request $request, $id)
    {
        Auth::user()->notifications()->where('id', $id)->delete();
        return response();
    }

    #send notif when someone wants an access to your list
    public function requestAccessToList(Request $request, User $listOwner, GiftList $list)
    {
        abort_if($list->isPrivate, 404);

        $requestingUser = Auth::user();

        $alreadyFollowing = $requestingUser->followed_lists()->where('gift_list_id', $list->id)->exists();
        $pendingRequest = $listOwner->notifications()
            ->where('type', 'request-access')
            ->where('data->requestingUserId', $requestingUser->id)
            ->where('data->listId', $list->id)
            ->whereNull('data->response')
            ->exists();

        if ($alreadyFollowing || $pendingRequest) {
            return response()->json(['message' => 'Demande déjà envoyée.']);
        }

        $listOwner->notify(new NotifyRequestAccessToList($listOwner, $requestingUser->name, $requestingUser->id, $list->name, $list->id));

        return response()->json(['message' => 'Demande envoyée avec succès.']);
    }

    #send response accepted/declined to request
    public function respondToAccessRequest(Request $request, $notificationId, GiftList $list)
    {
        $listOwner = Auth::user();

        abort_unless($list->user_id === $listOwner->id, 403);

        $response = $request->validate([
            'response' => 'required|in:accepté,décliné',
        ])['response'];

        // Row lock so that two concurrent clicks cannot both see the request as unanswered.
        $requestingUser = DB::transaction(function () use ($listOwner, $notificationId, $list, $response) {
            $notification = $listOwner->notifications()->lockForUpdate()->find($notificationId);
            abort_unless($notification && (int) $notification->data['listId'] === $list->id, 403);
            abort_if(isset($notification->data['response']), 409, 'Tu as déjà répondu à cette demande.');

            $requestingUser = User::find($notification->data['requestingUserId']);

            if ($response === 'accepté') {
                $requestingUser->followed_lists()->createOrFirst(
                    ['gift_list_id' => $list->id],
                    ['private_code' => $list->private_code],
                );
            }

            $notificationData = $notification->data;
            $notificationData['response'] = $response;
            $notification->data = $notificationData;
            $notification->markAsRead();
            $notification->save();

            return $requestingUser;
        });

        $requestingUser->notify(new NotifyResponseToRequestAccess($response, $requestingUser, $listOwner->name, $list->name, $list->id));

        return response()->json(['message' => 'Réponse envoyée avec succès.']);
    }
}
