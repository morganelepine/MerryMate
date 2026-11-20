<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ResetPasswordNotification extends Notification
{
    use Queueable;

    protected $token;
    protected $user;

    /**
     * Create a new notification instance.
     */
    public function __construct($token, $user)
    {
        $this->token = $token;
        $this->user = $user;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Réinitialisation de ton mot de passe')
            ->greeting('Bonjour ' . $this->user->name . ',')
            ->line('Tu reçois cet e-mail car nous avons reçu une demande de réinitialisation de mot de passe pour ton compte.')
            ->line('Pour créer un nouveau mot de passe, tu peux cliquer sur le bouton ci-dessous :')
            ->action('Réinitialiser mon mot de passe', url(route('password.reset', ['token' => $this->token, 'email' => $notifiable->getEmailForPasswordReset()], false)))
            ->line('Si tu n\'as pas effectué de demande de mot de passe oublié, aucune action n\'est requise.')
            ->salutation('À bientôt sur MerryMate !');
    }

    public function getToken()
    {
        return $this->token;
    }
}
