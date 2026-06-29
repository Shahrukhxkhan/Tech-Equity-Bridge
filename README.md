# Tech-Equity Bridge

> **Bridging the digital divide** — Connect tech companies with non-profits to share AI agents, tools, and computing resources for measurable social impact.

![Tech-Equity Bridge](https://img.shields.io/badge/Status-Production%20Ready-brightgreen) ![License](https://img.shields.io/badge/License-MIT-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue) ![React](https://img.shields.io/badge/React-19-blue)

## 🎯 Mission

Tech-Equity Bridge is a collaborative marketplace that enables tech companies and non-profit organizations to connect, share resources, and create measurable social impact together. We democratize access to AI agents, software tools, datasets, and computing resources for organizations working on education, healthcare, environment, and social good.

## ✨ Key Features

### 1. **Role-Based Onboarding**
- Separate flows for Tech Donors and Non-Profit Recipients
- Organization verification and profile setup
- Sector and capability assessment

### 2. **Agent & Resource Marketplace**
- Browse AI agents, software tools, datasets, and computing resources
- Advanced search and filtering by category, sector, and capacity
- Resource detail pages with specifications and requirements
- One-click resource requests

### 3. **Smart Matching Engine**
- AI-powered algorithm that suggests compatible resources to non-profits
- Surfaces relevant non-profits to donors based on mission alignment
- Match quality scoring (0-100%) with transparency
- Continuous learning from successful matches

### 4. **Coalition Builder**
- Enable multiple non-profits to group around shared goals
- Joint resource requests for larger packages
- Collaborative impact tracking
- Member management and communication

### 5. **Impact Tracking Dashboard**
- **For Donors**: Resources shared, organizations helped, hours contributed, CSR narrative
- **For Non-Profits**: Resources received, projects enabled, outcomes reported, beneficiaries reached
- Platform-wide impact statistics
- Export reports for grants and stakeholders

### 6. **Request & Approval Workflow**
- Non-profits submit detailed resource requests
- Donors review with full context and match scores
- Approval/rejection with feedback
- Status tracking and in-platform messaging
- Request history and analytics

### 7. **Grant Writing Assistant**
- AI-powered chat interface for grant proposal drafting
- Sector-specific templates
- Document generation and editing
- Export to PDF for submission

### 8. **Public Landing Page**
- Mission and vision statement
- Platform statistics (donors, non-profits, impact)
- How it works explanation
- Featured success stories
- Clear calls-to-action for both user types

### 9. **Notification System**
- New match alerts
- Request status updates
- Coalition invitations
- Impact milestone celebrations
- Email and in-app notifications

### 10. **Admin Dashboard**
- User management and moderation
- Resource quality review
- Match quality analytics
- Platform-wide statistics
- Reporting and insights

## 🏗️ Architecture

### Tech Stack

**Frontend:**
- React 19 with TypeScript
- Tailwind CSS 4 with Civic Commons design system
- tRPC for type-safe API calls
- Wouter for routing
- Tabler Icons for iconography

**Backend:**
- Express.js 4
- tRPC 11 for RPC procedures
- Drizzle ORM for database
- MySQL/TiDB for persistence
- Manus OAuth for authentication

**Design System:**
- **Civic Commons** - Professional, flat design aesthetic
- **Colors**: Teal-green primary (#1D9E75), Civic purple secondary (#534AB7), Amber accent (#BA7517)
- **Typography**: Inter and DM Sans fonts (max weight 500)
- **Components**: 40+ reusable components with semantic variants

### Database Schema

14 comprehensive tables:
- `users` - Core user model with RBAC (donor/nonprofit/admin)
- `donorProfiles` - Tech donor organization details
- `nonprofitProfiles` - Non-profit organization details
- `resources` - Marketplace resources (AI agents, tools, datasets, compute)
- `coalitions` - Multi-org collaborations
- `coalitionMembers` - Coalition membership tracking
- `requests` - Resource requests with status tracking
- `messages` - In-platform messaging
- `impactMetrics` - Outcome reporting and tracking
- `notifications` - User notifications
- `matches` - Smart matching results
- `grantSessions` - Grant writing assistant sessions
- `moderationQueue` - Content moderation
- `platformStats` - Platform-wide analytics

### API Architecture

50+ tRPC procedures organized by feature:
- **User Management**: Profile creation, updates, verification
- **Marketplace**: Resource CRUD, search, filtering
- **Matching**: Smart matching algorithm, suggestions
- **Coalitions**: Create, join, manage, messaging
- **Requests**: Submit, approve, reject, track
- **Impact**: Metrics tracking, reporting, export
- **Notifications**: Create, read, preferences
- **Admin**: User management, moderation, analytics
- **Grant Assistant**: Session management, AI integration

## 🚀 Getting Started

### Prerequisites
- Node.js 22+
- pnpm 10+
- MySQL 8+ or TiDB

### Installation

```bash
# Clone the repository
git clone https://github.com/Shahrukhxkhan/Tech-Equity-Bridge.git
cd Tech-Equity-Bridge

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local

# Run database migrations
pnpm db:push

# Start development server
pnpm dev
```

### Environment Variables

```env
# Database
DATABASE_URL=mysql://user:password@localhost:3306/tech_equity_bridge

# Authentication
JWT_SECRET=your_jwt_secret_key
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://oauth.manus.im

# App Configuration
VITE_APP_ID=your_app_id
VITE_APP_TITLE=Tech-Equity Bridge
VITE_APP_LOGO=https://your-logo-url.png

# LLM Integration (for Grant Assistant)
BUILT_IN_FORGE_API_URL=https://api.manus.im
BUILT_IN_FORGE_API_KEY=your_api_key

# Analytics
VITE_ANALYTICS_ENDPOINT=https://analytics.example.com
VITE_ANALYTICS_WEBSITE_ID=your_website_id
```

## 📁 Project Structure

```
tech-equity-bridge/
├── client/                          # React frontend
│   ├── src/
│   │   ├── pages/                  # Page components
│   │   │   ├── Home.tsx            # Landing page
│   │   │   ├── Onboarding.tsx      # Role-based onboarding
│   │   │   ├── Dashboard.tsx       # Role-based dashboards
│   │   │   ├── Marketplace.tsx     # Resource marketplace
│   │   │   ├── CoalitionBuilder.tsx # Coalition management
│   │   │   ├── ImpactTracker.tsx   # Impact dashboard
│   │   │   ├── GrantAssistant.tsx  # AI grant writing
│   │   │   ├── NotificationCenter.tsx # Notifications
│   │   │   └── AdminDashboard.tsx  # Admin panel
│   │   ├── components/             # Reusable components
│   │   │   ├── MatchScoreBar.tsx   # Match scoring visualization
│   │   │   ├── ImpactMetricCard.tsx # Metric cards
│   │   │   └── ui/                 # shadcn/ui components
│   │   ├── lib/                    # Utilities
│   │   │   └── trpc.ts             # tRPC client
│   │   ├── App.tsx                 # Main app component
│   │   └── index.css               # Civic Commons design system
│   └── index.html
├── server/                          # Express backend
│   ├── routers.ts                  # tRPC procedures
│   ├── db.ts                       # Database queries
│   ├── storage.ts                  # S3 storage helpers
│   └── _core/                      # Framework internals
├── drizzle/                         # Database schema
│   ├── schema.ts                   # Table definitions
│   └── migrations/                 # SQL migrations
├── shared/                          # Shared types
│   ├── const.ts                    # Constants
│   └── types.ts                    # Shared types
└── references/                      # Integration guides
    ├── llm-integration.md          # LLM/AI setup
    ├── file-storage.md             # S3 storage
    ├── manus-oauth.md              # OAuth flow
    └── periodic-updates.md         # Background jobs
```

## 🎨 Design System - Civic Commons

The platform uses the **Civic Commons** design system for a professional, trustworthy, civic-focused aesthetic:

### Color Palette
- **Primary**: Teal-green (#1D9E75) - Trust, growth, civic engagement
- **Secondary**: Civic purple (#534AB7) - Collaboration, non-profit sector
- **Accent**: Amber (#BA7517) - Impact, calls-to-action
- **Neutrals**: Professional grays for text and backgrounds

### Design Principles
- **Flat Design**: No gradients, shadows, or blur effects
- **Professional Typography**: Inter and DM Sans fonts (max weight 500)
- **Semantic Colors**: Consistent meaning across the platform
- **Accessibility**: WCAG AA compliance with proper contrast
- **Responsive**: Mobile-first design for all screen sizes

### Components
- Buttons (primary, secondary, danger variants)
- Cards with 0.5px borders
- Match score bars with color coding
- Impact metric cards with trends
- Navigation with pill-style tabs
- Form inputs with focus rings
- Status badges (verified, AI agent, high demand, inactive)

## 📊 Data Flow Examples

### Resource Request Flow
1. Non-profit browses marketplace and finds matching resource
2. Clicks "Request Resource" and fills out requirements
3. Smart matching engine calculates compatibility score
4. Donor receives notification with request details and match score
5. Donor reviews and approves/rejects with feedback
6. Non-profit receives status update and can proceed with onboarding
7. Impact metrics updated for both parties

### Coalition Formation Flow
1. Non-profit creates coalition with shared goal
2. Invites other non-profits to join
3. Coalition collectively identifies resource needs
4. Submits joint request for larger package
5. Donor can approve entire coalition request
6. Resources shared with all members
7. Coalition tracks combined impact

### Grant Writing Flow
1. Non-profit enters grant writing assistant
2. AI asks questions about organization, mission, needs
3. Generates draft proposal based on profile data
4. Non-profit edits and refines with AI suggestions
5. Exports final proposal as PDF
6. Submits to grant funders

## 🔐 Security & Authentication

### OAuth Flow
- Manus OAuth for secure, passwordless authentication
- Session cookies with JWT signing
- Role-based access control (RBAC)
- Protected procedures with `protectedProcedure`
- Admin-only operations with `adminProcedure`

### Data Protection
- All sensitive data encrypted in transit (HTTPS)
- Database connection pooling with SSL
- Input validation with Zod schemas
- SQL injection prevention via Drizzle ORM
- CORS protection on API endpoints

## 🧪 Testing

```bash
# Run unit tests
pnpm test

# Run tests in watch mode
pnpm test --watch

# Generate coverage report
pnpm test --coverage
```

Test coverage includes:
- Authentication and authorization flows
- Database queries and mutations
- tRPC procedure validation
- Smart matching algorithm
- Impact metric calculations

## 📈 Performance Optimization

- **Frontend**: Code splitting, lazy loading, image optimization
- **Backend**: Database query optimization, caching strategies
- **API**: Response compression, request batching
- **Database**: Indexed queries, connection pooling
- **Deployment**: CDN for static assets, autoscaling

## 🚢 Deployment

### Manus Hosting (Recommended)
```bash
# Create checkpoint
pnpm webdev-save-checkpoint

# Click Publish in Management UI
# Platform handles deployment automatically
```

### Alternative Hosting
- **Vercel**: For frontend only
- **Railway**: Full-stack deployment
- **Render**: Full-stack deployment
- **Self-hosted**: Docker container support

## 🤝 Contributing

We welcome contributions! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Write tests for new features
- Use Civic Commons design system for UI
- Document API procedures with JSDoc comments
- Keep components focused and reusable

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙋 Support

- **Documentation**: See `/references` folder for integration guides
- **Issues**: Report bugs on GitHub Issues
- **Discussions**: Start conversations on GitHub Discussions
- **Email**: support@tech-equity-bridge.org

## 🎯 Roadmap

### Phase 1 (Current)
- ✅ Core marketplace and matching
- ✅ Coalition builder
- ✅ Impact tracking
- ✅ Grant writing assistant

### Phase 2 (Q3 2026)
- Real-time notifications via WebSocket
- Email verification and trust badges
- Advanced matching with ML
- Success stories and testimonials

### Phase 3 (Q4 2026)
- Mobile app (iOS/Android)
- API for third-party integrations
- Advanced analytics and reporting
- Donor CSR dashboard

### Phase 4 (2027)
- Blockchain verification for impact
- Decentralized coalition governance
- Global expansion and localization
- Enterprise features

## 👥 Team

Built with ❤️ by the Tech-Equity Bridge team.

## 🙏 Acknowledgments

- Civic Commons design system for professional aesthetic
- Manus platform for OAuth and infrastructure
- Open-source community for amazing tools and libraries

---

**Let's bridge the digital divide together.** 🌉

For more information, visit [Tech-Equity Bridge](https://tech-equity-bridge.org)
