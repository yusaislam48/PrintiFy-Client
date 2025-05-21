import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import fs from 'fs'

// Custom plugin to handle PDF.js worker
const pdfjsWorkerPlugin = () => {
  return {
    name: 'pdfjs-worker-plugin',
    configureServer(server) {
      // Serve the PDF.js worker file in development
      server.middlewares.use((req, res, next) => {
        if (req.url.includes('pdf.worker.min.js')) {
          try {
            const workerPath = resolve(
              __dirname,
              'node_modules',
              'pdfjs-dist',
              'build',
              'pdf.worker.min.js'
            )
            
            if (fs.existsSync(workerPath)) {
              const content = fs.readFileSync(workerPath)
              res.setHeader('Content-Type', 'application/javascript')
              res.end(content)
              return
            }
          } catch (error) {
            console.error('Error serving PDF.js worker:', error)
          }
        }
        next()
      })
    },
    generateBundle() {
      // This will be handled by the copy plugin in the build process
      console.log('PDF.js worker plugin is active')
    }
  }
}

// Custom CORS plugin
const corsPlugin = () => {
  return {
    name: 'custom-cors-plugin',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', '*')
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization')
        res.setHeader('Access-Control-Allow-Credentials', 'true')
        
        if (req.method === 'OPTIONS') {
          res.statusCode = 204
          return res.end()
        }
        
        next()
      })
    }
  }
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '')
  
  console.log('API URL:', env.VITE_API_URL || 'https://printify-server-production.up.railway.app')
  
  return {
    plugins: [
      react(),
      pdfjsWorkerPlugin(),
      corsPlugin()
    ],
    server: {
      cors: {
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['X-Requested-With', 'Content-Type', 'Authorization'],
        credentials: true
      },
      proxy: {
        '/pdf-proxy': {
          target: 'https://res.cloudinary.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/pdf-proxy/, ''),
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'X-Requested-With, Content-Type, Authorization',
            'Access-Control-Allow-Credentials': 'true'
          }
        },
        '/api': {
          target: env.VITE_API_URL || 'https://printify-server-production.up.railway.app',
          changeOrigin: true,
          secure: false,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'X-Requested-With, Content-Type, Authorization',
            'Access-Control-Allow-Credentials': 'true'
          }
        }
      }
    },
    resolve: {
      alias: {
        // Add any aliases you need here
      }
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'pdfjs': ['pdfjs-dist', 'react-pdf'],
          }
        }
      }
    },
    optimizeDeps: {
      include: ['pdfjs-dist', 'react-pdf']
    },
    define: {
      'process.env.VITE_API_URL': JSON.stringify(env.VITE_API_URL || 'https://printify-server-production.up.railway.app')
    }
  }
})
