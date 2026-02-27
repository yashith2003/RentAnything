# 📱 Rent Anything

**Rent Anything** is a React Native mobile application that allows users to rent and list items through a secure and user-friendly marketplace. The platform supports both individual users and companies, providing features such as item listings, rental requests, payments, chat, reviews, and KYC verification.

---

## 🚀 Features

* Individual & company user accounts
* Item listing with images and availability
* Rental request and booking flow
* Secure payments
* In-app chat between renters and owners
* Ratings and reviews after rentals
* KYC verification for trust and safety
* Notifications for important actions

---

## 🛠 Tech Stack

* React Native Expo
* Nest.js (Backend)
* Database: Postgres TypeORM

---

## ▶️ Getting Started

Install dependencies:

```bash
npm install
```

Run on expo-app:

```bash
npx expo start
```

Run on Android:

```bash
npx react-native run-android
```

Run on iOS:

```bash
npx react-native run-ios
```

---

Trending Items Algo:
1) Define the ranking

Events + base weights: VIEW=1, CHAT=1.5, CALL=2 (keep yours).

Add time-decay: score += weight * exp(-ageDays / 7) (7-day half-life feel).

Add momentum: compute two scores: last 3 days vs previous 3 days, then final = decayed14 + 0.3*(recent3 - prev3).

2) Backend data model

item_interactions table: id, itemId, type, createdAt, userId?, sessionId, dayKey.

Add unique guard: store dayKey = YYYY-MM-DD and enforce one VIEW per item per (userId or sessionId) per day.

3) Recording endpoint

POST /items/:id/interact with { type }.

Server resolves userId (if logged in) else sessionId from header/cookie.

For VIEW: upsert/ignore if same item + same dayKey + same user/session.

4) Trending query endpoint

GET /items/trending?page&limit&search&categoryId

Query:

filter interactions createdAt >= now - 14 days

aggregate per item:

decayed14 = SUM(weight(type) * EXP(-ageDays/7))

recent3 = SUM(weight * EXP(-ageDays/3)) for last 3 days

prev3 = SUM(weight * EXP(-(ageDays-3)/3)) for days 3–6

finalScore = decayed14 + 0.3*(recent3 - prev3)

order by finalScore DESC, then createdAt DESC as tie-break.

Paginate with skip/take (page, limit default 20).

5) Caching

Cache key: items:trending:{category}:{search}:{page}:{limit} (or keep page separate).

TTL: 60–120 seconds.

On interact, just delete items:trending:* (simple) or let TTL handle it (even simpler).

6) Frontend tracking triggers

On item details open: fire VIEW once (use local “viewed” map to avoid double fire).

On “Chat” tap: fire CHAT.

On “Call” tap: fire CALL.

7) Trending page UI (infinite scroll)

FlatList with onEndReached fetching next page.

Use RTK Query serializeQueryArgs ignoring page + merge to append results.

Reset list when search or categoryId changes.

8) Verification

Insert interactions with known timestamps (yesterday vs 10 days ago) and confirm ordering.

Spam test: 100 refreshes from same user/session should count as 1 VIEW per day.

Momentum test: item with recent burst should outrank steady item with same total.

---
reviews

