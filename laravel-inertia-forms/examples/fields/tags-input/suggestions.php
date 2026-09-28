<?php

// #region example
use Erag\InertiaForms\Fields\TagsInput;

TagsInput::make('skills')
    ->suggestions(['laravel', 'inertia', 'vue', 'react', 'svelte', 'tailwind'])
    ->maxTags(5)
    ->maxTagLength(20)
    ->placeholder('Add a skill')
    ->help('Up to 5. Pick a suggestion or type your own.');
// #endregion example
