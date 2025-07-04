// sse.js
let clients = [];

export const registerClient = (res) => {
  clients.push(res);
  console.log("👤 New SSE client registered.");

  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    "Connection": "keep-alive",
  });

  res.write("\n");

  res.on("close", () => {
    clients = clients.filter((c) => c !== res);
    console.log("❌ SSE client disconnected.");
  });
};



export const pushSSE = (event, data) => {
  const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
  clients.forEach((client) => client.write(payload));
};

