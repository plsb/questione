<?php
namespace App\Notifications;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;

class WelcomeNotifications extends Notification implements ShouldQueue
{
    use Queueable;
    protected $token;
    protected $user;
    /**
    * Create a new notification instance.
    *
    * @return void
    */
    public function __construct($user)
    {
        $this->user = $user;
    }
    /**
    * Get the notification's delivery channels.
    *
    * @param  mixed  $notifiable
    * @return array
    */
    public function via($notifiable)
    {
        return ['mail'];
    }
     /**
     * Get the mail representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
     public function toMail($notifiable)
     {
        $url = "https://questione.ifce.edu.br";
        return (new MailMessage)
            ->subject('Boas-vindas')
            ->greeting('Olá, '.$this->user->name.'.')
            ->line('Agradecemos pelo seu cadastro na plataforma Questione.')
            ->line('Seja bem-vindo(a) e esperamos que tenha uma ótima experiência com o uso da plataforma.')
            ->action('Questione', url($url));
    }
    /**
    * Get the array representation of the notification.
    *
    * @param  mixed  $notifiable
    * @return array
    */
    public function toArray($notifiable)
    {
        return [
            //
        ];
    }
}
