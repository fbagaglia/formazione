<?php
/**
 * Plugin Name: Accademia Umanesimo Digitale - Corsi & Sessioni
 * Description: Registra i Custom Post Types "Corso" e "Sessione" e definisce i gruppi di campi ACF per il modulo formazione.
 * Author: Franco Bagaglia & Assistente AI
 * Version: 1.0.0
 */

if (!defined('ABSPATH')) {
    exit; // Uscita sicura se accesso diretto
}

/**
 * Registra i Custom Post Types per corsi e sessioni.
 */
function aud_register_cpt() {
    // CPT Corso
    register_post_type('aud_course', [
        'label'               => 'Corsi',
        'labels'              => [
            'name'          => 'Corsi',
            'singular_name' => 'Corso',
            'add_new_item'  => 'Aggiungi nuovo corso',
            'edit_item'     => 'Modifica corso',
        ],
        'public'              => true,
        'show_in_rest'        => true,
        'menu_icon'           => 'dashicons-welcome-learn-more',
        'supports'            => ['title', 'editor', 'thumbnail', 'excerpt'],
        'has_archive'         => true,
        'rewrite'             => ['slug' => 'corsi'],
    ]);

    // CPT Sessione
    register_post_type('aud_session', [
        'label'               => 'Sessioni',
        'labels'              => [
            'name'          => 'Sessioni',
            'singular_name' => 'Sessione',
            'add_new_item'  => 'Aggiungi nuova sessione',
            'edit_item'     => 'Modifica sessione',
        ],
        'public'              => true,
        'show_in_rest'        => true,
        'menu_icon'           => 'dashicons-schedule',
        'supports'            => ['title', 'editor', 'thumbnail', 'excerpt', 'author'],
        'has_archive'         => true,
        'rewrite'             => ['slug' => 'sessioni'],
    ]);
}
add_action('init', 'aud_register_cpt');

/**
 * Registra tassonomie utili (opzionali).
 */
function aud_register_taxonomies() {
    register_taxonomy('aud_course_category', 'aud_course', [
        'label'        => 'Categorie Corsi',
        'hierarchical' => true,
        'rewrite'      => ['slug' => 'categoria-corso'],
        'show_in_rest' => true,
    ]);

    register_taxonomy('aud_skill', 'aud_course', [
        'label'        => 'Competenze',
        'hierarchical' => false,
        'rewrite'      => ['slug' => 'competenza'],
        'show_in_rest' => true,
    ]);
}
add_action('init', 'aud_register_taxonomies');

/**
 * Definisce i gruppi di campi ACF se il plugin Advanced Custom Fields è attivo.
 */
function aud_register_acf_field_groups() {
    if (!function_exists('acf_add_local_field_group')) {
        return;
    }

    // Gruppo campi Corso
    acf_add_local_field_group([
        'key'                   => 'group_aud_course_fields',
        'title'                 => 'Dettagli Corso',
        'fields'                => [
            [
                'key'   => 'field_aud_course_subtitle',
                'label' => 'Sottotitolo',
                'name'  => 'aud_course_subtitle',
                'type'  => 'text',
            ],
            [
                'key'   => 'field_aud_course_audience',
                'label' => 'Destinatari',
                'name'  => 'aud_course_audience',
                'type'  => 'text',
            ],
            [
                'key'   => 'field_aud_course_duration',
                'label' => 'Durata',
                'name'  => 'aud_course_duration',
                'type'  => 'text',
            ],
            [
                'key'      => 'field_aud_course_skills',
                'label'    => 'Competenze coltivate',
                'name'     => 'aud_course_skills',
                'type'     => 'repeater',
                'layout'   => 'table',
                'button_label' => 'Aggiungi competenza',
                'sub_fields' => [
                    [
                        'key'   => 'field_aud_course_skill_label',
                        'label' => 'Competenze',
                        'name'  => 'skill_label',
                        'type'  => 'text',
                    ],
                ],
            ],
            [
                'key'   => 'field_aud_course_summary',
                'label' => 'Riassunto narrativo',
                'name'  => 'aud_course_summary',
                'type'  => 'textarea',
                'rows'  => 4,
            ],
            [
                'key'   => 'field_aud_course_hero_image',
                'label' => 'Immagine hero',
                'name'  => 'aud_course_hero_image',
                'type'  => 'image',
                'return_format' => 'array',
                'preview_size'  => 'medium',
            ],
            [
                'key'   => 'field_aud_course_cta_label',
                'label' => 'Testo call-to-action',
                'name'  => 'aud_course_cta_label',
                'type'  => 'text',
                'instructions' => 'Esempio: "Iscriviti al percorso"',
            ],
            [
                'key'   => 'field_aud_course_cta_url',
                'label' => 'Link call-to-action',
                'name'  => 'aud_course_cta_url',
                'type'  => 'url',
            ],
        ],
        'location'              => [
            [
                [
                    'param'    => 'post_type',
                    'operator' => '==',
                    'value'    => 'aud_course',
                ],
            ],
        ],
    ]);

    // Gruppo campi Sessione
    acf_add_local_field_group([
        'key'                   => 'group_aud_session_fields',
        'title'                 => 'Dettagli Sessione',
        'fields'                => [
            [
                'key'      => 'field_aud_session_course',
                'label'    => 'Corso collegato',
                'name'     => 'aud_session_course',
                'type'     => 'post_object',
                'post_type'=> ['aud_course'],
                'return_format' => 'id',
                'required' => 1,
            ],
            [
                'key'   => 'field_aud_session_subtitle',
                'label' => 'Sottotitolo',
                'name'  => 'aud_session_subtitle',
                'type'  => 'text',
            ],
            [
                'key'   => 'field_aud_session_summary',
                'label' => 'Sintesi narrativa',
                'name'  => 'aud_session_summary',
                'type'  => 'textarea',
                'rows'  => 4,
            ],
            [
                'key'   => 'field_aud_session_hero_image',
                'label' => 'Immagine di copertina',
                'name'  => 'aud_session_hero_image',
                'type'  => 'image',
                'return_format' => 'array',
                'preview_size'  => 'medium',
            ],
            [
                'key'   => 'field_aud_session_youtube_id',
                'label' => 'ID video YouTube',
                'name'  => 'aud_session_youtube_id',
                'type'  => 'text',
                'instructions' => 'Inserisci solo l\'ID (es. dQw4w9WgXcQ)',
            ],
            [
                'key'   => 'field_aud_session_key_concepts',
                'label' => 'Concetti chiave',
                'name'  => 'aud_session_key_concepts',
                'type'  => 'repeater',
                'layout'   => 'table',
                'button_label' => 'Aggiungi concetto',
                'sub_fields' => [
                    [
                        'key'   => 'field_aud_session_key_concept',
                        'label' => 'Concetto',
                        'name'  => 'concept_label',
                        'type'  => 'text',
                    ],
                ],
            ],
            [
                'key'   => 'field_aud_session_resources',
                'label' => 'Risorse',
                'name'  => 'aud_session_resources',
                'type'  => 'repeater',
                'layout'   => 'row',
                'button_label' => 'Aggiungi risorsa',
                'sub_fields' => [
                    [
                        'key'   => 'field_aud_session_resource_label',
                        'label' => 'Titolo',
                        'name'  => 'resource_label',
                        'type'  => 'text',
                    ],
                    [
                        'key'   => 'field_aud_session_resource_url',
                        'label' => 'URL',
                        'name'  => 'resource_url',
                        'type'  => 'url',
                    ],
                    [
                        'key'   => 'field_aud_session_resource_description',
                        'label' => 'Descrizione',
                        'name'  => 'resource_description',
                        'type'  => 'textarea',
                        'rows'  => 2,
                    ],
                ],
            ],
            [
                'key'   => 'field_aud_session_practice_ideas',
                'label' => 'Idee pratiche',
                'name'  => 'aud_session_practice_ideas',
                'type'  => 'repeater',
                'layout'   => 'row',
                'button_label' => 'Aggiungi idea',
                'sub_fields' => [
                    [
                        'key'   => 'field_aud_session_practice_text',
                        'label' => 'Testo',
                        'name'  => 'practice_text',
                        'type'  => 'textarea',
                        'rows'  => 2,
                    ],
                ],
            ],
            [
                'key'   => 'field_aud_session_quote',
                'label' => 'Citazione ispirazionale',
                'name'  => 'aud_session_quote',
                'type'  => 'group',
                'sub_fields' => [
                    [
                        'key'   => 'field_aud_session_quote_text',
                        'label' => 'Testo citazione',
                        'name'  => 'quote_text',
                        'type'  => 'textarea',
                        'rows'  => 2,
                    ],
                    [
                        'key'   => 'field_aud_session_quote_author',
                        'label' => 'Autore',
                        'name'  => 'quote_author',
                        'type'  => 'text',
                    ],
                ],
            ],
            [
                'key'   => 'field_aud_session_flow',
                'label' => 'Flow narrativo',
                'name'  => 'aud_session_flow',
                'type'  => 'flexible_content',
                'layouts' => [
                    'layout_aud_flow_text' => [
                        'key'        => 'layout_aud_flow_text',
                        'name'       => 'text_block',
                        'label'      => 'Blocco di testo',
                        'display'    => 'block',
                        'sub_fields' => [
                            [
                                'key'   => 'field_aud_flow_text_heading',
                                'label' => 'Titolo',
                                'name'  => 'heading',
                                'type'  => 'text',
                            ],
                            [
                                'key'   => 'field_aud_flow_text_body',
                                'label' => 'Contenuto',
                                'name'  => 'body',
                                'type'  => 'wysiwyg',
                                'tabs'  => 'all',
                            ],
                        ],
                    ],
                    'layout_aud_flow_image' => [
                        'key'        => 'layout_aud_flow_image',
                        'name'       => 'image_block',
                        'label'      => 'Immagine',
                        'display'    => 'block',
                        'sub_fields' => [
                            [
                                'key'   => 'field_aud_flow_image',
                                'label' => 'Immagine',
                                'name'  => 'image',
                                'type'  => 'image',
                                'return_format' => 'array',
                                'preview_size'  => 'medium',
                            ],
                            [
                                'key'   => 'field_aud_flow_image_caption',
                                'label' => 'Didascalia',
                                'name'  => 'caption',
                                'type'  => 'text',
                            ],
                        ],
                    ],
                    'layout_aud_flow_video' => [
                        'key'        => 'layout_aud_flow_video',
                        'name'       => 'video_block',
                        'label'      => 'Video YouTube',
                        'display'    => 'block',
                        'sub_fields' => [
                            [
                                'key'   => 'field_aud_flow_video_id',
                                'label' => 'ID video YouTube',
                                'name'  => 'video_id',
                                'type'  => 'text',
                            ],
                            [
                                'key'   => 'field_aud_flow_video_description',
                                'label' => 'Descrizione',
                                'name'  => 'description',
                                'type'  => 'textarea',
                                'rows'  => 2,
                            ],
                        ],
                    ],
                    'layout_aud_flow_link' => [
                        'key'        => 'layout_aud_flow_link',
                        'name'       => 'link_block',
                        'label'      => 'Link / Risorsa',
                        'display'    => 'block',
                        'sub_fields' => [
                            [
                                'key'   => 'field_aud_flow_link_label',
                                'label' => 'Etichetta',
                                'name'  => 'label',
                                'type'  => 'text',
                            ],
                            [
                                'key'   => 'field_aud_flow_link_url',
                                'label' => 'URL',
                                'name'  => 'url',
                                'type'  => 'url',
                            ],
                            [
                                'key'   => 'field_aud_flow_link_description',
                                'label' => 'Descrizione',
                                'name'  => 'description',
                                'type'  => 'textarea',
                                'rows'  => 2,
                            ],
                        ],
                    ],
                    'layout_aud_flow_html' => [
                        'key'        => 'layout_aud_flow_html',
                        'name'       => 'html_block',
                        'label'      => 'HTML personalizzato',
                        'display'    => 'block',
                        'sub_fields' => [
                            [
                                'key'   => 'field_aud_flow_html_code',
                                'label' => 'Markup HTML',
                                'name'  => 'html_code',
                                'type'  => 'textarea',
                                'rows'  => 6,
                                'new_lines' => '',
                            ],
                        ],
                    ],
                    'layout_aud_flow_code' => [
                        'key'        => 'layout_aud_flow_code',
                        'name'       => 'code_block',
                        'label'      => 'Snippet di codice / Prompt',
                        'display'    => 'block',
                        'sub_fields' => [
                            [
                                'key'   => 'field_aud_flow_code_language',
                                'label' => 'Linguaggio',
                                'name'  => 'language',
                                'type'  => 'text',
                                'instructions' => 'Esempio: text, markdown, javascript',
                            ],
                            [
                                'key'   => 'field_aud_flow_code_content',
                                'label' => 'Contenuto',
                                'name'  => 'code_content',
                                'type'  => 'textarea',
                                'rows'  => 6,
                            ],
                            [
                                'key'   => 'field_aud_flow_code_notes',
                                'label' => 'Note contestuali',
                                'name'  => 'code_notes',
                                'type'  => 'textarea',
                                'rows'  => 3,
                            ],
                        ],
                    ],
                ],
                'button_label' => 'Aggiungi blocco',
            ],
        ],
        'location'              => [
            [
                [
                    'param'    => 'post_type',
                    'operator' => '==',
                    'value'    => 'aud_session',
                ],
            ],
        ],
    ]);
}
add_action('acf/init', 'aud_register_acf_field_groups');

