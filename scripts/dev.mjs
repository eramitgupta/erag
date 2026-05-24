import { createServer } from 'node:http'
import { spawn } from 'node:child_process'
import { readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import process from 'node:process'
import { createServer as createNetServer } from 'node:net'
import httpProxy from 'http-proxy'

const rootDir = process.cwd()
const indexPath = join(rootDir, 'index.html')

const apps = [
  {
    name: 'disposable-email',
    prefix: '/laravel-disposable-email',
    cwd: join(rootDir, 'laravel-disposable-email'),
    port: 5173
  },
  {
    name: 'inertia-toast',
    prefix: '/laravel-inertia-toast',
    cwd: join(rootDir, 'laravel-inertia-toast'),
    port: 5174
  },
  {
    name: 'lang-sync',
    prefix: '/laravel-lang-sync-inertia',
    cwd: join(rootDir, 'laravel-lang-sync-inertia'),
    port: 5175
  }
]

const children = []
const proxy = httpProxy.createProxyServer({
  ws: true,
  changeOrigin: true
})

let shuttingDown = false

const shutdown = (code = 0) => {
  if (shuttingDown) {
    return
  }

  shuttingDown = true
  server.close()
  proxy.close()

  for (const child of children) {
    child.kill('SIGINT')
  }

  setTimeout(() => process.exit(code), 300)
}

const findAvailablePort = async (startPort) => {
  let port = startPort

  while (true) {
    const isAvailable = await new Promise((resolve) => {
      const tester = createNetServer()
      tester.once('error', () => resolve(false))
      tester.once('listening', () => {
        tester.close(() => resolve(true))
      })
      tester.listen(port, '127.0.0.1')
    })

    if (isAvailable) {
      return port
    }

    port += 1
  }
}

proxy.on('error', (error, req, res) => {
  const message = '[root] Docs server is not ready yet. Retry in a moment.'
  console.error(message, error.message)

  if (res.writeHead) {
    res.writeHead(502, { 'Content-Type': 'text/plain; charset=utf-8' })
    res.end(message)
  }
})

const server = createServer((req, res) => {
  const url = req.url || '/'

  if (url === '/' || url === '/index.html') {
    res.writeHead(200, {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store'
    })
    res.end(readFileSync(indexPath))
    return
  }

  const app = apps.find(({ prefix }) => url === prefix || url.startsWith(`${prefix}/`))

  if (!app) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' })
    res.end('Not Found')
    return
  }

  proxy.web(req, res, {
    target: `http://127.0.0.1:${app.port}`
  })
})

server.on('upgrade', (req, socket, head) => {
  const url = req.url || '/'
  const app = apps.find(({ prefix }) => url === prefix || url.startsWith(`${prefix}/`))

  if (!app) {
    socket.destroy()
    return
  }

  proxy.ws(req, socket, head, {
    target: `ws://127.0.0.1:${app.port}`
  })
})

const bootstrap = async () => {
  for (const app of apps) {
    if (!existsSync(app.cwd)) {
      console.error(`[root] Missing docs directory: ${app.cwd}`)
      shutdown(1)
      return
    }
  }

  for (const app of apps) {
    app.port = await findAvailablePort(app.port)

    const child = spawn(
      'npm',
      ['run', 'dev', '--', '--host', '127.0.0.1', '--port', String(app.port)],
      {
        cwd: app.cwd,
        stdio: 'inherit'
      }
    )

    child.on('exit', (code, signal) => {
      if (shuttingDown) {
        return
      }

      const reason = signal ? `signal ${signal}` : `code ${code ?? 0}`
      console.error(`[root] ${app.name} dev server exited with ${reason}`)
      shutdown(typeof code === 'number' ? code : 1)
    })

    children.push(child)
  }

  const rootPort = await findAvailablePort(3000)

  server.listen(rootPort, '0.0.0.0', () => {
    console.log(`[root] Landing page: http://localhost:${rootPort}/`)
    for (const app of apps) {
      console.log(`[root] ${app.name}: http://localhost:${rootPort}${app.prefix}/ -> ${app.port}`)
    }
  })
}

bootstrap().catch((error) => {
  console.error('[root] Failed to start dev environment.', error)
  shutdown(1)
})

process.on('SIGINT', () => shutdown(0))
process.on('SIGTERM', () => shutdown(0))
