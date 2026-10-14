# CoreNode GymOS
### Run Your Gym. Grow Your Business.

**CoreNode GymOS** is a modern gym and fitness studio management software demo developed by **CoreNode Software Solutions**. It is designed to help fitness businesses streamline membership management, renewals, payment tracking, member attendance, trainer scheduling, workout planning, class bookings, and day-to-day operations.

The project demonstrates how gyms and fitness studios can manage their operations through a centralized, intuitive dashboard.

---

## Live Demo

🌐 **Live Application:** [CoreNode GymOS](https://corenode-gymos.vercel.app/)

📦 **GitHub Repository:** [CoreNode GymOS on GitHub](https://github.com/gopaltiwari04/CoreNode-GymOS-Gym-and-Fitness-Studio-Management-Software)

> Note: The live URL should be updated if your Vercel project uses a different deployment domain.

---

## Overview

Managing a gym involves more than tracking memberships. Owners must handle renewals, collect fees, monitor attendance, coordinate trainers, schedule classes, manage enquiries, and understand business performance.

CoreNode GymOS brings these workflows together in a single management interface.

The platform is designed for:
- Independent gyms and fitness centres
- Personal training studios
- Yoga and wellness studios
- CrossFit and functional fitness facilities
- Boutique fitness businesses
- Multi-branch fitness operators

The primary goal is to demonstrate a practical, scalable approach to gym operations management using modern web technologies.

## Features

### 📊 Business Dashboard
- Overview of gym operations
- Active membership statistics
- New member registrations
- Membership expiry tracking
- Outstanding payment summaries
- Attendance insights
- Revenue and expense analytics
- Quick access to common actions

### 👥 Member Management
- Centralized member directory
- Member profile management
- Contact and membership information
- Trainer assignment
- Member status tracking
- Attendance and payment history
- Search and filtering

### 🎫 Membership Management
- Configurable membership plans
- Monthly, quarterly, half-yearly, and annual plans
- Membership activation and renewal workflows
- Expiry tracking
- Membership freezing and reactivation
- Plan-wise membership summaries

### 💳 Payments and Billing
- Payment record management
- Full and partial payment tracking
- Outstanding balance monitoring
- Payment method tracking
- Transaction history
- Printable receipt support, where implemented
- Financial summaries

### 🕒 Check-In and Attendance
- Member lookup by name, ID, or phone
- Check-in and check-out workflows
- Daily attendance monitoring
- Visit history
- Membership status verification
- Attendance analytics

### 🏋️ Trainer and Staff Management
- Trainer profiles
- Staff directory
- Trainer specialization tracking
- Member-to-trainer assignment
- Training schedule management
- Trainer workload visibility

### 📋 Workout Plan Management
- Trainer-created workout plans
- Exercise and workout session organization
- Sets, repetitions, resistance, and rest periods
- Fitness goal tracking
- Member workout plan access
- Historical workout plans

### 🗓️ Classes and Bookings
- Group fitness class scheduling
- Instructor assignments
- Class capacity management
- Member bookings
- Booking status tracking
- Attendance and availability visibility

### 💪 Personal Training
- Personal training session scheduling
- Trainer availability
- Session completion tracking
- Training package management
- Remaining session tracking
- Personal training revenue summaries

### 📈 Leads and Enquiries
- Prospective member management
- Lead source tracking
- Follow-up scheduling
- Enquiry status management
- Trial session tracking
- Lead conversion workflow
- Lead pipeline analytics

### 📉 Reports and Analytics
- Membership reports
- Revenue summaries
- Payment collection reports
- Attendance trends
- Trainer performance summaries
- Class utilization
- Lead conversion analytics
- Data export capabilities, where implemented

### 🧾 Expense Management
- Expense recording
- Expense categorization
- Branch-level expense tracking
- Monthly expense summaries
- Expense analytics

### 🔧 Equipment and Maintenance
- Equipment inventory
- Equipment condition tracking
- Maintenance scheduling
- Maintenance history
- Upcoming maintenance alerts
- Equipment-related expense tracking

### 🔔 Notifications and Settings
- Membership expiry reminders
- Payment due notifications
- Lead follow-up reminders
- Booking notifications
- Equipment maintenance alerts
- Business and membership configuration

### 👤 Member Self-Service
Where implemented, members can access their own:
- Membership information
- Attendance history
- Workout plans
- Class bookings
- Personal training schedules
- Payment records

---

## Technology Stack

The project uses a modern React-based web development stack. The following technologies are part of the intended project setup; verify the current repository manifest for the exact installed versions.

| Technology | Purpose |
|---|---|
| React | Component-based user interface |
| TypeScript | Type-safe development |
| Vite | Development server and production bundling |
| Tailwind CSS | Utility-first styling |
| Lucide React | Interface icons |
| Recharts | Data visualization, where configured |
| Local Storage or configured data layer | Demo data persistence, where implemented |
| Vercel | Hosting and deployment |
| GitHub | Source control and collaboration |

The application is structured to support further development and future backend integration.

## Getting Started

Follow these steps to run the project locally.

### Prerequisites

Install:
- Node.js compatible with the project's dependencies
- npm
- Git

### 1. Clone the repository

```bash
git clone https://github.com/gopaltiwari04/CoreNode-GymOS-Gym-and-Fitness-Studio-Management-Software.git
```

### 2. Navigate to the project

```bash
cd CoreNode-GymOS-Gym-and-Fitness-Studio-Management-Software
```

### 3. Install dependencies

```bash
npm install
```

### 4. Start the development server

```bash
npm run dev
```

Open the local URL printed in your terminal.

### 5. Build for production

```bash
npm run build
```

### 6. Preview the production build

```bash
npm run preview
```

### 7. Run available checks

```bash
npm run lint
```

Run this command if the project defines a `lint` script in `package.json`.

If the project uses environment variables, configure them according to the provided example environment file. Never commit API keys or secrets.

---

## Deployment

CoreNode GymOS is intended to be deployed using Vercel with the GitHub repository as its source.

### Deployment steps

1. Open [Vercel](https://vercel.com/).
2. Import the CoreNode GymOS GitHub repository.
3. Configure the required environment variables, if applicable.
4. Set the build command to `npm run build`.
5. Set the output directory to `dist` for the standard Vite build configuration.
6. Deploy the application.

Future pushes to the configured branch can trigger automatic deployments.

Always verify that the production build completes successfully and that the deployed application works correctly.

## Demo Data and Limitations

CoreNode GymOS is a demonstration project intended to showcase gym management workflows.

Depending on the current implementation:
- Member, membership, payment, and attendance records may use simulated data.
- Payment entries do not necessarily represent real payment gateway transactions.
- Local browser storage, if used, is not a secure production database.
- Role switching in a frontend demo does not provide production-grade authorization.
- Workout plans are illustrative and are not a substitute for individualized professional guidance.
- External messaging, biometric access, QR scanning, payment gateway, and accounting integrations require separate implementation unless explicitly connected.

Use fictional data when exploring the application. Do not enter sensitive customer information, payment credentials, or confidential business records into an unsecured demo.

Before using the software commercially, implement secure authentication, server-side authorization, a production database, backups, audit logging, input validation, and appropriate privacy controls.

## Future Enhancements

Potential improvements include:

- Secure authentication and role-based access control
- Multi-tenant gym accounts
- Backend API and database integration
- Automated membership renewal reminders
- WhatsApp, SMS, and email notifications
- QR code membership check-in
- Biometric access control integration
- UPI and payment gateway integration
- GST-compliant billing integration
- Advanced revenue and retention analytics
- Trainer mobile interface
- Member mobile application
- Cloud synchronization and backups
- Integration with accounting and business management systems

## About CoreNode Software Solutions

**CoreNode Software Solutions** builds software solutions aimed at simplifying business operations and helping organizations adopt digital workflows.

CoreNode GymOS demonstrates an approach to creating practical management tools for the fitness industry, with a focus on usability, centralized operations, and extensibility.

For custom software development, product customization, or business collaboration, contact CoreNode Software Solutions through its official channels.

## License

No open-source license is specified in this README. Unless a license is added to the repository, all rights remain with the applicable copyright holder. Contact the project owner for permission to reuse, modify, or redistribute the software.

---

**Built by CoreNode Software Solutions**

*Run Your Gym. Grow Your Business.*
