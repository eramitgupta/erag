<?php

// #region example
use Erag\InertiaForms\Fields\Composer;

Composer::make('reply')
    ->label('Reply to customer')
    ->placeholder('Write a reply…')
    ->accept(['pdf', 'png', 'jpg'])
    ->maxFiles(3)
    ->maxSize(5120)
    ->maxLength(2000)
    ->quickReplies([
        'Thanks, looking into it now.',
        'Could you send a screenshot?',
        'This is fixed in the latest release.',
    ])
    ->required();
// #endregion example
