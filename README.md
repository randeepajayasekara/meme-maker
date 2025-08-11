# Meme Generator Pro

A modern, responsive meme generator built with Next.js, Tailwind CSS, and Fabric.js. Create hilarious memes with an intuitive interface and powerful editing capabilities.

![Meme Generator Preview](https://via.placeholder.com/800x400?text=Meme+Generator+Preview)

## 🚀 Features

### ✨ Current Features

- **Image Upload**: Support for JPG, PNG, and GIF formats
- **Interactive Canvas**: Powered by Fabric.js for smooth editing experience
- **Text Customization**:
  - Top and bottom text positioning
  - Multiple font options (Impact, Arial, Times New Roman, Helvetica, Comic Sans MS)
  - Color picker for text customization
  - Adjustable font size (20px - 100px)
  - Text outline/stroke toggle for better readability
- **Real-time Preview**: See changes instantly as you type
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **High-Quality Export**: Download your memes as PNG files
- **Dark Theme**: Modern dark interface for comfortable editing

### 🔮 Coming Soon

- **Template Gallery**: Pre-made meme templates
- **AI Image Generation**: Create custom images with AI
- **Social Media Sharing**: Direct sharing to platforms
- **Custom Templates**: Save and reuse your own templates
- **Advanced Text Effects**: Shadows, gradients, and more
- **Batch Processing**: Create multiple memes at once

## 🛠️ Technology Stack

- **Framework**: [Next.js 15](https://nextjs.org/) with App Router
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Canvas Library**: [Fabric.js v6](https://fabricjs.com/)
- **Language**: TypeScript
- **Package Manager**: pnpm

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/meme-maker.git
   cd meme-maker
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Start the development server**
   ```bash
   pnpm dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Building for Production

```bash
pnpm build
pnpm start
```

## 📱 Usage

1. **Upload an Image**: Click the "Upload Image" button and select your image file
2. **Add Text**: Enter your desired text in the "Top Text" and "Bottom Text" fields
3. **Customize**: 
   - Choose from available fonts
   - Adjust text color using the color picker
   - Modify font size with the slider
   - Toggle text outline for better visibility
4. **Download**: Click the "Download Meme" button to save your creation

## 🎨 UI/UX Design

The application features a clean, modern interface with:

- **Two-Column Layout**: Control panel on the left, canvas on the right
- **Responsive Design**: Adapts to single-column layout on mobile devices
- **Dark Theme**: Easy on the eyes with gray-900 background
- **Intuitive Controls**: Clearly labeled sections and interactive elements
- **Visual Feedback**: Hover effects and smooth transitions

## 🏗️ Project Structure

```
meme-maker/
├── app/
│   ├── components/
│   │   ├── MemeGenerator.tsx    # Main component
│   │   ├── ControlPanel.tsx     # Left sidebar controls
│   │   └── CanvasArea.tsx       # Canvas and download area
│   ├── globals.css              # Global styles and customizations
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Home page
├── public/                      # Static assets
├── package.json                 # Dependencies and scripts
└── README.md                    # This file
```

## 🔧 Key Components

### MemeGenerator
The main orchestrator component that manages:
- Canvas initialization and cleanup
- Image upload handling
- Text rendering and updates
- State management for all settings

### ControlPanel
Houses all the editing controls:
- Image upload interface
- Text input fields
- Font and styling options
- Future feature placeholders

### CanvasArea
Manages the canvas display and export:
- Responsive canvas container
- Download functionality
- Visual feedback and instructions

## 💻 Code Quality

- **TypeScript**: Full type safety throughout the application
- **Component-Based**: Modular, reusable React components
- **Error Handling**: Try-catch blocks for async operations
- **Clean Code**: Meaningful variable names and comprehensive comments
- **Performance**: Efficient state management with React hooks

## 🎯 Best Practices

- **Responsive First**: Mobile-friendly design from the ground up
- **Accessibility**: Proper labeling and semantic HTML
- **Performance**: Optimized canvas operations and image handling
- **User Experience**: Intuitive interface with clear visual feedback
- **Code Organization**: Clean separation of concerns

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Fabric.js](https://fabricjs.com/) for the powerful canvas library
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Next.js](https://nextjs.org/) for the amazing React framework

---

**Happy Meme Making! 🎉**
