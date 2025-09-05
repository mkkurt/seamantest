# Seaman's Test - Maritime Exam Preparation Platform

A modern, responsive web application for maritime professionals to practice and prepare for certification exams. Built with React and featuring PWA capabilities, multi-language support, and comprehensive accessibility features.

## ✨ Features

### Core Functionality
- 🧭 **Comprehensive Quiz System**: Practice questions across multiple maritime categories
- 🌐 **Multi-language Support**: Turkish and English with RTL support
- 🌙 **Dark/Light Theme**: Automatic system preference detection with manual override
- 📱 **Progressive Web App**: Offline functionality with service worker caching
- ♿ **WCAG 2.2 AA Compliant**: Full accessibility support with screen reader compatibility

### Quiz Modes
- 📚 **Standard Mode**: Sequential questions with immediate feedback
- 🎲 **Random Mode**: Shuffled questions for varied practice
- 📊 **Progress Tracking**: Score tracking and performance analytics
- 🔄 **Adaptive Weighting**: Smart question selection based on performance

### Categories
- ⚙️ **Auxiliary Engines**: Pump systems, auxiliary machinery
- 🚢 **Main Engine**: Primary propulsion systems
- 🗣️ **Maritime English**: Communication and terminology
- ⚖️ **Maritime Law**: Regulations and legal requirements
- 🦺 **Maritime Safety**: Safety procedures and protocols

## 🚀 Live Demo

Visit the live application: [https://mkkurt.github.io/seamantest](https://mkkurt.github.io/seamantest)

## 📸 Screenshots

![App Interface](https://github.com/user-attachments/assets/777a9975-d7c9-466f-86a2-24d72e9a9885)

## 🛠️ Technology Stack

- **Frontend**: React 18.3.1 with Hooks
- **Styling**: Tailwind CSS with dark mode support
- **Internationalization**: i18next with browser language detection
- **Icons**: Lucide React
- **PWA**: Custom service worker implementation
- **Testing**: Jest + React Testing Library
- **CI/CD**: GitHub Actions with Lighthouse CI
- **Accessibility**: axe-core integration

## 📋 Prerequisites

- Node.js (v16.0.0 or higher)
- npm (v7.0.0 or higher)

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/mkkurt/seamantest.git
   cd seamantest
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm start
   ```

4. **Access the application**
   Open [http://localhost:3000](http://localhost:3000) in your browser

## 🏗️ Build & Deployment

### Development Build
```bash
npm run build
```

### Production Deployment
```bash
npm run lighthouse:ci  # Run performance and accessibility audits
npm run build          # Create production build
```

### GitHub Pages Deployment
The application automatically deploys to GitHub Pages via GitHub Actions when changes are pushed to the main branch.

## 🧪 Testing

### Run Tests
```bash
npm test                    # Interactive test runner
npm test -- --coverage     # Run with coverage report
npm test -- --watchAll=false  # Single run for CI
```

### Accessibility Testing
```bash
npm start  # axe-core runs automatically in development
```

### Performance Testing
```bash
npm run lighthouse  # Run Lighthouse audit
```

## 🌍 Internationalization

### Supported Languages
- **Turkish (tr)**: Default language
- **English (en)**: Secondary language

### Adding New Languages
1. Create translation file in `src/locales/{lang}.json`
2. Update `src/i18n.js` configuration
3. Add language option in settings component

### Translation Files
```
src/
├── locales/
│   ├── tr.json    # Turkish translations
│   └── en.json    # English translations
└── i18n.js        # i18n configuration
```

## 🎨 Theming

### Available Themes
- **Light**: Default light theme
- **Dark**: Dark theme for low-light environments  
- **System**: Automatically follows system preference

### Theme Configuration
The theme system supports:
- CSS custom properties for consistent styling
- Automatic system preference detection
- Time-based theme switching (6 AM - 6 PM = light)
- Local storage persistence

## ♿ Accessibility Features

### WCAG 2.2 AA Compliance
- ✅ Keyboard navigation support
- ✅ Screen reader compatibility
- ✅ High contrast color schemes
- ✅ Focus management
- ✅ ARIA labels and roles
- ✅ Semantic HTML structure

### Testing Tools
- **axe-core**: Automated accessibility testing in development
- **Manual testing**: Keyboard and screen reader testing
- **Lighthouse**: Accessibility audits in CI/CD

## 📊 Performance

### Core Web Vitals
- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1

### Optimization Techniques
- Code splitting with React.lazy()
- Service worker caching
- Image optimization
- Gzip compression
- Bundle analysis and optimization

## 🔒 Security

### Security Headers
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- X-XSS-Protection: 1; mode=block

### Privacy Features
- Analytics opt-out functionality
- No sensitive data collection
- Local storage for user preferences only

## 🚀 Progressive Web App

### PWA Features
- ✅ Offline functionality
- ✅ Install prompt
- ✅ Background sync
- ✅ Push notifications (future)
- ✅ App-like experience

### Service Worker
- Caches static assets
- Network-first for dynamic content
- Graceful offline fallbacks

## 📈 Analytics

### Google Analytics 4
Set environment variable for analytics:
```bash
REACT_APP_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### Tracked Events
- Quiz starts and completions
- Answer submissions
- Theme/language changes
- Performance metrics

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow
```yaml
# .github/workflows/ci-cd.yml
- Build and test on Node.js 18.x, 20.x
- Security audit with npm audit
- Lighthouse CI performance testing
- Automated deployment to GitHub Pages
```

### Quality Gates
- All tests must pass
- Lighthouse performance score > 80%
- Accessibility score > 90%
- No high/critical security vulnerabilities

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── ErrorBoundary.js # Error handling
│   ├── QuestionCard.js  # Individual question display
│   ├── Sidebar.js       # Category navigation
│   └── ...
├── hooks/              # Custom React hooks
│   ├── useTheme.js     # Theme management
│   ├── useAnalytics.js # Analytics integration
│   └── ...
├── locales/            # Translation files
├── tests/              # Quiz question data
├── __mocks__/          # Test mocks
└── ...
```

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

### Code Style
- ESLint configuration with React rules
- Prettier for code formatting
- Accessibility linting with jsx-a11y
- Commit message conventions

### Testing Requirements
- Unit tests for all components
- Integration tests for user flows
- Accessibility tests with axe-core
- Performance tests with Lighthouse

## 🐛 Issue Reporting

Please use the [GitHub Issues](https://github.com/mkkurt/seamantest/issues) page to report bugs or request features.

### Bug Report Template
- Environment details
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Acknowledgments

- Maritime professionals who provided domain expertise
- React community for excellent tooling and libraries
- Contributors who helped improve accessibility and performance

## 🗺️ Roadmap

See [FEATURE_ROADMAP.md](FEATURE_ROADMAP.md) for detailed feature planning and prioritization.

### Upcoming Features
- 🤖 AI-powered study assistant
- 👥 User authentication and profiles
- 📈 Advanced analytics dashboard
- 🎯 Adaptive learning algorithms
- 🌐 Additional language support

## 📞 Support

For technical support or questions:
- Create an issue on GitHub
- Check existing documentation
- Review FAQ section

---

**Built with ❤️ for the maritime community**
