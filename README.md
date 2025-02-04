# Canard - MLSC DB's Flagship event of 2025
<!-- WHY ARE YOU LOOKING AT MY README'S CODE!!!!!😉😉 -->
<img src="https://github.com/user-attachments/assets/2305a8a3-0d7f-45f4-a095-3d2715568e22" alt="Canard poster" width="400">

## Overview

This repository contains the source code for Canard, the technical flagship event hosted by MLSC Derabassi '27. The event took place from 31st Jan - 2nd Feb with 100+ students participating in it.

## Features

- **Role-based Access Control:** Granular permissions for Admins, Teams, and Users.
- **Game & Stats Tracking:** Real-time tracking of game sessions and hands played.
- **Event-wide Announcements:** Instant notifications for all participants using WebSockets.
- **Configurable Event Settings:** Dynamic management of global event configurations.
- **Secure Middleware & Authentication:** Enforced security with JWT, bcrypt, and request validation.

## Tech Stack

- **Backend:** Node.js, Express.js, MongoDB, Socket.io
- **Additional -**
  - JWTs for authentication
  - Zod for validation
  - Nodemailer for sending mails on successful registration

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Fyxod/Canard.git
   cd Canard
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Start the server:**
   ```bash
   npm run dev
   ```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
