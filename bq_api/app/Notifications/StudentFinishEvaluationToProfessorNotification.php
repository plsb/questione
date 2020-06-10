<?php
namespace App\Notifications;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;

class StudentFinishEvaluationToProfessorNotification extends Notification implements ShouldQueue
{
    use Queueable;
    protected $userOwner;
    protected $userStudent;
    protected $evaluation;
    /**
    * Create a new notification instance.
    *
    * @return void
    */
    public function __construct($userOwner, $userStudent, $evaluation)
    {
        $this->userOwner = $userOwner;
        $this->userStudent = $userStudent;
        $this->evaluation = $evaluation;
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
        $url_questione = "https://questione.ifce.edu.br/";
        return (new MailMessage)
            ->subject('[QUESTIONE] Avaliação finalizada pelo estudante')
            ->greeting('Olá, '.$this->userOwner->name.'. Tudo bem?')
            ->line('Você está recebendo este e-mail porque um estudante finalizou uma avaliação que pertence a você.')
            ->line('O estudante que finalizou a avaliação foi o(a) '.$this->userStudent->name.'.')
            ->line('A avaliação possui a descrição: '.$this->evaluation->description.'.')
            ->action('Acesse o Questione', url($url_questione));
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
