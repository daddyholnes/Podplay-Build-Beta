<p align="center">
  <a href="https://podplay-build.io">
    <img src="client/public/assets/logo.svg" height="256">
  </a>
  <h1 align="center">
    <a href="https://podplay-build.io">Podplay-Build</a>
  </h1>
</p>

<p align="center">
  <a href="https://discord.podplay-build.io"> 
    <img
      src="https://img.shields.io/discord/1086345563026489514?label=&logo=discord&style=for-the-badge&logoWidth=20&logoColor=white&labelColor=000000&color=blueviolet">
  </a>
  <a href="https://docs.podplay-build.io"> 
    <img
      src="https://img.shields.io/badge/DOCS-blue.svg?style=for-the-badge&logo=read-the-docs&logoColor=white&labelColor=000000&logoWidth=20">
  </a>
</p>

# ✨ Features

- 🖥️ **Enhanced UI & Experience** specifically designed for podcast creation workflow

- 🤖 **AI Model Selection**:  
  - Anthropic (Claude), AWS Bedrock, OpenAI, Azure OpenAI, Google, Vertex AI
  - Compatible with multiple AI providers to fit your specific needs
  - Seamless integration with custom endpoints

- 🔧 **Code Interpreter API**: 
  - Secure, sandboxed execution in multiple programming languages
  - Seamless file handling for podcast script processing

- 🔦 **Podcast-Focused Agents & Tools**:  
  - Build specialized, AI-driven assistants for podcast creation
  - Tools for transcription, editing, and content enhancement

- 🪄 **Content Generation UI**:  
  - Generate podcast scripts, show notes, and promotional materials
  - Create diagrams and visual content for podcast marketing

- 💾 **Presets & Context Management**:  
  - Save custom presets for different podcast formats and styles
  - Switch between AI endpoints for different creative tasks
  - Edit, resubmit, and continue your podcast planning conversations

- 💬 **Multimodal & File Interactions**:  
  - Upload and analyze images for visual content planning
  - Chat with audio files and transcripts for podcast editing

- 🗣️ **Speech & Audio**:  
  - Hands-free interaction with Speech-to-Text and Text-to-Speech
  - Process and analyze audio samples directly in the platform

- 📥 **Import & Export**:  
  - Import and export your podcast planning conversations
  - Export content as markdown, text, or JSON for your workflow

- 👥 **Multi-User & Secure Access**:
  - Collaborate with your podcast team securely
  - Role-based access for producers, hosts, and guests

- ⚙️ **Flexible Deployment**:  
  - Use locally for complete privacy or deploy on the cloud
  - Docker support for easy setup

## 🪶 All-In-One AI Podcast Creation with Podplay-Build

Podplay-Build brings together powerful AI models to revolutionize podcast creation and production workflows. From scriptwriting and show notes to editing assistance and content enhancement, Podplay-Build offers a comprehensive suite of tools designed specifically for podcast creators.

---

## 🌐 Resources

**GitHub Repo:**
  - [github.com/daddyholnes/Podplay-Build-Beta](https://github.com/daddyholnes/Podplay-Build-Beta)

**Other:**
  - **Website:** [podplay-build.io](https://podplay-build.io)
  - **Documentation:** [docs.podplay-build.io](https://docs.podplay-build.io)

---

## Getting Started

### Prerequisites
- Node.js >= 16
- npm or yarn
- Docker & Docker Compose (optional)

### Installation
1. Clone this repository:
   ```bash
   git clone https://github.com/daddyholnes/Podplay-Build-Beta.git
   cd Podplay-Build-Beta
   ```
2. Copy environment config:
   ```bash
   cp podplay-build.example.yaml podplay-build.yaml
   cp camera-calibration-beta-6304d1bafd3c.json camera-calibration.json
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start development server:
   ```bash
   npm run dev
   ```
   or with Docker:
   ```bash
   docker-compose up --build
   ```
5. Access the application at http://localhost:3080

### One-Click Setup (Windows)
Run the PowerShell script:
```powershell
.\setup.ps1
```
