import { useState } from "react";
import { mcpTools, categories, webhookEvents } from "./data/tools";
import { mcpServerCode } from "./data/serverCode";
import { usageExamples, deploySteps, codexIntegration } from "./data/guides";

type Tab = "overview" | "tools" | "server" | "usage" | "deploy" | "codex" | "webhooks" | "setup" | "guide";

function CodeBlock({ code, id, copiedBlock, onCopy, lang = "bash" }: { code: string; id: string; copiedBlock: string | null; onCopy: (text: string, id: string) => void; lang?: string }) {
  return (
    <div className="relative group">
      <div className="absolute top-2 right-2 z-10 flex items-center gap-2">
        <span className="text-[10px] text-gray-600 font-mono uppercase">{lang}</span>
        <button
          onClick={() => onCopy(code, id)}
          className={`px-2 py-1 rounded text-xs font-medium transition-all ${
            copiedBlock === id
              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
              : "bg-gray-800 text-gray-400 hover:text-gray-200 border border-gray-700 opacity-0 group-hover:opacity-100"
          }`}
        >
          {copiedBlock === id ? "✓ Скопировано" : "Copy"}
        </button>
      </div>
      <pre className="bg-gray-950 border border-gray-800 rounded-lg p-4 text-xs text-gray-300 font-mono overflow-x-auto leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function App() {
  const [activeTab, setActiveTab] = useState<Tab>("guide");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedBlock, setCopiedBlock] = useState<string | null>(null);
  const [expandedExample, setExpandedExample] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedBlock(id);
    setTimeout(() => setCopiedBlock(null), 2000);
  };

  const filteredTools = mcpTools.filter((tool) => {
    const matchesCategory = selectedCategory === "all" || tool.category === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const tabs = [
    { id: "guide" as Tab, label: "📋 Инструкция", icon: "📋", highlight: true },
    { id: "overview" as Tab, label: "Обзор", icon: "🏠" },
    { id: "tools" as Tab, label: "Инструменты", icon: "🔧" },
    { id: "usage" as Tab, label: "Использование", icon: "💬" },
    { id: "deploy" as Tab, label: "Деплой", icon: "🚀" },
    { id: "codex" as Tab, label: "Codex & AI", icon: "🤖" },
    { id: "server" as Tab, label: "Код сервера", icon: "📝" },
    { id: "webhooks" as Tab, label: "Webhooks", icon: "🔔" },
    { id: "setup" as Tab, label: "Установка", icon: "⚙️" },
  ];

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
            <nav className="hidden lg:flex items-center gap-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? (tab as any).highlight
                        ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                        : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      : (tab as any).highlight
                      ? "bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30"
                      : "text-gray-400 hover:text-gray-200 hover:bg-gray-800/50"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
          {/* Mobile nav */}
          <div className="lg:hidden flex overflow-x-auto gap-1 pb-3 -mx-1 px-1 scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeTab === tab.id
                    ? (tab as any).highlight
                      ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                      : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    : (tab as any).highlight
                    ? "bg-emerald-500/20 text-emerald-300"
                    : "text-gray-400 hover:text-gray-200 bg-gray-800/50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ==================== OVERVIEW ==================== */}
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

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Инструментов", value: mcpTools.length.toString(), icon: "🔧" },
                { label: "Категорий", value: categories.length.toString(), icon: "📂" },
                { label: "Webhook событий", value: webhookEvents.length.toString(), icon: "🔔" },
                { label: "API версия", value: "v2", icon: "📡" },
              ].map((stat) => (
                <div key={stat.label} className="bg-gray-900 border border-gray-800 rounded-xl p-5 text-center">
                  <div className="text-2xl mb-2">{stat.icon}</div>
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                { title: "Управление клиентами", description: "Создание, редактирование, поиск клиентов. Работа с заметками, бонусами и кастомными полями.", tools: mcpTools.filter((t) => t.category === "Клиенты").length },
                { title: "Расписание и занятия", description: "Полное управление расписанием: создание занятий, записи, отметки посещений, лист ожидания.", tools: mcpTools.filter((t) => ["Занятия", "Записи", "Посещения"].includes(t.category)).length },
                { title: "Финансы и абонементы", description: "Оформление и заморозка абонементов, платежи, бонусы, генерация ссылок на оплату.", tools: mcpTools.filter((t) => ["Абонементы", "Платежи", "Бонусы"].includes(t.category)).length },
              ].map((feature) => (
                <div key={feature.title} className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-emerald-500/30 transition-colors">
                  <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-400 text-sm mb-4">{feature.description}</p>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {feature.tools} инструментов
                  </span>
                </div>
              ))}
            </div>

            {/* Quick navigation */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-900/50 border border-gray-800 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">📖 Навигация по документации</h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  { tab: "usage" as Tab, title: "Как пользоваться", desc: "Примеры запросов к AI", icon: "💬" },
                  { tab: "deploy" as Tab, title: "Деплой на сервер", desc: "VPS, Docker, PaaS", icon: "🚀" },
                  { tab: "codex" as Tab, title: "Подключить к Codex", desc: "OpenAI, Copilot, Cursor", icon: "🤖" },
                  { tab: "setup" as Tab, title: "Быстрая установка", desc: "Пошаговая инструкция", icon: "⚙️" },
                ].map((nav) => (
                  <button
                    key={nav.tab}
                    onClick={() => setActiveTab(nav.tab)}
                    className="text-left p-4 rounded-lg bg-gray-800/50 border border-gray-700 hover:border-emerald-500/30 transition-all group"
                  >
                    <span className="text-2xl mb-2 block">{nav.icon}</span>
                    <span className="text-sm font-semibold text-white group-hover:text-emerald-400 transition-colors">{nav.title}</span>
                    <span className="text-xs text-gray-500 block mt-0.5">{nav.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ==================== USAGE ==================== */}
        {activeTab === "usage" && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-white">💬 Как пользоваться</h2>
              <p className="text-gray-400 text-sm mt-1">
                После подключения MCP сервера, AI-ассистент автоматически получает доступ ко всем инструментам. Просто пишите запросы на естественном языке.
              </p>
            </div>

            {/* How it works */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Как это работает</h3>
              <div className="grid md:grid-cols-4 gap-4">
                {[
                  { step: "1", title: "Вы пишете запрос", desc: "Например: «Покажи клиентов за сегодня»", color: "from-blue-500 to-blue-600" },
                  { step: "2", title: "AI выбирает инструмент", desc: "Определяет нужный MCP-инструмент и параметры", color: "from-purple-500 to-purple-600" },
                  { step: "3", title: "Запрос к API", desc: "MCP сервер вызывает ListOk CRM API", color: "from-emerald-500 to-emerald-600" },
                  { step: "4", title: "AI отвечает", desc: "Формирует понятный ответ на основе данных", color: "from-amber-500 to-amber-600" },
                ].map((item) => (
                  <div key={item.step} className="text-center">
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center text-white font-bold mx-auto mb-3`}>
                      {item.step}
                    </div>
                    <h4 className="text-sm font-semibold text-white mb-1">{item.title}</h4>
                    <p className="text-xs text-gray-400">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Usage examples by category */}
            {usageExamples.map((category) => (
              <div key={category.category} className="space-y-3">
                <h3 className="text-lg font-semibold text-white">{category.category}</h3>
                <div className="space-y-2">
                  {category.examples.map((example, i) => {
                    const key = `${category.category}-${i}`;
                    const isExpanded = expandedExample === key;
                    return (
                      <div
                        key={i}
                        className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-gray-700 transition-colors"
                      >
                        <button
                          onClick={() => setExpandedExample(isExpanded ? null : key)}
                          className="w-full text-left px-5 py-4 flex items-center justify-between gap-4"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-emerald-400">💬</span>
                            <span className="text-gray-200 text-sm">{example.prompt}</span>
                          </div>
                          <svg
                            className={`w-4 h-4 text-gray-500 transition-transform flex-shrink-0 ${isExpanded ? "rotate-180" : ""}`}
                            fill="none" viewBox="0 0 24 24" stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        {isExpanded && (
                          <div className="px-5 pb-4 border-t border-gray-800 pt-3 space-y-3">
                            <p className="text-xs text-gray-400">{example.description}</p>
                            <div>
                              <span className="text-xs text-gray-500 mb-1 block">Вызванный инструмент:</span>
                              <code className="text-emerald-400 font-mono text-sm bg-gray-950 px-2 py-1 rounded">{example.tool}</code>
                            </div>
                            <div>
                              <span className="text-xs text-gray-500 mb-1 block">Аргументы:</span>
                              <pre className="bg-gray-950 border border-gray-800 rounded-lg p-3 text-xs text-cyan-300 font-mono overflow-x-auto">
                                {example.args}
                              </pre>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Tips */}
            <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-emerald-400 mb-3">💡 Советы</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-start gap-2"><span className="text-emerald-400 mt-0.5">•</span> AI автоматически определит, какой инструмент вызвать — просто опишите задачу</li>
                <li className="flex items-start gap-2"><span className="text-emerald-400 mt-0.5">•</span> Можно комбинировать запросы: «Найди клиента Иванова и запиши его на завтра»</li>
                <li className="flex items-start gap-2"><span className="text-emerald-400 mt-0.5">•</span> Для сложных операций AI вызовет несколько инструментов последовательно</li>
                <li className="flex items-start gap-2"><span className="text-emerald-400 mt-0.5">•</span> Если AI не нашёл клиента, попробуйте указать телефон или email точнее</li>
                <li className="flex items-start gap-2"><span className="text-emerald-400 mt-0.5">•</span> AI может анализировать данные: «Сколько клиентов пришло за неделю?»</li>
              </ul>
            </div>
          </div>
        )}

        {/* ==================== DEPLOY ==================== */}
        {activeTab === "deploy" && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-white">🚀 Деплой на сервер</h2>
              <p className="text-gray-400 text-sm mt-1">
                Полная инструкция по развёртыванию MCP сервера на VPS, в Docker или на PaaS-платформах
              </p>
            </div>

            {/* Deploy options */}
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { title: "VPS / VDS", desc: "Ubuntu, Debian, CentOS", icon: "🖥️", recommended: true },
                { title: "Docker", desc: "Контейнеризация", icon: "🐳", recommended: false },
                { title: "PaaS", desc: "Railway, Render, Fly.io", icon: "☁️", recommended: false },
              ].map((opt) => (
                <div key={opt.title} className={`relative bg-gray-900 border rounded-xl p-5 ${opt.recommended ? "border-emerald-500/30" : "border-gray-800"}`}>
                  {opt.recommended && (
                    <span className="absolute -top-2 right-3 px-2 py-0.5 text-[10px] font-bold bg-emerald-500 text-white rounded-full">
                      РЕКОМЕНДУЕМ
                    </span>
                  )}
                  <span className="text-2xl">{opt.icon}</span>
                  <h3 className="text-white font-semibold mt-2">{opt.title}</h3>
                  <p className="text-gray-400 text-xs mt-1">{opt.desc}</p>
                </div>
              ))}
            </div>

            {/* Deploy steps */}
            {deploySteps.map((section, si) => (
              <div key={si} className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <span className="text-xl">{section.icon}</span>
                  <span className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-sm font-bold">{si + 1}</span>
                  {section.title}
                </h3>
                <div className="space-y-4">
                  {section.steps.map((step, sti) => (
                    <div key={sti}>
                      <p className="text-sm text-gray-400 mb-2">{step.description}</p>
                      <CodeBlock
                        code={step.code}
                        id={`deploy-${si}-${sti}`}
                        copiedBlock={copiedBlock}
                        onCopy={copyToClipboard}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Security */}
            <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-amber-400 mb-3">🔒 Безопасность</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-start gap-2"><span className="text-amber-400 mt-0.5">•</span> Никогда не коммитьте <code className="bg-gray-800 px-1 rounded text-amber-300">.env</code> файл с токенами в Git</li>
                <li className="flex items-start gap-2"><span className="text-amber-400 mt-0.5">•</span> Используйте <code className="bg-gray-800 px-1 rounded text-amber-300">systemd</code> для управления процессом и автоперезапуска</li>
                <li className="flex items-start gap-2"><span className="text-amber-400 mt-0.5">•</span> Ограничьте права пользователя, от которого запускается сервер</li>
                <li className="flex items-start gap-2"><span className="text-amber-400 mt-0.5">•</span> Для удалённого доступа используйте SSH-туннели или VPN</li>
                <li className="flex items-start gap-2"><span className="text-amber-400 mt-0.5">•</span> Регулярно обновляйте зависимости: <code className="bg-gray-800 px-1 rounded text-amber-300">npm audit && npm update</code></li>
              </ul>
            </div>
          </div>
        )}

        {/* ==================== CODEX ==================== */}
        {activeTab === "codex" && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-white">🤖 Подключение к Codex и AI-агентам</h2>
              <p className="text-gray-400 text-sm mt-1">
                Инструкции по подключению MCP сервера к различным AI-инструментам
              </p>
            </div>

            {/* Supported platforms */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {codexIntegration.sections.map((section) => (
                <div key={section.title} className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-emerald-500/30 transition-colors">
                  <span className="text-2xl">{section.icon}</span>
                  <h3 className="text-white font-semibold mt-2">{section.title}</h3>
                  <p className="text-gray-400 text-xs mt-1">{section.description}</p>
                </div>
              ))}
            </div>

            {/* Detailed sections */}
            {codexIntegration.sections.map((section, i) => (
              <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                  <span className="text-xl">{section.icon}</span>
                  {section.title}
                </h3>
                <p className="text-gray-400 text-sm mb-4">{section.description}</p>

                {/* Config */}
                <div className="mb-4">
                  <span className="text-xs text-gray-500 mb-2 block">Конфигурация — {section.config.filename}:</span>
                  <CodeBlock
                    code={section.config.content}
                    id={`codex-config-${i}`}
                    copiedBlock={copiedBlock}
                    onCopy={copyToClipboard}
                    lang="json"
                  />
                </div>

                {/* Steps */}
                <div>
                  <span className="text-xs text-gray-500 mb-2 block">Шаги подключения:</span>
                  <div className="space-y-2">
                    {section.steps.map((step, si) => (
                      <div key={si} className="flex items-start gap-3 text-sm">
                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-gray-800 text-gray-400 flex items-center justify-center text-xs font-bold border border-gray-700">
                          {si + 1}
                        </span>
                        <span className="text-gray-300 pt-0.5" dangerouslySetInnerHTML={{
                          __html: step.replace(/`([^`]+)`/g, '<code class="bg-gray-800 px-1.5 py-0.5 rounded text-emerald-400 text-xs">$1</code>')
                        }} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            {/* Remote / SSE setup */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                <span className="text-xl">🌐</span>
                {codexIntegration.remoteSetup.title}
              </h3>
              <p className="text-gray-400 text-sm mb-4">{codexIntegration.remoteSetup.description}</p>

              <div className="mb-4">
                <span className="text-xs text-gray-500 mb-2 block">Серверная часть (SSE транспорт):</span>
                <CodeBlock
                  code={codexIntegration.remoteSetup.code}
                  id="remote-server"
                  copiedBlock={copiedBlock}
                  onCopy={copyToClipboard}
                  lang="typescript"
                />
              </div>

              <div>
                <span className="text-xs text-gray-500 mb-2 block">Клиентская конфигурация:</span>
                <CodeBlock
                  code={codexIntegration.remoteSetup.clientConfig}
                  id="remote-client"
                  copiedBlock={copiedBlock}
                  onCopy={copyToClipboard}
                  lang="json"
                />
              </div>
            </div>

            {/* Comparison table */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">📊 Сравнение AI-клиентов</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-500 border-b border-gray-800">
                      <th className="pb-3 pr-4">Клиент</th>
                      <th className="pb-3 pr-4">Транспорт</th>
                      <th className="pb-3 pr-4">Конфиг</th>
                      <th className="pb-3">Особенности</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-300">
                    {[
                      { name: "Claude Desktop", transport: "stdio", config: "JSON файл", features: "Нативная поддержка, лучший UX" },
                      { name: "OpenAI Codex CLI", transport: "stdio", config: "~/.codex/config.json", features: "Работа в терминале, агентный режим" },
                      { name: "Cursor IDE", transport: "stdio", config: ".cursor/mcp.json", features: "Интеграция в редактор, Cascade AI" },
                      { name: "GitHub Copilot", transport: "stdio", config: ".vscode/mcp.json", features: "Встроен в VS Code, чат" },
                      { name: "Windsurf", transport: "stdio", config: "Settings → MCP", features: "Cascade AI, автодополнение" },
                      { name: "Удалённый (SSE)", transport: "SSE/HTTP", config: "URL сервера", features: "Для командной работы, VPS" },
                    ].map((row) => (
                      <tr key={row.name} className="border-b border-gray-800/50">
                        <td className="py-3 pr-4 font-medium text-white">{row.name}</td>
                        <td className="py-3 pr-4"><code className="text-emerald-400 text-xs">{row.transport}</code></td>
                        <td className="py-3 pr-4 text-gray-400 text-xs">{row.config}</td>
                        <td className="py-3 text-gray-400 text-xs">{row.features}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ==================== TOOLS ==================== */}
        {activeTab === "tools" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">🔧 MCP Инструменты</h2>
                <p className="text-gray-400 text-sm mt-1">{filteredTools.length} из {mcpTools.length} инструментов</p>
              </div>
              <input
                type="text"
                placeholder="Поиск инструментов..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-72 px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>

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

            <div className="space-y-4">
              {filteredTools.map((tool) => (
                <div key={tool.name} className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-colors">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <code className="text-emerald-400 font-mono font-semibold text-sm">{tool.name}</code>
                        <span className={`px-1.5 py-0.5 rounded text-xs font-mono ${
                          tool.method === "GET" ? "bg-blue-500/10 text-blue-400" :
                          tool.method === "POST" ? "bg-green-500/10 text-green-400" :
                          tool.method === "PUT" || tool.method === "PATCH" ? "bg-yellow-500/10 text-yellow-400" :
                          "bg-red-500/10 text-red-400"
                        }`}>
                          {tool.method}
                        </span>
                      </div>
                      <p className="text-gray-300 text-sm">{tool.description}</p>
                    </div>
                    <span className="flex-shrink-0 px-2 py-0.5 rounded text-xs bg-gray-800 text-gray-400 border border-gray-700">{tool.category}</span>
                  </div>
                  <div className="text-xs text-gray-500 font-mono mb-3 bg-gray-950 px-3 py-1.5 rounded">{tool.endpoint}</div>
                  {tool.parameters.length > 0 && (
                    <details className="mt-3">
                      <summary className="text-sm text-gray-400 cursor-pointer hover:text-gray-200">Параметры ({tool.parameters.length})</summary>
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
                                <td className="py-2 pr-4"><code className="text-cyan-400 text-xs">{param.name}</code></td>
                                <td className="py-2 pr-4 text-gray-400 text-xs">{param.type}</td>
                                <td className="py-2 pr-4">{param.required ? <span className="text-amber-400 text-xs">да</span> : <span className="text-gray-600 text-xs">нет</span>}</td>
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

        {/* ==================== SERVER CODE ==================== */}
        {activeTab === "server" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white">📝 Исходный код MCP сервера</h2>
              <p className="text-gray-400 text-sm mt-1">Полный код TypeScript MCP сервера для интеграции с ListOk CRM API</p>
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

        {/* ==================== WEBHOOKS ==================== */}
        {activeTab === "webhooks" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white">🔔 Webhook события</h2>
              <p className="text-gray-400 text-sm mt-1">События, на которые можно подписаться через webhook-подписки</p>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-gray-300 mb-3">Пример проверки подписи</h3>
              <CodeBlock
                code={`$signature = hash_hmac('sha256', json_encode($payload), $webhookSecret);\nif ($signature === $_SERVER['X-Webhook-Signature']) {\n    // Подтверждено\n}`}
                id="webhook-sig"
                copiedBlock={copiedBlock}
                onCopy={copyToClipboard}
                lang="php"
              />
            </div>

            <div className="grid gap-2">
              {webhookEvents.map((evt) => (
                <div key={evt.event} className="bg-gray-900 border border-gray-800 rounded-lg px-4 py-3 flex items-center justify-between hover:border-gray-700 transition-colors">
                  <code className="text-emerald-400 font-mono text-sm">{evt.event}</code>
                  <span className="text-gray-400 text-sm">{evt.description}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== SETUP ==================== */}
        {activeTab === "setup" && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-white">⚙️ Установка и настройка</h2>
              <p className="text-gray-400 text-sm mt-1">Пошаговая инструкция по установке MCP сервера</p>
            </div>

            {/* Step 1 */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-sm font-bold">1</span>
                Создание проекта
              </h3>
              <CodeBlock
                code={`mkdir listok-crm-mcp && cd listok-crm-mcp\nnpm init -y\nnpm install @modelcontextprotocol/sdk\nnpm install -D typescript @types/node\nnpx tsc --init`}
                id="step1"
                copiedBlock={copiedBlock}
                onCopy={copyToClipboard}
              />
            </div>

            {/* Step 2 */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-sm font-bold">2</span>
                Получение API токена
              </h3>
              <div className="space-y-3 text-gray-300 text-sm mb-4">
                <p>1. Войдите в панель управления ListOk CRM</p>
                <p>2. Перейдите в <strong>Настройки → Интеграции → API</strong></p>
                <p>3. Создайте OAuth-приложение и получите токены</p>
              </div>
              <CodeBlock
                code={`curl --request POST \\\n    "https://yourdomain.listokcrm.ru/oauth/token" \\\n    --header "Content-Type: application/json" \\\n    --data '{\n        "grant_type": "authorization_code",\n        "client_id": "your_client_id",\n        "client_secret": "your_client_secret",\n        "redirect_uri": "your_redirect_uri",\n        "code": "authorization_code"\n    }'`}
                id="step2"
                copiedBlock={copiedBlock}
                onCopy={copyToClipboard}
                lang="bash"
              />
            </div>

            {/* Step 3 */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-sm font-bold">3</span>
                Настройка Claude Desktop
              </h3>
              <CodeBlock
                code={JSON.stringify({
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
                }, null, 2)}
                id="step3"
                copiedBlock={copiedBlock}
                onCopy={copyToClipboard}
                lang="json"
              />
            </div>

            {/* Env vars */}
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

            {/* Examples */}
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
                  <div key={i} className="flex items-center gap-3 px-4 py-2.5 bg-gray-950 rounded-lg border border-gray-800">
                    <span className="text-emerald-400 text-sm">💬</span>
                    <span className="text-gray-300 text-sm">{example}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ==================== GUIDE ==================== */}
        {activeTab === "guide" && (
          <div className="space-y-8">
            {/* Hero */}
            <div className="bg-gradient-to-br from-emerald-500/10 via-gray-900 to-cyan-500/10 border border-emerald-500/20 rounded-2xl p-8">
              <div className="flex items-center gap-2 text-emerald-400 text-sm mb-3">
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-xs font-bold">ГЛАВНАЯ ВКЛАДКА</span>
                <span>•</span>
                <span>Пошаговая инструкция</span>
              </div>
              <h2 className="text-3xl font-bold text-white mb-3">
                Как скачать, собрать и загрузить MCP-сервер на сервер
              </h2>
              <p className="text-gray-300 max-w-3xl">
                Полная инструкция для сценария: <strong className="text-white">сборка на локальном компьютере → загрузка через файловый менеджер → запуск на сервере</strong>.
                Не требуется SSH/SCP — всё делаем через графический интерфейс.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
                {[
                  { step: "1", title: "Скачать", desc: "Код проекта" },
                  { step: "2", title: "Собрать", desc: "npm install + build" },
                  { step: "3", title: "Загрузить", desc: "Через файловый менеджер" },
                  { step: "4", title: "Запустить", desc: "Настроить и стартовать" },
                ].map((s) => (
                  <div key={s.step} className="bg-gray-900/60 border border-gray-800 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold">{s.step}</span>
                      <span className="text-white font-semibold text-sm">{s.title}</span>
                    </div>
                    <p className="text-xs text-gray-400 ml-8">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* ===== ШАГ 1: СКАЧИВАНИЕ ===== */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-3">
                <span className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 text-white flex items-center justify-center font-bold">1</span>
                Скачиваем код проекта
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                Есть два варианта — выберите удобный.
              </p>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gray-950 border border-gray-800 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg">📦</span>
                    <h4 className="text-white font-semibold">Вариант A: ZIP-архив</h4>
                  </div>
                  <p className="text-xs text-gray-400 mb-3">Если код выложен на GitHub/GitLab — скачайте архив:</p>
                  <ol className="space-y-2 text-sm text-gray-300">
                    <li className="flex gap-2"><span className="text-emerald-400">1.</span> Откройте страницу репозитория в браузере</li>
                    <li className="flex gap-2"><span className="text-emerald-400">2.</span> Нажмите <code className="bg-gray-800 px-1.5 py-0.5 rounded text-xs">Code → Download ZIP</code></li>
                    <li className="flex gap-2"><span className="text-emerald-400">3.</span> Распакуйте в удобное место, например <code className="bg-gray-800 px-1.5 py-0.5 rounded text-xs">C:\Projects\listok-mcp</code></li>
                  </ol>
                </div>

                <div className="bg-gray-950 border border-gray-800 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg">🔧</span>
                    <h4 className="text-white font-semibold">Вариант B: Git clone</h4>
                  </div>
                  <p className="text-xs text-gray-400 mb-3">Если установлен Git — клонируйте репозиторий:</p>
                  <CodeBlock
                    code={`# Откройте терминал / командную строку\ncd C:\\Projects\ngit clone https://github.com/your-org/listok-crm-mcp.git\ncd listok-crm-mcp`}
                    id="guide-clone"
                    copiedBlock={copiedBlock}
                    onCopy={copyToClipboard}
                    lang="bash"
                  />
                </div>
              </div>

              <div className="mt-4 bg-blue-500/5 border border-blue-500/20 rounded-lg p-3 text-sm text-blue-200">
                💡 <strong>Совет:</strong> Если у вас нет репозитория — создайте папку <code className="bg-gray-800 px-1 rounded text-xs">listok-crm-mcp</code> вручную и скопируйте туда код из вкладки «Код сервера» (сохраните как <code className="bg-gray-800 px-1 rounded text-xs">src/index.ts</code>).
              </div>
            </div>

            {/* ===== ШАГ 2: СБОРКА ===== */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-3">
                <span className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 text-white flex items-center justify-center font-bold">2</span>
                Собираем проект локально
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                Откройте терминал (cmd / PowerShell / Terminal) в папке проекта и выполните команды.
              </p>

              <div className="space-y-4">
                <div>
                  <div className="text-xs text-gray-500 mb-2 font-semibold uppercase tracking-wide">2.1 — Установка зависимостей</div>
                  <CodeBlock
                    code={`# Переходим в папку проекта\ncd C:\\Projects\\listok-crm-mcp\n\n# Устанавливаем все зависимости (займёт 1-2 минуты)\nnpm install`}
                    id="guide-install"
                    copiedBlock={copiedBlock}
                    onCopy={copyToClipboard}
                    lang="bash"
                  />
                </div>

                <div>
                  <div className="text-xs text-gray-500 mb-2 font-semibold uppercase tracking-wide">2.2 — Компиляция TypeScript → JavaScript</div>
                  <CodeBlock
                    code={`# Компилируем TypeScript в папку dist/\nnpx tsc\n\n# Проверяем, что файл создан\nls dist/index.js\n# или в Windows:\ndir dist\\index.js`}
                    id="guide-build"
                    copiedBlock={copiedBlock}
                    onCopy={copyToClipboard}
                    lang="bash"
                  />
                </div>

                <div>
                  <div className="text-xs text-gray-500 mb-2 font-semibold uppercase tracking-wide">2.3 — Локальная проверка (опционально)</div>
                  <CodeBlock
                    code={`# Задаём переменные окружения и запускаем\n# Linux/macOS:\nLISTOK_DOMAIN=yourdomain.listokcrm.ru LISTOK_TOKEN=your_token node dist/index.js\n\n# Windows (PowerShell):\n$env:LISTOK_DOMAIN="yourdomain.listokcrm.ru"\n$env:LISTOK_TOKEN="your_token"\nnode dist/index.js\n\n# Windows (cmd):\nset LISTOK_DOMAIN=yourdomain.listokcrm.ru\nset LISTOK_TOKEN=your_token\nnode dist/index.js`}
                    id="guide-local-run"
                    copiedBlock={copiedBlock}
                    onCopy={copyToClipboard}
                    lang="bash"
                  />
                  <p className="text-xs text-gray-400 mt-2">Если видите <code className="bg-gray-800 px-1 rounded text-emerald-400">ListOk CRM MCP Server запущен</code> — всё работает. Нажмите <code className="bg-gray-800 px-1 rounded">Ctrl+C</code> для остановки.</p>
                </div>
              </div>
            </div>

            {/* ===== ШАГ 3: ЧТО ЗАГРУЖАТЬ ===== */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-3">
                <span className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 text-white flex items-center justify-center font-bold">3</span>
                Определяем, что загружать на сервер
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                Структура проекта после сборки. На сервер нужно загрузить <strong className="text-white">только то, что выделено зелёным</strong>.
              </p>

              <div className="bg-gray-950 border border-gray-800 rounded-lg p-4 font-mono text-sm">
                <div className="space-y-1">
                  <div className="text-gray-400">listok-crm-mcp/</div>
                  <div className="ml-4 text-gray-500">├── 📁 node_modules/ <span className="text-gray-600 text-xs">← ❌ НЕ загружаем (установим на сервере)</span></div>
                  <div className="ml-4 text-gray-500">├── 📁 src/ <span className="text-gray-600 text-xs">← ❌ не обязательно</span></div>
                  <div className="ml-4 text-emerald-400">├── 📁 <strong>dist/</strong> <span className="text-gray-600 text-xs">← ✅ обязательно (скомпилированный код)</span></div>
                  <div className="ml-4 text-emerald-400">├── 📄 <strong>package.json</strong> <span className="text-gray-600 text-xs">← ✅ обязательно</span></div>
                  <div className="ml-4 text-emerald-400">├── 📄 <strong>package-lock.json</strong> <span className="text-gray-600 text-xs">← ✅ обязательно</span></div>
                  <div className="ml-4 text-gray-500">├── 📄 tsconfig.json <span className="text-gray-600 text-xs">← не нужно</span></div>
                  <div className="ml-4 text-gray-500">├── 📄 .gitignore <span className="text-gray-600 text-xs">← не нужно</span></div>
                  <div className="ml-4 text-gray-500">└── 📄 README.md <span className="text-gray-600 text-xs">← не нужно</span></div>
                </div>
              </div>

              <div className="mt-4 grid md:grid-cols-2 gap-3">
                <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-lg p-3">
                  <div className="text-emerald-400 font-semibold text-sm mb-2">✅ Что загружаем:</div>
                  <ul className="text-xs text-gray-300 space-y-1">
                    <li>• Папка <code className="bg-gray-800 px-1 rounded">dist/</code> (вся целиком)</li>
                    <li>• Файл <code className="bg-gray-800 px-1 rounded">package.json</code></li>
                    <li>• Файл <code className="bg-gray-800 px-1 rounded">package-lock.json</code></li>
                  </ul>
                </div>
                <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-3">
                  <div className="text-red-400 font-semibold text-sm mb-2">❌ Что НЕ загружаем:</div>
                  <ul className="text-xs text-gray-300 space-y-1">
                    <li>• <code className="bg-gray-800 px-1 rounded">node_modules/</code> — установится на сервере</li>
                    <li>• <code className="bg-gray-800 px-1 rounded">src/</code> — уже скомпилировано</li>
                    <li>• <code className="bg-gray-800 px-1 rounded">.env</code> — создадим на сервере</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* ===== ШАГ 4: ЗАГРУЗКА ЧЕРЕЗ ФАЙЛОВЫЙ МЕНЕДЖЕР ===== */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-3">
                <span className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 text-white flex items-center justify-center font-bold">4</span>
                Загружаем файлы на сервер через файловый менеджер
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                Выберите ваш способ подключения к серверу:
              </p>

              <div className="space-y-4">
                {/* FTP / SFTP */}
                <div className="bg-gray-950 border border-gray-800 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg">🔌</span>
                    <h4 className="text-white font-semibold">Вариант A: FileZilla / WinSCP / Cyberduck (SFTP)</h4>
                  </div>
                  <div className="space-y-3 text-sm text-gray-300">
                    <div className="flex gap-3">
                      <span className="text-emerald-400 font-bold">1.</span>
                      <div>
                        <p>Откройте файловый менеджер (например, <strong>FileZilla</strong>)</p>
                        <p className="text-xs text-gray-500 mt-1">Скачать: <a href="https://filezilla-project.org/" target="_blank" rel="noreferrer" className="text-emerald-400 hover:underline">filezilla-project.org</a></p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <span className="text-emerald-400 font-bold">2.</span>
                      <div>
                        <p>Подключитесь к серверу по SFTP:</p>
                        <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                          <div className="bg-gray-800 rounded p-2"><span className="text-gray-500">Хост:</span> <span className="text-white">IP или домен сервера</span></div>
                          <div className="bg-gray-800 rounded p-2"><span className="text-gray-500">Порт:</span> <span className="text-white">22 (SFTP)</span></div>
                          <div className="bg-gray-800 rounded p-2"><span className="text-gray-500">Логин:</span> <span className="text-white">root / ваш пользователь</span></div>
                          <div className="bg-gray-800 rounded p-2"><span className="text-gray-500">Пароль:</span> <span className="text-white">••••••••</span></div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <span className="text-emerald-400 font-bold">3.</span>
                      <div>
                        <p>На сервере перейдите в папку <code className="bg-gray-800 px-1.5 py-0.5 rounded text-emerald-400">/opt/listok-crm-mcp/</code></p>
                        <p className="text-xs text-gray-500 mt-1">Если её нет — создайте через правый клик → «Создать каталог»</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <span className="text-emerald-400 font-bold">4.</span>
                      <div>
                        <p>Перетащите с локального компьютера на сервер:</p>
                        <ul className="mt-1 space-y-0.5 text-xs text-gray-400">
                          <li>• папку <code className="bg-gray-800 px-1 rounded">dist/</code></li>
                          <li>• файл <code className="bg-gray-800 px-1 rounded">package.json</code></li>
                          <li>• файл <code className="bg-gray-800 px-1 rounded">package-lock.json</code></li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Web panel */}
                <div className="bg-gray-950 border border-gray-800 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg">🌐</span>
                    <h4 className="text-white font-semibold">Вариант B: Веб-панель хостинга (ISPmanager / cPanel / FastPanel / Plesk)</h4>
                  </div>
                  <div className="space-y-3 text-sm text-gray-300">
                    <div className="flex gap-3">
                      <span className="text-emerald-400 font-bold">1.</span>
                      <p>Войдите в веб-панель управления сервером</p>
                    </div>
                    <div className="flex gap-3">
                      <span className="text-emerald-400 font-bold">2.</span>
                      <p>Откройте <strong>Файловый менеджер</strong> (File Manager)</p>
                    </div>
                    <div className="flex gap-3">
                      <span className="text-emerald-400 font-bold">3.</span>
                      <p>Перейдите в <code className="bg-gray-800 px-1.5 py-0.5 rounded text-emerald-400">/opt/</code> и создайте папку <code className="bg-gray-800 px-1.5 py-0.5 rounded text-emerald-400">listok-crm-mcp</code></p>
                    </div>
                    <div className="flex gap-3">
                      <span className="text-emerald-400 font-bold">4.</span>
                      <div>
                        <p>Загрузите файлы через кнопку <strong>«Загрузить» / «Upload»</strong>:</p>
                        <p className="text-xs text-gray-500 mt-1">
                          💡 Совет: сначала упакуйте <code className="bg-gray-800 px-1 rounded">dist/</code>, <code className="bg-gray-800 px-1 rounded">package.json</code> и <code className="bg-gray-800 px-1 rounded">package-lock.json</code> в ZIP-архив локально, загрузите один файл и распакуйте на сервере.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* mc / sftp via panel */}
                <div className="bg-gray-950 border border-gray-800 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg">⌨️</span>
                    <h4 className="text-white font-semibold">Вариант C: Встроенный файловый менеджер в SSH-терминале (mc)</h4>
                  </div>
                  <CodeBlock
                    code={`# Если есть доступ к терминалу, но хочется GUI:\nssh your-server\nsudo apt install mc -y   # или yum install mc\nmc\n\n# Откроется двухпанельный файловый менеджер.\n# Слева — локальные файлы (через SFTP link), справа — сервер.`}
                    id="guide-mc"
                    copiedBlock={copiedBlock}
                    onCopy={copyToClipboard}
                    lang="bash"
                  />
                </div>
              </div>
            </div>

            {/* ===== ШАГ 5: НАСТРОЙКА НА СЕРВЕРЕ ===== */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-3">
                <span className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 text-white flex items-center justify-center font-bold">5</span>
                Настраиваем сервер
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                После загрузки файлов — подключаемся к серверу по SSH (или через веб-консоль хостинга) и выполняем команды.
              </p>

              <div className="space-y-4">
                <div>
                  <div className="text-xs text-gray-500 mb-2 font-semibold uppercase tracking-wide">5.1 — Установить Node.js (если ещё не установлен)</div>
                  <CodeBlock
                    code={`# Проверяем, есть ли Node.js:\nnode -v\n\n# Если нет — устанавливаем Node.js 20:\ncurl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -\nsudo apt-get install -y nodejs\n\n# Проверяем:\nnode -v   # должно быть v20.x.x\nnpm -v`}
                    id="guide-nodejs"
                    copiedBlock={copiedBlock}
                    onCopy={copyToClipboard}
                    lang="bash"
                  />
                </div>

                <div>
                  <div className="text-xs text-gray-500 mb-2 font-semibold uppercase tracking-wide">5.2 — Установить зависимости на сервере</div>
                  <CodeBlock
                    code={`cd /opt/listok-crm-mcp\n\n# Устанавливаем только production-зависимости (быстрее и легче)\nnpm install --production\n\n# Проверяем, что node_modules создан\nls node_modules/@modelcontextprotocol`}
                    id="guide-server-install"
                    copiedBlock={copiedBlock}
                    onCopy={copyToClipboard}
                    lang="bash"
                  />
                </div>

                <div>
                  <div className="text-xs text-gray-500 mb-2 font-semibold uppercase tracking-wide">5.3 — Создать .env файл с токенами</div>
                  <CodeBlock
                    code={`# Создаём .env файл:\nnano /opt/listok-crm-mcp/.env\n\n# Вставляем содержимое:\nLISTOK_DOMAIN=yourdomain.listokcrm.ru\nLISTOK_TOKEN=your_bearer_token_here\n\n# Сохраняем: Ctrl+O, Enter, Ctrl+X\n\n# Защищаем файл от посторонних:\nchmod 600 /opt/listok-crm-mcp/.env`}
                    id="guide-env"
                    copiedBlock={copiedBlock}
                    onCopy={copyToClipboard}
                    lang="bash"
                  />
                </div>

                <div>
                  <div className="text-xs text-gray-500 mb-2 font-semibold uppercase tracking-wide">5.4 — Проверить запуск вручную</div>
                  <CodeBlock
                    code={`cd /opt/listok-crm-mcp\n\n# Загружаем переменные и запускаем:\nset -a && source .env && set +a\nnode dist/index.js\n\n# Должно появиться:\n# ListOk CRM MCP Server запущен\n\n# Останавливаем: Ctrl+C`}
                    id="guide-manual-run"
                    copiedBlock={copiedBlock}
                    onCopy={copyToClipboard}
                    lang="bash"
                  />
                </div>
              </div>
            </div>

            {/* ===== ШАГ 6: SYSTEMD ===== */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-3">
                <span className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 text-white flex items-center justify-center font-bold">6</span>
                Делаем автозапуск через systemd
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                Чтобы сервер запускался автоматически при старте системы и перезапускался при сбоях.
              </p>

              <CodeBlock
                code={`# Создаём unit-файл:\nsudo nano /etc/systemd/system/listok-mcp.service\n\n# Вставляем:\n[Unit]\nDescription=ListOk CRM MCP Server\nAfter=network.target\n\n[Service]\nType=simple\nWorkingDirectory=/opt/listok-crm-mcp\nEnvironmentFile=/opt/listok-crm-mcp/.env\nExecStart=/usr/bin/node /opt/listok-crm-mcp/dist/index.js\nRestart=always\nRestartSec=5\nStandardError=journal\n\n[Install]\nWantedBy=multi-user.target\n\n# Сохраняем: Ctrl+O, Enter, Ctrl+X\n\n# Активируем и запускаем:\nsudo systemctl daemon-reload\nsudo systemctl enable listok-mcp\nsudo systemctl start listok-mcp\n\n# Проверяем статус:\nsudo systemctl status listok-mcp\n\n# Смотрим логи в реальном времени:\nsudo journalctl -u listok-mcp -f`}
                id="guide-systemd"
                copiedBlock={copiedBlock}
                onCopy={copyToClipboard}
                lang="bash"
              />
            </div>

            {/* ===== ШАГ 7: ПОДКЛЮЧЕНИЕ К AI ===== */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-3">
                <span className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 text-white flex items-center justify-center font-bold">7</span>
                Подключаем к Codex / Claude / Cursor
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                Теперь, когда сервер работает на удалённой машине, есть <strong className="text-white">два варианта</strong> подключения.
              </p>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-emerald-400 font-bold text-sm">ВАРИАНТ A</span>
                    <span className="text-white font-semibold text-sm">Локальный запуск</span>
                  </div>
                  <p className="text-xs text-gray-400 mb-2">Запустить MCP-сервер на своём компьютере (нужен Node.js локально)</p>
                  <CodeBlock
                    code={`{\n  "mcpServers": {\n    "listok-crm": {\n      "command": "node",\n      "args": ["C:\\\\Projects\\\\listok-crm-mcp\\\\dist\\\\index.js"],\n      "env": {\n        "LISTOK_DOMAIN": "yourdomain.listokcrm.ru",\n        "LISTOK_TOKEN": "your_token"\n      }\n    }\n  }\n}`}
                    id="guide-local-config"
                    copiedBlock={copiedBlock}
                    onCopy={copyToClipboard}
                    lang="json"
                  />
                </div>

                <div className="bg-cyan-500/5 border border-cyan-500/20 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-cyan-400 font-bold text-sm">ВАРИАНТ B</span>
                    <span className="text-white font-semibold text-sm">Удалённый сервер (SSE)</span>
                  </div>
                  <p className="text-xs text-gray-400 mb-2">Если сервер работает на VPS — добавьте SSE-транспорт (см. вкладку «Codex & AI»)</p>
                  <CodeBlock
                    code={`{\n  "mcpServers": {\n    "listok-crm": {\n      "type": "sse",\n      "url": "https://your-server.com:3001/sse"\n    }\n  }\n}`}
                    id="guide-remote-config"
                    copiedBlock={copiedBlock}
                    onCopy={copyToClipboard}
                    lang="json"
                  />
                </div>
              </div>

              <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-4">
                <p className="text-sm text-blue-200">
                  📖 <strong>Подробные инструкции</strong> для каждого AI-клиента (Codex CLI, Claude Desktop, Cursor, Copilot, Windsurf) — во вкладке <button onClick={() => setActiveTab("codex")} className="text-emerald-400 hover:underline font-semibold">«Codex & AI»</button>.
                </p>
              </div>
            </div>

            {/* ===== ИТОГОВАЯ ШПАРГАЛКА ===== */}
            <div className="bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">📌 Шпаргалка: быстрые команды</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-emerald-400 font-bold uppercase mb-2">На локальном компьютере</div>
                  <CodeBlock
                    code={`npm install\nnpx tsc\nnode dist/index.js  # проверка`}
                    id="guide-cheat-local"
                    copiedBlock={copiedBlock}
                    onCopy={copyToClipboard}
                    lang="bash"
                  />
                </div>
                <div>
                  <div className="text-xs text-emerald-400 font-bold uppercase mb-2">На сервере</div>
                  <CodeBlock
                    code={`cd /opt/listok-crm-mcp\nnpm install --production\nsudo systemctl restart listok-mcp\nsudo journalctl -u listok-mcp -f`}
                    id="guide-cheat-server"
                    copiedBlock={copiedBlock}
                    onCopy={copyToClipboard}
                    lang="bash"
                  />
                </div>
              </div>
            </div>

            {/* Troubleshooting */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">🔧 Частые проблемы</h3>
              <div className="space-y-3">
                {[
                  { q: "Ошибка: Cannot find module '@modelcontextprotocol/sdk'", a: "Не установлены зависимости. Выполните `npm install` в папке проекта." },
                  { q: "Ошибка: LISTOK_DOMAIN is not defined", a: "Не заданы переменные окружения. Проверьте .env файл или env в systemd-юните." },
                  { q: "Ошибка: API error 401", a: "Неверный токен. Получите новый Bearer-токен через OAuth в панели ListOk CRM." },
                  { q: "Сервис не стартует (systemd)", a: "Смотрите логи: `sudo journalctl -u listok-mcp -n 50`. Часто — неверный путь к node или dist/index.js." },
                  { q: "FileZilla не подключается", a: "Убедитесь, что выбран протокол SFTP (не FTP), порт 22, и на сервере разрешено SSH-подключение." },
                ].map((item, i) => (
                  <details key={i} className="bg-gray-950 border border-gray-800 rounded-lg overflow-hidden">
                    <summary className="px-4 py-3 cursor-pointer text-sm text-white hover:bg-gray-800/50 transition-colors flex items-center gap-2">
                      <span className="text-amber-400">⚠️</span>
                      <span>{item.q}</span>
                    </summary>
                    <div className="px-4 pb-3 pt-1 text-sm text-gray-300 border-t border-gray-800">
                      → {item.a}
                    </div>
                  </details>
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
            <a href="https://api.listokcrm.ru/" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:text-emerald-300 transition-colors">
              API Документация →
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
