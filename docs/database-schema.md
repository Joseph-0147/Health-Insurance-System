# Database Schema Design

## Overview
This document describes the complete database schema for the Health Insurance Management System. All tables containing PHI (Protected Health Information) use field-level encryption for sensitive data.

## Entity Relationship Diagram

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│   Users     │────────▶│   Members    │◀────────│  Dependents │
└─────────────┘         └──────────────┘         └─────────────┘
       │                       │                         │
       │                       │                         │
       │                       ▼                         │
       │                ┌──────────────┐                │
       │                │   Policies   │                │
       │                └──────────────┘                │
       │                       │                         │
       │                       │                         │
       │                       ▼                         │
       │                ┌──────────────┐                │
       └───────────────▶│    Claims    │◀───────────────┘
                        └──────────────┘
                               │
                ┌──────────────┼──────────────┐
                ▼              ▼              ▼
         ┌──────────┐   ┌──────────┐   ┌──────────┐
         │Documents │   │ Payments │   │ Appeals  │
         └──────────┘   └──────────┘   └──────────┘

┌─────────────┐         ┌──────────────┐
│  Providers  │◀────────│   Contracts  │
└─────────────┘         └──────────────┘
       │
       │
       ▼
┌──────────────┐
│Credentialings│
└──────────────┘

┌──────────────┐         ┌──────────────┐
│  Employers   │────────▶│    Groups    │
└──────────────┘         └──────────────┘

┌──────────────┐
│  AuditLogs   │  (Tracks all PHI access)
└──────────────┘

┌──────────────┐
│ Notifications│
└──────────────┘
```

## Table Definitions

### 1. Users Table
Stores authentication and account information for all system users.

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('member', 'provider', 'employer', 'admin', 'regulator') NOT NULL,
    mfa_enabled BOOLEAN DEFAULT false,
    mfa_secret VARCHAR(255),
    last_login TIMESTAMP,
    login_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMP,
    email_verified BOOLEAN DEFAULT false,
    email_verification_token VARCHAR(255),
    password_reset_token VARCHAR(255),
    password_reset_expires TIMESTAMP,
    status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);
```

### 2. Members Table
Stores policyholder information (PHI - encrypted fields marked with 🔒).

```sql
CREATE TABLE members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    member_number VARCHAR(50) UNIQUE NOT NULL,
    
    -- Personal Information (Encrypted)
    first_name VARCHAR(255) NOT NULL, -- 🔒
    last_name VARCHAR(255) NOT NULL, -- 🔒
    middle_name VARCHAR(255), -- 🔒
    date_of_birth DATE NOT NULL, -- 🔒
    ssn VARCHAR(255), -- 🔒 Encrypted
    gender ENUM('male', 'female', 'other', 'prefer_not_to_say'),
    
    -- Contact Information (Encrypted)
    phone VARCHAR(255), -- 🔒
    alternate_phone VARCHAR(255), -- 🔒
    address_line1 VARCHAR(255), -- 🔒
    address_line2 VARCHAR(255), -- 🔒
    city VARCHAR(100), -- 🔒
    state VARCHAR(50), -- 🔒
    zip_code VARCHAR(20), -- 🔒
    country VARCHAR(50) DEFAULT 'USA',
    
    -- Medical Information (Encrypted)
    blood_type VARCHAR(10), -- 🔒
    allergies TEXT, -- 🔒
    medical_conditions TEXT, -- 🔒
    emergency_contact_name VARCHAR(255), -- 🔒
    emergency_contact_phone VARCHAR(255), -- 🔒
    emergency_contact_relation VARCHAR(100), -- 🔒
    
    -- Membership Status
    status ENUM('active', 'inactive', 'suspended', 'terminated') DEFAULT 'active',
    enrollment_date DATE NOT NULL,
    termination_date DATE,
    
    -- Employer Information
    employer_id UUID REFERENCES employers(id),
    employee_id VARCHAR(100),
    
    -- Preferences
    preferred_language VARCHAR(50) DEFAULT 'en',
    communication_preferences JSONB,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

CREATE INDEX idx_members_user_id ON members(user_id);
CREATE INDEX idx_members_member_number ON members(member_number);
CREATE INDEX idx_members_employer_id ON members(employer_id);
CREATE INDEX idx_members_status ON members(status);
```

### 3. Dependents Table
Stores information about member dependents.

```sql
CREATE TABLE dependents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    primary_member_id UUID REFERENCES members(id) ON DELETE CASCADE,
    
    -- Personal Information (Encrypted)
    first_name VARCHAR(255) NOT NULL, -- 🔒
    last_name VARCHAR(255) NOT NULL, -- 🔒
    middle_name VARCHAR(255), -- 🔒
    date_of_birth DATE NOT NULL, -- 🔒
    ssn VARCHAR(255), -- 🔒
    gender ENUM('male', 'female', 'other', 'prefer_not_to_say'),
    relationship ENUM('spouse', 'child', 'domestic_partner', 'other') NOT NULL,
    
    -- Medical Information (Encrypted)
    blood_type VARCHAR(10), -- 🔒
    allergies TEXT, -- 🔒
    medical_conditions TEXT, -- 🔒
    
    status ENUM('active', 'inactive', 'aged_out') DEFAULT 'active',
    enrollment_date DATE NOT NULL,
    termination_date DATE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

CREATE INDEX idx_dependents_primary_member ON dependents(primary_member_id);
CREATE INDEX idx_dependents_status ON dependents(status);
```

### 4. Policies Table
Insurance policy and coverage information.

```sql
CREATE TABLE policies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    policy_number VARCHAR(100) UNIQUE NOT NULL,
    member_id UUID REFERENCES members(id),
    
    -- Policy Details
    plan_type ENUM('HMO', 'PPO', 'EPO', 'POS', 'HDHP') NOT NULL,
    plan_name VARCHAR(255) NOT NULL,
    coverage_level ENUM('individual', 'individual_spouse', 'individual_children', 'family') NOT NULL,
    
    -- Coverage Amounts
    deductible_individual DECIMAL(10, 2) NOT NULL,
    deductible_family DECIMAL(10, 2),
    out_of_pocket_max_individual DECIMAL(10, 2) NOT NULL,
    out_of_pocket_max_family DECIMAL(10, 2),
    coinsurance_percentage INTEGER DEFAULT 80,
    
    -- Copays
    primary_care_copay DECIMAL(10, 2),
    specialist_copay DECIMAL(10, 2),
    emergency_copay DECIMAL(10, 2),
    urgent_care_copay DECIMAL(10, 2),
    
    -- Prescription Coverage
    rx_generic_copay DECIMAL(10, 2),
    rx_brand_copay DECIMAL(10, 2),
    rx_specialty_copay DECIMAL(10, 2),
    
    -- Status and Dates
    status ENUM('active', 'pending', 'terminated', 'expired') DEFAULT 'pending',
    effective_date DATE NOT NULL,
    termination_date DATE,
    renewal_date DATE,
    
    -- Premium Information
    monthly_premium DECIMAL(10, 2) NOT NULL,
    employer_contribution DECIMAL(10, 2) DEFAULT 0,
    employee_contribution DECIMAL(10, 2),
    
    -- Coverage Details (JSON for flexibility)
    coverage_details JSONB,
    exclusions JSONB,
    network_restrictions JSONB,
    
    -- Tracking
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

CREATE INDEX idx_policies_member_id ON policies(member_id);
CREATE INDEX idx_policies_policy_number ON policies(policy_number);
CREATE INDEX idx_policies_status ON policies(status);
CREATE INDEX idx_policies_effective_date ON policies(effective_date);
```

### 5. Claims Table
Insurance claim submissions and processing.

```sql
CREATE TABLE claims (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    claim_number VARCHAR(100) UNIQUE NOT NULL,
    policy_id UUID REFERENCES policies(id),
    member_id UUID REFERENCES members(id),
    dependent_id UUID REFERENCES dependents(id),
    provider_id UUID REFERENCES providers(id),
    
    -- Claim Details
    claim_type ENUM('medical', 'dental', 'vision', 'pharmacy', 'mental_health') NOT NULL,
    service_type VARCHAR(255),
    diagnosis_codes TEXT[], -- ICD-10 codes
    procedure_codes TEXT[], -- CPT codes
    
    -- Dates
    service_date DATE NOT NULL,
    submission_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    received_date TIMESTAMP,
    processed_date TIMESTAMP,
    
    -- Financial Information
    billed_amount DECIMAL(10, 2) NOT NULL,
    allowed_amount DECIMAL(10, 2),
    deductible_applied DECIMAL(10, 2) DEFAULT 0,
    coinsurance_amount DECIMAL(10, 2) DEFAULT 0,
    copay_amount DECIMAL(10, 2) DEFAULT 0,
    paid_amount DECIMAL(10, 2),
    member_responsibility DECIMAL(10, 2),
    
    -- Status and Processing
    status ENUM('submitted', 'received', 'under_review', 'approved', 'partially_approved', 'denied', 'appealed', 'paid') DEFAULT 'submitted',
    denial_reason TEXT,
    denial_code VARCHAR(50),
    notes TEXT,
    
    -- Processing Information
    processed_by UUID REFERENCES users(id),
    assigned_to UUID REFERENCES users(id),
    priority ENUM('low', 'normal', 'high', 'urgent') DEFAULT 'normal',
    
    -- Flags
    requires_manual_review BOOLEAN DEFAULT false,
    is_appealed BOOLEAN DEFAULT false,
    is_duplicate BOOLEAN DEFAULT false,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

CREATE INDEX idx_claims_claim_number ON claims(claim_number);
CREATE INDEX idx_claims_member_id ON claims(member_id);
CREATE INDEX idx_claims_policy_id ON claims(policy_id);
CREATE INDEX idx_claims_provider_id ON claims(provider_id);
CREATE INDEX idx_claims_status ON claims(status);
CREATE INDEX idx_claims_service_date ON claims(service_date);
CREATE INDEX idx_claims_submission_date ON claims(submission_date);
```

### 6. Claim Documents Table
Stores references to uploaded claim documents.

```sql
CREATE TABLE claim_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    claim_id UUID REFERENCES claims(id) ON DELETE CASCADE,
    
    document_type ENUM('bill', 'eob', 'medical_record', 'prescription', 'referral', 'other') NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size INTEGER,
    mime_type VARCHAR(100),
    
    -- OCR Results
    ocr_processed BOOLEAN DEFAULT false,
    ocr_text TEXT,
    ocr_confidence DECIMAL(5, 2),
    
    uploaded_by UUID REFERENCES users(id),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_claim_docs_claim_id ON claim_documents(claim_id);
```

### 7. Appeals Table
Claim appeal submissions.

```sql
CREATE TABLE appeals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    appeal_number VARCHAR(100) UNIQUE NOT NULL,
    claim_id UUID REFERENCES claims(id),
    
    appeal_reason TEXT NOT NULL,
    additional_information TEXT,
    requested_amount DECIMAL(10, 2),
    
    status ENUM('submitted', 'under_review', 'approved', 'denied', 'withdrawn') DEFAULT 'submitted',
    submission_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    decision_date TIMESTAMP,
    decision_reason TEXT,
    
    reviewed_by UUID REFERENCES users(id),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_appeals_claim_id ON appeals(claim_id);
CREATE INDEX idx_appeals_status ON appeals(status);
```

### 8. Providers Table
Healthcare provider directory.

```sql
CREATE TABLE providers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    
    -- Provider Information
    npi VARCHAR(10) UNIQUE NOT NULL, -- National Provider Identifier
    provider_type ENUM('individual', 'facility', 'group') NOT NULL,
    
    -- Individual Provider Info
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    credentials VARCHAR(100), -- MD, DO, NP, etc.
    
    -- Organization Info
    organization_name VARCHAR(255),
    tax_id VARCHAR(50), -- 🔒 Encrypted
    
    -- Specialties
    primary_specialty VARCHAR(255),
    secondary_specialties TEXT[],
    
    -- Contact Information
    phone VARCHAR(50),
    fax VARCHAR(50),
    email VARCHAR(255),
    website VARCHAR(255),
    
    -- Address
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(50),
    zip_code VARCHAR(20),
    
    -- Network Status
    network_status ENUM('in_network', 'out_of_network', 'pending') DEFAULT 'pending',
    accepting_new_patients BOOLEAN DEFAULT true,
    
    -- Languages
    languages_spoken TEXT[],
    
    -- Accessibility
    wheelchair_accessible BOOLEAN DEFAULT false,
    telehealth_available BOOLEAN DEFAULT false,
    
    -- Status
    status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
    
    -- Ratings
    average_rating DECIMAL(3, 2),
    total_reviews INTEGER DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

CREATE INDEX idx_providers_npi ON providers(npi);
CREATE INDEX idx_providers_network_status ON providers(network_status);
CREATE INDEX idx_providers_specialty ON providers(primary_specialty);
CREATE INDEX idx_providers_status ON providers(status);
CREATE INDEX idx_providers_zip ON providers(zip_code);
```

### 9. Provider Credentials Table
Tracks provider licensing and certifications.

```sql
CREATE TABLE provider_credentials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_id UUID REFERENCES providers(id) ON DELETE CASCADE,
    
    credential_type ENUM('medical_license', 'board_certification', 'dea', 'malpractice_insurance', 'hospital_privileges') NOT NULL,
    credential_number VARCHAR(255),
    issuing_authority VARCHAR(255),
    issue_date DATE,
    expiration_date DATE,
    
    status ENUM('verified', 'pending', 'expired', 'revoked') DEFAULT 'pending',
    verification_date DATE,
    verified_by UUID REFERENCES users(id),
    
    notes TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_provider_creds_provider_id ON provider_credentials(provider_id);
CREATE INDEX idx_provider_creds_status ON provider_credentials(status);
CREATE INDEX idx_provider_creds_expiration ON provider_credentials(expiration_date);
```

### 10. Contracts Table
Provider network contracts.

```sql
CREATE TABLE contracts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contract_number VARCHAR(100) UNIQUE NOT NULL,
    provider_id UUID REFERENCES providers(id),
    
    contract_type ENUM('individual', 'group', 'facility') NOT NULL,
    
    effective_date DATE NOT NULL,
    termination_date DATE,
    renewal_date DATE,
    
    status ENUM('draft', 'active', 'expired', 'terminated') DEFAULT 'draft',
    
    -- Rate Information
    reimbursement_method ENUM('fee_for_service', 'capitation', 'bundled', 'value_based'),
    rate_schedule JSONB,
    
    -- Terms
    contract_terms TEXT,
    
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_contracts_provider_id ON contracts(provider_id);
CREATE INDEX idx_contracts_status ON contracts(status);
CREATE INDEX idx_contracts_effective_date ON contracts(effective_date);
```

### 11. Employers Table
Group insurance employer accounts.

```sql
CREATE TABLE employers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    
    -- Company Information
    company_name VARCHAR(255) NOT NULL,
    tax_id VARCHAR(50), -- 🔒 Encrypted
    industry VARCHAR(100),
    employee_count INTEGER,
    
    -- Contact Information
    primary_contact_name VARCHAR(255),
    primary_contact_email VARCHAR(255),
    primary_contact_phone VARCHAR(50),
    
    -- Address
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(50),
    zip_code VARCHAR(20),
    
    -- Billing
    billing_cycle ENUM('monthly', 'quarterly', 'annually') DEFAULT 'monthly',
    payment_method ENUM('ach', 'wire', 'check', 'credit_card'),
    
    -- Group Details
    group_number VARCHAR(100) UNIQUE,
    contract_start_date DATE,
    contract_end_date DATE,
    
    status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

CREATE INDEX idx_employers_group_number ON employers(group_number);
CREATE INDEX idx_employers_status ON employers(status);
```

### 12. Payments Table
Payment transactions and billing.

```sql
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payment_number VARCHAR(100) UNIQUE NOT NULL,
    
    -- Payment Source
    payer_type ENUM('member', 'employer', 'provider', 'system') NOT NULL,
    payer_id UUID, -- References members, employers, or providers
    
    -- Payment Target
    payee_type ENUM('member', 'provider', 'system') NOT NULL,
    payee_id UUID,
    
    -- Related Records
    policy_id UUID REFERENCES policies(id),
    claim_id UUID REFERENCES claims(id),
    
    -- Payment Details
    payment_type ENUM('premium', 'claim_reimbursement', 'copay', 'deductible', 'refund') NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    payment_method ENUM('credit_card', 'debit_card', 'ach', 'check', 'wire', 'stripe') NOT NULL,
    
    -- Transaction Information
    transaction_id VARCHAR(255), -- Stripe/payment gateway ID
    confirmation_number VARCHAR(255),
    
    -- Status
    status ENUM('pending', 'processing', 'completed', 'failed', 'refunded', 'cancelled') DEFAULT 'pending',
    failure_reason TEXT,
    
    -- Dates
    payment_date TIMESTAMP,
    processed_date TIMESTAMP,
    
    -- Metadata
    description TEXT,
    invoice_number VARCHAR(100),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_payments_payer_id ON payments(payer_id);
CREATE INDEX idx_payments_payee_id ON payments(payee_id);
CREATE INDEX idx_payments_claim_id ON payments(claim_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_payment_date ON payments(payment_date);
```

### 13. Audit Logs Table
HIPAA-compliant audit trail for all PHI access.

```sql
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Who
    user_id UUID REFERENCES users(id),
    user_role VARCHAR(50),
    user_email VARCHAR(255),
    
    -- What
    action VARCHAR(100) NOT NULL, -- CREATE, READ, UPDATE, DELETE, LOGIN, LOGOUT
    resource_type VARCHAR(100) NOT NULL, -- members, claims, policies, etc.
    resource_id UUID,
    
    -- When
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Where
    ip_address VARCHAR(50),
    user_agent TEXT,
    
    -- Details
    phi_accessed BOOLEAN DEFAULT false,
    description TEXT,
    old_values JSONB,
    new_values JSONB,
    
    -- Result
    success BOOLEAN DEFAULT true,
    error_message TEXT,
    
    -- Compliance
    session_id VARCHAR(255),
    request_id VARCHAR(255)
);

CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_timestamp ON audit_logs(timestamp);
CREATE INDEX idx_audit_logs_resource ON audit_logs(resource_type, resource_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_phi ON audit_logs(phi_accessed);
```

### 14. Notifications Table
System notifications and messages.

```sql
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    
    notification_type ENUM('email', 'sms', 'in_app', 'push') NOT NULL,
    category ENUM('claim_update', 'payment_due', 'policy_update', 'appointment', 'security', 'general') NOT NULL,
    
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    
    priority ENUM('low', 'normal', 'high', 'urgent') DEFAULT 'normal',
    
    status ENUM('pending', 'sent', 'failed', 'read') DEFAULT 'pending',
    
    sent_at TIMESTAMP,
    read_at TIMESTAMP,
    
    metadata JSONB,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_status ON notifications(status);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);
```

### 15. Sessions Table
User session management.

```sql
CREATE TABLE sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    session_token VARCHAR(500) UNIQUE NOT NULL,
    refresh_token VARCHAR(500),
    
    ip_address VARCHAR(50),
    user_agent TEXT,
    
    expires_at TIMESTAMP NOT NULL,
    last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    is_active BOOLEAN DEFAULT true,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_token ON sessions(session_token);
CREATE INDEX idx_sessions_expires ON sessions(expires_at);
```

## Data Encryption Strategy

### Fields Requiring Encryption (AES-256)
All fields marked with 🔒 must be encrypted at rest:

**Members & Dependents:**
- Names (first, middle, last)
- Date of birth
- SSN
- Contact information (phone, address)
- Medical information (blood type, allergies, conditions)
- Emergency contacts

**Providers:**
- Tax ID

**Employers:**
- Tax ID

### Encryption Implementation
- Use AES-256-GCM for field-level encryption
- Store encryption key in secure key management service (AWS KMS, Azure Key Vault)
- Rotate encryption keys quarterly
- Maintain key version history for data recovery

## Indexes Strategy

### Performance Indexes
- Foreign key columns
- Frequently queried fields (status, dates)
- Search fields (names, IDs)

### Composite Indexes (Future Optimization)
```sql
CREATE INDEX idx_claims_processing ON claims(status, submission_date, priority);
CREATE INDEX idx_policies_active ON policies(member_id, status, effective_date);
CREATE INDEX idx_providers_search ON providers(network_status, primary_specialty, zip_code);
```

## Data Retention Policy

| Table | Retention Period | Archive Strategy |
|-------|------------------|------------------|
| Claims | 7 years | Move to cold storage after 2 years |
| Policies | 7 years | Permanent |
| Audit Logs | 7 years | Required for HIPAA compliance |
| Members | While active + 7 years | Soft delete with retention |
| Payments | 7 years | Financial compliance |
| Notifications | 90 days | Purge after read |
| Sessions | 30 days | Auto-cleanup expired |

## Backup Strategy

- **Daily**: Full database backup at 2 AM
- **Hourly**: Transaction log backup
- **Retention**: 30 days online, 7 years archived
- **Recovery Point Objective (RPO)**: 1 hour
- **Recovery Time Objective (RTO)**: 4 hours

## Compliance Notes

### HIPAA Requirements Met
✅ Unique user identification (user_id)  
✅ Automatic log-off (session timeout)  
✅ Audit controls (audit_logs table)  
✅ Encryption at rest (field-level encryption)  
✅ Access controls (RBAC via roles)  
✅ Data integrity (foreign keys, constraints)

### GDPR Requirements Met
✅ Right to access (API endpoints)  
✅ Right to rectification (update endpoints)  
✅ Right to erasure (soft delete with deleted_at)  
✅ Data portability (export functionality)  
✅ Consent tracking (in communication_preferences)

---

**Schema Version**: 1.0  
**Last Updated**: November 2025  
**Next Review**: February 2026
