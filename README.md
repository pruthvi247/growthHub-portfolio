# GrowthHub Portfolio

A modern, interactive frontend portfolio showcasing the latest web development trends and technologies.

## 🚀 Features

- **Interactive Navigation**: Smooth scrolling navigation with animated tab indicators
- **Particle Background**: Dynamic particle animation using Particles.js
- **Responsive Design**: Optimized for all device sizes and screen resolutions
- **Modern Architecture**: Modular ES6+ JavaScript with clean separation of concerns
- **Trend Showcase**: Highlights key frontend technologies:
  - Progressive Web Apps (PWAs)
  - Jamstack Architecture
  - AI Tools Integration
  - TypeScript Adoption
  - Internet of Things (IoT)

## 📁 Project Structure

```
growthhub-portfolio/
├── public/                 # Public assets and HTML files
│   └── index.html         # Main HTML file
├── src/                   # Source code
│   ├── styles/           # CSS modules
│   │   ├── main.css      # Main stylesheet (imports all modules)
│   │   ├── base.css      # Reset and base styles
│   │   ├── layout.css    # Layout and section styles
│   │   ├── navigation.css # Navigation component styles
│   │   ├── animations.css # Animation definitions
│   │   └── responsive.css # Media queries and responsive design
│   ├── scripts/          # JavaScript modules
│   │   ├── main.js       # Application entry point
│   │   ├── navigation.js # Navigation controller
│   │   └── particles.js  # Particle background handler
│   └── assets/          # Static assets
│       ├── images/      # Images and icons
│       └── fonts/       # Custom fonts (if any)
├── docs/                # Documentation
├── package.json         # Project configuration and dependencies
└── README.md           # This file
```

## 🛠️ Installation & Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/growthhub/portfolio.git
   cd growthhub-portfolio
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start development server**

   ```bash
   npm start
   ```

   The site will be available at `http://localhost:3000`

## 🔧 Development

### Available Scripts

- `npm start` - Start development server
- `npm run dev` - Start development server with file watching
- `npm run build` - Build for production (placeholder)
- `npm test` - Run tests (placeholder)
- `npm run lint` - Run linter (placeholder)
- `npm run format` - Format code (placeholder)

### Development Server

The project uses `live-server` for development with hot reloading. Any changes to files in the `src/` directory will automatically reload the page.

### Adding New Features

1. **CSS Styles**: Add new CSS modules in `src/styles/` and import them in `main.css`
2. **JavaScript**: Create new modules in `src/scripts/` and import them in `main.js`
3. **Assets**: Add images, fonts, or other assets to `src/assets/`

## 🎨 Customization

### Colors

The project uses a modern color palette defined in CSS custom properties:

- Primary: `#03dac6` (Teal)
- Accent: `#ff0266` (Pink)
- Background: `#1e1f26` (Dark)
- Text: `#faebd7` (Antique White)

### Fonts

- Primary: Roboto (Google Fonts)
- Headers: Josefin Sans (Google Fonts)

### Animations

- Loading text animation with staggered delays
- Smooth hover effects and transitions
- Particle background animation

## 📱 Responsive Design

The portfolio is fully responsive with breakpoints at:

- Mobile: < 360px
- Tablet: 360px - 800px
- Desktop: > 800px

## 🔗 Dependencies

### Runtime

- `particles.js` - Particle background animation

### Development

- `live-server` - Development server with hot reloading

## 🚀 Deployment

### GitHub Pages

1. Build the project: `npm run build`
2. Deploy the `public/` folder to GitHub Pages

### Netlify

1. Connect your repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `public`

### Vercel

1. Connect your repository to Vercel
2. Set build command: `npm run build`
3. Set output directory: `public`

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Credits

- **Matrix Particles**: Particles.js library
- **Slider Navigation**: Inspired by Ettrics
- **Design**: Sara Mazal Web design concepts
- **Fonts**: Google Fonts (Roboto, Josefin Sans)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit your changes: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📞 Support

For support, email support@growthhub.com or create an issue in the repository.

---

**Made with ❤️ by the GrowthHub Team**
