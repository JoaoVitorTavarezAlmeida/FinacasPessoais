import net from "node:net";

const host = process.env.DB_HOST ?? "127.0.0.1";
const port = Number(process.env.DB_PORT ?? "5432");
const timeoutMs = Number(process.env.DB_WAIT_TIMEOUT_MS ?? "30000");
const intervalMs = Number(process.env.DB_WAIT_INTERVAL_MS ?? "1000");

function tryConnect() {
  return new Promise((resolve, reject) => {
    const socket = new net.Socket();

    const cleanup = () => {
      socket.removeAllListeners();
      socket.destroy();
    };

    socket.setTimeout(2000);
    socket.once("connect", () => {
      cleanup();
      resolve(true);
    });
    socket.once("timeout", () => {
      cleanup();
      reject(new Error("timeout"));
    });
    socket.once("error", (error) => {
      cleanup();
      reject(error);
    });

    socket.connect(port, host);
  });
}

async function main() {
  const startedAt = Date.now();

  while (Date.now() - startedAt < timeoutMs) {
    try {
      await tryConnect();
      console.log(`PostgreSQL disponivel em ${host}:${port}.`);
      return;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, intervalMs));
    }
  }

  console.error(
    `Timeout aguardando PostgreSQL em ${host}:${port} por ${timeoutMs}ms.`,
  );
  process.exit(1);
}

await main();
