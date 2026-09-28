<?php

// #region example
use Erag\InertiaForms\Fields\Hidden;
use Erag\InertiaForms\Fields\Textarea;
use Erag\InertiaForms\Form;

class ReplyForm extends Form
{
    public function fields(): array
    {
        return [
            Hidden::make('post_id')->required()->rule('exists:posts,id'),
            Hidden::make('parent_id')->rule('exists:comments,id'),
            Textarea::make('body')->label('Your reply')->required()->rows(3),
        ];
    }
}

ReplyForm::make()->bind(['post_id' => 42, 'parent_id' => 7]);
// #endregion example
