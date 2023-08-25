<?php
namespace App\Notifications;
use App\Http\Controllers\Util\MailController;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use PHPMailer\PHPMailer\PHPMailer;

class PasswordResetRequestNotifications extends Notification implements ShouldQueue
{
    use Queueable;
    protected $token;
    protected $user;
    /**
    * Create a new notification instance.
    *
    * @return void
    */
    public function __construct($token, $user)
    {
        $this->token = $token;
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
        $url_questione = "https://questione.ifce.edu.br/reset-password/".$this->token;

        return (new MailMessage)
            ->subject('[QUESTIONE] Recuperação de senha')
            ->greeting('Olá, '.$this->user->name.'.')
            ->line('Você está recebendo este e-mail porque nós recebemos uma solicitação de recuperação de senha para sua conta.')
            ->line('Se você não requisitou a redefinição de senha, não é necessário nenhuma ação adicional.')
            ->action('Recuperar Senha', url($url_questione));
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
