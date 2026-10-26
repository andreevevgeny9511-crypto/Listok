import { useState } from "react";
import { mcpTools, categories, webhookEvents } from "./data/tools";
import { mcpServerCode } from "./data/serverCode";

type Tab = "overview" | "tools" | "server" | "webhooks" | "setup";

function App() {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedBlock, setCopiedBlock] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedBlock(id);
    setTimeout(() => setCopiedBlock(null), 2000);
  };

  const filteredTools = mcpTools.filter((tool) => {
    const matchesCategory =
      selectedCategory === "all" || tool.category === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">ListOk CRM</h1>
                <p className="text-xs text-gray-400 -mt-0.5">MCP Server</p>
              </div>
            </div>
            <nav className="flex items-center gap-1">
              {[
                { id: "overview" as Tab, label: "Обзор" },
                { id: "tools" as Tab, label: "Инструменты" },
                { id: "server" as Tab, label: "Код сервера" },
                { id: "webhooks" as Tab, label: "Webhooks" },
                { id: "setup" as Tab, label: "Установка" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      : "text-gray-400 hover:text-gray-200 hover:bg-gray-800/50"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            <div className="text-center py-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm mb-6">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Model Context Protocol
              </div>
              <h2 className="text-4xl font-bold text-white mb-4">
                MCP сервер для{" "}
                <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                  ListOk CRM
                </span>
              </h2>
              <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                Полноценный MCP-сервер, предоставляющий AI-ассистентам доступ к API ListOk CRM.
                Управление клиентами, абонементами, занятиями, платежами и многим другим.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Инструментов", value: mcpTools.length.toString(), icon: "🔧" },
                { label: "Категорий", value: categories.length.toString(), icon: "📂" },
                { label: "Webhook событий", value: webhookEvents.length.toString(), icon: "🔔" },
                { label: "API версия", value: "v2", icon: "📡" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-gray-900 border border-gray-800 rounded-xl p-5 text-center"
                >
                  <div className="text-2xl mb-2">{stat.icon}</div>
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Features */}
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  title: "Управление клиентами",
                  description: "Создание, редактирование, поиск клиентов. Работа с заметками, бонусами и кастомными полями.",
                  tools: mcpTools.filter((t) => t.category === "Клиенты").length,
                },
                {
                  title: "Расписание и занятия",
                  description: "Полное управление расписанием: создание занятий, записи, отметки посещений, лист ожидания.",
                  tools: mcpTools.filter((t) => ["Занятия", "Записи", "Посещения"].includes(t.category)).length,
                },
                {
                  title: "Финансы и абонементы",
                  description: "Оформление и заморозка абонементов, платежи, бонусы, генерация ссылок на оплату.",
                  tools: mcpTools.filter((t) => ["Абонементы", "Платежи", "Бонусы"].includes(t.category)).length,
                },
              ].map((feature) => (
                <div
                  key={feature.title}
                  className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-emerald-500/30 transition-colors"
                >
                  <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-400 text-sm mb-4">{feature.description}</p>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {feature.tools} инструментов
                  </span>
                </div>
              ))}
            </div>

            {/* Quick Start */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">⚡ Быстрый старт</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold">1</span>
                  <p className="text-gray-300">Установите зависимости: <code className="bg-gray-800 px-2 py-0.5 rounded text-emerald-400 text-sm">npm install @modelcontextprotocol/sdk</code></p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold">2</span>
                  <p className="text-gray-300">Настройте переменные окружения <code className="bg-gray-800 px-2 py-0.5 rounded text-emerald-400 text-sm">LISTOK_DOMAIN</code> и <code className="bg-gray-800 px-2 py-0.5 rounded text-emerald-400 text-sm">LISTOK_TOKEN</code></p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold">3</span>
                  <p className="text-gray-300">Добавьте сервер в конфигурацию Claude Desktop или другого MCP-клиента</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tools Tab */}
        {activeTab === "tools" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">MCP Инструменты</h2>
                <p className="text-gray-400 text-sm mt-1">
                  {filteredTools.length} из {mcpTools.length} инструментов
                </p>
              </div>
              <input
                type="text"
                placeholder="Поиск инструментов..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-72 px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  selectedCategory === "all"
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : "bg-gray-800 text-gray-400 hover:text-gray-200 border border-gray-700"
                }`}
              >
                Все
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    selectedCategory === cat
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      : "bg-gray-800 text-gray-400 hover:text-gray-200 border border-gray-700"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Tools List */}
            <div className="space-y-4">
              {filteredTools.map((tool) => (
                <div
                  key={tool.name}
                  className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <code className="text-emerald-400 font-mono font-semibold text-sm">
                          {tool.name}
                        </code>
                        <span
                          className={`px-1.5 py-0.5 rounded text-xs font-mono ${
                            tool.method === "GET"
                              ? "bg-blue-500/10 text-blue-400"
                              : tool.method === "POST"
                              ? "bg-green-500/10 text-green-400"
                              : tool.method === "PUT" || tool.method === "PATCH"
                              ? "bg-yellow-500/10 text-yellow-400"
                              : "bg-red-500/10 text-red-400"
                          }`}
                        >
                          {tool.method}
                        </span>
                      </div>
                      <p className="text-gray-300 text-sm">{tool.description}</p>
                    </div>
                    <span className="flex-shrink-0 px-2 py-0.5 rounded text-xs bg-gray-800 text-gray-400 border border-gray-700">
                      {tool.category}
                    </span>
                  </div>

                  <div className="text-xs text-gray-500 font-mono mb-3 bg-gray-950 px-3 py-1.5 rounded">
                    {tool.endpoint}
                  </div>

                  {tool.parameters.length > 0 && (
                    <details className="mt-3">
                      <summary className="text-sm text-gray-400 cursor-pointer hover:text-gray-200">
                        Параметры ({tool.parameters.length})
                      </summary>
                      <div className="mt-2 overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="text-left text-gray-500 border-b border-gray-800">
                              <th className="pb-2 pr-4">Имя</th>
                              <th className="pb-2 pr-4">Тип</th>
                              <th className="pb-2 pr-4">Обяз.</th>
                              <th className="pb-2">Описание</th>
                            </tr>
                          </thead>
                          <tbody>
                            {tool.parameters.map((param) => (
                              <tr key={param.name} className="border-b border-gray-800/50">
                                <td className="py-2 pr-4">
                                  <code className="text-cyan-400 text-xs">{param.name}</code>
                                </td>
                                <td className="py-2 pr-4 text-gray-400 text-xs">{param.type}</td>
                                <td className="py-2 pr-4">
                                  {param.required ? (
                                    <span className="text-amber-400 text-xs">да</span>
                                  ) : (
                                    <span className="text-gray-600 text-xs">нет</span>
                                  )}
                                </td>
                                <td className="py-2 text-gray-400 text-xs">{param.description}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </details>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Server Code Tab */}
        {activeTab === "server" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white">Исходный код MCP сервера</h2>
              <p className="text-gray-400 text-sm mt-1">
                Полный код TypeScript MCP сервера для интеграции с ListOk CRM API
              </p>
            </div>

            <div className="relative">
              <div className="absolute top-3 right-3 z-10">
                <button
                  onClick={() => copyToClipboard(mcpServerCode, "server")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    copiedBlock === "server"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      : "bg-gray-800 text-gray-400 hover:text-gray-200 border border-gray-700"
                  }`}
                >
                  {copiedBlock === "server" ? "✓ Скопировано" : "Копировать"}
                </button>
              </div>
              <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 border-b border-gray-800">
                  <div className="w-3 h-3 rounded-full bg-red-500/60"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/60"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/60"></div>
                  <span className="ml-2 text-xs text-gray-400 font-mono">src/index.ts</span>
                </div>
                <pre className="p-4 overflow-x-auto text-sm leading-relaxed max-h-[70vh] overflow-y-auto">
                  <code className="text-gray-300 font-mono text-xs">{mcpServerCode}</code>
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* Webhooks Tab */}
        {activeTab === "webhooks" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white">Webhook события</h2>
              <p className="text-gray-400 text-sm mt-1">
                События, на которые можно подписаться через webhook-подписки
              </p>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-gray-300 mb-3">Пример проверки подписи</h3>
              <div className="relative">
                <button
                  onClick={() => copyToClipboard(
                    `$signature = hash_hmac('sha256', json_encode($payload), $webhookSecret);\nif ($signature === $_SERVER['X-Webhook-Signature']) {\n    // Подтверждено\n}`,
                    "webhook-sig"
                  )}
                  className={`absolute top-2 right-2 px-2 py-1 rounded text-xs ${
                    copiedBlock === "webhook-sig"
                      ? "bg-emerald-500/20 text-emerald-400"
                      : "bg-gray-800 text-gray-400 hover:text-gray-200"
                  }`}
                >
                  {copiedBlock === "webhook-sig" ? "✓" : "Copy"}
                </button>
                <pre className="bg-gray-950 rounded-lg p-4 text-xs text-gray-300 font-mono overflow-x-auto">
{`$signature = hash_hmac('sha256', json_encode($payload), $webhookSecret);
if ($signature === $_SERVER['X-Webhook-Signature']) {
    // Подтверждено
}`}
                </pre>
              </div>
            </div>

            <div className="grid gap-2">
              {webhookEvents.map((evt) => (
                <div
                  key={evt.event}
                  className="bg-gray-900 border border-gray-800 rounded-lg px-4 py-3 flex items-center justify-between hover:border-gray-700 transition-colors"
                >
                  <code className="text-emerald-400 font-mono text-sm">{evt.event}</code>
                  <span className="text-gray-400 text-sm">{evt.description}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Setup Tab */}
        {activeTab === "setup" && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-white">Установка и настройка</h2>
              <p className="text-gray-400 text-sm mt-1">
                Пошаговая инструкция по установке MCP сервера
              </p>
            </div>

            {/* Step 1 */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-sm font-bold">1</span>
                Создание проекта
              </h3>
              <div className="relative">
                <button
                  onClick={() => copyToClipboard(
                    `mkdir listok-crm-mcp && cd listok-crm-mcp\nnpm init -y\nnpm install @modelcontextprotocol/sdk\nnpm install -D typescript @types/node\nnpx tsc --init`,
                    "step1"
                  )}
                  className={`absolute top-2 right-2 px-2 py-1 rounded text-xs ${
                    copiedBlock === "step1"
                      ? "bg-emerald-500/20 text-emerald-400"
                      : "bg-gray-800 text-gray-400 hover:text-gray-200"
                  }`}
                >
                  {copiedBlock === "step1" ? "✓" : "Copy"}
                </button>
                <pre className="bg-gray-950 rounded-lg p-4 text-sm text-gray-300 font-mono overflow-x-auto">
{`mkdir listok-crm-mcp && cd listok-crm-mcp
npm init -y
npm install @modelcontextprotocol/sdk
npm install -D typescript @types/node
npx tsc --init`}
                </pre>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-sm font-bold">2</span>
                Получение API токена
              </h3>
              <div className="space-y-3 text-gray-300 text-sm">
                <p>1. Войдите в панель управления ListOk CRM</p>
                <p>2. Перейдите в раздел <strong>Настройки → Интеграции → API</strong></p>
                <p>3. Создайте OAuth-приложение и получите <code className="bg-gray-800 px-1.5 py-0.5 rounded text-emerald-400">client_id</code> и <code className="bg-gray-800 px-1.5 py-0.5 rounded text-emerald-400">client_secret</code></p>
                <p>4. Пройдите OAuth-авторизацию для получения Bearer-токена:</p>
                <div className="relative">
                  <button
                    onClick={() => copyToClipboard(
                      `curl --request POST \\\n    "https://yourdomain.listokcrm.ru/oauth/token" \\\n    --header "Content-Type: application/json" \\\n    --data '{\n        "grant_type": "authorization_code",\n        "client_id": "your_client_id",\n        "client_secret": "your_client_secret",\n        "redirect_uri": "your_redirect_uri",\n        "code": "authorization_code"\n    }'`,
                      "step2"
                    )}
                    className={`absolute top-2 right-2 px-2 py-1 rounded text-xs ${
                      copiedBlock === "step2"
                        ? "bg-emerald-500/20 text-emerald-400"
                        : "bg-gray-800 text-gray-400 hover:text-gray-200"
                    }`}
                  >
                    {copiedBlock === "step2" ? "✓" : "Copy"}
                  </button>
                  <pre className="bg-gray-950 rounded-lg p-4 text-xs text-gray-300 font-mono overflow-x-auto">
{`curl --request POST \\
    "https://yourdomain.listokcrm.ru/oauth/token" \\
    --header "Content-Type: application/json" \\
    --data '{
        "grant_type": "authorization_code",
        "client_id": "your_client_id",
        "client_secret": "your_client_secret",
        "redirect_uri": "your_redirect_uri",
        "code": "authorization_code"
    }'`}
                  </pre>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-sm font-bold">3</span>
                Настройка Claude Desktop
              </h3>
              <p className="text-gray-400 text-sm mb-3">
                Добавьте сервер в конфигурационный файл Claude Desktop:
              </p>
              <div className="relative">
                <button
                  onClick={() => copyToClipboard(
                    JSON.stringify({
                      mcpServers: {
                        "listok-crm": {
                          command: "node",
                          args: ["/path/to/listok-crm-mcp/dist/index.js"],
                          env: {
                            LISTOK_DOMAIN: "yourdomain.listokcrm.ru",
                            LISTOK_TOKEN: "your_bearer_token"
                          }
                        }
                      }
                    }, null, 2),
                    "step3"
                  )}
                  className={`absolute top-2 right-2 px-2 py-1 rounded text-xs ${
                    copiedBlock === "step3"
                      ? "bg-emerald-500/20 text-emerald-400"
                      : "bg-gray-800 text-gray-400 hover:text-gray-200"
                  }`}
                >
                  {copiedBlock === "step3" ? "✓" : "Copy"}
                </button>
                <pre className="bg-gray-950 rounded-lg p-4 text-xs text-gray-300 font-mono overflow-x-auto">
{`// macOS: ~/Library/Application Support/Claude/claude_desktop_config.json
// Windows: %APPDATA%\\Claude\\claude_desktop_config.json

{
  "mcpServers": {
    "listok-crm": {
      "command": "node",
      "args": ["/path/to/listok-crm-mcp/dist/index.js"],
      "env": {
        "LISTOK_DOMAIN": "yourdomain.listokcrm.ru",
        "LISTOK_TOKEN": "your_bearer_token"
      }
    }
  }
}`}
                </pre>
              </div>
            </div>

            {/* Step 4 */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-sm font-bold">4</span>
                Альтернативная конфигурация (Cursor / VS Code)
              </h3>
              <div className="relative">
                <button
                  onClick={() => copyToClipboard(
                    JSON.stringify({
                      mcpServers: {
                        "listok-crm": {
                          command: "npx",
                          args: ["-y", "tsx", "/path/to/listok-crm-mcp/src/index.ts"],
                          env: {
                            LISTOK_DOMAIN: "yourdomain.listokcrm.ru",
                            LISTOK_TOKEN: "your_bearer_token"
                          }
                        }
                      }
                    }, null, 2),
                    "step4"
                  )}
                  className={`absolute top-2 right-2 px-2 py-1 rounded text-xs ${
                    copiedBlock === "step4"
                      ? "bg-emerald-500/20 text-emerald-400"
                      : "bg-gray-800 text-gray-400 hover:text-gray-200"
                  }`}
                >
                  {copiedBlock === "step4" ? "✓" : "Copy"}
                </button>
                <pre className="bg-gray-950 rounded-lg p-4 text-xs text-gray-300 font-mono overflow-x-auto">
{`// .cursor/mcp.json или .vscode/mcp.json
{
  "mcpServers": {
    "listok-crm": {
      "command": "npx",
      "args": ["-y", "tsx", "/path/to/listok-crm-mcp/src/index.ts"],
      "env": {
        "LISTOK_DOMAIN": "yourdomain.listokcrm.ru",
        "LISTOK_TOKEN": "your_bearer_token"
      }
    }
  }
}`}
                </pre>
              </div>
            </div>

            {/* Environment Variables */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">📋 Переменные окружения</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-500 border-b border-gray-800">
                      <th className="pb-2 pr-4">Переменная</th>
                      <th className="pb-2 pr-4">Описание</th>
                      <th className="pb-2">Пример</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-800/50">
                      <td className="py-3 pr-4"><code className="text-cyan-400">LISTOK_DOMAIN</code></td>
                      <td className="py-3 pr-4 text-gray-400">Домен вашей CRM</td>
                      <td className="py-3 text-gray-300 font-mono text-xs">mycompany.listokcrm.ru</td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-4"><code className="text-cyan-400">LISTOK_TOKEN</code></td>
                      <td className="py-3 pr-4 text-gray-400">Bearer токен авторизации</td>
                      <td className="py-3 text-gray-300 font-mono text-xs">eyJhbGciOi...</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Usage Examples */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">💬 Примеры запросов к AI</h3>
              <div className="space-y-3">
                {[
                  "Покажи всех клиентов, которые не были на занятиях последний месяц",
                  "Сколько платежей поступило за эту неделю?",
                  "Запиши клиента Иванова на завтрашнее занятие по йоге",
                  "Заморозь абонемент клиента ID 42 на 14 дней",
                  "Создай нового клиента с именем Петров Пёт, телефон +79991234567",
                  "Какие группы есть в филиале «Основной»?",
                ].map((example, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 px-4 py-2.5 bg-gray-950 rounded-lg border border-gray-800"
                  >
                    <span className="text-emerald-400 text-sm">💬</span>
                    <span className="text-gray-300 text-sm">{example}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <p>ListOk CRM MCP Server • API v2</p>
            <a
              href="https://api.listokcrm.ru/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              API Документация →
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
