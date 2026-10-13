# Бэкенд на NestJS для Aura Decor

Полнофункциональный серверный бэкенд на **NestJS (TypeScript)**, разработанный под структуру и потребности клиентского приложения **Aura Decor** (каталог товаров, прайс-пакеты услуг, формы обратной связи и оформления заказов, конфигурация сайта).

---

## 📁 Структура проекта `server/`

```text
server/
├── data/
│   └── aura.db.json               # Файл базы данных (товары, тарифы, заявки, конфигурация)
├── src/
│   ├── app-config/                # Модуль системной конфигурации (контакты, соцсети, бренд)
│   │   ├── app-config.controller.ts
│   │   ├── app-config.module.ts
│   │   └── app-config.service.ts
│   ├── contact/                   # Модуль заявок и заказов
│   │   ├── dto/
│   │   │   └── create-contact.dto.ts
│   │   ├── contact.controller.ts
│   │   ├── contact.module.ts
│   │   └── contact.service.ts
│   ├── database/                  # Сервис хранения и персистентности данных (CRUD)
│   │   ├── database.module.ts
│   │   └── database.service.ts
│   ├── pricing/                   # Модуль тарифов и пакетов услуг
│   │   ├── pricing.controller.ts
│   │   ├── pricing.module.ts
│   │   └── pricing.service.ts
│   ├── products/                  # Модуль каталога товаров
│   │   ├── dto/
│   │   │   ├── create-product.dto.ts
│   │   │   └── query-product.dto.ts
│   │   ├── products.controller.ts
│   │   ├── products.module.ts
│   │   └── products.service.ts
│   ├── app.module.ts              # Корневой модуль приложения
│   └── main.ts                    # Точка входа (CORS, ValidationPipe, Swagger UI)
├── package.json
└── tsconfig.json
```

---

## 🚀 Реализованные возможности API

### 1. Каталог товаров (`/api/products`)
- **`GET /api/products`** — получение списка с поддержкой:
  - `search` — полнотекстовый поиск по имени, описанию, характеристикам и категории.
  - `category` — фильтрация по категории ("Все", "Вазы", "Скульптуры", "Подносы", "Свечи", "Текстиль").
  - `inStock` — фильтрация товаров в наличии (`true`/`false`).
  - `sort` — сортировка: `price-asc`, `price-desc`, `name-asc`, `default`.
  - `page` и `limit` — постраничная пагинация с метаданными (`total`, `totalPages`, `currentPage`).
- **`GET /api/products/categories`** — сводка по категориям с количеством товаров в каждой.
- **`GET /api/products/:id`** — получение детальной информации о товаре по числовому ID.
- **`POST /api/products`** — создание нового предмета с валидацией (`CreateProductDto`).
- **`PUT /api/products/:id`** — обновление существующего товара.
- **`DELETE /api/products/:id`** — удаление товара из каталога.

### 2. Пакеты услуг и прайсинг (`/api/pricing`)
- **`GET /api/pricing`** — список пакетов («Базовый декор», «Полный проект», «VIP-сопровождение») с описаниями, включенными услугами и опцией `popular`.
- **`GET /api/pricing/:id`** — детальная информация о выбранном тарифе.

### 3. Заявки и оформление заказов (`/api/contact`)
- **`POST /api/contact`** — приём заявок на консультацию, выезд декоратора или запрос коммерческого предложения на конкретный товар:
  - Поля: `name`, `phone`, `email`, `message`, `type` (`GENERAL` | `QUOTE` | `ORDER`), `productId`, `productName`.
- **`GET /api/contact`** — просмотр всех поступивших заявок с временными метками `createdAt`.

### 4. Конфигурация сайта (`/api/config`)
- **`GET /api/config`** — получение контактных данных, адреса, часов работы, email и ссылок на мессенджеры (WhatsApp, Telegram).

---

## 📖 Swagger / OpenAPI документация

Вся интерактивная документация доступна по адресу:
👉 **[http://localhost:4000/api/docs](http://localhost:4000/api/docs)**

Включает описание схем запросов, DTO, кодов ответов и возможность отправки тестовых запросов прямо из браузера.

---

## 🔗 Интеграция с React-клиентом

В клиенте реализован слой взаимодействия:
1. **[api-client.ts](../client/src/shared/api/api-client.ts)**:
   - Автоматически отправляет запросы к `http://localhost:4000/api`.
   - Имеет **Graceful Fallback**: в случае недоступности сервера клиент продолжает работать без сбоев на локальных данных.
2. **[Каталог](../client/src/pages/catalog/index.tsx)**:
   - Получает товары и счётчики категорий с бэкенда с анимацией загрузки.
3. **[Страница товара](../client/src/pages/product/index.tsx)**:
   - Запрашивает данные товара по ID и отправляет запрос на КП в базу заявок сервера.
4. **[Главная витрина](../client/src/pages/home/components/shop.tsx)**:
   - Подгружает актуальные коллекции по категориям.

---

## 🛠️ Запуск проекта

### 1. Запуск сервера:
```bash
cd server
npm run start:dev
# Сервер запустится на порту 4000: http://localhost:4000
# Swagger UI: http://localhost:4000/api/docs
```

### 2. Запуск клиента:
```bash
cd client
npm run dev
# Клиент запустится на http://localhost:5173
```
