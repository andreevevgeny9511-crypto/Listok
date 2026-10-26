export const mcpServerCode = `import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

// Конфигурация
const LISTOK_DOMAIN = process.env.LISTOK_DOMAIN; // yourdomain.listokcrm.ru
const LISTOK_TOKEN = process.env.LISTOK_TOKEN;   // Bearer токен

const BASE_URL = \`https://\${LISTOK_DOMAIN}/api/external/v2\`;

async function listokRequest(
  method: string,
  path: string,
  body?: Record<string, unknown>
) {
  const url = \`\${BASE_URL}\${path}\`;
  const options: RequestInit = {
    method,
    headers: {
      Authorization: \`Bearer \${LISTOK_TOKEN}\`,
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-Requested-With": "XMLHttpRequest",
    },
  };
  if (body && method !== "GET") {
    options.body = JSON.stringify(body);
  }
  const response = await fetch(url, options);
  if (response.status === 204) return { success: true };
  if (!response.ok) {
    throw new Error(\`API error: \${response.status} \${await response.text()}\`);
  }
  return response.json();
}

// Определение всех MCP инструментов
const TOOLS = [
  // === КЛИЕНТЫ ===
  {
    name: "listok_list_contacts",
    description: "Получить список клиентов CRM с фильтрацией",
    inputSchema: {
      type: "object" as const,
      properties: {
        page: { type: "number", description: "Номер страницы" },
        name: { type: "string", description: "Фильтр по ФИО" },
        phone: { type: "string", description: "Фильтр по телефону" },
        email: { type: "string", description: "Фильтр по email" },
        since_id: { type: "number", description: "ID > указанного" },
        includes: { type: "string", description: "Доп. сущности: passes" },
      },
      required: ["page"],
    },
  },
  {
    name: "listok_get_contact",
    description: "Получить данные клиента по ID",
    inputSchema: {
      type: "object" as const,
      properties: {
        contact_id: { type: "number", description: "ID клиента" },
      },
      required: ["contact_id"],
    },
  },
  {
    name: "listok_create_contact",
    description: "Создать нового клиента",
    inputSchema: {
      type: "object" as const,
      properties: {
        name: { type: "string", description: "ФИО клиента" },
        phone: { type: "string", description: "Телефон" },
        email: { type: "string", description: "Email" },
        birth_date: { type: "string", description: "Дата рождения (YYYY-MM-DD)" },
        gender: { type: "string", description: "Пол" },
        note: { type: "string", description: "Заметка" },
        source_id: { type: "number", description: "ID источника" },
        interest: { type: "string", description: "Интересы" },
        sickness: { type: "string", description: "Противопоказания" },
      },
      required: ["name"],
    },
  },
  {
    name: "listok_update_contact",
    description: "Обновить данные клиента",
    inputSchema: {
      type: "object" as const,
      properties: {
        contact_id: { type: "number", description: "ID клиента" },
        name: { type: "string", description: "ФИО" },
        phone: { type: "string", description: "Телефон" },
        email: { type: "string", description: "Email" },
        birth_date: { type: "string", description: "Дата рождения" },
        note: { type: "string", description: "Заметка" },
      },
      required: ["contact_id"],
    },
  },
  // === АБОНЕМЕНТЫ ===
  {
    name: "listok_list_passes",
    description: "Получить список абонементов",
    inputSchema: {
      type: "object" as const,
      properties: {
        page: { type: "number", description: "Номер страницы" },
      },
      required: ["page"],
    },
  },
  {
    name: "listok_list_contact_passes",
    description: "Получить абонементы клиента",
    inputSchema: {
      type: "object" as const,
      properties: {
        contact_id: { type: "number", description: "ID клиента" },
        status: { type: "string", description: "Статус: active,expired,frozen,inactive,revoked" },
      },
      required: ["contact_id"],
    },
  },
  {
    name: "listok_issue_pass",
    description: "Оформить абонемент клиенту",
    inputSchema: {
      type: "object" as const,
      properties: {
        contact_id: { type: "number", description: "ID клиента" },
        pass_id: { type: "number", description: "ID абонемента" },
      },
      required: ["contact_id", "pass_id"],
    },
  },
  {
    name: "listok_freeze_pass",
    description: "Заморозить абонемент клиента",
    inputSchema: {
      type: "object" as const,
      properties: {
        contact_id: { type: "number", description: "ID клиента" },
        pass_contact_id: { type: "number", description: "ID абонемента клиента" },
        freeze_days: { type: "number", description: "Срок заморозки в днях" },
      },
      required: ["contact_id", "pass_contact_id"],
    },
  },
  {
    name: "listok_unfreeze_pass",
    description: "Разморозить абонемент клиента",
    inputSchema: {
      type: "object" as const,
      properties: {
        contact_id: { type: "number", description: "ID клиента" },
        pass_contact_id: { type: "number", description: "ID абонемента клиента" },
      },
      required: ["contact_id", "pass_contact_id"],
    },
  },
  // === ЗАНЯТИЯ ===
  {
    name: "listok_list_events",
    description: "Получить список занятий на дату/период",
    inputSchema: {
      type: "object" as const,
      properties: {
        date: { type: "string", description: "Дата (YYYY-MM-DD)" },
        from: { type: "string", description: "Начало периода" },
        to: { type: "string", description: "Конец периода" },
        includes: { type: "string", description: "listings,admissions,queue" },
      },
    },
  },
  {
    name: "listok_get_event",
    description: "Получить данные занятия по ID",
    inputSchema: {
      type: "object" as const,
      properties: {
        event_id: { type: "number", description: "ID занятия" },
      },
      required: ["event_id"],
    },
  },
  {
    name: "listok_create_event",
    description: "Создать занятие",
    inputSchema: {
      type: "object" as const,
      properties: {
        office_id: { type: "number", description: "ID филиала" },
        group_id: { type: "number", description: "ID группы" },
        room_id: { type: "number", description: "ID зала" },
        contact_id: { type: "number", description: "ID преподавателя" },
        date: { type: "string", description: "Дата (YYYY-MM-DD)" },
        start_time: { type: "string", description: "Время (HH:MM)" },
        event_comment: { type: "string", description: "Комментарий" },
      },
      required: ["office_id", "group_id", "room_id", "date", "start_time"],
    },
  },
  {
    name: "listok_delete_event",
    description: "Удалить занятие",
    inputSchema: {
      type: "object" as const,
      properties: {
        event_id: { type: "number", description: "ID занятия" },
      },
      required: ["event_id"],
    },
  },
  // === ЗАПИСИ И ПОСЕЩЕНИЯ ===
  {
    name: "listok_create_listing",
    description: "Записать клиента на занятие",
    inputSchema: {
      type: "object" as const,
      properties: {
        contact_id: { type: "number", description: "ID клиента" },
        event_id: { type: "number", description: "ID занятия" },
      },
      required: ["contact_id", "event_id"],
    },
  },
  {
    name: "listok_delete_listing",
    description: "Отменить запись клиента",
    inputSchema: {
      type: "object" as const,
      properties: {
        contact_id: { type: "number", description: "ID клиента" },
        event_id: { type: "number", description: "ID занятия" },
      },
      required: ["contact_id", "event_id"],
    },
  },
  {
    name: "listok_create_admission",
    description: "Отметить посещение клиента",
    inputSchema: {
      type: "object" as const,
      properties: {
        contact_id: { type: "number", description: "ID клиента" },
        event_id: { type: "number", description: "ID занятия" },
      },
      required: ["contact_id", "event_id"],
    },
  },
  {
    name: "listok_delete_admission",
    description: "Снять клиента с занятия",
    inputSchema: {
      type: "object" as const,
      properties: {
        contact_id: { type: "number", description: "ID клиента" },
        event_id: { type: "number", description: "ID занятия" },
      },
      required: ["contact_id", "event_id"],
    },
  },
  // === ПЛАТЕЖИ ===
  {
    name: "listok_list_payments",
    description: "Получить список платежей",
    inputSchema: {
      type: "object" as const,
      properties: {
        page: { type: "number", description: "Номер страницы" },
        date: { type: "string", description: "Дата" },
        from: { type: "string", description: "Начало периода" },
        to: { type: "string", description: "Конец периода" },
        direction: { type: "string", description: "income или expense" },
      },
      required: ["page"],
    },
  },
  {
    name: "listok_list_contact_payments",
    description: "Получить платежи клиента",
    inputSchema: {
      type: "object" as const,
      properties: {
        contact_id: { type: "number", description: "ID клиента" },
        page: { type: "number", description: "Номер страницы" },
        direction: { type: "string", description: "income или expense" },
      },
      required: ["contact_id", "page"],
    },
  },
  // === ГРУППЫ ===
  {
    name: "listok_list_groups",
    description: "Получить список групп",
    inputSchema: {
      type: "object" as const,
      properties: {
        page: { type: "number", description: "Номер страницы" },
      },
      required: ["page"],
    },
  },
  {
    name: "listok_create_group",
    description: "Создать группу",
    inputSchema: {
      type: "object" as const,
      properties: {
        name: { type: "string", description: "Название" },
        duration: { type: "number", description: "Длительность (мин)" },
        group_type_id: { type: "number", description: "ID направления" },
        office_id: { type: "number", description: "ID филиала" },
        employee_id: { type: "number", description: "ID преподавателя" },
        max_attendance_limit: { type: "number", description: "Макс. людей (0=без лимита)" },
      },
      required: ["name", "duration"],
    },
  },
  // === СОТРУДНИКИ ===
  {
    name: "listok_list_teachers",
    description: "Получить список преподавателей",
    inputSchema: {
      type: "object" as const,
      properties: {
        page: { type: "number", description: "Номер страницы" },
      },
      required: ["page"],
    },
  },
  {
    name: "listok_list_managers",
    description: "Получить список менеджеров",
    inputSchema: {
      type: "object" as const,
      properties: {
        page: { type: "number", description: "Номер страницы" },
        name: { type: "string", description: "Фильтр по имени" },
      },
      required: ["page"],
    },
  },
  // === СПРАВОЧНИКИ ===
  {
    name: "listok_list_offices",
    description: "Получить список филиалов",
    inputSchema: {
      type: "object" as const,
      properties: { page: { type: "number" } },
      required: ["page"],
    },
  },
  {
    name: "listok_list_rooms",
    description: "Получить список залов",
    inputSchema: {
      type: "object" as const,
      properties: { page: { type: "number" } },
      required: ["page"],
    },
  },
  {
    name: "listok_list_group_types",
    description: "Получить список направлений",
    inputSchema: {
      type: "object" as const,
      properties: { page: { type: "number" } },
      required: ["page"],
    },
  },
  {
    name: "listok_list_interests",
    description: "Получить справочник интересов",
    inputSchema: {
      type: "object" as const,
      properties: { page: { type: "number" } },
      required: ["page"],
    },
  },
  {
    name: "listok_list_sources",
    description: "Получить список источников",
    inputSchema: {
      type: "object" as const,
      properties: { page: { type: "number" } },
      required: ["page"],
    },
  },
  // === ЗАМЕТКИ ===
  {
    name: "listok_list_contact_notes",
    description: "Получить заметки клиента",
    inputSchema: {
      type: "object" as const,
      properties: {
        contact_id: { type: "number", description: "ID клиента" },
        page: { type: "number", description: "Номер страницы" },
      },
      required: ["contact_id", "page"],
    },
  },
  {
    name: "listok_create_contact_note",
    description: "Создать заметку клиента",
    inputSchema: {
      type: "object" as const,
      properties: {
        contact_id: { type: "number", description: "ID клиента" },
        text: { type: "string", description: "Текст заметки" },
      },
      required: ["contact_id", "text"],
    },
  },
  // === БОНУСЫ ===
  {
    name: "listok_add_bonuses",
    description: "Начислить бонусы клиенту",
    inputSchema: {
      type: "object" as const,
      properties: {
        contact_id: { type: "number", description: "ID клиента" },
        amount: { type: "number", description: "Сумма бонусов" },
        reason: { type: "string", description: "Основание" },
        expires_in_days: { type: "number", description: "Срок действия (дни)" },
      },
      required: ["contact_id", "amount", "reason"],
    },
  },
];

// Обработка вызовов инструментов
async function handleToolCall(name: string, args: Record<string, unknown>) {
  switch (name) {
    // Клиенты
    case "listok_list_contacts": {
      const params = new URLSearchParams({ page: String(args.page) });
      if (args.name) params.set("name", String(args.name));
      if (args.phone) params.set("phone", String(args.phone));
      if (args.email) params.set("email", String(args.email));
      if (args.since_id) params.set("since_id", String(args.since_id));
      if (args.includes) params.set("includes", String(args.includes));
      return listokRequest("GET", \`/contacts?\${params}\`);
    }
    case "listok_get_contact":
      return listokRequest("GET", \`/contacts/\${args.contact_id}\`);
    case "listok_create_contact":
      return listokRequest("POST", "/contacts", args);
    case "listok_update_contact": {
      const { contact_id, ...data } = args;
      return listokRequest("PUT", \`/contacts/\${contact_id}\`, data);
    }
    // Абонементы
    case "listok_list_passes":
      return listokRequest("GET", \`/passes?page=\${args.page}\`);
    case "listok_list_contact_passes": {
      const params = new URLSearchParams();
      if (args.status) params.set("status", String(args.status));
      return listokRequest("GET", \`/contacts/\${args.contact_id}/passes?\${params}\`);
    }
    case "listok_issue_pass":
      return listokRequest("POST", \`/contacts/\${args.contact_id}/passes/\${args.pass_id}\`);
    case "listok_freeze_pass":
      return listokRequest("POST", \`/contacts/\${args.contact_id}/passes/\${args.pass_contact_id}/freeze\`, args);
    case "listok_unfreeze_pass":
      return listokRequest("POST", \`/contacts/\${args.contact_id}/passes/\${args.pass_contact_id}/unfreeze\`);
    // Занятия
    case "listok_list_events": {
      const params = new URLSearchParams();
      if (args.date) params.set("date", String(args.date));
      if (args.from) params.set("from", String(args.from));
      if (args.to) params.set("to", String(args.to));
      if (args.includes) params.set("includes", String(args.includes));
      return listokRequest("GET", \`/events?\${params}\`);
    }
    case "listok_get_event":
      return listokRequest("GET", \`/events/\${args.event_id}\`);
    case "listok_create_event":
      return listokRequest("POST", "/events", args);
    case "listok_delete_event":
      return listokRequest("DELETE", \`/events/\${args.event_id}\`);
    // Записи и посещения
    case "listok_create_listing":
      return listokRequest("POST", \`/contacts/\${args.contact_id}/listings/\${args.event_id}\`);
    case "listok_delete_listing":
      return listokRequest("DELETE", \`/contacts/\${args.contact_id}/listings/\${args.event_id}\`);
    case "listok_create_admission":
      return listokRequest("POST", \`/contacts/\${args.contact_id}/admissions/\${args.event_id}\`);
    case "listok_delete_admission":
      return listokRequest("DELETE", \`/contacts/\${args.contact_id}/admissions/\${args.event_id}\`);
    // Платежи
    case "listok_list_payments": {
      const params = new URLSearchParams({ page: String(args.page) });
      if (args.date) params.set("date", String(args.date));
      if (args.from) params.set("from", String(args.from));
      if (args.to) params.set("to", String(args.to));
      if (args.direction) params.set("direction", String(args.direction));
      return listokRequest("GET", \`/payments?\${params}\`);
    }
    case "listok_list_contact_payments": {
      const params = new URLSearchParams({ page: String(args.page) });
      if (args.direction) params.set("direction", String(args.direction));
      return listokRequest("GET", \`/contacts/\${args.contact_id}/payments?\${params}\`);
    }
    // Группы
    case "listok_list_groups":
      return listokRequest("GET", \`/groups?page=\${args.page}\`);
    case "listok_create_group":
      return listokRequest("POST", "/groups", args);
    // Сотрудники
    case "listok_list_teachers":
      return listokRequest("GET", \`/employees/teachers?page=\${args.page}\`);
    case "listok_list_managers": {
      const params = new URLSearchParams({ page: String(args.page) });
      if (args.name) params.set("name", String(args.name));
      return listokRequest("GET", \`/employees/managers?\${params}\`);
    }
    // Справочники
    case "listok_list_offices":
      return listokRequest("GET", \`/offices?page=\${args.page}\`);
    case "listok_list_rooms":
      return listokRequest("GET", \`/rooms?page=\${args.page}\`);
    case "listok_list_group_types":
      return listokRequest("GET", \`/group-types?page=\${args.page}\`);
    case "listok_list_interests":
      return listokRequest("GET", \`/interests?page=\${args.page}\`);
    case "listok_list_sources":
      return listokRequest("GET", \`/sources?page=\${args.page}\`);
    // Заметки
    case "listok_list_contact_notes":
      return listokRequest("GET", \`/contacts/\${args.contact_id}/notes?page=\${args.page}\`);
    case "listok_create_contact_note":
      return listokRequest("POST", \`/contacts/\${args.contact_id}/notes\`, { text: args.text });
    // Бонусы
    case "listok_add_bonuses":
      return listokRequest("POST", \`/contacts/\${args.contact_id}/bonuses\`, args);
    default:
      throw new Error(\`Unknown tool: \${name}\`);
  }
}

// Создание MCP сервера
const server = new Server(
  { name: "listok-crm-mcp", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

// Обработчик списка инструментов
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: TOOLS,
}));

// Обработчик вызова инструментов
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  try {
    const result = await handleToolCall(
      request.params.name,
      request.params.arguments ?? {}
    );
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  } catch (error) {
    return {
      content: [{ type: "text", text: \`Error: \${error}\` }],
      isError: true,
    };
  }
});

// Запуск сервера
async function main() {
  if (!LISTOK_DOMAIN || !LISTOK_TOKEN) {
    console.error("Необходимо установить переменные окружения:");
    console.error("  LISTOK_DOMAIN=yourdomain.listokcrm.ru");
    console.error("  LISTOK_TOKEN=your_bearer_token");
    process.exit(1);
  }
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("ListOk CRM MCP Server запущен");
}

main().catch(console.error);`;
