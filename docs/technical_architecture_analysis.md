# Technical Architecture Deep Dive & Analysis

This document analyzes the Health Insurance Management System through the lens of critical architectural attributes: Design Tactics, Scalability, Performance, Security, and Failure Management.

## 1. Design Tactics & Challenges

### 1.1 Challenge: Complex Role-Based Access Control (RBAC)
**Context:** The system serves 5 distinct roles (Member, Provider, Employer, Agent, Admin), each with overlapping but distinct data access needs.
*   **Tactic:** We implemented a "Defense in Depth" strategy.
    *   **Frontend:** [PrivateRoute](file:///c:/Users/joeki/Documents/Notes/4.1/CSS/Health%20Insurance/client/src/components/PrivateRoute.js#5-29) wrapper and [Layout](file:///c:/Users/joeki/Documents/Notes/4.1/CSS/Health%20Insurance/client/src/components/Layout.js#5-165) prop-drilling manage visibility (UX security).
    *   **Backend:** `authMiddleware` strictly enforces role checks on every API route (Real security).
    *   **Challenge:** Ensuring a user with multiple potential roles (e.g., an Admin who is also a Member) doesn't leak permissions. *Solution:* Strict single-role sessions per login or distinct JWT payloads.

### 1.2 Challenge: Regulatory Data Compliance (Kenyan Context)
**Context:** Health data is sensitive; local context requires specific currency and formatting.
*   **Tactic:** Localization Abstraction.
    *   Frontend components use centralized formatters for KES currency.
    *   Data placeholders reflect local entities (e.g., "Nairobi Hospital").

### 1.3 Challenge: Data Integrity across Entities
**Context:** Managing relationships between Policies, Claims, and Users without redundancy.
*   **Tactic:** 3rd Normal Form (3NF) Database Design.
    *   Separated [Users](file:///c:/Users/joeki/Documents/Notes/4.1/CSS/Health%20Insurance/client/src/pages/admin/ManageUsers.js#5-117) (auth) from `Profiles` (role data).
    *   Foreign keys enforce referential integrity (e.g., A claim *must* belong to a valid Member and Provider).

## 2. Scalability

### 2.1 Stateless Architecture
**Analysis:** The system uses **JWT (JSON Web Tokens)** for authentication.
*   **Benefit:** The backend does not need to store session state in memory.
*   **Scalability Impact:** We can spin up multiple instances of the Node.js server (Horizontal Scaling) behind a load balancer without worrying about "sticky sessions". Any server can verify a valid signature.

### 2.2 Database Scalability
**Analysis:** Currently running on a single PostgreSQL instance.
*   **Future Tactic:** Read-Replicas.
    *   Insurance systems are "Read-Heavy" (checking eligibility, viewing policies).
    *   We can route `GET` requests to Read Replicas and `POST/PUT` to the Write Master.

### 2.3 Caching Strategy (Redis)
**Analysis:** `ioredis` is integrated.
*   **Impact:** Reduces database load for static/semi-static data like "Provider Lists" or "Policy Details".
*   **Scale:** Redis handles high-throughput key-value lookups much faster than SQL joins.

## 3. Load Balancing & Performance

### 3.1 Load Balancing Readiness
**Implementation:** `app.set('trust proxy', 1)` in [server/index.js](file:///c:/Users/joeki/Documents/Notes/4.1/CSS/Health%20Insurance/server/index.js).
*   **Explanation:** This configuration tells Express it is sitting behind a proxy (like Nginx, AWS ELB, or Cloudflare). It correctly interprets `X-Forwarded-For` headers to identify the real client IP for rate limiting and logging.

### 3.2 Performance Tactics
*   **Compression:** The `compression` middleware reduces the payload size (gzip) of JSON responses, speeding up transfer over mobile networks (critical for Agents in the field).
*   **Eager Loading:** Sequelize is used with selective `include` statements to fetch related data (e.g., Member + Policy) in a single query rather than N+1 queries.
*   **Asynchronous Offloading:** The [RiskAssessmentService](file:///c:/Users/joeki/Documents/Notes/4.1/CSS/Health%20Insurance/server/services/riskAssessment.js#8-75) is designed to be decoupled. Heavy calculations can be moved to a background worker queue in the future to keep the API responsive.

## 4. Security (Data Protection)

### 4.1 Data in Transit & Rest
*   **Transit:** HTTPS (enforced by HSTS headers via Helmet).
*   **At Rest:** Critical fields like Passwords are hashed using `bcryptjs` (Cost factor 10 or 12). PII (Personally Identifiable Information) in the DB is protected by access controls.

### 4.2 Injection & Attack Prevention
*   **SQL Injection:** Mitigated by using Sequelize ORM, which parameterizes queries automatically.
*   **XSS (Cross-Site Scripting):** Content Security Policy (CSP) headers in [server/index.js](file:///c:/Users/joeki/Documents/Notes/4.1/CSS/Health%20Insurance/server/index.js) restrict where scripts/styles can load from.
*   **Brute Force/DDoS:** `express-rate-limit` is configured:
    *   **Global API:** 100 requests / 15 min.
    *   **Auth Routes:** Strict 5 attempts / 15 min to prevent credential stuffing.

### 4.3 Auditability
**Implementation:** `auditLog` middleware.
*   **Purpose:** Every write operation is logged with `Who`, `What`, `When`. This is crucial for "Non-Repudiation" — proving a user performed an action.

## 5. Failure in Client-Server Systems

### 5.1 Timing Failures
**Risk:** Race conditions (e.g., two admins approving a claim simultaneously).
*   **Mitigation:** Database transactions (Sequelize Transaction) ensure ACID properties. If one step fails, the whole operation rolls back.
*   **Clock Drift:** JWTs assume synchronized clocks. We mitigate this by setting a small "leeway" or ensuring server NTP synchronization.

### 5.2 Arbitrary (Byzantine) & Crash Failures
*   **Crash Handling:**
    *   **Graceful Shutdown:** `SIGTERM` handlers allow the server to finish current requests and close DB connections cleanly before restarting.
    *   **Global Error Handler:** Catches unhandled exceptions to prevent the process from hanging in an undefined state.
*   **Network Partitions (Client-Side):**
    *   If the user loses internet while submitting a claim, the React Client (via Axios interceptors) can detect network errors and prompt the user to retry, ensuring data isn't silently lost.

### 5.3 Omission Failures
**Risk:** Request sent, no response received (Timeout).
*   **Mitigation:** The system implements explicit timeouts. If the Risk Assessment Service hangs, the main thread will eventually timeout and return a 503 error rather than blocking indefinitely.

---
*Analysis generated by Antigravity AI for the Health Insurance Management System Project*
