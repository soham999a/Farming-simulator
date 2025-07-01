# 🌾 3D Dream Farm - Advanced Farming Simulator

An immersive 3D farming simulator built with React, Three.js, and modern web technologies. Experience realistic farming with stunning 3D graphics, unique vegetable animations, and engaging gameplay mechanics.

## 🎮 Live Demo

https://farming-simulator-one.vercel.app/ 

## ✨ Features

### 🌟 3D Graphics & Animations
- **Stunning 3D Environment** with realistic lighting and shadows
- **6 Unique Vegetable Types** with individual growth animations:
  - 🌾 Wheat - Swaying golden stalks
  - 🌽 Corn - Tall plants with developing cobs
  - 🍅 Tomato - Bushy plants with ripening fruits
  - 🥕 Carrot - Feathery tops with visible roots
  - 🥔 Potato - Flowering bushes with soil mounds
  - 🥬 Lettuce - Spreading leafy heads
- **Particle Effects** for growth and harvest feedback
- **Interactive 3D Fields** with real-time crop visualization

### 🎯 Gameplay Features
- **Plant & Harvest** different crop types
- **Real-time Growth** with visual progress tracking
- **Economic System** with money management
- **Experience Points** and leveling system
- **Weather Information** integration
- **Field Management** with 6 interactive fields

### 🎨 User Experience
- **Dual View Modes**: Switch between 2D and 3D perspectives
- **Intuitive Controls**: Mouse-based camera navigation
- **Visual Feedback**: Sparkle effects for ready crops
- **Responsive Design**: Works on desktop and mobile
- **Professional UI**: Clean, modern interface design

## 🛠️ Technology Stack

- **Frontend**: React 18 + Vite
- **3D Graphics**: Three.js + React Three Fiber
- **3D Components**: @react-three/drei
- **Styling**: Tailwind CSS
- **Database**: Firebase Firestore
- **Deployment**: Vercel
- **Language**: JavaScript/TypeScript

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/soham999a/Farming-simulator.git
   cd Farming-simulator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   ```
   http://localhost:5173
   ```

## 🎮 How to Play

### 3D Mode Controls
- **🖱️ Mouse Drag**: Rotate camera around the farm
- **🔍 Mouse Wheel**: Zoom in/out
- **🌾 Click Fields**: Plant crops or harvest when ready
- **🎯 Field Selection**: Click to select and view field details

### Farming Mechanics
1. **Plant Crops**: Click empty fields and choose a crop type
2. **Watch Growth**: Crops grow in real-time with unique animations
3. **Harvest**: Click fields when crops show "READY!" indicator
4. **Earn Money**: Sell harvested crops to buy more seeds
5. **Level Up**: Gain experience points from farming activities

## 📁 Project Structure

```
src/
├── components/
│   ├── 3d/
│   │   ├── SimpleFarm3D.jsx      # Main 3D farm scene
│   │   ├── VegetableAnimations.jsx # Crop-specific animations
│   │   ├── ParticleEffects.jsx    # Visual effects system
│   │   └── UI3D.jsx              # 3D mode UI overlay
│   ├── 2d/                       # 2D game components
│   └── ui/                       # Shared UI components
├── firebase/
│   ├── config.js                 # Firebase configuration
│   └── firestore.js             # Database operations
├── systems/                      # Game logic systems
├── store/                        # State management
└── utils/                        # Helper functions
```

## 🌟 Key Features Explained

### Vegetable-Specific Animations
Each crop type has unique 3D animations:
- **Growth stages** from seed to harvest
- **Natural movements** like swaying and breathing
- **Color transitions** as crops mature
- **Particle effects** for visual feedback

### 3D Environment
- **Realistic farm setting** with barn, trees, and fields
- **Dynamic lighting** with shadows and ambient effects
- **Interactive elements** with hover and click feedback
- **Smooth camera controls** for optimal viewing

### Game Progression
- **6 different crops** with varying growth times and profits
- **Economic balance** between investment and returns
- **Experience system** for long-term progression
- **Visual achievements** with particle celebrations

## 🔧 Configuration

### Firebase Setup (Optional)
The project includes Firebase for data persistence. The configuration is already set up, but you can modify it in:
```javascript
// src/firebase/config.js
const firebaseConfig = {
  // Your Firebase config
};
```

## 📦 Build & Deploy

### Build for Production
```bash
npm run build
```

### Deploy to Vercel
1. **Connect to GitHub**: Link your repository to Vercel
2. **Auto-deploy**: Vercel automatically deploys on push to main
3. **Custom domain**: Configure your domain in Vercel dashboard

## 🎯 Performance

- **60 FPS** smooth 3D rendering
- **Optimized assets** for fast loading
- **Efficient animations** with minimal CPU usage
- **Responsive design** for all screen sizes

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- **Three.js** for amazing 3D capabilities
- **React Three Fiber** for React integration
- **@react-three/drei** for helpful 3D components
- **Tailwind CSS** for beautiful styling
- **Firebase** for backend services
- **Vercel** for seamless deployment

---

**Made with ❤️ by [Soham](https://github.com/soham999a)**

🌾 Happy Farming! 🚜✨
# Farming-simulator
