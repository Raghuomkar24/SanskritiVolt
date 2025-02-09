# Mapping Cultural Narratives through Digital Storytelling

## Overview
This project aims to bridge the gap between traditional cultural storytelling and modern digital platforms. Through interactive maps, timelines, and social features, users can explore and share unique cultural narratives from diverse regions.

## Features
- 🌍 **Interactive Maps** – Visual representation of cultural elements across regions.
- 📜 **Storytelling Platform** – Users can contribute and explore narratives related to festivals, art, and traditions.
- 🎮 **Gamification** – Earn tokens, badges, and participate in interactive challenges.
- 🤖 **AI Chatbot (Samvaad)** – Engage in insightful cultural conversations.
- 📊 **Personalized Dashboard** – Track achievements, contributions, and explore curated content.
- 🔐 **Secure Authentication** – User login system with encrypted passwords and secure sessions.

## Technologies Used
- **Frontend:** Next.js, Tailwind CSS
- **Backend:** Next.js (API Routes), Prisma ORM
- **Database:** PostgreSQL
- **Authentication:** NextAuth.js, bcrypt.js, JWT
- **Deployment & Development:** Docker

## Installation & Setup
### Prerequisites
Ensure you have the following installed:
- Node.js (v18+ recommended)
- PostgreSQL (local or cloud-based instance)
- Docker (optional, for containerized setup)

### Steps to Run Locally
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/your-repo.git
   cd your-repo
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   Create a `.env` file in the root directory and add the following:
   ```plaintext
   DATABASE_URL="your_postgresql_connection_string"
   NEXTAUTH_SECRET="your_secret_key"
   NEXTAUTH_URL="http://localhost:3000"
   ```
4. Run database migrations:
   ```bash
   npx prisma migrate dev
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```

## Testing
Run the following command to execute tests:
```bash
npm test
```

## Deployment
To deploy the project using Docker:
```bash
docker build -t cultural-storytelling .
docker run -p 3000:3000 cultural-storytelling
```
Alternatively, deploy to **Vercel** or **Netlify** for seamless hosting.

## Future Enhancements
- 🔍 Advanced search and filtering options
- 📱 Mobile app integration
- 🎨 More interactive cultural visualization tools
- 🌎 Multilingual support for diverse user engagement

## Contributors
- Samkit Samsukha
- Vijesh
- Varenya Thaker
- Oojam Chaudhary

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
