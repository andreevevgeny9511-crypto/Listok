# ТУРНИКС & ListOk CRM — MCP Server

Полноценный MCP (Model Context Protocol) сервер для интеграции ListOk CRM с AI-ассистентами. Позволяет AI-агентам (Claude Desktop, Cursor, Codex CLI, Битрикс24 и др.) работать с данными CRM через естественный язык.

## 📋 Содержание

- [Возможности](#-возможности)
- [Архитектура](#-архитектура)
- [Быстрый старт](#-быстрый-старт)
- [Установка](#-установка)
- [Настройка](#-настройка)
- [Использование](#-использование)
- [Интеграция с AI-клиентами](#-интеграция-с-ai-клиентами)
- [Доступные инструменты](#-доступные-инструменты)
- [Веб-интерфейс](#-веб-интерфейс)
- [Troubleshooting](#-troubleshooting)
- [Безопасность](#-безопасность)
- [Лицензия](#-лицензия)

## 🚀 Возможности

### Управление клиентами
- Поиск клиентов по имени, телефону, email
- Создание и редактирование карточек клиентов
- Работа с заметками и кастомными полями
- Управление бонусами и балансом

### Работа с абонементами
- Оформление абонементов клиентам
- Заморозка и разморозка абонементов
- Генерация ссылок на оплату
- Проверка статуса и остатков

### Расписание и занятия
- Просмотр расписания на дату/период
- Создание и редактирование занятий
- Запись клиентов на занятия
- Отметка посещений

### Финансы
- Просмотр платежей с фильтрацией
- Статистика по доходам и расходам
- Работа с категориями платежей

### Справочники
- Группы и направления
- Сотрудники (преподаватели, менеджеры)
- Филиалы и залы
- Источники клиентов

### Webhooks
- Подписка на события CRM в реальном времени
- 26+ типов событий (клиенты, абонементы, занятия, платежи)
- Проверка подписи для безопасности

## 🏗️ Архитектура

Проект состоит из двух основных частей:

### 1. Веб-приложение (фронтенд)
- **Технологии:** React, TypeScript, Tailwind CSS, Vite
- **Назначение:** Управление настройками, просмотр документации, OAuth-авторизация
- **Файлы:** `index.html`, `assets/`, `oauth-callback.html`, `oauth-proxy.php`

### 2. MCP-сервер (бэкенд)
- **Технологии:** Node.js, TypeScript, @modelcontextprotocol/sdk
- **Назначение:** Предоставление инструментов AI-агентам через MCP протокол
- **Файлы:** `mcp-server/index.js`, `mcp-server/package.json`

### Схема работы

```
┌─────────────────┐
│   AI-клиент     │
│ (Claude/Cursor) │
└────────┬────────┘
         │ MCP Protocol (stdio)
         ▼
┌─────────────────┐
│   MCP Server    │
│   (Node.js)     │
└────────┬────────┘
         │ HTTP API
         ▼
┌─────────────────┐
│   ListOk CRM    │
│     API v2      │
└─────────────────┘
```

## ⚡ Быстрый старт

### Для веб-приложения (сервер)

1. **Скачайте проект** и распакуйте
2. **Загрузите на сервер** через файловый менеджер:
   - `index.html`
   - `oauth-callback.html`
   - `oauth-proxy.php`
   - папку `assets/`
   - папку `mcp-server/`
3. **Откройте в браузере:** `http://ваш-домен/Listok/`
4. **Настройте OAuth** в настройках приложения
5. **Готово!** Веб-интерфейс работает

### Для MCP-сервера (локально)

1. **Скачайте папку `mcp-server/`** с сервера
2. **Установите зависимости:**
   ```bash
   cd mcp-server
   npm install
   ```
3. **Настройте переменные окружения:**
   ```bash
   export LISTOK_DOMAIN=an7236.listokcrm.ru
   export LISTOK_TOKEN=ваш_токен
   ```
4. **Запустите сервер:**
   ```bash
   node index.js
   ```
5. **Подключите к AI-клиенту** (см. раздел [Интеграция с AI-клиентами](#-интеграция-с-ai-клиентами))

## 📦 Установка

### Требования

**Для веб-приложения:**
- Веб-сервер с поддержкой PHP 7.4+ (Apache/Nginx)
- HTTPS (рекомендуется)

**Для MCP-сервера:**
- Node.js 18 или выше
- npm или yarn

### Установка веб-приложения

#### Вариант 1: Статический хостинг

1. Загрузите файлы в корень сайта или подпапку
2. Убедитесь, что PHP работает
3. Настройте `.htaccess` (если нужно):
   ```apache
   RewriteEngine On
   RewriteBase /Listok/
   RewriteRule ^index\.html$ - [L]
   RewriteCond %{REQUEST_FILENAME} !-f
   RewriteCond %{REQUEST_FILENAME} !-d
   RewriteRule . /Listok/index.html [L]
   ```

#### Вариант 2: VPS с Nginx

```nginx
server {
    listen 80;
    server_name ваш-домен.ru;
    root /var/www/Listok;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php7.4-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }
}
```

### Установка MCP-сервера

```bash
# Клонируйте или скачайте проект
cd mcp-server

# Установите зависимости
npm install

# Соберите (если нужно)
npm run build
```

## 🔐 Настройка

### OAuth авторизация в ListOk CRM

1. **Создайте OAuth-приложение:**
   - Войдите в панель ListOk CRM
   - Перейдите в: Настройки → Интеграции → API
   - Нажмите "Создать OAuth-приложение"
   - Укажите Redirect URI: `http://ваш-домен/Listok/oauth-callback.html`
   - Сохраните Client ID и Client Secret

2. **Настройте веб-приложение:**
   - Откройте настройки приложения
   - Введите:
     - **Домен CRM:** `an7236.listokcrm.ru` (ваш домен)
     - **Client ID:** из панели ListOk
     - **Client Secret:** из панели ListOk
   - Нажмите "Войти через ListOk CRM"
   - Авторизуйтесь в открывшемся окне

3. **Получите токен:**
   - После успешной авторизации токен сохранится автоматически
   - Вы можете скопировать его кнопкой "📋 Копировать токен"

### Настройка MCP-сервера

Создайте файл `.env` в папке `mcp-server/`:

```env
LISTOK_DOMAIN=an7236.listokcrm.ru
LISTOK_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Или экспортируйте переменные окружения:

**Linux/macOS:**
```bash
export LISTOK_DOMAIN=an7236.listokcrm.ru
export LISTOK_TOKEN=ваш_токен
```

**Windows (PowerShell):**
```powershell
$env:LISTOK_DOMAIN="an7236.listokcrm.ru"
$env:LISTOK_TOKEN="ваш_токен"
```

**Windows (cmd):**
```cmd
set LISTOK_DOMAIN=an7236.listokcrm.ru
set LISTOK_TOKEN=ваш_токен
```

## 💡 Использование

### Веб-интерфейс

Откройте приложение в браузере и используйте вкладки:

- **🏠 Обзор** — главная страница со статистикой
- **🔧 Инструменты** — список всех MCP-инструментов с документацией
- **💬 Использование** — примеры запросов к AI
- **🤖 Codex & AI** — инструкции по подключению к AI-клиентам
- **🔗 Битрикс24** — интеграция с AI-ассистентом Битрикс24
- **📝 Код сервера** — исходный код MCP-сервера
- **🔔 Webhooks** — документация по webhook-событиям
- **⚙️ Настройки** — авторизация и конфигурация

### MCP-сервер

Запустите сервер:

```bash
cd mcp-server
node index.js
```

Сервер будет работать в режиме stdio и принимать запросы от AI-клиентов.

### Примеры запросов к AI

После подключения MCP-сервера к AI-клиенту, вы можете писать запросы на естественном языке:

**Клиенты:**
- "Найди всех клиентов с телефоном +79991234567"
- "Создай нового клиента: Анна Сидорова, телефон +79161112233"
- "Покажи информацию о клиенте ID 42"

**Абонементы:**
- "Какие абонементы есть у клиента ID 42?"
- "Заморозь абонемент клиента ID 42 на 14 дней"
- "Оформи абонемент ID 5 клиенту ID 42"

**Расписание:**
- "Какие занятия запланированы на завтра?"
- "Запиши клиента ID 42 на занятие ID 100"
- "Создай занятие по йоге в зале 3 на 20 января в 18:00"

**Аналитика:**
- "Сколько платежей поступило за эту неделю?"
- "Покажи всех клиентов, которые не были на занятиях последний месяц"

## 🔌 Интеграция с AI-клиентами

### Claude Desktop

1. Откройте Claude Desktop
2. Перейдите в: Claude → Settings → Developer → Edit Config
3. Добавьте в `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "listok-crm": {
      "command": "node",
      "args": ["/путь/к/mcp-server/index.js"],
      "env": {
        "LISTOK_DOMAIN": "an7236.listokcrm.ru",
        "LISTOK_TOKEN": "ваш_токен"
      }
    }
  }
}
```

4. Сохраните и перезапустите Claude Desktop
5. Проверьте подключение: напишите "проверь подключение к ListOk CRM"

### Cursor IDE

1. Откройте Cursor
2. Перейдите в: Settings → MCP → Add new MCP server
3. Заполните поля:
   - **Name:** `listok-crm`
   - **Type:** `stdio`
   - **Command:** `node /путь/к/mcp-server/index.js`
   - **Environment Variables:**
     - `LISTOK_DOMAIN` = `an7236.listokcrm.ru`
     - `LISTOK_TOKEN` = `ваш_токен`
4. Нажмите Save
5. Используйте в Cascade AI

### GitHub Copilot (VS Code)

1. Откройте VS Code
2. Создайте файл `.vscode/mcp.json` в корне проекта:

```json
{
  "servers": {
    "listok-crm": {
      "type": "stdio",
      "command": "node",
      "args": ["/путь/к/mcp-server/index.js"],
      "env": {
        "LISTOK_DOMAIN": "an7236.listokcrm.ru",
        "LISTOK_TOKEN": "ваш_токен"
      }
    }
  }
}
```

3. Перезапустите VS Code
4. Используйте в Copilot Chat с `@listok-crm`

### OpenAI Codex CLI

1. Установите Codex CLI:
   ```bash
   npm install -g @openai/codex
   ```

2. Создайте файл `~/.codex/config.json`:

```json
{
  "mcpServers": {
    "listok-crm": {
      "type": "stdio",
      "command": "node",
      "args": ["/путь/к/mcp-server/index.js"],
      "env": {
        "LISTOK_DOMAIN": "an7236.listokcrm.ru",
        "LISTOK_TOKEN": "ваш_токен"
      }
    }
  }
}
```

3. Запустите Codex:
   ```bash
   codex
   ```

4. Используйте инструменты через обычный чат

### Битрикс24

1. Откройте AI-ассистент в Битрикс24
2. Перейдите в настройки → "Подключения MCP" или "Внешние инструменты"
3. Добавьте новый MCP-сервер:
   - **URL:** `https://ваш-домен/Listok/mcp-server/`
   - **Токен:** ваш Bearer-токен из настроек приложения
4. Сохраните и проверьте подключение

**Важно:** Для Битрикс24 требуется HTTPS и доступность сервера из интернета.

## 🛠️ Доступные инструменты

### Клиенты (Contacts)

| Инструмент | Описание |
|------------|----------|
| `listok_list_contacts` | Получить список клиентов с фильтрацией |
| `listok_get_contact` | Получить данные клиента по ID |
| `listok_create_contact` | Создать нового клиента |
| `listok_update_contact` | Обновить данные клиента |

### Абонементы (Passes)

| Инструмент | Описание |
|------------|----------|
| `listok_list_passes` | Получить список абонементов |
| `listok_list_contact_passes` | Получить абонементы клиента |
| `listok_issue_pass` | Оформить абонемент клиенту |
| `listok_freeze_pass` | Заморозить абонемент |
| `listok_unfreeze_pass` | Разморозить абонемент |
| `listok_generate_pass_payment_link` | Сгенерировать ссылку на оплату |

### Занятия (Events)

| Инструмент | Описание |
|------------|----------|
| `listok_list_events` | Получить список занятий |
| `listok_get_event` | Получить данные занятия |
| `listok_create_event` | Создать занятие |
| `listok_update_event` | Редактировать занятие |
| `listok_delete_event` | Удалить занятие |

### Записи (Listings)

| Инструмент | Описание |
|------------|----------|
| `listok_list_contact_listings` | Получить записи клиента |
| `listok_create_listing` | Записать клиента на занятие |
| `listok_delete_listing` | Отменить запись |

### Посещения (Admissions)

| Инструмент | Описание |
|------------|----------|
| `listok_list_contact_admissions` | Получить посещения клиента |
| `listok_create_admission` | Отметить посещение |
| `listok_delete_admission` | Отменить посещение |

### Платежи (Payments)

| Инструмент | Описание |
|------------|----------|
| `listok_list_payments` | Получить список платежей |
| `listok_list_contact_payments` | Получить платежи клиента |

### Группы (Groups)

| Инструмент | Описание |
|------------|----------|
| `listok_list_groups` | Получить список групп |
| `listok_get_group` | Получить данные группы |
| `listok_create_group` | Создать группу |

### Сотрудники (Employees)

| Инструмент | Описание |
|------------|----------|
| `listok_list_teachers` | Получить список преподавателей |
| `listok_list_managers` | Получить список менеджеров |

### Справочники

| Инструмент | Описание |
|------------|----------|
| `listok_list_offices` | Получить список филиалов |
| `listok_list_rooms` | Получить список залов |
| `listok_list_group_types` | Получить список направлений |
| `listok_list_interests` | Получить справочник интересов |
| `listok_list_sicknesses` | Получить справочник противопоказаний |
| `listok_list_sources` | Получить список источников |
| `listok_list_payment_categories` | Получить категории платежей |
| `listok_list_custom_fields` | Получить кастомные поля |

### Заметки (Notes)

| Инструмент | Описание |
|------------|----------|
| `listok_list_contact_notes` | Получить заметки клиента |
| `listok_create_contact_note` | Создать заметку |

### Бонусы (Bonuses)

| Инструмент | Описание |
|------------|----------|
| `listok_add_bonuses` | Начислить бонусы клиенту |
| `listok_list_contact_bonuses` | Получить историю бонусов |

### Webhooks

| Инструмент | Описание |
|------------|----------|
| `listok_create_webhook` | Создать webhook-подписку |
| `listok_get_webhook` | Получить текущую подписку |

## 🌐 Веб-интерфейс

### Структура страниц

```
/Listok/
├── index.html              # Главное приложение
├── oauth-callback.html     # Обработка OAuth callback
├── oauth-proxy.php         # Прокси для OAuth (обходит CORS)
├── assets/                 # Статические файлы (CSS, JS)
└── mcp-server/             # MCP-сервер для скачивания
    ├── index.js            # Основной файл сервера
    ├── package.json        # Зависимости
    └── README.md           # Документация сервера
```

### Функции веб-интерфейса

- **OAuth авторизация** — автоматическое получение токена через браузер
- **Просмотр документации** — все инструменты и их параметры
- **Примеры использования** — готовые запросы к AI
- **Инструкции по подключению** — для всех AI-клиентов
- **Копирование конфигурации** — одной кнопкой
- **Статистика** — основные показатели из CRM

## 🔧 Troubleshooting

### Веб-приложение

**Проблема:** Белый экран после загрузки
**Решение:** Проверьте, что файлы загружены в правильную папку и пути к `assets/` корректны

**Проблема:** Ошибка CORS при авторизации
**Решение:** Убедитесь, что `oauth-proxy.php` загружен и PHP работает

**Проблема:** OAuth не работает, ошибка "invalid_client"
**Решение:** Проверьте, что Redirect URI в ListOk CRM точно совпадает с URL в настройках приложения

**Проблема:** Кнопка "Копировать токен" не работает
**Решение:** Используйте HTTPS или обновите браузер

### MCP-сервер

**Проблема:** Ошибка "Cannot find module '@modelcontextprotocol/sdk'"
**Решение:** Выполните `npm install` в папке `mcp-server/`

**Проблема:** Ошибка "LISTOK_DOMAIN is not defined"
**Решение:** Установите переменные окружения `LISTOK_DOMAIN` и `LISTOK_TOKEN`

**Проблема:** Ошибка "API error: 401"
**Решение:** Проверьте, что токен действителен и не истёк

**Проблема:** AI-клиент не видит MCP-сервер
**Решение:** Проверьте путь к `index.js` в конфигурации и перезапустите AI-клиент

**Проблема:** Битрикс24 не может подключиться
**Решение:** Убедитесь, что сервер доступен по HTTPS и URL указан правильно

### Общие проблемы

**Проблема:** Токен истёк
**Решение:** Пройдите авторизацию заново в настройках приложения

**Проблема:** Ошибка "Failed to fetch"
**Решение:** Проверьте подключение к интернету и доступность API ListOk CRM

**Проблема:** Конфликт портов
**Решение:** Измените порт в конфигурации или остановите другой процесс

## 🔒 Безопасность

### Рекомендации

1. **Используйте HTTPS** — особенно для Битрикс24 и удалённого доступа
2. **Не коммитьте токены в Git** — используйте `.env` файлы и добавьте их в `.gitignore`
3. **Ограничьте права доступа** — запускайте MCP-сервер от непривилегированного пользователя
4. **Регулярно обновляйте зависимости** — выполняйте `npm audit` и `npm update`
5. **Используйте firewall** — ограничьте доступ к серверу только с доверенных IP
6. **Мониторьте логи** — отслеживайте подозрительную активность

### Хранение токенов

**Веб-приложение:**
- Токены хранятся в `localStorage` браузера
- Очищаются при нажатии "Отключить"
- Не передаются на сторонние серверы

**MCP-сервер:**
- Токены передаются через переменные окружения
- Не сохраняются в файлах
- Используются только для запросов к API ListOk CRM

### OAuth безопасность

- Redirect URI должен точно совпадать в настройках
- Код авторизации одноразовый и живёт ~10 минут
- Токены имеют ограниченный срок действия
- Используйте HTTPS для защиты данных

## 📄 Лицензия

MIT License

Copyright (c) 2026 ТУРНИКС & ListOk CRM

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## 🤝 Поддержка

- **Документация API ListOk CRM:** https://api.listokcrm.ru/
- **Поддержка ListOk CRM:** через чат в панели управления
- **Вопросы по MCP:** создайте issue в репозитории проекта

## 📝 Changelog

### Версия 1.0.0 (2026)

- ✅ Первоначальный релиз
- ✅ OAuth 2.0 авторизация
- ✅ 40+ MCP инструментов
- ✅ Поддержка Claude Desktop, Cursor, Codex CLI, Битрикс24
- ✅ Веб-интерфейс с документацией
- ✅ PHP прокси для обхода CORS
- ✅ Поддержка webhook-событий

---

**Разработано с ❤️ для ТУРНИКС & ListOk CRM**
