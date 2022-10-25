#!/usr/bin/env python
import PIL
import PySimpleGUI as sg
import os
import io
import threading
import base64
import json
import markdown
import shutil
import hashlib

from PIL import Image
from sys import exit
from tkhtmlview import html_parser

from constants import CONFIG_LOCATION, IMAGES_PATH
from utils import (load_config, update_config, move_image, 
    generate_id, save_visual_page, get_image_data, load_image, load_visual_info)



MARKDOWN_WINDOW = None


def render_markdown_window(markdown_text):
    html = markdown.markdown(markdown_text)
    render_layout = [
        [
            sg.Multiline(
                size=(80, 30),
                border_width=2,
                disabled=True,
                no_scrollbar=True,
                expand_x=True,
                expand_y=True,
                key='render-space')
        ]
    ]
    layout = [
        [sg.Frame('Rendered Markdown', layout=render_layout)]
    ]

    if MARKDOWN_WINDOW is None:
        window = sg.Window('Markdown Render', layout=layout, finalize=True, modal=False)
        # MARKDOWN_WINDOW = window
    else:
        window = MARKDOWN_WINDOW
    widget = window['render-space'].Widget

    parser = html_parser.HTMLTextParser()
    prev_state = widget.cget('state')
    widget.config(state=sg.tk.NORMAL)
    widget.delete('1.0', sg.tk.END)
    widget.tag_delete(widget.tag_names)
    parser.w_set_html(widget, html, strip=True)
    widget.config(state=prev_state)

    while True:
        event, values = window.Read()
        if event == 'Exit' or event == sg.WIN_CLOSED:
            break
    window.close()


def render_visual_window(page_id, config):
    images_path = os.path.join(os.getcwd(), '..', IMAGES_PATH)
    sorted_sub_config = sorted(config[page_id]['items'], 
        key=lambda x: x['date'], reverse=True)

    title_inputs = [
        sg.Text('Title'),
        sg.Input(size=(35, 1), enable_events=True, key='title'),
        sg.Button('Date', pad=None, 
            key='date-picker'),
        sg.Input(size=(10, 1), key='date', enable_events=True),
    ]

    file_browser_input = [
        sg.Text('Choose an image: '), 
        sg.Input(key='image-path', enable_events=True), 
        sg.FileBrowse(key='image-chooser', target='image-path')
    ]

    image_block = [
        sg.Image(key='image')
    ]

    image_size_block = [
        sg.Text('Image width'),
        sg.Input(size=(4, 1), key='image-width'),
        sg.Text('Image height'),
        sg.Input(size=(4, 1), key='image-height')
    ]

    caption_options_inputs = [
        sg.Text('Caption'),
        sg.Input(size=(35, 1), key='caption'),
        sg.Text('Options'),
        sg.Input(size=(20, 1), key='options')
    ]

    description_input = [
        sg.Multiline(size=(80, 10), autoscroll=True, key='description'),
    ]

    render_button = [
        sg.Button('Render Markdown', key='render-description-markdown')
    ]

    tags_input = [
        sg.Text('Tags'),
        sg.Input(size=(70, 1), key='tags')
    ]

    save_button = [
        sg.Button('Save', key='save')
    ]

    input_form_col = [
        title_inputs,
        file_browser_input,
        image_block,
        image_size_block,
        caption_options_inputs,
        [sg.Text('Description')],
        description_input,
        render_button,
        tags_input,
        save_button
    ]

    titles = [i['title'] for i in sorted_sub_config]
    items_list_col = [
        [sg.Listbox(values=titles, enable_events=True, size=(40, 20), key='item-list')],
        [sg.Button('+', key='add')]
    ]

    
    layout = [[sg.Column(input_form_col), sg.VSeperator(), sg.Column(items_list_col, justification='center')]]
    window = sg.Window('{} Manager'.format(page_id), layout, resizable=True, finalize=True)
    
    selected_item = None
    while True:
        event, values = window.read()
        if event == 'Exit' or event == sg.WIN_CLOSED:
            break

        elif event == 'date-picker':
            d = sg.popup_get_date(close_when_chosen=True)
            window['date'].update("{}-{}-{}".format(d[2], d[0], d[1]))
            window.TKroot.focus_force()
        elif event == 'image-path':
            image_path = values['image-path']
            load_image(window, image_path)
        elif event == 'item-list':
            selected_idx = window['item-list'].get_indexes()[0]
            item = sorted_sub_config[selected_idx]
            selected_item = item
            load_visual_info(window, item, config, images_path)
        elif event == 'render-description-markdown':
            render_markdown_window(values['description'])
        elif event == 'save':
            new_config = save_visual_page(values, selected_item, page_id, config, images_path)
            update_config(new_config)
        elif event == 'add':
            # Clear page state
            selected_item = None
            for inp_key in ['title','date','caption','options','image-path','description','tags']:
                window[inp_key]('')
                window['image'].update()
                print(dir(window['image']))

    window.close()


def render_post_window(page_id, config):
    pass


def render_album_window(page_id, config):
    pass


def main():
    page_buttons = [
        sg.Button('Programming', border_width=0, button_color=sg.COLOR_SYSTEM_DEFAULT, key='programming-button'),
        sg.Button('Outdoors', border_width=0, button_color=sg.COLOR_SYSTEM_DEFAULT, key='outdoors-button'),
        sg.Button('Art', border_width=0, button_color=sg.COLOR_SYSTEM_DEFAULT, key='art-button'),
        sg.Button('Photography', border_width=0, button_color=sg.COLOR_SYSTEM_DEFAULT, key='photography-button'),
        sg.Button('Travel', border_width=0, button_color=sg.COLOR_SYSTEM_DEFAULT, key='travel-button'),
        sg.Button('Albums', border_width=0, button_color=sg.COLOR_SYSTEM_DEFAULT, key='album-button')
    ]
    layout = [page_buttons]
    config = load_config()
    window = sg.Window('Site Manager Menu', layout)

    while True:
        event, values = window.read()
        if event == 'Exit' or event == sg.WIN_CLOSED:
            break
        elif event == 'programming-button':
            render_post_window('programming', config)
        elif event == 'outdoors-button':
            render_post_window('outdoors', config)
        elif event == 'art-button':
            render_visual_window('art', config)
        elif event == 'photography-button':
            render_visual_window('photography', config)
        elif event == 'travel-button':
            render_post_window('travel', config)
        elif event == 'album-button':
            render_album_window('album', config)

    window.close()

if __name__ == '__main__':
    main()