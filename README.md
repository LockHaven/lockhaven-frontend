# 🔒 LockHaven - Secure File Storage

A modern web application for uploading, encrypting, and securely storing files with military-grade AES-256 encryption.

## 🚀 Features

- **Military-Grade Security**: AES-256 encryption for all uploaded files
- **Easy Upload**: Drag and drop interface for seamless file uploads
- **Cross-Platform Access**: Download your files securely from any device
- **Modern UI**: Beautiful, responsive design built with Next.js and Tailwind CSS
- **Privacy First**: Your encryption keys stay with you - we can't access your files

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 with App Router
- **Styling**: Tailwind CSS v4
- **Language**: TypeScript
- **Icons**: Custom SVG icons
- **Fonts**: Geist Sans & Geist Mono

## 📦 Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd lockhaven-frontend
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🎨 Project Structure

```
lockhaven-frontend/
├── src/
│   ├── app/
│   │   ├── layout.tsx      # Root layout with metadata
│   │   ├── page.tsx        # Homepage with hero section
│   │   └── globals.css     # Global styles
│   └── ...
├── public/
│   └── lock-icon.svg       # Custom lock favicon
├── package.json
└── README.md
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🎯 Current Status

- ✅ Modern homepage with hero section
- ✅ Responsive navigation
- ✅ Custom lock icon favicon
- ✅ Security-focused design
- 🔄 Upload functionality (coming soon)
- 🔄 File management dashboard (coming soon)
- 🔄 User authentication (coming soon)

## 🔐 Security Features

- **AES-256 Encryption**: Military-grade encryption for all files
- **Client-Side Keys**: Encryption keys never leave your device
- **Secure Storage**: Encrypted files stored with zero-knowledge architecture
- **Privacy First**: We cannot access or decrypt your files

## 🚀 Deployment

This is a Next.js application that can be deployed on:

- [Vercel](https://vercel.com) (recommended)
- [Netlify](https://netlify.com)
- Any platform supporting Node.js

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For support, email support@lockhaven.com or join our Discord community.

---

Built with ❤️ using Next.js and Tailwind CSS
