<?php
namespace App\Notifications;
use App\Course;
use App\CourseProfessor;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
class RequestCourseProfessorNotifications extends Notification implements ShouldQueue
{
    use Queueable;
    protected $user;
    protected $course;
    protected $situaton;

    /**
    * Create a new notification instance.
    *
    * @return void
    */
    public function __construct($user, $course, $situaton)
    {
        $this->user = $user;
        $this->course = $course;
        $this->situaton = $situaton;
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
        $url = "https://questione.ifce.edu.br/";

        return (new MailMessage)
            ->subject('[QUESTIONE] Solicitação de acesso ao curso')
            ->greeting('Olá, '.$this->user->name.'.')
            ->line('Você solicitou permissão para produzir questões para ao curso de '.$this->course.'.')
            ->line('Já temos uma decisão. Situação '.$this->situaton. '.')
            ->action('Acesse o Questione', url($url));;

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
