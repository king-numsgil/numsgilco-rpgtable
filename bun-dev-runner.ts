const client = Bun.spawn({
    cmd: ["bun", "run", "dev"],
    cwd: "./packages/client",
    env: { ...process.env },
    stdout: "pipe",
    onExit(_1, exitCode, signalCode, _2) {
        console.log(`Client exited with ${exitCode} (${signalCode})`);
    },
});

const server = Bun.spawn({
    cmd: ["bun", "run", "dev"],
    cwd: "./packages/server",
    env: { ...process.env },
    stdout: "pipe",
    onExit(_1, exitCode, signalCode, _2) {
        console.log(`Server exited with ${exitCode} (${signalCode})`);
    },
});

process.on("SIGINT", () => {
    console.warn("Ctrl-C was pressed, exiting...");
    client.kill();
    server.kill();
});

for await (const chunk of client.stdout) {
    const text = Buffer.from(chunk).toString();
    for (const line of text.split("\n")) {
        console.log(`[Client] ${line}`);
    }
}
for await (const chunk of server.stdout) {
    const text = Buffer.from(chunk).toString();
    for (const line of text.split("\n")) {
        console.log(`[Server] ${line}`);
    }
}

await Promise.all([client.exited, server.exited]);
export { };
