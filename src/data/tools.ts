export interface MCPTool {
  name: string;
  description: string;
  category: string;
  method: string;
  endpoint: string;
  parameters: {
    name: string;
    type: string;
    required: boolean;
    description: string;
  }[];
  response: string;
}

export const mcpTools: MCPTool[] = [
  // Клиенты (Contacts)
  {
    name: "listok_list_contacts",
    description: "Получить список клиентов CRM. Поддерживает фильтрацию по имени, телефону, email, дате обновления и ID.",
    category: "Клиенты",
    method: "GET",
    endpoint: "/api/external/v2/contacts",
    parameters: [
      { name: "page", type: "integer", required: true, description: "Номер страницы" },
      { name: "name", type: "string", required: false, description: "Фильтр по ФИО" },
      { name: "phone", type: "string", required: false, description: "Фильтр по телефону" },
      { name: "email", type: "string", required: false, description: "Фильтр по email" },
      { name: "since_id", type: "integer", required: false, description: "Вернуть клиентов с ID > указанного" },
      { name: "updated_at_from", type: "string", required: false, description: "Начало периода обновления (ISO 8601)" },
      { name: "updated_at_to", type: "string", required: false, description: "Конец периода обновления (ISO 8601)" },
      { name: "includes", type: "string", required: false, description: "Доп. сущности (passes)" },
    ],
    response: `{ "data": [{ "contact_id": 1, "name": "...", "phone": "...", ... }], "meta": { "pagination": {...} } }`,
  },
  {
    name: "listok_get_contact",
    description: "Получить данные конкретного клиента по ID.",
    category: "Клиенты",
    method: "GET",
    endpoint: "/api/external/v2/contacts/{contact_id}",
    parameters: [
      { name: "contact_id", type: "integer", required: true, description: "ID клиента" },
    ],
    response: `{ "contact_id": 1, "name": "Иванов Иван", "phone": "+79529991122", ... }`,
  },
  {
    name: "listok_create_contact",
    description: "Создать нового клиента в CRM.",
    category: "Клиенты",
    method: "POST",
    endpoint: "/api/external/v2/contacts",
    parameters: [
      { name: "name", type: "string", required: true, description: "ФИО клиента" },
      { name: "phone", type: "string", required: false, description: "Телефон" },
      { name: "email", type: "string", required: false, description: "Email" },
      { name: "birth_date", type: "string", required: false, description: "Дата рождения (YYYY-MM-DD)" },
      { name: "gender", type: "string", required: false, description: "Пол" },
      { name: "note", type: "string", required: false, description: "Заметка" },
      { name: "source_id", type: "integer", required: false, description: "ID источника" },
      { name: "interest", type: "string", required: false, description: "Интересы" },
      { name: "sickness", type: "string", required: false, description: "Противопоказания" },
      { name: "parent_contact_id", type: "integer", required: false, description: "ID родительской карточки" },
    ],
    response: `{ "contact_id": 16, "name": "Иванов Иван", ... }`,
  },
  {
    name: "listok_update_contact",
    description: "Обновить данные существующего клиента.",
    category: "Клиенты",
    method: "PUT",
    endpoint: "/api/external/v2/contacts/{contact_id}",
    parameters: [
      { name: "contact_id", type: "integer", required: true, description: "ID клиента" },
      { name: "name", type: "string", required: false, description: "ФИО клиента" },
      { name: "phone", type: "string", required: false, description: "Телефон" },
      { name: "email", type: "string", required: false, description: "Email" },
      { name: "birth_date", type: "string", required: false, description: "Дата рождения" },
      { name: "note", type: "string", required: false, description: "Заметка" },
    ],
    response: `{ "contact_id": 16, "name": "Иванов Иван Иванович", ... }`,
  },
  // Абонементы (Passes)
  {
    name: "listok_list_passes",
    description: "Получить список абонементов в аккаунте.",
    category: "Абонементы",
    method: "GET",
    endpoint: "/api/external/v2/passes",
    parameters: [
      { name: "page", type: "integer", required: true, description: "Номер страницы" },
    ],
    response: `{ "data": [{ "pass_id": 1, "name": "Абонемент на 10 занятий", "price": 2000, ... }] }`,
  },
  {
    name: "listok_list_contact_passes",
    description: "Получить список абонементов конкретного клиента.",
    category: "Абонементы",
    method: "GET",
    endpoint: "/api/external/v2/contacts/{contact_id}/passes",
    parameters: [
      { name: "contact_id", type: "integer", required: true, description: "ID клиента" },
      { name: "status", type: "string", required: false, description: "Статус: active, expired, frozen, inactive, revoked" },
    ],
    response: `{ "data": [{ "pass_contact_id": 1, "pass_id": 1, "status": "active", ... }] }`,
  },
  {
    name: "listok_issue_pass",
    description: "Оформить абонемент клиенту.",
    category: "Абонементы",
    method: "POST",
    endpoint: "/api/external/v2/contacts/{contact_id}/passes/{pass_id}",
    parameters: [
      { name: "contact_id", type: "integer", required: true, description: "ID клиента" },
      { name: "pass_id", type: "integer", required: true, description: "ID абонемента" },
    ],
    response: `{ "pass_contact_id": 312142, "status": "inactive", ... }`,
  },
  {
    name: "listok_freeze_pass",
    description: "Заморозить абонемент клиента.",
    category: "Абонементы",
    method: "POST",
    endpoint: "/api/external/v2/contacts/{contact_id}/passes/{pass_contact_id}/freeze",
    parameters: [
      { name: "contact_id", type: "integer", required: true, description: "ID клиента" },
      { name: "pass_contact_id", type: "integer", required: true, description: "ID абонемента клиента" },
      { name: "planned_freeze_at", type: "string", required: false, description: "Дата начала заморозки" },
      { name: "freeze_days", type: "integer", required: false, description: "Срок заморозки в днях" },
    ],
    response: `{ "pass_contact_id": 312142, "status": "frozen", ... }`,
  },
  {
    name: "listok_unfreeze_pass",
    description: "Разморозить абонемент клиента.",
    category: "Абонементы",
    method: "POST",
    endpoint: "/api/external/v2/contacts/{contact_id}/passes/{pass_contact_id}/unfreeze",
    parameters: [
      { name: "contact_id", type: "integer", required: true, description: "ID клиента" },
      { name: "pass_contact_id", type: "integer", required: true, description: "ID абонемента клиента" },
    ],
    response: `{ "pass_contact_id": 312142, "status": "active", ... }`,
  },
  {
    name: "listok_generate_pass_payment_link",
    description: "Сгенерировать ссылку на оплату абонемента.",
    category: "Абонементы",
    method: "POST",
    endpoint: "/api/external/v2/contacts/{contact_id}/passes/{pass_id}/link",
    parameters: [
      { name: "contact_id", type: "integer", required: true, description: "ID клиента" },
      { name: "pass_id", type: "integer", required: true, description: "ID абонемента" },
      { name: "promocode", type: "string", required: false, description: "Промокод" },
      { name: "spend_bonuses", type: "integer", required: false, description: "Списать бонусы (фикс. сумма)" },
      { name: "debit_client_balance", type: "integer", required: false, description: "Оплатить с баланса" },
    ],
    response: `{ "link": "https://...", "amount": 2000 }`,
  },
  // Занятия (Events)
  {
    name: "listok_list_events",
    description: "Получить список занятий на дату или период (макс. 31 день).",
    category: "Занятия",
    method: "GET",
    endpoint: "/api/external/v2/events",
    parameters: [
      { name: "date", type: "string", required: false, description: "Дата занятия (YYYY-MM-DD)" },
      { name: "from", type: "string", required: false, description: "Начало периода (YYYY-MM-DD)" },
      { name: "to", type: "string", required: false, description: "Конец периода (YYYY-MM-DD)" },
      { name: "includes", type: "string", required: false, description: "listings,admissions,queue,cancelled_listings" },
    ],
    response: `{ "data": [{ "event_id": 9, "date": "2024-01-01", "group_name": "...", ... }] }`,
  },
  {
    name: "listok_get_event",
    description: "Получить данные конкретного занятия по ID.",
    category: "Занятия",
    method: "GET",
    endpoint: "/api/external/v2/events/{event_id}",
    parameters: [
      { name: "event_id", type: "integer", required: true, description: "ID занятия" },
    ],
    response: `{ "event_id": 9, "date": "2024-01-01", "group_name": "...", "teacher_name": "..." }`,
  },
  {
    name: "listok_create_event",
    description: "Создать новое занятие.",
    category: "Занятия",
    method: "POST",
    endpoint: "/api/external/v2/events",
    parameters: [
      { name: "office_id", type: "integer", required: true, description: "ID филиала" },
      { name: "group_id", type: "integer", required: true, description: "ID группы" },
      { name: "room_id", type: "integer", required: true, description: "ID зала" },
      { name: "contact_id", type: "integer", required: false, description: "ID преподавателя" },
      { name: "date", type: "string", required: true, description: "Дата (YYYY-MM-DD)" },
      { name: "start_time", type: "string", required: true, description: "Время начала (HH:MM)" },
      { name: "event_comment", type: "string", required: false, description: "Комментарий" },
    ],
    response: `{ "event_id": 123, "date": "2025-10-23", ... }`,
  },
  {
    name: "listok_update_event",
    description: "Редактировать занятие.",
    category: "Занятия",
    method: "PUT",
    endpoint: "/api/external/v2/events/{event_id}",
    parameters: [
      { name: "event_id", type: "integer", required: true, description: "ID занятия" },
      { name: "date", type: "string", required: false, description: "Дата (YYYY-MM-DD)" },
      { name: "start_time", type: "string", required: false, description: "Время начала (HH:MM)" },
      { name: "event_comment", type: "string", required: false, description: "Комментарий" },
    ],
    response: `{ "event_id": 9, "date": "2025-10-23", ... }`,
  },
  {
    name: "listok_delete_event",
    description: "Удалить занятие по ID.",
    category: "Занятия",
    method: "DELETE",
    endpoint: "/api/external/v2/events/{event_id}",
    parameters: [
      { name: "event_id", type: "integer", required: true, description: "ID занятия" },
    ],
    response: `204 No Content`,
  },
  // Записи (Listings)
  {
    name: "listok_list_contact_listings",
    description: "Получить список записей клиента на занятия.",
    category: "Записи",
    method: "GET",
    endpoint: "/api/external/v2/contacts/{contact_id}/listings",
    parameters: [
      { name: "contact_id", type: "integer", required: true, description: "ID клиента" },
      { name: "page", type: "integer", required: true, description: "Номер страницы" },
    ],
    response: `{ "data": [{ "listing_id": 1, "event_id": 9, ... }] }`,
  },
  {
    name: "listok_create_listing",
    description: "Записать клиента на занятие.",
    category: "Записи",
    method: "POST",
    endpoint: "/api/external/v2/contacts/{contact_id}/listings/{event_id}",
    parameters: [
      { name: "contact_id", type: "integer", required: true, description: "ID клиента" },
      { name: "event_id", type: "integer", required: true, description: "ID занятия" },
    ],
    response: `{ "listing_id": 312142, "event_id": 123, "contact_id": 16 }`,
  },
  {
    name: "listok_delete_listing",
    description: "Отменить запись клиента на занятие.",
    category: "Записи",
    method: "DELETE",
    endpoint: "/api/external/v2/contacts/{contact_id}/listings/{event_id}",
    parameters: [
      { name: "contact_id", type: "integer", required: true, description: "ID клиента" },
      { name: "event_id", type: "integer", required: true, description: "ID занятия" },
    ],
    response: `204 No Content`,
  },
  // Посещения (Admissions)
  {
    name: "listok_list_contact_admissions",
    description: "Получить список посещений клиента.",
    category: "Посещения",
    method: "GET",
    endpoint: "/api/external/v2/contacts/{contact_id}/admissions",
    parameters: [
      { name: "contact_id", type: "integer", required: true, description: "ID клиента" },
      { name: "page", type: "integer", required: true, description: "Номер страницы" },
    ],
    response: `{ "data": [{ "admission_id": 1, "event_id": 9, ... }] }`,
  },
  {
    name: "listok_create_admission",
    description: "Отметить посещение клиента на занятии.",
    category: "Посещения",
    method: "POST",
    endpoint: "/api/external/v2/contacts/{contact_id}/admissions/{event_id}",
    parameters: [
      { name: "contact_id", type: "integer", required: true, description: "ID клиента" },
      { name: "event_id", type: "integer", required: true, description: "ID занятия" },
    ],
    response: `{ "admission_id": 31122142, "event_id": 123, "contact_id": 16 }`,
  },
  {
    name: "listok_delete_admission",
    description: "Снять клиента с занятия (отменить посещение).",
    category: "Посещения",
    method: "DELETE",
    endpoint: "/api/external/v2/contacts/{contact_id}/admissions/{event_id}",
    parameters: [
      { name: "contact_id", type: "integer", required: true, description: "ID клиента" },
      { name: "event_id", type: "integer", required: true, description: "ID занятия" },
    ],
    response: `204 No Content`,
  },
  // Платежи (Payments)
  {
    name: "listok_list_payments",
    description: "Получить список всех платежей с фильтрацией по дате.",
    category: "Платежи",
    method: "GET",
    endpoint: "/api/external/v2/payments",
    parameters: [
      { name: "page", type: "integer", required: true, description: "Номер страницы" },
      { name: "date", type: "string", required: false, description: "Конкретная дата" },
      { name: "from", type: "string", required: false, description: "Начало периода" },
      { name: "to", type: "string", required: false, description: "Конец периода" },
      { name: "direction", type: "string", required: false, description: "income или expense" },
    ],
    response: `{ "data": [{ "payment_id": 51234, "amount": 3500, "direction": "income", ... }] }`,
  },
  {
    name: "listok_list_contact_payments",
    description: "Получить список платежей конкретного клиента.",
    category: "Платежи",
    method: "GET",
    endpoint: "/api/external/v2/contacts/{contact_id}/payments",
    parameters: [
      { name: "contact_id", type: "integer", required: true, description: "ID клиента" },
      { name: "page", type: "integer", required: true, description: "Номер страницы" },
      { name: "direction", type: "string", required: false, description: "income или expense" },
    ],
    response: `{ "data": [{ "payment_id": 51234, "amount": 3500, ... }] }`,
  },
  // Группы (Groups)
  {
    name: "listok_list_groups",
    description: "Получить список всех групп.",
    category: "Группы",
    method: "GET",
    endpoint: "/api/external/v2/groups",
    parameters: [
      { name: "page", type: "integer", required: true, description: "Номер страницы" },
    ],
    response: `{ "data": [{ "group_id": 1, "name": "Тестовая группа", "duration": 60, ... }] }`,
  },
  {
    name: "listok_get_group",
    description: "Получить данные конкретной группы по ID.",
    category: "Группы",
    method: "GET",
    endpoint: "/api/external/v2/groups/{group_id}",
    parameters: [
      { name: "group_id", type: "integer", required: true, description: "ID группы" },
    ],
    response: `{ "group_id": 1, "name": "Тестовая группа", ... }`,
  },
  {
    name: "listok_create_group",
    description: "Создать новую группу.",
    category: "Группы",
    method: "POST",
    endpoint: "/api/external/v2/groups",
    parameters: [
      { name: "name", type: "string", required: true, description: "Название группы" },
      { name: "duration", type: "integer", required: true, description: "Длительность (мин)" },
      { name: "group_type_id", type: "integer", required: false, description: "ID направления" },
      { name: "office_id", type: "integer", required: false, description: "ID филиала" },
      { name: "employee_id", type: "integer", required: false, description: "ID преподавателя" },
      { name: "max_attendance_limit", type: "integer", required: false, description: "Макс. кол-во людей (0=без лимита)" },
    ],
    response: `{ "group_id": 1, "name": "Фитнес", "duration": 60, ... }`,
  },
  // Сотрудники (Employees)
  {
    name: "listok_list_teachers",
    description: "Получить список преподавателей.",
    category: "Сотрудники",
    method: "GET",
    endpoint: "/api/external/v2/employees/teachers",
    parameters: [
      { name: "page", type: "integer", required: true, description: "Номер страницы" },
    ],
    response: `{ "data": [{ "employee_id": 1, "name": "...", ... }] }`,
  },
  {
    name: "listok_list_managers",
    description: "Получить список менеджеров (владелец и администраторы).",
    category: "Сотрудники",
    method: "GET",
    endpoint: "/api/external/v2/employees/managers",
    parameters: [
      { name: "page", type: "integer", required: true, description: "Номер страницы" },
      { name: "name", type: "string", required: false, description: "Фильтр по имени" },
      { name: "phone", type: "string", required: false, description: "Фильтр по телефону" },
      { name: "email", type: "string", required: false, description: "Фильтр по email" },
    ],
    response: `{ "data": [{ "employee_id": 1, "name": "...", "access_level_name": "..." }] }`,
  },
  // Филиалы (Offices)
  {
    name: "listok_list_offices",
    description: "Получить список филиалов.",
    category: "Филиалы",
    method: "GET",
    endpoint: "/api/external/v2/offices",
    parameters: [
      { name: "page", type: "integer", required: true, description: "Номер страницы" },
    ],
    response: `{ "data": [{ "office_id": 1, "name": "Основной", ... }] }`,
  },
  // Залы (Rooms)
  {
    name: "listok_list_rooms",
    description: "Получить список залов.",
    category: "Залы",
    method: "GET",
    endpoint: "/api/external/v2/rooms",
    parameters: [
      { name: "page", type: "integer", required: true, description: "Номер страницы" },
    ],
    response: `{ "data": [{ "room_id": 2, "office_id": 2, "name": "Зал 1", ... }] }`,
  },
  // Направления (Group Types)
  {
    name: "listok_list_group_types",
    description: "Получить список направлений.",
    category: "Направления",
    method: "GET",
    endpoint: "/api/external/v2/group-types",
    parameters: [
      { name: "page", type: "integer", required: true, description: "Номер страницы" },
    ],
    response: `{ "data": [{ "group_type_id": 1, "name": "Фитнес", ... }] }`,
  },
  // Заметки (Notes)
  {
    name: "listok_list_contact_notes",
    description: "Получить список заметок клиента.",
    category: "Заметки",
    method: "GET",
    endpoint: "/api/external/v2/contacts/{contact_id}/notes",
    parameters: [
      { name: "contact_id", type: "integer", required: true, description: "ID клиента" },
      { name: "page", type: "integer", required: true, description: "Номер страницы" },
    ],
    response: `{ "data": [{ "note_id": 1, "text": "...", ... }] }`,
  },
  {
    name: "listok_create_contact_note",
    description: "Создать заметку для клиента.",
    category: "Заметки",
    method: "POST",
    endpoint: "/api/external/v2/contacts/{contact_id}/notes",
    parameters: [
      { name: "contact_id", type: "integer", required: true, description: "ID клиента" },
      { name: "text", type: "string", required: true, description: "Текст заметки" },
    ],
    response: `{ "note_id": 1, "text": "Новая заметка", ... }`,
  },
  // Бонусы
  {
    name: "listok_add_bonuses",
    description: "Начислить бонусы клиенту.",
    category: "Бонусы",
    method: "POST",
    endpoint: "/api/external/v2/contacts/{contact_id}/bonuses",
    parameters: [
      { name: "contact_id", type: "integer", required: true, description: "ID клиента" },
      { name: "amount", type: "integer", required: true, description: "Сумма бонусов" },
      { name: "reason", type: "string", required: true, description: "Основание начисления" },
      { name: "expires_in_days", type: "integer", required: false, description: "Срок действия в днях" },
    ],
    response: `{ "bonus_balance": 500, ... }`,
  },
  {
    name: "listok_list_contact_bonuses",
    description: "Получить историю бонусов клиента.",
    category: "Бонусы",
    method: "GET",
    endpoint: "/api/external/v2/contacts/{contact_id}/bonuses",
    parameters: [
      { name: "contact_id", type: "integer", required: true, description: "ID клиента" },
      { name: "page", type: "integer", required: true, description: "Номер страницы" },
    ],
    response: `{ "data": [{ "bonus_id": 1, "amount": 100, "type": "credit", ... }] }`,
  },
  // Подписки (Subscriptions)
  {
    name: "listok_list_subscriptions",
    description: "Получить список подписок (расписаний групп).",
    category: "Подписки",
    method: "GET",
    endpoint: "/api/external/v2/subscriptions",
    parameters: [
      { name: "page", type: "integer", required: true, description: "Номер страницы" },
      { name: "pass_id", type: "integer", required: false, description: "Фильтр по ID абонемента" },
    ],
    response: `{ "data": [{ "subscription_id": 1, ... }] }`,
  },
  // Webhooks
  {
    name: "listok_create_webhook",
    description: "Создать webhook-подписку на события CRM.",
    category: "Webhooks",
    method: "POST",
    endpoint: "/api/external/v2/webhooks",
    parameters: [
      { name: "url", type: "string", required: true, description: "URL для получения событий" },
      { name: "events", type: "string[]", required: true, description: "Список событий" },
      { name: "secret", type: "string", required: true, description: "Секрет для подписи" },
    ],
    response: `{ "events": [...], "url": "https://...", "client_id": "..." }`,
  },
  {
    name: "listok_get_webhook",
    description: "Получить текущую конфигурацию webhook-подписки.",
    category: "Webhooks",
    method: "GET",
    endpoint: "/api/external/v2/webhooks",
    parameters: [],
    response: `{ "events": [...], "url": "https://...", "client_id": "..." }`,
  },
  // Справочники
  {
    name: "listok_list_interests",
    description: "Получить справочник интересов клиентов.",
    category: "Справочники",
    method: "GET",
    endpoint: "/api/external/v2/interests",
    parameters: [
      { name: "page", type: "integer", required: true, description: "Номер страницы" },
    ],
    response: `{ "data": [{ "interest_id": 1, "name": "Танцы" }] }`,
  },
  {
    name: "listok_list_sicknesses",
    description: "Получить справочник противопоказаний.",
    category: "Справочники",
    method: "GET",
    endpoint: "/api/external/v2/sicknesses",
    parameters: [
      { name: "page", type: "integer", required: true, description: "Номер страницы" },
    ],
    response: `{ "data": [{ "sickness_id": 1, "name": "..." }] }`,
  },
  {
    name: "listok_list_sources",
    description: "Получить список источников клиентов.",
    category: "Справочники",
    method: "GET",
    endpoint: "/api/external/v2/sources",
    parameters: [
      { name: "page", type: "integer", required: true, description: "Номер страницы" },
    ],
    response: `{ "data": [{ "source_id": 1, "name": "..." }] }`,
  },
  {
    name: "listok_list_payment_categories",
    description: "Получить список категорий платежей.",
    category: "Справочники",
    method: "GET",
    endpoint: "/api/external/v2/payment-categories",
    parameters: [
      { name: "page", type: "integer", required: true, description: "Номер страницы" },
    ],
    response: `{ "data": [{ "category_id": 1, "name": "..." }] }`,
  },
  {
    name: "listok_list_custom_fields",
    description: "Получить список кастомных полей клиентов.",
    category: "Справочники",
    method: "GET",
    endpoint: "/api/external/v2/contacts/fields",
    parameters: [],
    response: `{ "data": [{ "field_id": 1, "label": "Test field", "type": "text", ... }] }`,
  },
];

export const categories = [...new Set(mcpTools.map((t) => t.category))];

export const webhookEvents = [
  { event: "chat.message.received", description: "Входящее сообщение от клиента" },
  { event: "contact.admission.created", description: "Клиент посетил занятие" },
  { event: "contact.admission.deleted", description: "Клиента сняли с занятия" },
  { event: "contact.created", description: "Клиент создан" },
  { event: "contact.deleted", description: "Клиент удалён" },
  { event: "contact.updated", description: "Клиент изменён" },
  { event: "contact.listing.created", description: "Клиент записан на занятие" },
  { event: "contact.listing.deleted", description: "Запись на занятие отменена" },
  { event: "contact.pass.activated", description: "Абонемент активирован" },
  { event: "contact.pass.created", description: "Абонемент оформлен" },
  { event: "contact.pass.expired", description: "Абонемент истёк" },
  { event: "contact.pass.frozen", description: "Абонемент заморожен" },
  { event: "contact.pass.unfrozen", description: "Абонемент разморожен" },
  { event: "contact.pass.revoked", description: "Абонемент отозван" },
  { event: "contact.permanent.created", description: "Клиент добавлен в группу" },
  { event: "contact.queue.created", description: "Клиент добавлен в лист ожидания" },
  { event: "contact.queue.deleted", description: "Клиент удалён из листа ожидания" },
  { event: "contact.review.created", description: "Клиент оставил отзыв" },
  { event: "event.created", description: "Занятие создано" },
  { event: "event.deleted", description: "Занятие удалено" },
  { event: "event.updated", description: "Занятие изменено" },
  { event: "group.created", description: "Группа создана" },
  { event: "group.updated", description: "Группа изменена" },
  { event: "payment.created", description: "Платёж создан" },
  { event: "payment.deleted", description: "Платёж удалён" },
  { event: "payment.refunded", description: "Возврат средств клиенту" },
];
