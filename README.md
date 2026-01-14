# Health Insurance Management System

A comprehensive HIPAA-compliant health insurance management platform serving members, providers, employers, and administrators.

## 🏥 Features

### Multi-Portal Architecture
- **Member Portal**: Policy management, claims submission, provider search, digital ID cards
- **Provider Portal**: Claims processing, patient verification, contract management
- **Employer Portal**: Group administration, billing, employee management
- **Admin Portal**: System oversight, analytics, compliance reporting
- **Regulatory Portal**: Compliance tracking and audit access

### Core Capabilities
- ✅ Digital enrollment with e-signature
- ✅ Automated claims processing with OCR
- ✅ Real-time eligibility verification
- ✅ Secure payment processing (Stripe integration)
- ✅ Provider network directory
- ✅ Multi-factor authentication
- ✅ End-to-end encryption (AES-256)
- ✅ HIPAA/GDPR compliance
- ✅ Comprehensive audit logging

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL 14+
- Stripe account (for payments)
- SMTP server (for emails)

### Installation

1. **Clone and install dependencies**
```bash
npm install
cd client && npm install
```

2. **Configure environment**
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. **Database setup**
```bash
# Create database
createdb health_insurance_db

# Run migrations
npm run migrate

# Seed initial data (optional)
npm run seed
```

4. **Start development servers**
```bash
# Start both backend and frontend
npm run dev:full

# Or separately:
npm run dev      # Backend on :5000
npm run client   # Frontend on :3000
```

## 📁 Project Structure

```
health-insurance-management-system/
├── client/                    # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   ├── pages/            # Portal pages
│   │   │   ├── member/
│   │   │   ├── provider/
│   │   │   ├── employer/
│   │   │   └── admin/
│   │   ├── contexts/         # React contexts (auth, user)
│   │   ├── hooks/            # Custom hooks
│   │   ├── services/         # API services
│   │   ├── utils/            # Utility functions
│   │   └── App.js
│   └── package.json
├── server/                    # Node.js backend
│   ├── config/               # Configuration files
│   ├── controllers/          # Route controllers
│   ├── middleware/           # Express middleware
│   ├── models/               # Sequelize models
│   ├── routes/               # API routes
│   ├── services/             # Business logic
│   ├── utils/                # Utilities (encryption, logging)
│   ├── migrations/           # Database migrations
│   ├── seeders/              # Database seeders
│   └── index.js              # Entry point
├── docs/                     # Documentation
│   ├── architecture.md
│   ├── database-schema.md
│   ├── api-documentation.md
│   ├── security-plan.md
│   └── wireframes/
├── uploads/                  # File uploads (gitignored)
├── logs/                     # Application logs (gitignored)
├── .env.example              # Environment template
└── package.json
```

## 🔐 Security Features

- **Authentication**: JWT with refresh tokens, MFA support
- **Encryption**: AES-256 for PHI data at rest
- **Transport**: HTTPS/TLS 1.3 required in production
- **RBAC**: Role-based access control for all endpoints
- **Audit Logging**: All PHI access logged with timestamps
- **Session Management**: Automatic timeout after 30 minutes
- **Rate Limiting**: API throttling to prevent abuse

## 🗄️ Database Schema

Core entities:
- **Users**: Authentication and profile information
- **Members**: Policyholders and dependents
- **Policies**: Insurance plans and coverage details
- **Claims**: Claim submissions and processing
- **Providers**: Healthcare provider network
- **Billing**: Payments and invoices
- **AuditLogs**: Compliance tracking

See `docs/database-schema.md` for detailed ER diagram.

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `POST /api/auth/mfa/setup` - Setup MFA
- `POST /api/auth/refresh` - Refresh token

### Members
- `GET /api/members/:id` - Get member details
- `PUT /api/members/:id` - Update member
- `GET /api/members/:id/policies` - Get member policies
- `GET /api/members/:id/id-card` - Generate digital ID card

### Claims
- `POST /api/claims` - Submit new claim
- `GET /api/claims/:id` - Get claim details
- `PUT /api/claims/:id` - Update claim
- `GET /api/claims/:id/status` - Check claim status
- `POST /api/claims/:id/appeal` - Submit appeal

### Providers
- `GET /api/providers/search` - Search provider directory
- `GET /api/providers/:id` - Get provider details
- `POST /api/providers/verify` - Verify credentials

See `docs/api-documentation.md` for complete API reference.

## 🧪 Testing

```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Run specific test suite
npm test -- controllers/claims.test.js
```

## 🚢 Deployment

### Production Checklist
- [ ] Set `NODE_ENV=production`
- [ ] Configure production database with SSL
- [ ] Set secure JWT secrets (32+ characters)
- [ ] Enable HTTPS with valid SSL certificate
- [ ] Configure production SMTP/Twilio credentials
- [ ] Set up Stripe production keys
- [ ] Enable audit logging and monitoring
- [ ] Configure backup strategy
- [ ] Review and apply security headers
- [ ] Set up CDN for static assets

### Docker Deployment (Optional)
```bash
docker-compose up -d
```

## 📊 Success Metrics

- Claims processing time: Target <72 hours
- System uptime: 99.9% SLA
- Member satisfaction: Track through portal surveys
- Compliance audit readiness: Quarterly reviews

## 🤝 Contributing

1. Follow HIPAA compliance guidelines
2. Write tests for all new features
3. Document API changes
4. Run linter before committing
5. Submit PR with detailed description

## 📄 License

MIT License - See LICENSE file for details

## 📞 Support

For technical support or questions:
- Email: support@healthinsurance.com
- Documentation: /docs
- Issue Tracker: GitHub Issues

## ⚠️ Compliance Notice

This system handles Protected Health Information (PHI). All users must:
- Complete HIPAA training
- Follow data handling procedures
- Report security incidents immediately
- Use MFA for all accounts

---

**Version**: 1.0.0  
**Last Updated**: November 2025
