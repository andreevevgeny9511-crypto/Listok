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
    ],
  },
  {
    category: "📝 Создание и редактирование",
    examples: [
      {
        prompt: "Создай нового клиента: Анна Сидорова, телефон +79161112233",
        tool: "listok_create_contact",
        args: '{ "name": "Сидорова Анна", "phone": "+79161112233" }',
        description: "Создание клиента в CRM",
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
        prompt: "Запиши клиента ID 42 на занятие ID 100",
        tool: "listok_create_listing",
        args: '{ "contact_id": 42, "event_id": 100 }',
        description: "Запись клиента на занятие",
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
        prompt: "Заморозь абонемент клиента ID 42 на 14 дней",
        tool: "listok_freeze_pass",
        args: '{ "contact_id": 42, "pass_contact_id": 312, "freeze_days": 14 }',
        description: "Заморозка абонемента",
      },
    ],
  },
];

export const codexIntegration = {
  title: "Подключение к Codex и AI-агентам",
  description: "Инструкции по подключению MCP-сервера через графический интерфейс приложений",
  sections: [
    {
      title: "OpenAI Codex CLI",
      icon: "🤖",
      description: "Codex CLI — терминальный AI-агент от OpenAI с поддержкой MCP",
      steps: [
        {
          title: "Откройте терминал",
          description: "Запустите Terminal (macOS/Linux) или PowerShell (Windows)",
        },
        {
          title: "Установите Codex CLI",
          description: "Выполните команду установки глобально:",
          code: "npm install -g @openai/codex",
          lang: "bash",
        },
        {
          title: "Создайте конфигурационный файл",
          description: "Создайте файл ~/.codex/config.json (или .codex/config.json в проекте) со следующим содержимым:",
          code: `{
  "mcpServers": {
    "listok-crm": {
      "type": "stdio",
      "command": "node",
      "args": ["/путь/к/dist/index.js"],
      "env": {
        "LISTOK_DOMAIN": "yourdomain.listokcrm.ru",
        "LISTOK_TOKEN": "ваш_токен"
      }
    }
  }
}`,
          lang: "json",
        },
        {
          title: "Запустите Codex",
          description: "Теперь можно использовать Codex с доступом к ListOk CRM:",
          code: "codex",
          lang: "bash",
        },
        {
          title: "Используйте инструменты",
          description: "Просто пишите запросы на естественном языке — Codex автоматически вызовет нужные инструменты MCP",
        },
      ],
    },
    {
      title: "GitHub Copilot (VS Code)",
      icon: "🐙",
      description: "GitHub Copilot Chat в VS Code с поддержкой MCP-серверов",
      steps: [
        {
          title: "Откройте VS Code",
          description: "Запустите Visual Studio Code",
        },
        {
          title: "Установите расширение",
          description: "Перейдите в Extensions (Ctrl+Shift+X) и установите 'GitHub Copilot Chat'",
        },
        {
          title: "Создайте конфигурацию MCP",
          description: "В корне проекта создайте файл .vscode/mcp.json:",
          code: `{
  "servers": {
    "listok-crm": {
      "type": "stdio",
      "command": "node",
      "args": ["/путь/к/dist/index.js"],
      "env": {
        "LISTOK_DOMAIN": "yourdomain.listokcrm.ru",
        "LISTOK_TOKEN": "ваш_токен"
      }
    }
  }
}`,
          lang: "json",
        },
        {
          title: "Перезапустите VS Code",
          description: "Закройте и снова откройте VS Code для применения изменений",
        },
        {
          title: "Используйте в чате",
          description: "Откройте Copilot Chat (Ctrl+Alt+I) и используйте @listok-crm для вызова инструментов",
        },
      ],
    },
    {
      title: "Cursor IDE",
      icon: "⚡",
      description: "Cursor полностью поддерживает MCP через встроенный интерфейс настроек",
      steps: [
        {
          title: "Откройте Cursor",
          description: "Запустите Cursor IDE",
        },
        {
          title: "Перейдите в настройки MCP",
          description: "Откройте Settings (Cmd/Ctrl + ,) → раздел 'MCP' или 'Features' → 'MCP Servers'",
        },
        {
          title: "Добавьте новый сервер",
          description: "Нажмите 'Add new MCP server' и заполните поля:",
        },
        {
          title: "Укажите параметры",
          description: "Заполните конфигурацию:",
          code: `Name: listok-crm
Type: stdio
Command: node /путь/к/dist/index.js

Environment Variables:
  LISTOK_DOMAIN = yourdomain.listokcrm.ru
  LISTOK_TOKEN = ваш_токен`,
          lang: "text",
        },
        {
          title: "Сохраните и подключите",
          description: "Нажмите 'Save' — сервер автоматически подключится и будет доступен в Cascade AI",
        },
      ],
    },
    {
      title: "Claude Desktop",
      icon: "🟠",
      description: "Claude Desktop — нативная поддержка MCP с простым интерфейсом",
      steps: [
        {
          title: "Откройте Claude Desktop",
          description: "Запустите приложение Claude Desktop",
        },
        {
          title: "Откройте настройки",
          description: "Перейдите в меню: Claude → Settings (или Preferences) → Developer",
        },
        {
          title: "Редактируйте конфигурацию",
          description: "Нажмите 'Edit Config' — откроется файл claude_desktop_config.json",
        },
        {
          title: "Добавьте MCP-сервер",
          description: "Добавьте в файл следующую конфигурацию:",
          code: `{
  "mcpServers": {
    "listok-crm": {
      "command": "node",
      "args": ["/путь/к/dist/index.js"],
      "env": {
        "LISTOK_DOMAIN": "yourdomain.listokcrm.ru",
        "LISTOK_TOKEN": "ваш_токен"
      }
    }
  }
}`,
          lang: "json",
        },
        {
          title: "Сохраните и перезапустите",
          description: "Сохраните файл и перезапустите Claude Desktop. Сервер подключится автоматически",
        },
        {
          title: "Используйте в чате",
          description: "Теперь Claude может использовать инструменты ListOk CRM через обычный чат",
        },
      ],
    },
    {
      title: "Windsurf (Codeium)",
      icon: "🏄",
      description: "Windsurf поддерживает MCP через настройки Cascade AI",
      steps: [
        {
          title: "Откройте Windsurf",
          description: "Запустите Windsurf IDE",
        },
        {
          title: "Перейдите в настройки MCP",
          description: "Откройте Settings → раздел 'MCP' или 'Cascade'",
        },
        {
          title: "Добавьте новый сервер",
          description: "Нажмите 'Add MCP Server' и выберите тип 'stdio'",
        },
        {
          title: "Заполните конфигурацию",
          description: "Укажите параметры подключения:",
          code: `Command: node
Args: /путь/к/dist/index.js

Environment:
  LISTOK_DOMAIN=yourdomain.listokcrm.ru
  LISTOK_TOKEN=ваш_токен`,
          lang: "text",
        },
        {
          title: "Сохраните",
          description: "Нажмите 'Save' — сервер подключится и будет доступен в Cascade AI",
        },
      ],
    },
  ],
};
