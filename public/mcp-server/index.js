#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

const LISTOK_DOMAIN = process.env.LISTOK_DOMAIN;
const LISTOK_TOKEN = process.env.LISTOK_TOKEN;

if (!LISTOK_DOMAIN || !LISTOK_TOKEN) {
  console.error("Ошибка: Установите переменные окружения LISTOK_DOMAIN и LISTOK_TOKEN");
  process.exit(1);
}

const BASE_URL = `https://${LISTOK_DOMAIN}/api/external/v2`;

async function listokRequest(method, path, body = null) {
  const url = `${BASE_URL}${path}`;
  const options = {
    method,
    headers: {
      Authorization: `Bearer ${LISTOK_TOKEN}`,
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-Requested-With": "XMLHttpRequest",
    },
  };
  
  if (body && method !== "GET") {
    options.body = JSON.stringify(body);
  }
  
  const response = await fetch(url, options);
  
  if (response.status === 204) {
    return { success: true };
  }
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API error: ${response.status} ${errorText}`);
  }
  
  return response.json();
}

const TOOLS = [
  {
    name: "listok_list_contacts",
    description: "Получить список клиентов CRM с фильтрацией",
    inputSchema: {
      type: "object",
      properties: {
        page: { type: "number", description: "Номер страницы" },
        name: { type: "string", description: "Фильтр по ФИО" },
        phone: { type: "string", description: "Фильтр по телефону" },
        email: { type: "string", description: "Фильтр по email" },
      },
      required: ["page"],
    },
  },
  {
    name: "listok_get_contact",
    description: "Получить данные клиента по ID",
    inputSchema: {
      type: "object",
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
      type: "object",
      properties: {
        name: { type: "string", description: "ФИО клиента" },
        phone: { type: "string", description: "Телефон" },
        email: { type: "string", description: "Email" },
      },
      required: ["name"],
    },
  },
  {
    name: "listok_list_passes",
    description: "Получить список абонементов",
    inputSchema: {
      type: "object",
      properties: {
        page: { type: "number", description: "Номер страницы" },
      },
      required: ["page"],
    },
  },
  {
    name: "listok_list_events",
    description: "Получить список занятий на дату/период",
    inputSchema: {
      type: "object",
      properties: {
        date: { type: "string", description: "Дата (YYYY-MM-DD)" },
        from: { type: "string", description: "Начало периода" },
        to: { type: "string", description: "Конец периода" },
      },
    },
  },
  {
    name: "listok_create_listing",
    description: "Записать клиента на занятие",
    inputSchema: {
      type: "object",
      properties: {
        contact_id: { type: "number", description: "ID клиента" },
        event_id: { type: "number", description: "ID занятия" },
      },
      required: ["contact_id", "event_id"],
    },
  },
  {
    name: "listok_list_payments",
    description: "Получить список платежей",
    inputSchema: {
      type: "object",
      properties: {
        page: { type: "number", description: "Номер страницы" },
        from: { type: "string", description: "Начало периода" },
        to: { type: "string", description: "Конец периода" },
      },
      required: ["page"],
    },
  },
  {
    name: "listok_list_groups",
    description: "Получить список групп",
    inputSchema: {
      type: "object",
      properties: {
        page: { type: "number", description: "Номер страницы" },
      },
      required: ["page"],
    },
  },
];

async function handleToolCall(name, args) {
  switch (name) {
    case "listok_list_contacts": {
      const params = new URLSearchParams({ page: String(args.page) });
      if (args.name) params.set("name", String(args.name));
      if (args.phone) params.set("phone", String(args.phone));
      if (args.email) params.set("email", String(args.email));
      return listokRequest("GET", `/contacts?${params}`);
    }
    case "listok_get_contact":
      return listokRequest("GET", `/contacts/${args.contact_id}`);
    case "listok_create_contact":
      return listokRequest("POST", "/contacts", args);
    case "listok_list_passes":
      return listokRequest("GET", `/passes?page=${args.page}`);
    case "listok_list_events": {
      const params = new URLSearchParams();
      if (args.date) params.set("date", String(args.date));
      if (args.from) params.set("from", String(args.from));
      if (args.to) params.set("to", String(args.to));
      return listokRequest("GET", `/events?${params}`);
    }
    case "listok_create_listing":
      return listokRequest("POST", `/contacts/${args.contact_id}/listings/${args.event_id}`);
    case "listok_list_payments": {
      const params = new URLSearchParams({ page: String(args.page) });
      if (args.from) params.set("from", String(args.from));
      if (args.to) params.set("to", String(args.to));
      return listokRequest("GET", `/payments?${params}`);
    }
    case "listok_list_groups":
      return listokRequest("GET", `/groups?page=${args.page}`);
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

const server = new Server(
  { name: "listok-crm-mcp", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: TOOLS,
}));

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
      content: [{ type: "text", text: `Error: ${error.message}` }],
      isError: true,
    };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("ListOk CRM MCP Server запущен");
}

main().catch(console.error);
