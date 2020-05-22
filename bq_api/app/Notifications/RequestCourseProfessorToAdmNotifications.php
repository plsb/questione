<?php
namespace App\Notifications;
use App\Course;
use App\CourseProfessor;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
class RequestCourseProfessorToAdmNotifications extends Notification implements ShouldQueue
{
    use Queueable;
    protected $user;
    protected $course;

    /**
    * Create a new notification instance.
    *
    * @return void
    */
    public function __construct($userRequester, $course)
    {
        $this->user = $userRequester;
        $this->course = $course;
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
            ->subject('[QUESTIONE] Solicitação de usuário')
            ->greeting('Olá, ADM. O usuário '.$this->user->name.' solicitou acesso a um curso.')
            ->line('O curso solicitado foi '.$this->course.'.')
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
