# System Architecture

## Overview
The Health Insurance Management System is a three-tier web application architecture designed for scalability, security, and HIPAA compliance.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           CLIENT TIER (Frontend)                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐ │
│  │   Member     │  │   Provider   │  │   Employer   │  │    Admin    │ │
│  │   Portal     │  │   Portal     │  │   Portal     │  │   Portal    │ │
│  │  (React)     │  │  (React)     │  │  (React)     │  │  (React)    │ │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  └──────┬──────┘ │
│         │                  │                  │                  │        │
│         └──────────────────┴──────────────────┴──────────────────┘        │
│                                     │                                      │
│                                     │  HTTPS/TLS 1.3                      │
│                                     │  (Port 443)                         │
└─────────────────────────────────────┼──────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      APPLICATION TIER (Backend)                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │                    Load Balancer / API Gateway                     │  │
│  │              (NGINX / AWS ALB / Azure App Gateway)                 │  │
│  └───────────────────────────────┬───────────────────────────────────┘  │
│                                   │                                       │
│  ┌────────────────────────────────┼────────────────────────────────┐    │
│  │         Express.js API Server (Node.js)                          │    │
│  │                                                                   │    │
│  │  ┌──────────────────────────────────────────────────────────┐   │    │
│  │  │              Authentication & Authorization               │   │    │
│  │  │  • JWT Token Validation  • MFA Verification              │   │    │
│  │  │  • Role-Based Access Control (RBAC)                      │   │    │
│  │  │  • Session Management    • Rate Limiting                 │   │    │
│  │  └──────────────────────────────────────────────────────────┘   │    │
│  │                                                                   │    │
│  │  ┌──────────────┬──────────────┬──────────────┬─────────────┐   │    │
│  │  │   Member     │   Claims     │  Provider    │   Admin     │   │    │
│  │  │  Services    │  Processing  │  Services    │  Services   │   │    │
│  │  │              │   Engine     │              │             │   │    │
│  │  │  • Enroll    │  • Submit    │  • Search    │  • Review   │   │    │
│  │  │  • Profile   │  • Validate  │  • Verify    │  • Reports  │   │    │
│  │  │  • ID Card   │  • Adjudicate│  • Contract  │  • Analytics│   │    │
│  │  │  • Claims    │  • Appeal    │  • Billing   │  • Audit    │   │    │
│  │  └──────────────┴──────────────┴──────────────┴─────────────┘   │    │
│  │                                                                   │    │
│  │  ┌──────────────────────────────────────────────────────────┐   │    │
│  │  │                  Business Logic Layer                     │   │    │
│  │  │  • Eligibility Engine    • Premium Calculator            │   │    │
│  │  │  • Claims Rules Engine   • Coverage Verification         │   │    │
│  │  │  • Billing Engine        • Notification Service          │   │    │
│  │  └──────────────────────────────────────────────────────────┘   │    │
│  │                                                                   │    │
│  │  ┌──────────────────────────────────────────────────────────┐   │    │
│  │  │                   Middleware Layer                        │   │    │
│  │  │  • Request Logging    • Error Handling                   │   │    │
│  │  │  • Validation         • Audit Logging (PHI)              │   │    │
│  │  │  • Encryption/Decrypt • Response Formatting              │   │    │
│  │  └──────────────────────────────────────────────────────────┘   │    │
│  └────────────────────────────┬──────────────────────────────────┘    │
│                                │                                        │
└────────────────────────────────┼────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         DATA TIER (Persistence)                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  ┌───────────────────────────────────────────────────────────────┐      │
│  │                    PostgreSQL Database                         │      │
│  │                     (Primary Instance)                         │      │
│  │                                                                 │      │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐           │      │
│  │  │   Members   │  │   Claims    │  │  Providers  │           │      │
│  │  │  (Encrypted)│  │  (Encrypted)│  │             │           │      │
│  │  └─────────────┘  └─────────────┘  └─────────────┘           │      │
│  │                                                                 │      │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐           │      │
│  │  │  Policies   │  │  Payments   │  │ Audit Logs  │           │      │
│  │  │             │  │             │  │  (WORM)     │           │      │
│  │  └─────────────┘  └─────────────┘  └─────────────┘           │      │
│  └───────────────────────────┬───────────────────────────────────┘      │
│                               │                                          │
│                               │  Replication                             │
│                               ▼                                          │
│  ┌───────────────────────────────────────────────────────────────┐      │
│  │              PostgreSQL (Read Replicas)                        │      │
│  │              • Reporting Queries                               │      │
│  │              • Analytics                                       │      │
│  └───────────────────────────────────────────────────────────────┘      │
│                                                                           │
└───────────────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                        EXTERNAL INTEGRATIONS                             │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────┐   │
│  │   Payment    │  │  Email/SMS   │  │   Document   │  │ Provider │   │
│  │   Gateway    │  │   Service    │  │   Storage    │  │   API    │   │
│  │              │  │              │  │              │  │          │   │
│  │   Stripe     │  │  Nodemailer  │  │   AWS S3     │  │  NPI DB  │   │
│  │              │  │   Twilio     │  │              │  │          │   │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────┘   │
│                                                                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                  │
│  │     OCR      │  │   Key Mgmt   │  │  Monitoring  │                  │
│  │   Service    │  │   Service    │  │              │                  │
│  │              │  │              │  │   Winston    │                  │
│  │ Tesseract.js │  │  AWS KMS /   │  │   Logs       │                  │
│  │              │  │ Azure Vault  │  │              │                  │
│  └──────────────┘  └──────────────┘  └──────────────┘                  │
│                                                                           │
└───────────────────────────────────────────────────────────────────────────┘
```

## Component Details

### 1. Frontend Layer (Client Tier)

#### Technology Stack
- **Framework**: React 18.2
- **State Management**: Zustand + React Query
- **Routing**: React Router v6
- **Styling**: Tailwind CSS
- **Forms**: Formik + Yup validation
- **Charts**: Recharts + Chart.js
- **HTTP Client**: Axios

#### Portal Architecture

**Member Portal**
- Dashboard (policy info, quick actions)
- Profile management
- Claims submission & tracking
- Provider search & directory
- Digital ID card generation
- Billing & payment history
- Secure messaging
- Document uploads

**Provider Portal**
- Patient eligibility verification
- Claims submission interface
- Claims history & payment tracking
- Contract management
- Patient roster
- Analytics dashboard

**Employer Portal**
- Employee roster management
- Group policy administration
- Billing & invoice review
- Contribution management
- Reports & analytics

**Admin Portal**
- Claims review & adjudication
- Member management
- Provider credentialing
- Policy configuration
- System analytics
- Audit log viewer
- Compliance reporting

### 2. Backend Layer (Application Tier)

#### Technology Stack
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **ORM**: Sequelize
- **Authentication**: JWT + Speakeasy (MFA)
- **Validation**: Joi + Express Validator
- **Security**: Helmet, CORS, Rate Limiting
- **Encryption**: Node crypto (AES-256-GCM)
- **Logging**: Winston + Morgan
- **File Upload**: Multer
- **OCR**: Tesseract.js

#### API Structure

```
/api
├── /auth
│   ├── POST   /register
│   ├── POST   /login
│   ├── POST   /logout
│   ├── POST   /refresh
│   ├── POST   /mfa/setup
│   ├── POST   /mfa/verify
│   └── POST   /password/reset
│
├── /members
│   ├── GET    /:id
│   ├── PUT    /:id
│   ├── POST   /enroll
│   ├── GET    /:id/policies
│   ├── GET    /:id/claims
│   ├── GET    /:id/id-card
│   ├── POST   /:id/dependents
│   └── GET    /:id/documents
│
├── /claims
│   ├── POST   /
│   ├── GET    /:id
│   ├── PUT    /:id
│   ├── GET    /
│   ├── POST   /:id/documents
│   ├── GET    /:id/status
│   ├── POST   /:id/appeal
│   └── PUT    /:id/process
│
├── /providers
│   ├── GET    /search
│   ├── GET    /:id
│   ├── POST   /
│   ├── PUT    /:id
│   ├── POST   /:id/credentials
│   ├── GET    /:id/contracts
│   └── POST   /verify-eligibility
│
├── /policies
│   ├── GET    /:id
│   ├── POST   /
│   ├── PUT    /:id
│   ├── GET    /plans
│   └── POST   /compare
│
├── /payments
│   ├── POST   /process
│   ├── GET    /:id
│   ├── GET    /invoices
│   └── POST   /webhook (Stripe)
│
├── /employers
│   ├── GET    /:id
│   ├── POST   /
│   ├── PUT    /:id
│   ├── GET    /:id/employees
│   └── GET    /:id/billing
│
└── /admin
    ├── GET    /dashboard
    ├── GET    /analytics
    ├── GET    /audit-logs
    └── GET    /compliance-reports
```

#### Middleware Pipeline

1. **Request Logging** (Morgan)
2. **CORS** (Configured for client origin)
3. **Helmet** (Security headers)
4. **Rate Limiting** (100 req/15min per IP)
5. **Body Parser** (JSON, URL-encoded)
6. **Cookie Parser**
7. **Authentication** (JWT verification)
8. **Authorization** (RBAC check)
9. **Input Validation** (Joi schemas)
10. **Audit Logging** (PHI access tracking)
11. **Error Handler** (Centralized)

#### Security Implementation

**Authentication Flow**
```
1. User submits credentials
2. Server validates against database
3. If MFA enabled:
   a. Generate TOTP token
   b. Send to user device
   c. Verify token
4. Generate JWT access token (15min)
5. Generate refresh token (7 days, with tokenId)
6. Set HttpOnly, Secure, SameSite=strict cookie (refreshToken)
7. Create session record
8. Log authentication event
9. Return tokens + user profile
```

**Authorization Flow**
```
1. Extract JWT from Authorization header
2. Verify token signature
3. Check expiration
4. Extract user ID and role
5. Query session validity
6. Check resource permissions (RBAC)
7. Allow/Deny request
8. Log access if PHI involved
```

**Encryption Strategy**
- **In Transit**: TLS 1.3
- **At Rest**: AES-256-GCM for PHI fields
- **Keys**: Stored in AWS KMS / Azure Key Vault
- **Passwords**: bcrypt (12 rounds)

**Token Management**
- **Access Tokens**: Short-lived, Bearer in `Authorization` header
- **Refresh Tokens**: HttpOnly cookie, server-side rotation and revocation (tokenId)
- **Rate Limits**: Global API limit and stricter auth endpoints
- **CORS**: Allowlist of client origins via env configuration

### 3. Data Layer (Persistence Tier)

#### Database Architecture

**Primary Database**
- PostgreSQL 14+
- Master instance (read/write)
- Automated daily backups
- Point-in-time recovery enabled
- Connection pooling (max 10 connections)

**Read Replicas**
- 2+ replica instances
- Lag < 5 seconds
- Used for analytics queries
- Load balanced reads

**Data Encryption**
- Field-level: AES-256-GCM (PHI)
- Disk-level: PostgreSQL TDE
- Backup encryption: Enabled

**Performance Optimization**
- Indexes on foreign keys
- Composite indexes for common queries
- Query plan analysis
- Materialized views for reports
- Connection pooling

### 4. External Integrations

#### Payment Processing (Stripe)
```javascript
Payment Flow:
1. Frontend creates payment intent
2. Stripe.js collects card details (PCI-compliant)
3. Tokenize card → secure token
4. Backend processes payment with token
5. Webhook confirms payment status
6. Update payment record
7. Send confirmation email
```

#### Email Service (Nodemailer)
- SMTP configuration
- Templates for notifications
- Delivery tracking
- Bounce handling

#### SMS Service (Twilio)
- MFA codes
- Claim status updates
- Appointment reminders
- Security alerts

#### Document Storage (AWS S3)
- Encrypted buckets
- Signed URLs (temporary access)
- Lifecycle policies (archive after 2 years)
- Versioning enabled

#### OCR Processing (Tesseract.js)
- Extract text from uploaded documents
- Process medical bills
- Auto-populate claim forms
- Confidence scoring

### 5. Security Architecture

#### Defense in Depth

**Layer 1: Network**
- Firewall rules
- DDoS protection
- VPC/VNet isolation
- SSL/TLS termination at load balancer

**Layer 2: Application**
- Authentication (JWT + MFA)
- Authorization (RBAC)
- Input validation
- Rate limiting
- CSRF tokens
- XSS protection
- SQL injection prevention (ORM)

**Layer 3: Data**
- Field-level encryption
- Database encryption at rest
- Encrypted backups
- Secure key management

**Layer 4: Monitoring**
- Audit logging (all PHI access)
- Intrusion detection
- Anomaly detection
- Real-time alerts

#### HIPAA Compliance Controls

| Control | Implementation |
|---------|----------------|
| Access Control | RBAC + MFA |
| Audit Controls | Comprehensive audit_logs table |
| Data Integrity | Foreign keys, checksums |
| Transmission Security | TLS 1.3 |
| Automatic Logoff | 30-minute session timeout |
| Encryption | AES-256 at rest, TLS in transit |
| Backup | Daily automated, 7-year retention |
| Disaster Recovery | RPO: 1hr, RTO: 4hr |

### 6. Deployment Architecture

#### Development Environment
```
Local Machine
├── PostgreSQL (Docker)
├── Node.js backend (:5000)
├── React frontend (:3000)
└── Stripe test mode
```

#### Staging Environment
```
Cloud Provider (AWS/Azure)
├── EC2/VM (Backend)
├── RDS/PostgreSQL (Database)
├── S3/Blob Storage (Documents)
├── CloudFront/CDN (Static files)
└── Load Balancer
```

#### Production Environment
```
Cloud Provider (Multi-AZ/Region)
├── Auto-scaling group (Backend: 2-10 instances)
├── RDS Multi-AZ (Database + Read replicas)
├── S3 + CloudFront (Global CDN)
├── Application Load Balancer
├── WAF (Web Application Firewall)
├── CloudWatch/Application Insights (Monitoring)
└── Backup: Daily snapshots, 7-year retention
```

### 7. Data Flow Examples

#### Claims Submission Flow
```
1. Member uploads documents via React frontend
2. Frontend sends multipart/form-data to /api/claims
3. Backend authenticates user (JWT)
4. Multer processes file upload
5. File saved to S3 with encryption
6. Tesseract extracts text from document
7. Validation engine checks eligibility
8. Claim record created in database
9. Notification sent to member (email/SMS)
10. Admin assigned for review
11. Audit log records PHI access
12. Frontend receives success response
```

#### Payment Processing Flow
```
1. Member initiates premium payment
2. Frontend creates Stripe PaymentIntent
3. Stripe.js securely collects card details
4. Tokenized payment sent to backend
5. Backend calls Stripe API to charge card
6. Stripe processes payment
7. Webhook confirms success/failure
8. Payment record created in database
9. Policy status updated
10. Receipt sent via email
11. Audit log records transaction
```

#### Provider Search Flow
```
1. Member enters search criteria (specialty, zip)
2. Frontend sends GET /api/providers/search
3. Backend validates request
4. Query database with filters + pagination
5. Join provider_credentials table
6. Filter by network_status = 'in_network'
7. Calculate distance (geo query)
8. Apply sorting (rating, distance)
9. Return paginated results
10. Frontend renders provider cards
11. Member clicks for details
12. Detailed view fetches provider profile
```

### 8. Monitoring & Observability

#### Application Monitoring
- **Winston Logs**: Structured JSON logs
- **Morgan**: HTTP request logging
- **Custom Metrics**: 
  - Claims processing time
  - API response times
  - Error rates
  - Active sessions

#### Database Monitoring
- Query performance
- Connection pool status
- Replication lag
- Storage utilization

#### Alerts
- Failed login attempts (>5)
- Unusual PHI access patterns
- API error rate spike (>5%)
- Database connection issues
- Payment processing failures

### 9. Scalability Considerations

#### Horizontal Scaling
- Stateless API servers (scale to N instances)
- Session stored in database (not memory)
- Load balancer distributes traffic

#### Vertical Scaling
- Database instance size
- Connection pool configuration
- Cache layer (Redis) for frequent queries

#### Caching Strategy
- API responses (5-minute TTL)
- Provider directory (1-hour TTL)
- Policy details (until update)

### 10. Disaster Recovery

#### Backup Strategy
- **Database**: Daily full + hourly incremental
- **Files**: S3 versioning + lifecycle policies
- **Code**: Git repository + CI/CD pipelines

#### Recovery Procedures
- **Data Loss**: Restore from latest backup
- **Corruption**: Point-in-time recovery
- **Infrastructure Failure**: Multi-region failover
- **Security Breach**: Incident response plan

---

**Architecture Version**: 1.0  
**Last Updated**: November 2025  
**Next Review**: February 2026
