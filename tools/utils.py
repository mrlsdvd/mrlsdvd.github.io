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


def load_config():
    config = json.load(open(CONFIG_LOCATION))
    return config


def update_config(config):
    with open(CONFIG_LOCATION, 'w') as fp:
        json.dump(config, fp)

def move_image(origin_path, dest_path, new_size):
    # Could do compression or resizing here
    shutil.copy(origin_path, dest_path)


def generate_id(base):
    return str(int(hashlib.md5(base.encode('utf-8')).hexdigest(), 16))


def save_visual_page(window_values, selected_item, page_id, config, images_path):
    image_size = (window_values['image-width'], window_values['image-height'])
    orientation = 'landscape'
    if window_values['image-width'] < window_values['image-height']:
        orientation = 'portrait'

    new_sub_config = {
        'title': window_values['title'],
        'date': window_values['date'],
        'caption': window_values['caption'],
        'options': window_values['options'],
        'description': window_values['description'],
        'orientation': orientation,
        'tags': list(map(lambda s: s.strip(), window_values['tags'].split(',')))
    }
    if selected_item is None:
        # Adding new item
        new_sub_config['id'] = generate_id(new_sub_config['title'])
        config[page_id]['items'].append(new_sub_config)
        selected_item = new_sub_config

    for item in config[page_id]['items']:
        if item['id'] == selected_item['id']:
            # Update image
            new_image_path = window_values['image-path']
            new_image_name = os.path.basename(new_image_path)
            dest_path = os.path.join(images_path, new_image_name)
            new_image_config = {'path': os.path.join('./' + IMAGES_PATH, new_image_name)}
            if not os.path.exists(dest_path):
                move_image(new_image_path, dest_path, image_size)
                new_image_id = generate_id(os.path.basename(new_image_path))
                new_sub_config['imageId'] = new_image_id
                config['data']['images'][new_image_id] = new_image_config
            else:
                # Find existing image and update new item image id 
                for k, v in config['data']['images'].items():
                    if v['path'] == os.path.join('./' + IMAGES_PATH, new_image_name):
                        new_sub_config['imageId'] = k
            item.update(new_sub_config)
    return config


def get_image_data(image_path, get_size=False):
    # Open image as bytes
    image = Image.open(image_path)
    image.thumbnail((400, 400))
    bio = io.BytesIO()
    image.save(bio, format='PNG')

    if get_size:
        size = image.size
        return bio.getvalue(), size

    return bio.getvalue()

def load_image(window, image_path):
    image_data, size= get_image_data(image_path, True)
    window['image'].update(data=image_data)
    window['image-width'].update(size[0])
    window['image-height'].update(size[1])


def load_visual_info(window, item, config, images_path):
    # Populate inputs with info from selected item
    select_item_id = item['id']
    window['title'].update(item['title'])
    window['date'].update(item['date'])
    window['caption'].update(item['caption'])
    window['options'].update(item['options'])
    window['description'].update(item['description'])
    window['tags'].update(','.join(item['tags']))

    image = config['data']['images'][item['imageId']]
    load_image(window, os.path.join(images_path, os.path.basename(image['path'])))
