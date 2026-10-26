import { useState, useEffect, useRef } from "react";
import { mcpTools, categories, webhookEvents } from "./data/tools";
import { mcpServerCode } from "./data/serverCode";
import { usageExamples } from "./data/guides";

type Tab = "overview" | "tools" | "usage" | "codex" | "server" | "webhooks" | "settings";

interface ListokSettings {
  domain: string;
  clientId: string;
  clientSecret: string;
  token: string;
  tokenExpiry: number | null;
}

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
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedBlock, setCopiedBlock] = useState<string | null>(null);
  const [expandedExample, setExpandedExample] = useState<string | null>(null);

  // Определяем базовый путь из URL (для сайтов в подпапках)
  const getBasePath = () => {
    let pathname = window.location.pathname;
    // Убираем index.html из конца
    if (pathname.endsWith("index.html")) {
      pathname = pathname.slice(0, -"index.html".length);
    }
    // Убираем trailing slash
    if (pathname.endsWith("/")) {
      pathname = pathname.slice(0, -1);
    }
    return pathname;
  };

  const basePath = getBasePath();
  const redirectUri = window.location.origin + basePath + "/oauth-callback.html";

  // Settings state
  const [settings, setSettings] = useState<ListokSettings>({
    domain: "",
    clientId: "",
    clientSecret: "",
    token: "",
    tokenExpiry: null,
  });
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccess, setAuthSuccess] = useState(false);

  // Load settings from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("listok-settings");
    if (saved) {
      try {
        setSettings(JSON.parse(saved));
      } catch {}
    }

    // Обработка возврата с OAuth через query-параметр (если popup не сработал)
    const urlParams = new URLSearchParams(window.location.search);
    const oauthCode = urlParams.get("oauth_code");
    if (oauthCode) {
      // Убираем параметр из URL
      window.history.replaceState({}, document.title, window.location.pathname);
      // Обмениваем код на токен
      const savedSettings = localStorage.getItem("listok-settings");
      if (savedSettings) {
        try {
          const parsed = JSON.parse(savedSettings);
          setSettings(parsed);
          // Небольшая задержка, чтобы state обновился
          setTimeout(() => exchangeCodeForTokenRef.current?.(oauthCode, parsed), 100);
        } catch {}
      }
    }
  }, []);

  // Ref для функции обмена кода (чтобы избежать замыкания)
  const exchangeCodeForTokenRef = useRef<((code: string, currentSettings: ListokSettings) => void) | null>(null);

  const saveSettings = (newSettings: ListokSettings) => {
    setSettings(newSettings);
    localStorage.setItem("listok-settings", JSON.stringify(newSettings));
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedBlock(id);
    setTimeout(() => setCopiedBlock(null), 2000);
  };

  const handleOAuth = async () => {
    if (!settings.domain || !settings.clientId || !settings.clientSecret) {
      setAuthError("Заполните все поля");
      return;
    }
    setAuthLoading(true);
    setAuthError(null);
    setAuthSuccess(false);

    try {
      // OAuth authorization code flow
      // redirect_uri должен ТОЧНО совпадать с тем, что указано в настройках ListOk CRM
      // Сохраняем redirect_uri, чтобы использовать его при обмене кода на токен
      localStorage.setItem("listok-redirect-uri", redirectUri);
      const authUrl = `https://${settings.domain}/oauth/authorize?client_id=${encodeURIComponent(settings.clientId)}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code`;
      
      // Open OAuth window
      const width = 600;
      const height = 700;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;
      const popup = window.open(authUrl, "listok-oauth", `width=${width},height=${height},left=${left},top=${top}`);

      // Listen for the callback
      const handleMessage = (event: MessageEvent) => {
        if (event.data?.type === "listok-oauth-callback" && event.data?.code) {
          window.removeEventListener("message", handleMessage);
          exchangeCodeForToken(event.data.code);
        }
      };
      window.addEventListener("message", handleMessage);

      // Also check if popup was closed
      const checkClosed = setInterval(() => {
        if (popup?.closed) {
          clearInterval(checkClosed);
          window.removeEventListener("message", handleMessage);
          setAuthLoading(false);
        }
      }, 500);
    } catch (err) {
      setAuthError("Ошибка авторизации: " + String(err));
      setAuthLoading(false);
    }
  };

  const exchangeCodeForToken = async (code: string, currentSettings?: ListokSettings) => {
    const s = currentSettings || settings;
    // Используем сохранённый redirect_uri (тот, что был при авторизации)
    const savedRedirectUri = localStorage.getItem("listok-redirect-uri") || redirectUri;
    
    try {
      // Отправляем запрос на серверный PHP-прокси (обходит CORS)
      const proxyUrl = basePath + "/oauth-proxy.php";
      
      const response = await fetch(proxyUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: code,
          client_id: s.clientId,
          client_secret: s.clientSecret,
          redirect_uri: savedRedirectUri,
          domain: s.domain,
        }),
      });

      const responseText = await response.text();
      let data: any;
      try {
        data = JSON.parse(responseText);
      } catch {
        data = { raw: responseText };
      }

      if (!response.ok) {
        const errorMsg = data?.error_description || data?.message || data?.error || responseText;
        throw new Error(`${response.status}: ${errorMsg}`);
      }

      if (!data.access_token) {
        throw new Error("Токен не получен. Ответ: " + JSON.stringify(data));
      }

      const newSettings = {
        ...s,
        token: data.access_token,
        tokenExpiry: data.expires_in ? Date.now() + data.expires_in * 1000 : null,
      };
      saveSettings(newSettings);
      setAuthSuccess(true);
      setAuthLoading(false);
    } catch (err) {
      setAuthError("Ошибка получения токена: " + String(err));
      setAuthLoading(false);
    }
  };

  // Сохраняем функцию в ref для доступа из useEffect
  useEffect(() => {
    exchangeCodeForTokenRef.current = exchangeCodeForToken;
  });

  // Manual token input
  const handleManualToken = () => {
    if (!settings.domain || !settings.token) {
      setAuthError("Укажите домен и токен");
      return;
    }
    saveSettings(settings);
    setAuthSuccess(true);
    setAuthError(null);
  };

  const handleDisconnect = () => {
    const newSettings = { ...settings, token: "", tokenExpiry: null };
    saveSettings(newSettings);
    setAuthSuccess(false);
  };

  const filteredTools = mcpTools.filter((tool) => {
    const matchesCategory = selectedCategory === "all" || tool.category === selectedCategory;
    const matchesSearch = !searchQuery || tool.name.toLowerCase().includes(searchQuery.toLowerCase()) || tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const tabs = [
    { id: "overview" as Tab, label: "Обзор", icon: "🏠" },
    { id: "tools" as Tab, label: "Инструменты", icon: "🔧" },
    { id: "usage" as Tab, label: "Использование", icon: "💬" },
    { id: "codex" as Tab, label: "Codex & AI", icon: "🤖" },
    { id: "server" as Tab, label: "Код сервера", icon: "📝" },
    { id: "webhooks" as Tab, label: "Webhooks", icon: "🔔" },
    { id: "settings" as Tab, label: "Настройки", icon: "⚙️" },
  ];

  const isConnected = !!settings.token;

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
                <h1 className="text-lg font-bold text-white">ТУРНИКС & ListOk CRM</h1>
                <p className="text-xs text-gray-400 -mt-0.5">MCP Server</p>
              </div>
              {isConnected && (
                <span className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Подключено
                </span>
              )}
            </div>
            <nav className="hidden lg:flex items-center gap-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      : "text-gray-400 hover:text-gray-200 hover:bg-gray-800/50"
                  }`}
                >
                  <span className="mr-1">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
          {/* Mobile nav */}
          <div className="lg:hidden flex overflow-x-auto gap-1 pb-3 -mx-1 px-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeTab === tab.id
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
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
                <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">ТУРНИКС & ListOk CRM</span>
              </h2>
              <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                Полноценный MCP-сервер, предоставляющий AI-ассистентам доступ к API ListOk CRM.
              </p>
              {!isConnected && (
                <button
                  onClick={() => setActiveTab("settings")}
                  className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg transition-colors"
                >
                  ⚙️ Подключить CRM
                </button>
              )}
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
                { title: "Расписание и занятия", description: "Полное управление расписанием: создание занятий, записи, отметки посещений.", tools: mcpTools.filter((t) => ["Занятия", "Записи", "Посещения"].includes(t.category)).length },
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
          </div>
        )}

        {/* ==================== TOOLS ==================== */}
        {activeTab === "tools" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">🔧 MCP Инструменты</h2>
                <p className="text-gray-400 text-sm mt-1">{filteredTools.length} из {mcpTools.length}</p>
              </div>
              <input
                type="text"
                placeholder="Поиск..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-72 px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <button onClick={() => setSelectedCategory("all")} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${selectedCategory === "all" ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-gray-800 text-gray-400 hover:text-gray-200 border border-gray-700"}`}>Все</button>
              {categories.map((cat) => (
                <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${selectedCategory === cat ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-gray-800 text-gray-400 hover:text-gray-200 border border-gray-700"}`}>{cat}</button>
              ))}
            </div>

            <div className="space-y-4">
              {filteredTools.map((tool) => (
                <div key={tool.name} className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-colors">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <code className="text-emerald-400 font-mono font-semibold text-sm">{tool.name}</code>
                        <span className={`px-1.5 py-0.5 rounded text-xs font-mono ${tool.method === "GET" ? "bg-blue-500/10 text-blue-400" : tool.method === "POST" ? "bg-green-500/10 text-green-400" : tool.method === "PUT" || tool.method === "PATCH" ? "bg-yellow-500/10 text-yellow-400" : "bg-red-500/10 text-red-400"}`}>{tool.method}</span>
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

        {/* ==================== USAGE ==================== */}
        {activeTab === "usage" && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-white">💬 Как пользоваться</h2>
              <p className="text-gray-400 text-sm mt-1">Примеры запросов к AI-ассистенту после подключения MCP-сервера</p>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Как это работает</h3>
              <div className="grid md:grid-cols-4 gap-4">
                {[
                  { step: "1", title: "Вы пишете запрос", desc: "На естественном языке", color: "from-blue-500 to-blue-600" },
                  { step: "2", title: "AI выбирает инструмент", desc: "Определяет нужный MCP-инструмент", color: "from-purple-500 to-purple-600" },
                  { step: "3", title: "Запрос к API", desc: "MCP сервер вызывает ListOk API", color: "from-emerald-500 to-emerald-600" },
                  { step: "4", title: "AI отвечает", desc: "Формирует понятный ответ", color: "from-amber-500 to-amber-600" },
                ].map((item) => (
                  <div key={item.step} className="text-center">
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center text-white font-bold mx-auto mb-3`}>{item.step}</div>
                    <h4 className="text-sm font-semibold text-white mb-1">{item.title}</h4>
                    <p className="text-xs text-gray-400">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {usageExamples.map((category) => (
              <div key={category.category} className="space-y-3">
                <h3 className="text-lg font-semibold text-white">{category.category}</h3>
                <div className="space-y-2">
                  {category.examples.map((example, i) => {
                    const key = `${category.category}-${i}`;
                    const isExpanded = expandedExample === key;
                    return (
                      <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-gray-700 transition-colors">
                        <button onClick={() => setExpandedExample(isExpanded ? null : key)} className="w-full text-left px-5 py-4 flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <span className="text-emerald-400">💬</span>
                            <span className="text-gray-200 text-sm">{example.prompt}</span>
                          </div>
                          <svg className={`w-4 h-4 text-gray-500 transition-transform flex-shrink-0 ${isExpanded ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        {isExpanded && (
                          <div className="px-5 pb-4 border-t border-gray-800 pt-3 space-y-3">
                            <p className="text-xs text-gray-400">{example.description}</p>
                            <div>
                              <span className="text-xs text-gray-500 mb-1 block">Инструмент:</span>
                              <code className="text-emerald-400 font-mono text-sm bg-gray-950 px-2 py-1 rounded">{example.tool}</code>
                            </div>
                            <div>
                              <span className="text-xs text-gray-500 mb-1 block">Аргументы:</span>
                              <pre className="bg-gray-950 border border-gray-800 rounded-lg p-3 text-xs text-cyan-300 font-mono overflow-x-auto">{example.args}</pre>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ==================== CODEX & AI ==================== */}
        {activeTab === "codex" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white">🤖 Подключение к AI</h2>
              <p className="text-gray-400 text-sm mt-1">Выберите AI-клиент и скопируйте готовый конфиг</p>
            </div>

            {!isConnected ? (
              <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-6 text-center">
                <span className="text-4xl mb-3 block">🔐</span>
                <p className="text-amber-200 font-medium mb-2">Сначала подключите ListOk CRM</p>
                <button onClick={() => setActiveTab("settings")} className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-medium transition-colors">
                  Перейти в настройки
                </button>
              </div>
            ) : (
              <>
                {/* Token info */}
                <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-emerald-400 text-sm font-medium">✓ Подключено к {settings.domain}</span>
                    <button
                      onClick={() => copyToClipboard(settings.token, "token")}
                      className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
                    >
                      {copiedBlock === "token" ? "✓ Скопировано" : "📋 Копировать токен"}
                    </button>
                  </div>
                  <p className="text-xs text-gray-400">Токен автоматически подставлен в конфиги ниже</p>
                </div>

                {/* AI Clients Grid */}
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Claude Desktop */}
                  <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-emerald-500/30 transition-colors">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-3xl">🟠</span>
                      <div>
                        <h3 className="text-white font-semibold">Claude Desktop</h3>
                        <p className="text-xs text-gray-400">Лучший UX, нативная поддержка</p>
                      </div>
                    </div>
                    <div className="space-y-2 mb-4">
                      <p className="text-xs text-gray-400">1. Откройте Claude → Settings → Developer → Edit Config</p>
                      <p className="text-xs text-gray-400">2. Вставьте конфиг и сохраните</p>
                      <p className="text-xs text-gray-400">3. Перезапустите Claude Desktop</p>
                    </div>
                    <div className="relative group">
                      <pre className="bg-gray-950 border border-gray-800 rounded-lg p-3 text-xs text-gray-300 font-mono overflow-x-auto max-h-32">
{JSON.stringify({
  mcpServers: {
    "listok-crm": {
      command: "node",
      args: ["/path/to/dist/index.js"],
      env: {
        LISTOK_DOMAIN: settings.domain,
        LISTOK_TOKEN: settings.token.substring(0, 20) + "..."
      }
    }
  }
}, null, 2)}
                      </pre>
                      <button
                        onClick={() => copyToClipboard(JSON.stringify({
                          mcpServers: {
                            "listok-crm": {
                              command: "node",
                              args: ["/path/to/dist/index.js"],
                              env: {
                                LISTOK_DOMAIN: settings.domain,
                                LISTOK_TOKEN: settings.token
                              }
                            }
                          }
                        }, null, 2), "claude")}
                        className="absolute top-2 right-2 px-2 py-1 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        {copiedBlock === "claude" ? "✓" : "📋"}
                      </button>
                    </div>
                  </div>

                  {/* Cursor */}
                  <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-emerald-500/30 transition-colors">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-3xl">⚡</span>
                      <div>
                        <h3 className="text-white font-semibold">Cursor IDE</h3>
                        <p className="text-xs text-gray-400">Интеграция в редактор</p>
                      </div>
                    </div>
                    <div className="space-y-2 mb-4">
                      <p className="text-xs text-gray-400">1. Откройте Settings → MCP</p>
                      <p className="text-xs text-gray-400">2. Нажмите «Add new MCP server»</p>
                      <p className="text-xs text-gray-400">3. Вставьте конфиг</p>
                    </div>
                    <div className="relative group">
                      <pre className="bg-gray-950 border border-gray-800 rounded-lg p-3 text-xs text-gray-300 font-mono overflow-x-auto max-h-32">
{JSON.stringify({
  mcpServers: {
    "listok-crm": {
      command: "node",
      args: ["/path/to/dist/index.js"],
      env: {
        LISTOK_DOMAIN: settings.domain,
        LISTOK_TOKEN: settings.token.substring(0, 20) + "..."
      }
    }
  }
}, null, 2)}
                      </pre>
                      <button
                        onClick={() => copyToClipboard(JSON.stringify({
                          mcpServers: {
                            "listok-crm": {
                              command: "node",
                              args: ["/path/to/dist/index.js"],
                              env: {
                                LISTOK_DOMAIN: settings.domain,
                                LISTOK_TOKEN: settings.token
                              }
                            }
                          }
                        }, null, 2), "cursor")}
                        className="absolute top-2 right-2 px-2 py-1 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        {copiedBlock === "cursor" ? "✓" : "📋"}
                      </button>
                    </div>
                  </div>

                  {/* VS Code / Copilot */}
                  <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-emerald-500/30 transition-colors">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-3xl">🐙</span>
                      <div>
                        <h3 className="text-white font-semibold">GitHub Copilot</h3>
                        <p className="text-xs text-gray-400">Встроен в VS Code</p>
                      </div>
                    </div>
                    <div className="space-y-2 mb-4">
                      <p className="text-xs text-gray-400">1. Создайте файл .vscode/mcp.json</p>
                      <p className="text-xs text-gray-400">2. Вставьте конфиг</p>
                      <p className="text-xs text-gray-400">3. Перезапустите VS Code</p>
                    </div>
                    <div className="relative group">
                      <pre className="bg-gray-950 border border-gray-800 rounded-lg p-3 text-xs text-gray-300 font-mono overflow-x-auto max-h-32">
{JSON.stringify({
  servers: {
    "listok-crm": {
      type: "stdio",
      command: "node",
      args: ["/path/to/dist/index.js"],
      env: {
        LISTOK_DOMAIN: settings.domain,
        LISTOK_TOKEN: settings.token.substring(0, 20) + "..."
      }
    }
  }
}, null, 2)}
                      </pre>
                      <button
                        onClick={() => copyToClipboard(JSON.stringify({
                          servers: {
                            "listok-crm": {
                              type: "stdio",
                              command: "node",
                              args: ["/path/to/dist/index.js"],
                              env: {
                                LISTOK_DOMAIN: settings.domain,
                                LISTOK_TOKEN: settings.token
                              }
                            }
                          }
                        }, null, 2), "vscode")}
                        className="absolute top-2 right-2 px-2 py-1 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        {copiedBlock === "vscode" ? "✓" : "📋"}
                      </button>
                    </div>
                  </div>

                  {/* Codex CLI */}
                  <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-emerald-500/30 transition-colors">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-3xl">🤖</span>
                      <div>
                        <h3 className="text-white font-semibold">OpenAI Codex CLI</h3>
                        <p className="text-xs text-gray-400">Терминал, агентный режим</p>
                      </div>
                    </div>
                    <div className="space-y-2 mb-4">
                      <p className="text-xs text-gray-400">1. Установите: npm i -g @openai/codex</p>
                      <p className="text-xs text-gray-400">2. Создайте ~/.codex/config.json</p>
                      <p className="text-xs text-gray-400">3. Вставьте конфиг</p>
                    </div>
                    <div className="relative group">
                      <pre className="bg-gray-950 border border-gray-800 rounded-lg p-3 text-xs text-gray-300 font-mono overflow-x-auto max-h-32">
{JSON.stringify({
  mcpServers: {
    "listok-crm": {
      type: "stdio",
      command: "node",
      args: ["/path/to/dist/index.js"],
      env: {
        LISTOK_DOMAIN: settings.domain,
        LISTOK_TOKEN: settings.token.substring(0, 20) + "..."
      }
    }
  }
}, null, 2)}
                      </pre>
                      <button
                        onClick={() => copyToClipboard(JSON.stringify({
                          mcpServers: {
                            "listok-crm": {
                              type: "stdio",
                              command: "node",
                              args: ["/path/to/dist/index.js"],
                              env: {
                                LISTOK_DOMAIN: settings.domain,
                                LISTOK_TOKEN: settings.token
                              }
                            }
                          }
                        }, null, 2), "codex")}
                        className="absolute top-2 right-2 px-2 py-1 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        {copiedBlock === "codex" ? "✓" : "📋"}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Important note */}
                <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4">
                  <p className="text-sm text-blue-200">
                    💡 <strong>Важно:</strong> Замените <code className="bg-gray-800 px-1 rounded text-xs">/path/to/dist/index.js</code> на реальный путь к MCP-серверу на вашем компьютере
                  </p>
                </div>
              </>
            )}
          </div>
        )}

        {/* ==================== SERVER CODE ==================== */}
        {activeTab === "server" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white">📝 Исходный код MCP сервера</h2>
              <p className="text-gray-400 text-sm mt-1">Полный код TypeScript MCP сервера для интеграции с ListOk CRM API</p>
            </div>
            <CodeBlock code={mcpServerCode} id="server" copiedBlock={copiedBlock} onCopy={copyToClipboard} lang="typescript" />
          </div>
        )}

        {/* ==================== WEBHOOKS ==================== */}
        {activeTab === "webhooks" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white">🔔 Webhook события</h2>
              <p className="text-gray-400 text-sm mt-1">События, на которые можно подписаться</p>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-gray-300 mb-3">Проверка подписи</h3>
              <CodeBlock code={`$signature = hash_hmac('sha256', json_encode($payload), $webhookSecret);\nif ($signature === $_SERVER['X-Webhook-Signature']) {\n    // Подтверждено\n}`} id="webhook-sig" copiedBlock={copiedBlock} onCopy={copyToClipboard} lang="php" />
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

        {/* ==================== SETTINGS ==================== */}
        {activeTab === "settings" && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-white">⚙️ Настройки подключения</h2>
              <p className="text-gray-400 text-sm mt-1">Авторизация в ListOk CRM и конфигурация MCP-сервера</p>
            </div>

            {/* Connection Status */}
            <div className={`rounded-xl p-5 border ${isConnected ? "bg-emerald-500/5 border-emerald-500/20" : "bg-gray-900 border-gray-800"}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isConnected ? "bg-emerald-500/20" : "bg-gray-800"}`}>
                    {isConnected ? (
                      <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <h3 className={`font-semibold ${isConnected ? "text-emerald-400" : "text-gray-300"}`}>
                      {isConnected ? "Подключено к ListOk CRM" : "Не подключено"}
                    </h3>
                    <p className="text-xs text-gray-400">
                      {isConnected ? settings.domain : "Настройте авторизацию для использования MCP-сервера"}
                    </p>
                  </div>
                </div>
                {isConnected && (
                  <button onClick={handleDisconnect} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors">
                    Отключить
                  </button>
                )}
              </div>
            </div>

            {/* OAuth Section */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-1 flex items-center gap-2">
                🔐 OAuth 2.0 авторизация
              </h3>
              <p className="text-gray-400 text-sm mb-5">
                Автоматическое получение токена через браузер. Нужны Client ID и Client Secret из панели ListOk CRM.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Домен CRM <span className="text-red-400">*</span></label>
                  <input
                    type="text"
                    placeholder="yourdomain.listokcrm.ru"
                    value={settings.domain}
                    onChange={(e) => setSettings({ ...settings, domain: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-950 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-mono text-sm"
                  />
                  <p className="text-xs text-gray-500 mt-1">Адрес вашей CRM, например: mystudio.listokcrm.ru</p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Client ID <span className="text-red-400">*</span></label>
                    <input
                      type="text"
                      placeholder="Ваш client_id"
                      value={settings.clientId}
                      onChange={(e) => setSettings({ ...settings, clientId: e.target.value })}
                      className="w-full px-4 py-2.5 bg-gray-950 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-mono text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Client Secret <span className="text-red-400">*</span></label>
                    <input
                      type="password"
                      placeholder="••••••••••••"
                      value={settings.clientSecret}
                      onChange={(e) => setSettings({ ...settings, clientSecret: e.target.value })}
                      className="w-full px-4 py-2.5 bg-gray-950 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-mono text-sm"
                    />
                  </div>
                </div>

                <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-3 space-y-2">
                  <p className="text-xs text-blue-200">
                    💡 <strong>Где взять Client ID и Secret?</strong> В панели ListOk CRM: Настройки → Интеграции → API → Создать OAuth-приложение.
                  </p>
                  <div className="bg-gray-950 border border-gray-800 rounded p-2 mt-2">
                    <p className="text-[10px] text-gray-500 uppercase tracking-wide mb-1">📋 Redirect URI для ListOk CRM (скопируйте и вставьте в настройки):</p>
                    <p className="text-xs text-emerald-400 font-mono break-all select-all">
                      {redirectUri}
                    </p>
                  </div>
                  {window.location.protocol === "http:" && (
                    <p className="text-xs text-amber-300 mt-2">
                      ⚠️ Ваш сайт работает по <strong>HTTP</strong> (без SSL). Убедитесь, что в ListOk CRM указан именно <code className="bg-gray-800 px-1 rounded">http://</code>, а не <code className="bg-gray-800 px-1 rounded">https://</code>.
                    </p>
                  )}
                </div>

                {authError && (
                  <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-3 text-sm text-red-300">
                    <div className="font-semibold mb-1">❌ Ошибка авторизации</div>
                    <pre className="text-xs whitespace-pre-wrap font-mono mt-2 text-red-200">{authError}</pre>
                  </div>
                )}
                {authSuccess && (
                  <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-lg p-3 text-sm text-emerald-300">
                    ✅ Авторизация успешна! Токен получен и сохранён.
                  </div>
                )}

                <button
                  onClick={handleOAuth}
                  disabled={authLoading}
                  className="w-full px-4 py-3 bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-700 disabled:text-gray-500 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  {authLoading ? (
                    <>
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                      Ожидание авторизации...
                    </>
                  ) : (
                    <>🔑 Войти через ListOk CRM</>
                  )}
                </button>
              </div>
            </div>

            {/* Manual Token */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-1 flex items-center gap-2">
                🎫 Ручной ввод токена
              </h3>
              <p className="text-gray-400 text-sm mb-5">
                Если у вас уже есть Bearer-токен — вставьте его напрямую.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Bearer токен</label>
                  <input
                    type="password"
                    placeholder="eyJhbGciOi..."
                    value={settings.token}
                    onChange={(e) => setSettings({ ...settings, token: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-950 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-mono text-sm"
                  />
                </div>
                <button
                  onClick={handleManualToken}
                  className="w-full px-4 py-3 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors border border-gray-700"
                >
                  Сохранить токен
                </button>
              </div>
            </div>

            {/* MCP Config for AI clients */}
            {isConnected && (
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-1 flex items-center gap-2">
                  🔌 Конфигурация для AI-клиентов
                </h3>
                <p className="text-gray-400 text-sm mb-4">
                  Скопируйте эту конфигурацию в ваш AI-клиент (Claude Desktop, Cursor, Codex и т.д.)
                </p>

                <CodeBlock
                  code={JSON.stringify({
                    mcpServers: {
                      "listok-crm": {
                        command: "node",
                        args: ["/path/to/listok-crm-mcp/dist/index.js"],
                        env: {
                          LISTOK_DOMAIN: settings.domain,
                          LISTOK_TOKEN: settings.token.substring(0, 20) + "...",
                        },
                      },
                    },
                  }, null, 2)}
                  id="mcp-config"
                  copiedBlock={copiedBlock}
                  onCopy={copyToClipboard}
                  lang="json"
                />

                <p className="text-xs text-gray-500 mt-3">
                  📖 Подробные инструкции по подключению — во вкладке <button onClick={() => setActiveTab("codex")} className="text-emerald-400 hover:underline">«Codex & AI»</button>
                </p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <p>ТУРНИКС & ListOk CRM • MCP Server • API v2</p>
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
