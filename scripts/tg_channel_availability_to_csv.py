"""
Парсит посты из канала rooneyform_warehouse, сохраняет данные в CSV и фотографии постов с UUID.
Добавляет ссылку на пост и дату публикации.
"""

from telethon.sync import TelegramClient
from telethon.tl.types import Message, MessageMediaPhoto
import pandas as pd
import re
import os
import uuid
from datetime import datetime

# Данные для доступа к Telegram API: https://my.telegram.org/apps

api_id = "15465531"  # Замените на ваш api_id (получается на my.telegram.org)
api_hash = "9ff33616247248afe167b5de803740"  # Замените на ваш api_hash
channel_username = "rooneyform_warehouse"  # Имя канала для парсинга

# Папка для сохранения фотографий
PHOTOS_DIR = "photos"


# Функция для извлечения данных из текста поста
def parse_post(text):
    data = {
        "Команда": None,
        "Бренд": None,
        "Сезон": None,
        "Тип формы": None,
        "Состояние": None,
        "Цена": None,
        "Размер": None,
        "Цвет": None,
        "Особенности": None,
        "Контакты": "@rooneyform_admin",
        "Хештеги": None,
    }

    # Извлекаем данные с помощью регулярных выражений
    try:
        data["Команда"] = re.search(r"футболка «(.*?)»", text).group(1)
    except:
        pass

    try:
        data["Бренд"] = re.search(
            r"(Kappa|Puma|Adidas|Nike|Umbro|New Balance)", text, re.IGNORECASE
        ).group(1)
    except:
        pass

    try:
        data["Сезон"] = re.search(r"(\d{4}/\d{2})", text).group(1)
    except:
        pass

    try:
        data["Тип формы"] = re.search(
            r"(третья|гостевая|домашняя|вратарская)", text, re.IGNORECASE
        ).group(1)
    except:
        pass

    try:
        data["Состояние"] = re.search(r"Состояние (.*?)\.", text).group(1)
    except:
        pass

    try:
        data["Цена"] = re.search(r"(\d+) р\.", text).group(1)
    except:
        pass

    try:
        data["Размер"] = re.search(r"(S|M|L|XL|XXL|XXXL)", text).group(1)
    except:
        pass

    try:
        data["Цвет"] = re.search(
            r"(серый|синий|чёрный|черный|красный|белый|жёлтый|зелёный)",
            text,
            re.IGNORECASE,
        ).group(1)
    except:
        pass

    # Хештеги: лига и размер, через запятую, как на фото
    try:
        hashtags = re.findall(r"#([\wА-Яа-я]+)", text)
        if hashtags:
            data["Хештеги"] = ", ".join(hashtags)
        else:
            data["Хештеги"] = None
    except:
        data["Хештеги"] = None

    # Извлечение особенностей (первые 2 предложения после "Отдельно стоит отметить")
    try:
        notes_part = text.split("Отдельно стоит отметить")[1].split(". ")[:2]
        data["Особенности"] = ". ".join(notes_part).strip()
    except:
        pass

    return data


# Функция для генерации уникального идентификатора товара
def generate_product_uuid(data):
    base = (
        f"{data.get('Команда', '')}_{data.get('Сезон', '')}_{data.get('Тип формы', '')}"
    )
    return str(uuid.uuid5(uuid.NAMESPACE_DNS, base))


# Функция для сохранения всех фотографий из поста (альбома или одиночных)
def save_photos(client, message, product_uuid):
    """
    Исправлено: теперь сохраняет абсолютно все фотографии, связанные с постом, включая альбомы.
    """
    photo_uuids = []
    if not os.path.exists(PHOTOS_DIR):
        os.makedirs(PHOTOS_DIR)
    product_dir = os.path.join(PHOTOS_DIR, product_uuid)
    if not os.path.exists(product_dir):
        os.makedirs(product_dir)

    # Список для хранения id сообщений, чтобы не сохранять одну и ту же фотографию дважды
    saved_message_ids = set()

    # Если это альбом (группа сообщений)
    if hasattr(message, "grouped_id") and message.grouped_id:
        # Получаем все сообщения с тем же grouped_id (альбом)
        # Важно: reverse=False, чтобы идти от старых к новым (правильный порядок)
        for msg in client.iter_messages(
            channel_username, min_id=0, max_id=message.id + 20, reverse=False
        ):
            if getattr(msg, "grouped_id", None) == message.grouped_id:
                if msg.media and isinstance(msg.media, MessageMediaPhoto):
                    if msg.id not in saved_message_ids:
                        photo_uuid = str(uuid.uuid4())
                        file_path = os.path.join(product_dir, f"{photo_uuid}.jpg")
                        client.download_media(msg, file=file_path)
                        photo_uuids.append(photo_uuid)
                        saved_message_ids.add(msg.id)
            # Останавливаемся, если id сообщения больше, чем у текущей группы (оптимизация)
            if getattr(msg, "id", 0) > message.id + 20:
                break

    # Также проверяем текущее сообщение (на случай если оно не в альбоме или не было обработано)
    if message.media and isinstance(message.media, MessageMediaPhoto):
        if message.id not in saved_message_ids:
            photo_uuid = str(uuid.uuid4())
            file_path = os.path.join(product_dir, f"{photo_uuid}.jpg")
            client.download_media(message, file=file_path)
            photo_uuids.append(photo_uuid)
            saved_message_ids.add(message.id)
    elif hasattr(message, "photo") and message.photo:
        if message.id not in saved_message_ids:
            photo_uuid = str(uuid.uuid4())
            file_path = os.path.join(product_dir, f"{photo_uuid}.jpg")
            client.download_media(message, file=file_path)
            photo_uuids.append(photo_uuid)
            saved_message_ids.add(message.id)
    elif (
        hasattr(message, "media")
        and hasattr(message.media, "webpage")
        and hasattr(message.media.webpage, "photo")
    ):
        photo_uuid = str(uuid.uuid4())
        file_path = os.path.join(product_dir, f"{photo_uuid}.jpg")
        client.download_media(message.media.webpage.photo, file=file_path)
        photo_uuids.append(photo_uuid)

    return photo_uuids


# Основная функция парсинга
def parse_telegram_channel():
    with TelegramClient("session_name", api_id, api_hash) as client:
        posts_data = []

        # Получаем последние 1000 постов (можно увеличить)
        for message in client.iter_messages(channel_username, limit=1000):
            if isinstance(message, Message) and message.text:
                post_data = parse_post(message.text)
                product_uuid = generate_product_uuid(post_data)
                post_data["UUID"] = product_uuid

                # Сохраняем фотографии и получаем их UUID
                photo_uuids = save_photos(client, message, product_uuid)
                post_data["UUID_фотографий"] = (
                    ",".join(photo_uuids) if photo_uuids else ""
                )

                # Добавляем ссылку на пост
                try:
                    post_data["Ссылка на пост"] = (
                        f"https://t.me/{channel_username}/{message.id}"
                    )
                except Exception:
                    post_data["Ссылка на пост"] = ""

                # Добавляем дату публикации поста
                try:
                    if hasattr(message, "date") and message.date:
                        # Приводим к строке в формате YYYY-MM-DD HH:MM:SS
                        post_data["Дата публикации"] = message.date.strftime(
                            "%Y-%m-%d %H:%M:%S"
                        )
                    else:
                        post_data["Дата публикации"] = ""
                except Exception:
                    post_data["Дата публикации"] = ""

                posts_data.append(post_data)

        # Создаем DataFrame и сохраняем в CSV
        df = pd.DataFrame(posts_data)

        # Удаляем дубликаты (если есть повторяющиеся посты)
        df = df.drop_duplicates(subset=["Команда", "Сезон", "Тип формы"], keep="first")

        # Сохраняем в CSV
        df.to_csv("football_jerseys.csv", index=False, encoding="utf-8-sig")
        print(f"Данные сохранены в football_jerseys.csv. Найдено {len(df)} записей.")
        print(f"Фотографии сохранены в папке {PHOTOS_DIR}/<UUID товара>/")


# Запуск парсера
if __name__ == "__main__":
    parse_telegram_channel()
