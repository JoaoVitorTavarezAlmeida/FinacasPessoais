import { spawnSync } from "node:child_process";

const [, , command = "up", ...args] = process.argv;

const candidates = [
  { bin: "docker", baseArgs: ["compose"] },
  { bin: "podman", baseArgs: ["compose"] },
  { bin: "docker-compose", baseArgs: [] },
  { bin: "podman-compose", baseArgs: [] },
];

function hasCommand(bin) {
  const result = spawnSync("sh", ["-lc", `command -v ${bin}`], {
    stdio: "ignore",
  });

  return result.status === 0;
}

const runtime = candidates.find((candidate) => hasCommand(candidate.bin));

if (!runtime) {
  console.error(
    [
      "Nenhum runtime de container foi encontrado.",
      "Instale `docker`/`docker compose` ou `podman`/`podman compose` para usar o banco local.",
      "Se quiser rodar a interface sem banco, use `npm run dev`.",
    ].join("\n"),
  );
  process.exit(1);
}

const result = spawnSync(
  runtime.bin,
  [...runtime.baseArgs, command, ...args],
  { stdio: "inherit" },
);

process.exit(result.status ?? 1);
