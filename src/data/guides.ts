export const usageExamples = [
  {
    category: "🔍 Поиск и просмотр клиентов",
    examples: [
      {
        prompt: "Найди всех клиентов с телефоном +79991234567",
        tool: "listok_list_contacts",
        args: '{ "phone": "+79991234567", "page": 1 }',
        description: "AI вызовет инструмент для поиска клиента по номеру телефона",
      },
      {
        prompt: "Покажи информацию о клиенте ID 42",
        tool: "listok_get_contact",
        args: '{ "contact_id": 42 }',
        description: "Получение полной карточки клиента",
      },
      {
        prompt: "Сколько всего клиентов в CRM?",
        tool: "listok_list_contacts",
        args: '{ "page": 1 }',
        description: "AI получит первую страницу и посчитает total из пагинации",
      },
      {
        prompt: "Покажи клиентов, которые были изменены за последнюю неделю",
        tool: "listok_list_contacts",
        args: '{ "updated_at_from": "2025-01-10T00:00:00Z", "updated_at_to": "2025-01-17T23:59:59Z", "page": 1 }',
        description: "Фильтрация по дате обновления",
      },
    ],
  },
  {
    category: "📝 Создание и редактирование",
    examples: [
      {
        prompt: "Создай нового клиента: Анна Сидорова, телефон +79161112233, email anna@mail.ru",
        tool: "listok_create_contact",
        args: '{ "name": "Сидорова Анна", "phone": "+79161112233", "email": "anna@mail.ru" }',
        description: "Создание клиента в CRM",
      },
      {
        prompt: "Обнови телефон клиента ID 42 на +79998887766",
        tool: "listok_update_contact",
        args: '{ "contact_id": 42, "phone": "+79998887766" }',
        description: "Обновление данных клиента",
      },
      {
        prompt: "Добавь заметку клиенту ID 42: 'Позвонить после тренировки'",
        tool: "listok_create_contact_note",
        args: '{ "contact_id": 42, "text": "Позвонить после тренировки" }',
        description: "Создание заметки в карточке клиента",
      },
    ],
  },
  {
    category: "📅 Расписание и записи",
    examples: [
      {
        prompt: "Какие занятия запланированы на завтра?",
        tool: "listok_list_events",
        args: '{ "date": "2025-01-18" }',
        description: "Получение расписания на конкретную дату",
      },
      {
        prompt: "Покажи занятия с 20 по 25 января",
        tool: "listok_list_events",
        args: '{ "from": "2025-01-20", "to": "2025-01-25" }',
        description: "Расписание на период (макс. 31 день)",
      },
      {
        prompt: "Запиши клиента ID 42 на занятие ID 100",
        tool: "listok_create_listing",
        args: '{ "contact_id": 42, "event_id": 100 }',
        description: "Запись клиента на занятие",
      },
      {
        prompt: "Отметь что клиент ID 42 посетил занятие ID 100",
        tool: "listok_create_admission",
        args: '{ "contact_id": 42, "event_id": 100 }',
        description: "Отметка посещения",
      },
      {
        prompt: "Создай занятие по йоге в зале 3 на 20 января в 18:00",
        tool: "listok_create_event",
        args: '{ "office_id": 1, "group_id": 5, "room_id": 3, "date": "2025-01-20", "start_time": "18:00" }',
        description: "Создание нового занятия",
      },
    ],
  },
  {
    category: "💳 Абонементы и платежи",
    examples: [
      {
        prompt: "Какие абонементы есть у клиента ID 42?",
        tool: "listok_list_contact_passes",
        args: '{ "contact_id": 42 }',
        description: "Список абонементов клиента",
      },
      {
        prompt: "Оформи абонемент ID 5 клиенту ID 42",
        tool: "listok_issue_pass",
        args: '{ "contact_id": 42, "pass_id": 5 }',
        description: "Оформление абонемента",
      },
      {
        prompt: "Заморозь абонемент клиента ID 42 на 14 дней",
        tool: "listok_freeze_pass",
        args: '{ "contact_id": 42, "pass_contact_id": 312, "freeze_days": 14 }',
        description: "Заморозка абонемента",
      },
      {
        prompt: "Сколько платежей поступило за эту неделю?",
        tool: "listok_list_payments",
        args: '{ "from": "2025-01-13", "to": "2025-01-19", "direction": "income", "page": 1 }',
        description: "Финансовая статистика",
      },
      {
        prompt: "Начисли 500 бонусов клиенту ID 42 за рекомендацию",
        tool: "listok_add_bonuses",
        args: '{ "contact_id": 42, "amount": 500, "reason": "Рекомендация друга" }',
        description: "Начисление бонусов",
      },
    ],
  },
  {
    category: "📊 Аналитика и отчёты",
    examples: [
      {
        prompt: "Сколько клиентов записано на завтрашние занятия?",
        tool: "listok_list_events",
        args: '{ "date": "2025-01-18", "includes": "listings" }',
        description: "AI посчитает количество записей по всем занятиям",
      },
      {
        prompt: "Покажи все свободные группы",
        tool: "listok_list_groups",
        args: '{ "page": 1 }',
        description: "Список групп с информацией о заполненности",
      },
      {
        prompt: "Кто из преподавателей ведёт занятия в понедельник?",
        tool: "listok_list_events",
        args: '{ "date": "2025-01-20", "includes": "listings,admissions" }',
        description: "Расписание с преподавателями",
      },
    ],
  },
];

export const deploySteps = [
  {
    title: "Подготовка проекта",
    icon: "📦",
    steps: [
      {
        code: `# Создаём директорию проекта
mkdir listok-crm-mcp && cd listok-crm-mcp

# Инициализируем npm проект
npm init -y

# Устанавливаем зависимости
npm install @modelcontextprotocol/sdk
npm install -D typescript @types/node tsx

# Создаём tsconfig.json
cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "Node16",
    "moduleResolution": "Node16",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*"]
}
EOF`,
        description: "Создание структуры проекта с TypeScript конфигурацией",
      },
    ],
  },
  {
    title: "Создание исходного кода",
    icon: "📝",
    steps: [
      {
        code: `mkdir -p src

# Скопируйте код MCP сервера из вкладки "Код сервера"
# и сохраните в файл src/index.ts
# Или скачайте из репозитория:
# git clone https://github.com/your-org/listok-crm-mcp.git`,
        description: "Создание директории src и добавление кода сервера",
      },
    ],
  },
  {
    title: "Сборка проекта",
    icon: "🔨",
    steps: [
      {
        code: `# Компиляция TypeScript
npx tsc

# Проверка что файл создан
ls -la dist/index.js`,
        description: "Компиляция TypeScript в JavaScript",
      },
    ],
  },
  {
    title: "Деплой на VPS (Ubuntu/Debian)",
    icon: "🖥️",
    steps: [
      {
        code: `# === На сервере ===

# 1. Установите Node.js 20+
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# 2. Создайте пользователя для MCP
sudo useradd -m -s /bin/bash mcp-user

# 3. Создайте директорию
sudo mkdir -p /opt/listok-crm-mcp
sudo chown mcp-user:mcp-user /opt/listok-crm-mcp

# 4. Скопируйте файлы на сервер
scp -r dist/ package.json package-lock.json mcp-user@your-server:/opt/listok-crm-mcp/

# 5. Установите зависимости на сервере
ssh mcp-user@your-server
cd /opt/listok-crm-mcp
npm install --production`,
        description: "Установка Node.js и подготовка сервера",
      },
    ],
  },
  {
    title: "Создание systemd сервиса",
    icon: "⚙️",
    steps: [
      {
        code: `# /etc/systemd/system/listok-mcp.service

[Unit]
Description=ListOk CRM MCP Server
After=network.target

[Service]
Type=simple
User=mcp-user
WorkingDirectory=/opt/listok-crm-mcp
Environment=LISTOK_DOMAIN=yourdomain.listokcrm.ru
Environment=LISTOK_TOKEN=your_bearer_token_here
ExecStart=/usr/bin/node /opt/listok-crm-mcp/dist/index.js
Restart=always
RestartSec=5
StandardError=journal

# Безопасность
NoNewPrivileges=true
ProtectSystem=strict
ProtectHome=true
ReadWritePaths=/opt/listok-crm-mcp

[Install]
WantedBy=multi-user.target`,
        description: "Systemd unit файл для автозапуска",
      },
      {
        code: `# Активация и запуск сервиса
sudo systemctl daemon-reload
sudo systemctl enable listok-mcp
sudo systemctl start listok-mcp

# Проверка статуса
sudo systemctl status listok-mcp

# Просмотр логов
sudo journalctl -u listok-mcp -f`,
        description: "Запуск и проверка сервиса",
      },
    ],
  },
  {
    title: "Деплой через Docker",
    icon: "🐳",
    steps: [
      {
        code: `# Dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --production

COPY dist/ ./dist/

ENV LISTOK_DOMAIN=""
ENV LISTOK_TOKEN=""

USER node

ENTRYPOINT ["node", "dist/index.js"]`,
        description: "Dockerfile для контейнеризации",
      },
      {
        code: `# docker-compose.yml
version: "3.8"

services:
  listok-mcp:
    build: .
    container_name: listok-crm-mcp
    restart: unless-stopped
    environment:
      - LISTOK_DOMAIN=\${LISTOK_DOMAIN}
      - LISTOK_TOKEN=\${LISTOK_TOKEN}
    stdin_open: true   # Важно для stdio транспорта
    tty: true`,
        description: "Docker Compose конфигурация",
      },
      {
        code: `# Запуск
docker compose up -d

# Проверка логов
docker compose logs -f

# .env файл
LISTOK_DOMAIN=yourdomain.listokcrm.ru
LISTOK_TOKEN=your_bearer_token_here`,
        description: "Запуск контейнера",
      },
    ],
  },
  {
    title: "Деплой на Railway / Render / Fly.io",
    icon: "☁️",
    steps: [
      {
        code: `# === Railway ===
# 1. railway init
# 2. railway up
# 3. Добавить переменные в dashboard:
#    LISTOK_DOMAIN, LISTOK_TOKEN

# === Fly.io ===
fly launch --name listok-mcp
fly secrets set LISTOK_DOMAIN=yourdomain.listokcrm.ru
fly secrets set LISTOK_TOKEN=your_bearer_token
fly deploy

# === Render ===
# 1. Подключить Git репозиторий
# 2. Build Command: npm install && npx tsc
# 3. Start Command: node dist/index.js
# 4. Добавить Environment Variables`,
        description: "Деплой на PaaS платформы",
      },
    ],
  },
];

export const codexIntegration = {
  title: "Подключение к Codex",
  description: "OpenAI Codex, GitHub Copilot и другие AI-агенты поддерживают MCP протокол",
  sections: [
    {
      title: "OpenAI Codex CLI",
      icon: "🤖",
      description: "Codex CLI от OpenAI поддерживает MCP серверы через конфигурационный файл",
      config: {
        filename: "~/.codex/config.json (или project-level .codex/config.json)",
        content: `{
  "mcpServers": {
    "listok-crm": {
      "type": "stdio",
      "command": "node",
      "args": ["/opt/listok-crm-mcp/dist/index.js"],
      "env": {
        "LISTOK_DOMAIN": "yourdomain.listokcrm.ru",
        "LISTOK_TOKEN": "your_bearer_token"
      }
    }
  }
}`,
      },
      steps: [
        "Установите Codex CLI: `npm install -g @openai/codex`",
        "Создайте конфигурационный файл `~/.codex/config.json`",
        "Укажите путь к MCP серверу и переменные окружения",
        "Запустите Codex: `codex` — сервер подключится автоматически",
        "Используйте команды: `codex \"покажи клиентов из CRM\"`",
      ],
    },
    {
      title: "GitHub Copilot (VS Code)",
      icon: "🐙",
      description: "GitHub Copilot Chat в VS Code поддерживает MCP через расширение",
      config: {
        filename: ".vscode/mcp.json (в корне проекта)",
        content: `{
  "servers": {
    "listok-crm": {
      "type": "stdio",
      "command": "node",
      "args": ["/opt/listok-crm-mcp/dist/index.js"],
      "env": {
        "LISTOK_DOMAIN": "yourdomain.listokcrm.ru",
        "LISTOK_TOKEN": "your_bearer_token"
      }
    }
  }
}`,
      },
      steps: [
        "Обновите VS Code до последней версии",
        "Установите расширение GitHub Copilot Chat",
        "Создайте файл `.vscode/mcp.json` в корне проекта",
        "Перезапустите VS Code",
        "В Copilot Chat используйте @listok-crm для вызова инструментов",
      ],
    },
    {
      title: "Cursor IDE",
      icon: "⚡",
      description: "Cursor полностью поддерживает MCP серверы",
      config: {
        filename: ".cursor/mcp.json (в корне проекта)",
        content: `{
  "mcpServers": {
    "listok-crm": {
      "command": "node",
      "args": ["/opt/listok-crm-mcp/dist/index.js"],
      "env": {
        "LISTOK_DOMAIN": "yourdomain.listokcrm.ru",
        "LISTOK_TOKEN": "your_bearer_token"
      }
    }
  }
}`,
      },
      steps: [
        "Откройте Cursor IDE",
        "Перейдите в Settings → MCP",
        "Нажмите 'Add new MCP server'",
        "Выберите тип: stdio",
        "Укажите команду: `node /opt/listok-crm-mcp/dist/index.js`",
        "Добавьте переменные окружения LISTOK_DOMAIN и LISTOK_TOKEN",
        "Нажмите Save — сервер подключится",
      ],
    },
    {
      title: "Claude Desktop",
      icon: "🟠",
      description: "Claude Desktop — нативная поддержка MCP",
      config: {
        filename: "~/Library/Application Support/Claude/claude_desktop_config.json",
        content: `{
  "mcpServers": {
    "listok-crm": {
      "command": "node",
      "args": ["/opt/listok-crm-mcp/dist/index.js"],
      "env": {
        "LISTOK_DOMAIN": "yourdomain.listokcrm.ru",
        "LISTOK_TOKEN": "your_bearer_token"
      }
    }
  }
}`,
      },
      steps: [
        "Установите Claude Desktop",
        "Откройте настройки: Claude → Settings → Developer → Edit Config",
        "Добавьте конфигурацию MCP сервера",
        "Перезапустите Claude Desktop",
        "Используйте инструменты через обычный чат",
      ],
    },
    {
      title: "Windsurf (Codeium)",
      icon: "🏄",
      description: "Windsurf поддерживает MCP через конфигурацию",
      config: {
        filename: "~/.codeium/windsurf/mcp_config.json",
        content: `{
  "mcpServers": {
    "listok-crm": {
      "command": "node",
      "args": ["/opt/listok-crm-mcp/dist/index.js"],
      "env": {
        "LISTOK_DOMAIN": "yourdomain.listokcrm.ru",
        "LISTOK_TOKEN": "your_bearer_token"
      }
    }
  }
}`,
      },
      steps: [
        "Откройте Windsurf",
        "Перейдите в Windsurf Settings → MCP",
        "Добавьте новый MCP сервер",
        "Укажите команду и переменные окружения",
        "Подключите и используйте в Cascade",
      ],
    },
  ],
  remoteSetup: {
    title: "Удалённое подключение (SSE/HTTP)",
    description: "Если MCP сервер работает на удалённом сервере, используйте SSE транспорт",
    code: `// === Модификация сервера для HTTP/SSE транспорта ===
// Установите: npm install @modelcontextprotocol/sdk express

import express from "express";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";

const app = express();
const PORT = process.env.PORT || 3001;

let transport: SSEServerTransport;

app.get("/sse", async (req, res) => {
  transport = new SSEServerTransport("/messages", res);
  await server.connect(transport);
});

app.post("/messages", async (req, res) => {
  await transport.handlePostMessage(req, res);
});

app.listen(PORT, () => {
  console.log(\`MCP SSE Server running on port \${PORT}\`);
});`,
    clientConfig: `{
  "mcpServers": {
    "listok-crm-remote": {
      "type": "sse",
      "url": "https://your-server.com:3001/sse"
    }
  }
}`,
  },
};
